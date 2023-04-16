import { CloseOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import Payload from '../Payload'
import Headers from '../Headers'
import styles from './index.less'

type IProps = {
  detail: any;
  onClose: () => void;
}

export default function ReqDetail({ detail, onClose }: IProps) {
  const tabItems: TabsProps['items'] = [
    {
      label: 'Headers',
      key: '1',
      children: <Headers detail={detail} />,
    },
    {
      label: 'Payload',
      key: '2',
      children: <Payload detail={detail} />,
    },
    {
      label: 'Preview',
      key: '3',
      children: (
        <div>Preview</div>
      ),
    },
  ]
  const [filteredTabItems, setFilteredTabItems] = useState(tabItems)
  useEffect(() => {
    const hasPayload = detail.request.queryString?.[0] || detail.request.postData?.text
    if (!hasPayload) {
      tabItems.splice(1, 1)
    }
    setFilteredTabItems([...tabItems])
  }, [detail])
  return (
    <div className={styles.reqDetail}>
      <Tabs
        tabBarGutter={20}
        tabBarExtraContent={{
          left: <CloseOutlined onClick={onClose} className={styles.icon} />,
        }}
        defaultActiveKey="1"
        items={filteredTabItems}
      />
    </div>
  )
}
