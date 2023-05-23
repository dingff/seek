import { CaretRightOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useSize } from 'ahooks'
import classNames from 'classnames'
import styles from './index.less'

type IProps = {
  detail: any;
}

const { Panel } = Collapse

export default function Headers({ detail }: IProps) {
  const containerRef = useRef(null)
  const size = useSize(containerRef)
  const [listItemClassNames, setListItemClassNames] = useState(classNames(styles.listItem, styles.hide))
  const getValueByName = (dict: any[]) => (name: string) => {
    return dict.filter((item) => item.name === name)[0]?.value || 'strict-origin-when-cross-origin'
  }
  const renderStatus = (v: number) => {
    const status = v.toString()
    let className = ''
    switch (true) {
      case status.startsWith('2'):
        className = styles.success
        break
      case status.startsWith('3'):
        className = styles.warning
        break
      case status.startsWith('4') || status.startsWith('5') || status == '0':
        className = styles.error
        break
      default:
        className = styles.default
        break
    }
    return (
      <div className={classNames(styles.dot, className)}></div>
    )
  }
  useEffect(() => {
    if (!size) return
    setListItemClassNames(classNames(styles.listItem, {
      [styles.wrap]: size.width < 330,
    }))
  }, [size])
  return (
    <div className={styles.headers} ref={containerRef}>
      <Collapse
        bordered={false}
        defaultActiveKey={['1', '2', '3']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{ background: '#fff' }}
      >
        <Panel header="General" key="1">
          <div className={styles.list}>
            <div className={listItemClassNames}>
              <b>Request URL:</b>
              {detail.request.url}
            </div>
            <div className={listItemClassNames}>
              <b>Request Method:</b>
              {detail.request.method}
            </div>
            <div className={classNames(listItemClassNames, styles.status)}>
              <b>Status Code:</b>
              {renderStatus(detail.response.status)}
              {detail.response.status}
            </div>
            {detail.serverIPAddress && (
              <div className={listItemClassNames}>
                <b>Remote Address:</b>
                {detail.serverIPAddress}
              </div>
            )}
            <div className={listItemClassNames}>
              <b>Referrer Policy:</b>
              {getValueByName(detail.response.headers)('referrer-policy')}
            </div>
          </div>
        </Panel>
        {detail.response.headers[0] && (
          <Panel header="Response Headers" key="2">
            <div className={styles.list}>
              {detail.response.headers.map((item: any) => (
                <div className={listItemClassNames}>
                  <b>{item.name}:</b>
                  {item.value}
                </div>
              ))}
            </div>
          </Panel>
        )}
        <Panel header="Request Headers" key="3">
          <div className={styles.list}>
            {detail.request.headers.map((item: any) => (
              <div className={listItemClassNames}>
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
