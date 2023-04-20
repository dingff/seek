import { Collapse } from 'antd'
import { CaretRightOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import JsonInspector from '@/components/JsonInspector'
import styles from './index.less'

type IProps = {
  detail: any;
}
type IParams = {
  name: string;
  value: string;
}
type IData = {
  parsed?: any;
  source?: string;
  current: 'parsed' | 'source';
}
const { Panel } = Collapse
export default function Payload({ detail }: IProps) {
  const [queryString, setQueryString] = useState<IData>({ current: 'parsed' })
  const [postDataJson, setPostDataJson] = useState<IData>({ current: 'parsed' })
  const [postDataForm, setPostDataForm] = useState<IData>({ current: 'parsed' })
  useEffect(() => {
    const { postData } = detail.request
    if (postData?.mimeType) {
      if (postData.mimeType.includes('json')) {
        setPostDataJson({
          ...postDataJson,
          parsed: postData.text,
          source: postData.text,
        })
      }
      if (postData.mimeType.includes('form')) {
        setPostDataForm({
          ...postDataForm,
          parsed: postData.params,
          source: postData.text,
        })
      }
    }
    if (detail.request.queryString[0]) {
      const source = detail.request.queryString.reduce((acc: string, curr: IParams) => {
        return `${acc}&${curr.name}=${curr.value}`
      }, '').slice(1)
      setQueryString({ ...queryString, source, parsed: detail.request.queryString })
    }
    return () => {
      setQueryString({ current: 'parsed' })
      setPostDataJson({ current: 'parsed' })
      setPostDataForm({ current: 'parsed' })
    }
  }, [detail])
  return (
    <div className={styles.payload}>
      <Collapse
        collapsible="icon"
        bordered={false}
        defaultActiveKey={['1', '2', '3']}
        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
        style={{ background: '#fff' }}
      >
        {queryString.source && (
          <Panel
            header={(
              <div className={styles.header}>
                <span className={styles.title}>Query String Parameters</span>
                <div className={styles.btns}>
                  <span
                    onClick={() => setQueryString({
                      ...queryString,
                      current: queryString.current === 'parsed' ? 'source' : 'parsed',
                    })}
                  >
                    view {queryString.current === 'parsed' ? 'source' : 'parsed'}
                  </span>
                </div>
              </div>
            )}
            key="1"
          >
            <div className={styles.content}>
              {queryString.current === 'parsed' && (
                <div className={styles.list}>
                  {queryString.parsed?.map((item: any) => (
                    <div className={styles.listItem}>
                      <b>{item.name}:</b>
                      {item.value}
                    </div>
                  ))}
                </div>
              )}
              {queryString.current === 'source' && queryString.source}
            </div>
          </Panel>
        )}
        {postDataJson.source && (
          <Panel
            header={(
              <div className={styles.header}>
                <span className={styles.title}>Request Payload</span>
                <div className={styles.btns}>
                  <span
                    onClick={() => setPostDataJson({
                      ...postDataJson,
                      current: postDataJson.current === 'parsed' ? 'source' : 'parsed',
                    })}
                  >
                    view {postDataJson.current === 'parsed' ? 'source' : 'parsed'}
                  </span>
                </div>
              </div>
            )}
            key="2"
          >
            <div className={styles.content}>
              {postDataJson.current === 'parsed' && <JsonInspector expandLevel={1} data={postDataJson.parsed} />}
              {postDataJson.current === 'source' && postDataJson.source}
            </div>
          </Panel>
        )}
        {postDataForm.source && (
          <Panel
            header={(
              <div className={styles.header}>
                <span className={styles.title}>Form Data</span>
                <div className={styles.btns}>
                  <span
                    onClick={() => setPostDataForm({
                      ...postDataForm,
                      current: postDataForm.current === 'parsed' ? 'source' : 'parsed',
                    })}
                  >
                    view {postDataForm.current === 'parsed' ? 'source' : 'parsed'}
                  </span>
                </div>
              </div>
            )}
            key="3"
          >
            <div className={styles.content}>
              {postDataForm.current === 'parsed' && (
                <div className={styles.list}>
                  {postDataForm.parsed?.map((item: any) => (
                    <div className={styles.listItem}>
                      <b>{item.name}:</b>
                      {item.value}
                    </div>
                  ))}
                </div>
              )}
              {postDataForm.current === 'source' && postDataForm.source}
            </div>
          </Panel>
        )}
      </Collapse>
    </div>
  )
}
