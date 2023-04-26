import { useEffect, useRef, useState } from 'react'
import { Checkbox, Input, Segmented, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { StopOutlined } from '@ant-design/icons'
import { IResourceType } from '@/types'
import { KNOWN_TYPES, RESOURCE_TYPES, RESOURCE_TYPE_MAP } from '@/common/constants'
import Ellipsis from '@/components/Ellipsis'
import styles from './index.less'
import ReqDetail from './components/ReqDetail'
import Resizable from '@/components/Resizable'
import { CssIcon, DefaultIcon, DocIcon, FontIcon, ImgIcon, JsIcon } from '@/components/FileIcon'

declare const chrome: any

export default function Panel() {
  const columns: ColumnsType<any> = [
    { title: 'Name', dataIndex: ['request', 'url'], render: renderName, onCell: handleNameClick },
    { title: 'Method', dataIndex: ['request', 'method'], width: 60, ellipsis: true },
    { title: 'Status', dataIndex: ['response', 'status'], width: 60, render: renderStatus },
    { title: 'Type', dataIndex: '_resourceType', render: renderType, width: 60, ellipsis: true },
    {
      title: 'Size',
      dataIndex: ['response', '_transferSize'],
      render: renderSize,
      width: 70,
      sorter: (a, b) => a.response._transferSize - b.response._transferSize,
    },
    {
      title: 'Time',
      dataIndex: 'time',
      render: renderTime,
      width: 70,
      ellipsis: true,
      sorter: (a, b) => a.time - b.time,
    },
  ]
  const [filteredColumns, setFilteredColumns] = useState(columns)
  const [reqs, setReqs] = useState<any[]>([])
  const [filteredReqs, setFilteredReqs] = useState<any[]>([])
  const [currResourceType, setCurrResourceType] = useState<IResourceType>('Fetch/XHR')
  const shouldPreserveLogRef = useRef(false)
  const [keyword, setKeyword] = useState('')
  const [detail, setDetail] = useState(null)
  const [currRow, setCurrRow] = useState(-1)
  const maxTimeRef = useRef(0)
  const tableRef = useRef<HTMLDivElement>(null)

  function renderName(v: string = '', r: any) {
    const tokens = v.split('/')
    const shortName = tokens.pop() || tokens.pop()
    let fileIcon = null
    const type = r._resourceType
    switch (true) {
      case RESOURCE_TYPE_MAP.JS.includes(type):
        fileIcon = <JsIcon />
        break
      case RESOURCE_TYPE_MAP.CSS.includes(type):
        fileIcon = <CssIcon />
        break
      case RESOURCE_TYPE_MAP.Doc.includes(type):
        fileIcon = <DocIcon />
        break
      case RESOURCE_TYPE_MAP.Img.includes(type):
        fileIcon = <ImgIcon src={r.request.url} />
        break
      case RESOURCE_TYPE_MAP.Font.includes(type):
        fileIcon = <FontIcon />
        break
      default:
        fileIcon = <DefaultIcon />
        break
    }
    return (
      <div className={styles.nameCell}>
        <div className={styles.icon}>{fileIcon}</div>
        <Ellipsis style={{ flex: 1 }} title={v}>{v.startsWith('data:image') ? v : shortName as string}</Ellipsis>
      </div>
    )
  }
  const parseSize = (bytes: number) => {
    let parsedSize = ''
    const KB = 1024
    const MB = KB * KB
    switch (true) {
      case bytes < KB:
        parsedSize = `${bytes} B`
        break
      case bytes < MB:
        parsedSize = `${(bytes / KB).toFixed(1)} kB`
        break
      default:
        parsedSize = `${(bytes / MB).toFixed(1)} MB`
        break
    }
    return parsedSize
  }
  function renderSize(bytes: number, r: any) {
    return (
      r._fromCache ? (
        <Ellipsis className={styles.textGray}>{`(${r._fromCache} cache)`}</Ellipsis>
      ) : (
        <Ellipsis>{parseSize(bytes)}</Ellipsis>
      )
    )
  }
  function renderTime(v: number) {
    const parsed = v < 1000 ? `${(v).toFixed(0)} ms` : `${(v / 1000).toFixed(2)} s`
    return (
      <div
        style={{
          width: `${(v / maxTimeRef.current) * 100}%`,
          background: '#dfecff',
        }}
      >
        {parsed}
      </div>
    )
  }
  function renderType(v: string = '', r: any) {
    if (v.includes('image')) {
      return r.response.content.mimeType.split('/').pop()
    }
    return v
  }
  function renderStatus(v: number) {
    const status = v.toString()
    let color = ''
    switch (true) {
      case status.startsWith('3'):
        color = '#fa8c16'
        break
      case status.startsWith('4') || status.startsWith('5') || status == '0':
        color = '#f5222d'
        break
      default:
        break
    }
    return (
      <Ellipsis style={{ color }}>{status}</Ellipsis>
    )
  }
  function handleNameClick(r: any, rowIndex: number = -1) {
    return {
      onClick() {
        setCurrRow(rowIndex)
        setDetail(r)
        setFilteredColumns([filteredColumns[0]] as ColumnsType)
      },
    }
  }
  const handlePreserveLogChange = (e: any) => {
    shouldPreserveLogRef.current = e.target.checked
  }
  const handleKeywordChange = (e: any) => {
    setKeyword(e.target.value)
  }
  const handleDetailClose = () => {
    setDetail(null)
    setFilteredColumns(columns)
    setCurrRow(-1)
  }
  const clearReqs = () => {
    setReqs([])
    maxTimeRef.current = 0
    handleDetailClose()
  }
  useEffect(() => {
    if (tableRef.current && !detail) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight - tableRef.current.clientHeight
    }
  }, [filteredReqs])
  useEffect(() => {
    const types = RESOURCE_TYPE_MAP[currResourceType]
    let next = []
    switch (currResourceType) {
      case 'All':
        next = reqs
        break
      case 'Other':
        next = reqs.filter((item) => {
          return !Object.values(KNOWN_TYPES).includes(item._resourceType)
        })
        break
      default:
        next = reqs.filter((item) => {
          return types.includes(item._resourceType)
        })
        break
    }
    if (keyword) {
      next = next.filter((item) => {
        const postParams = item.request.postData?.text || ''
        return item.request.url.includes(keyword) || postParams.includes(keyword)
      })
    }
    setFilteredReqs(next)
  }, [currResourceType, reqs, keyword])
  useEffect(() => {
    handleDetailClose()
  }, [currResourceType, keyword])
  useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener((data: any) => {
      console.log('onRequestFinished', data.response.content.mimeType, data)
      setReqs((prev) => {
        return [...prev, data]
      })
      maxTimeRef.current = Math.max(data.time, maxTimeRef.current)
    })
    chrome.devtools.network.onNavigated.addListener((data: string) => {
      console.log('onNavigated', data)
      if (!shouldPreserveLogRef.current) {
        clearReqs()
      }
    })
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <StopOutlined className={styles.icon} onClick={clearReqs} />
        <span className={styles.splitLine}></span>
        <Checkbox onChange={handlePreserveLogChange}>Preserve log</Checkbox>
      </div>
      <div className={styles.filter}>
        <Input onChange={handleKeywordChange} className={styles.keywordSer} placeholder="Filter" />
        <Segmented
          value={currResourceType}
          onChange={(v) => setCurrResourceType(v as IResourceType)}
          size="small"
          className={styles.types}
          options={RESOURCE_TYPES}
        />
      </div>
      <div className={styles.table}>
        <Resizable
          style={{
            width: detail ? '160px' : '100%',
            height: '100%',
            minWidth: 100,
          }}
          handles={detail ? ['right'] : []}
        >
          <Table
            style={{
              height: '100%',
              overflow: 'auto',
            }}
            ref={tableRef}
            showSorterTooltip={false}
            rowClassName={(r, i) => (currRow === i ? styles.currRow : '')}
            locale={{ emptyText: "There's nothing here" }}
            sticky
            bordered
            dataSource={filteredReqs}
            columns={filteredColumns}
            pagination={false}
          />
        </Resizable>
        {detail && <ReqDetail onClose={handleDetailClose} detail={detail} /> }
      </div>
    </div>
  )
}
