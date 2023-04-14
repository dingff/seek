import { useEffect, useState } from 'react'
import { Checkbox, Input, Segmented, Table, Tooltip } from 'antd'
import styles from './index.less'
import { IResourceType } from '@/types'
import { KNOWN_TYPES, RESOURCE_TYPES, RESOURCE_TYPE_MAP } from '@/common/constants'

declare const chrome: any

export default function Panel() {
  const [queryList, setQueryList] = useState<any[]>([])
  const [filteredQueryList, setFilteredQueryList] = useState<any[]>([])
  const [currResourceType, setCurrResourceType] = useState<IResourceType>('All')
  const renderName = (v: string) => {
    const shortName = v?.split('/').pop()
    return (
      <Tooltip placement="topLeft" title={v}>
        {shortName}
      </Tooltip>
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
        return <span style={{ color: '#f5222d' }}>(blocked:other)</span>
      },
    }
    // @ts-ignore
    return handles[v] ? handles[v]() : v
  }
  const columns = [
    { title: 'Name', dataIndex: ['request', 'url'], ellipsis: { showTitle: false }, render: renderName },
    { title: 'Status', dataIndex: ['response', 'status'], width: 120, ellipsis: true, render: renderStatus },
    { title: 'Type', dataIndex: '_resourceType', render: renderType, width: 80 },
    { title: 'Size', dataIndex: ['response', '_transferSize'], render: renderSize, width: 80 },
    { title: 'Time', dataIndex: 'time', ellipsis: true, render: renderTime, width: 80 },
  ]
  const handleResourceTypeChange = (v: IResourceType) => {
    setCurrResourceType(v)
  }
  useEffect(() => {
    const types = RESOURCE_TYPE_MAP[currResourceType]
    let next = []
    switch (currResourceType) {
      case 'All':
        next = queryList
        break
      case 'Other':
        next = queryList.filter((item) => {
          return !Object.values(KNOWN_TYPES).includes(item._resourceType)
        })
        break
      default:
        next = queryList.filter((item) => {
          return types.includes(item._resourceType)
        })
        break
    }
    setFilteredQueryList(next)
  }, [currResourceType, queryList])
  useEffect(() => {
    chrome.devtools.network.onRequestFinished.addListener((data: any) => {
      console.log('onRequestFinished', data)
      setQueryList((prev) => {
        return [...prev, data]
      })
    })
    chrome.devtools.network.onNavigated.addListener((data: string) => {
      console.log('onNavigated', data)
    })

    // const test = Array(100).fill('').map((item) => {
    //   return {
    //     name: '123',
    //   }
    // })
    // setQueryList(test)
  }, [])
  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <Checkbox>Preserve log</Checkbox>
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
          dataSource={filteredQueryList}
          columns={columns}
          pagination={false}
        />
      </div>
    </div>
  )
}
