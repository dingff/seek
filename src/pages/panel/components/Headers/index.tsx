import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import styles from './index.less'

type IProps = {
  detail: any;
}

const { Panel } = Collapse

export default function Headers({ detail }: IProps) {
  const getValueByName = (dict: any[]) => (name: string) => {
    return dict.filter((item) => item.name === name)[0]?.value || ''
  }
  return (
    <div className={styles.headers}>
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
    </div>

  )
}
