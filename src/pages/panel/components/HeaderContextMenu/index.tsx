import { useEffect, useState } from 'react'
import { Modal, Switch, Table } from 'antd'
import { useUpdateEffect } from 'ahooks'
import ContextMenu from '@/components/ContextMenu'
import styles from './index.less'
import store from '@/common/store'
import { STORED_COLUMNS_KEY, DEFAULT_COLUMNS } from '@/common/constants'
import { IColumn } from '@/types'

type IProps = {
  // eslint-disable-next-line no-unused-vars
  onColumnsChange: (data: any[]) => void;
}
export default function HeaderContextMenu({
  onColumnsChange,
}: IProps) {
  const [modalVisible, setModalVisible] = useState(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const columns = [
    { title: 'Column', dataIndex: 'title' },
    { title: 'Action', render: renderAction },
  ]
  const contextMenuItems = [
    { label: 'Edit Columns' },
    { label: 'Reset Columns' },
  ]
  const handleContextMenuClick = (key: string) => {
    const handles = {
      'Edit Columns': () => {
        setModalVisible(true)
      },
    }
    handles[key as keyof typeof handles]()
  }
  const handleSwitchChange = (title: string, checked: boolean) => {
    const next = dataSource.map((item: IColumn) => {
      return {
        ...item,
        visible: item.title === title ? checked : item.visible,
      }
    })
    setDataSource(next)
  }
  function renderAction(v: string, r: any, i: number) {
    if (i === 0) return
    return (
      <div className={styles.action}>
        <Switch defaultChecked={r.visible !== false} onChange={(checked) => handleSwitchChange(r.title, checked)}></Switch>
      </div>
    )
  }
  useUpdateEffect(() => {
    onColumnsChange(dataSource)
    store.set(STORED_COLUMNS_KEY, dataSource)
  }, [dataSource])
  useEffect(() => {
    store.get(STORED_COLUMNS_KEY).then((list: any) => {
      if (list) {
        setDataSource(list)
      } else {
        store.set(STORED_COLUMNS_KEY, DEFAULT_COLUMNS)
        setDataSource(DEFAULT_COLUMNS)
      }
    })
  }, [])
  return (
    <div className={styles.container}>
      <Modal footer={null} title="Edit Columns" open={modalVisible} onCancel={() => setModalVisible(false)}>
        <Table
          showSorterTooltip={false}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
      </Modal>
      <ContextMenu
        target={document.querySelector('.ant-table-header')}
        items={contextMenuItems}
        onClick={handleContextMenuClick}
      />
    </div>
  )
}
