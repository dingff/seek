import { useEffect, useRef, useState } from 'react'
import { Checkbox, Input, Segmented, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { StopOutlined } from '@ant-design/icons'
import { IResourceType } from '@/types'
import { KNOWN_TYPES, RESOURCE_TYPES, RESOURCE_TYPE_MAP } from '@/common/constants'
import Ellipsis from '@/components/Ellipsis'
import styles from './index.less'
import ReqDetail from './components/ReqDetail'

declare const chrome: any

export default function Panel() {
  const columns: ColumnsType<any> = [
    { title: 'Name', dataIndex: ['request', 'url'], render: renderName, onCell: handleNameClick },
    { title: 'Method', dataIndex: ['request', 'method'], width: 70 },
    { title: 'Status', dataIndex: ['response', 'status'], width: 80, render: renderStatus },
    { title: 'Type', dataIndex: '_resourceType', render: renderType, width: 80 },
    { title: 'Size', dataIndex: ['response', '_transferSize'], render: renderSize, width: 80 },
    { title: 'Time', dataIndex: 'time', render: renderTime, width: 80 },
  ]
  const [filteredColumns, setFilteredColumns] = useState(columns)
  const [reqs, setReqs] = useState<any[]>([])
  const [filteredReqs, setFilteredReqs] = useState<any[]>([])
  const [currResourceType, setCurrResourceType] = useState<IResourceType>('All')
  const shouldPreserveLogRef = useRef(false)
  const [keyword, setKeyword] = useState('')
  const [detail, setDetail] = useState(null)

  function renderName(v: string = '') {
    const tokens = v.split('/')
    const shortName = tokens.pop() || tokens.pop()
    return (
      <Ellipsis title={v}>{shortName as string}</Ellipsis>
    )
  }
  function renderSize(bytes: number) {
    if (bytes < 1024) {
      return `${bytes} B`
    } if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} kB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  function renderTime(v: number) {
    return v < 1000 ? `${(v).toFixed(0)} ms` : `${(v / 1000).toFixed(2)} s`
  }
  function renderType(v: string = '', r: any) {
    if (v.includes('image')) {
      return r.response.content.mimeType.split('/').pop()
    }
    return v
  }
  function renderStatus(v: number) {
    const handles = {
      // eslint-disable-next-line react/no-unstable-nested-components
      0: () => {
        return <Ellipsis style={{ color: '#f5222d' }}>(blocked:other)</Ellipsis>
      },
    }
    // @ts-ignore
    return handles[v] ? handles[v]() : v
  }
  function handleNameClick(r: any) {
    return {
      onClick() {
        console.log(r)
        setDetail(r)
        setFilteredColumns([filteredColumns[0]] as ColumnsType)
      },
    }
  }

  const handleResourceTypeChange = (v: IResourceType) => {
    setCurrResourceType(v)
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
  }
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
    chrome.devtools.network.onRequestFinished.addListener((data: any) => {
      console.log('onRequestFinished', data)
      setReqs((prev) => {
        return [...prev, data]
      })
    })
    chrome.devtools.network.onNavigated.addListener((data: string) => {
      console.log('onNavigated', data)
      if (!shouldPreserveLogRef.current) {
        setReqs([])
      }
    })

    // const test = Array(100).fill('').map(() => {
    //   return {
    //     request: {
    //       url: '123131',
    //     },
    //   }
    // })
    // setReqs(test)
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <StopOutlined className={styles.icon} onClick={() => setReqs([])} />
        <span className={styles.splitLine}></span>
        <Checkbox onChange={handlePreserveLogChange}>Preserve log</Checkbox>
      </div>
      <div className={styles.filter}>
        <Input onChange={handleKeywordChange} className={styles.keywordSer} placeholder="Filter" />
        <Segmented
          onChange={(v) => handleResourceTypeChange(v as IResourceType)}
          size="small"
          className={styles.types}
          options={RESOURCE_TYPES}
        />
      </div>
      <div className={styles.table}>
        <Table
          style={{
            width: detail ? '130px' : '100%',
            height: '100%',
            overflow: 'auto',
          }}
          locale={{ emptyText: "There's nothing here" }}
          sticky
          bordered
          dataSource={filteredReqs}
          columns={filteredColumns}
          pagination={false}
        />
        {detail && <ReqDetail onClose={handleDetailClose} detail={detail} /> }
      </div>
    </div>
  )
}
