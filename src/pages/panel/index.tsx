import { useEffect, useRef, useState } from 'react'
import { Checkbox, Input, Segmented, Table } from 'antd'
import { StopOutlined } from '@ant-design/icons'
import { IResourceType } from '@/types'
import { KNOWN_TYPES, RESOURCE_TYPES, RESOURCE_TYPE_MAP } from '@/common/constants'
import Ellipsis from '@/components/Ellipsis'
import styles from './index.less'

declare const chrome: any

export default function Panel() {
  const [reqs, setReqs] = useState<any[]>([])
  const [filteredReqs, setFilteredReqs] = useState<any[]>([])
  const [currResourceType, setCurrResourceType] = useState<IResourceType>('All')
  const shouldPreserveLogRef = useRef(false)

  const renderName = (v: string = '') => {
    const tokens = v.split('/')
    const shortName = tokens.pop() || tokens.pop()
    return (
      <Ellipsis title={v}>{shortName as string}</Ellipsis>
    )
  }
  const renderSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`
    } if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} kB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
  const renderTime = (v: number) => {
    return v < 1000 ? `${(v).toFixed(0)} ms` : `${(v / 1000).toFixed(2)} s`
  }
  const renderType = (v: string = '', r: any) => {
    if (v.includes('image')) {
      return r.response.content.mimeType.split('/').pop()
    }
    return v
  }
  const renderStatus = (v: number) => {
    const handles = {
      // eslint-disable-next-line react/no-unstable-nested-components
      0: () => {
        return <Ellipsis className="errorColumn">(blocked:other)</Ellipsis>
      },
    }
    // @ts-ignore
    return handles[v] ? handles[v]() : v
  }
  const columns = [
    { title: 'Name', dataIndex: ['request', 'url'], render: renderName },
    { title: 'Status', dataIndex: ['response', 'status'], width: 80, render: renderStatus },
    { title: 'Type', dataIndex: '_resourceType', render: renderType, width: 80 },
    { title: 'Size', dataIndex: ['response', '_transferSize'], render: renderSize, width: 80 },
    { title: 'Time', dataIndex: 'time', render: renderTime, width: 80 },
  ]
  const handleResourceTypeChange = (v: IResourceType) => {
    setCurrResourceType(v)
  }
  const handlePreserveLogChange = (e: any) => {
    shouldPreserveLogRef.current = e.target.checked
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
    setFilteredReqs(next)
    const elements = document.getElementsByClassName('errorColumn')
    Array.prototype.forEach.call(elements, (element) => {
      element.parentNode.parentNode.style.color = '#f5222d'
    })
  }, [currResourceType, reqs])
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
    //     name: '123',
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
        <Input size="small" className={styles.keywordSer} placeholder="Filter" />
        <Segmented
          onChange={(v) => handleResourceTypeChange(v as IResourceType)}
          size="small"
          className={styles.types}
          options={RESOURCE_TYPES}
        />
      </div>
      <div className={styles.table}>
        <Table
          locale={{ emptyText: "There's nothing here" }}
          sticky
          size="small"
          bordered
          dataSource={filteredReqs}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  )
}
