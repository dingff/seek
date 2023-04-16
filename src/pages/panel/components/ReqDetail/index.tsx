/* eslint-disable react/no-unstable-nested-components */
import { CaretRightOutlined, CloseOutlined } from '@ant-design/icons'
import { Collapse, Tabs } from 'antd'
import styles from './index.less'

const { Panel } = Collapse

type IProps = {
  detail: any;
  onClose: () => void;
}
export default function ReqDetail({ detail, onClose }: IProps) {
  const getValueByName = (dict: any[]) => (name: string) => {
    return dict.filter((item) => item.name === name)[0]?.value || ''
  }
  const tabItems = [
    {
      label: 'Headers',
      key: '1',
      children: (
        <Collapse
          bordered={false}
          defaultActiveKey={['1', '2', '3']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          style={{ background: '#fff' }}
        >
          <Panel header="General" key="1">
            <div className={styles.list}>
              <div className={styles.listItem}>
                <b>Request URL:</b>
                {detail.request.url}
              </div>
              <div className={styles.listItem}>
                <b>Request Method:</b>
                {detail.request.method}
              </div>
              <div className={styles.listItem}>
                <b>Status Code:</b>
                {detail.response.status}
              </div>
              <div className={styles.listItem}>
                <b>Remote Address:</b>
                {detail.serverIPAddress}
              </div>
              <div className={styles.listItem}>
                <b>Referrer Policy:</b>
                {getValueByName(detail.response.headers)('referrer-policy')}
              </div>
            </div>
          </Panel>
          <Panel header="Response Headers" key="2">
            <div className={styles.list}>
              {detail.response.headers.map((item: any) => (
                <div className={styles.listItem}>
                  <b>{item.name}:</b>
                  {item.value}
                </div>
              ))}
            </div>
          </Panel>
          <Panel header="Request Headers" key="3">
            <div className={styles.list}>
              {detail.request.headers.map((item: any) => (
                <div className={styles.listItem}>
                  <b>{item.name}:</b>
                  {item.value}
                </div>
              ))}
            </div>
          </Panel>
        </Collapse>
      ),
    },
    {
      label: 'Preview',
      key: '2',
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
