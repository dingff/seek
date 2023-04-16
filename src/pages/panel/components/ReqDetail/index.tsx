import { CloseOutlined } from '@ant-design/icons'
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
  return (
    <div className={styles.reqDetail}>
      <Tabs
        tabBarGutter={20}
        tabBarExtraContent={{
          left: <CloseOutlined onClick={onClose} className={styles.icon} />,
        }}
        defaultActiveKey="1"
        items={tabItems}
      />
    </div>
  )
}
