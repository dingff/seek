import { Inspector } from 'react-inspector'
import { CaretRightOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import styles from './index.less'

type IProps = {
  detail: any;
}
type IQueryStringItem = {
  name: string;
  value: string;
}

export default function Payload({ detail }: IProps) {
  const [isPost, setIsPost] = useState(false)
  const [queryString, setQueryString] = useState<IQueryStringItem[]>([])
  const [queryStringSource, setQueryStringSource] = useState('')
  const [postData, setPostData] = useState('')
  const [sourceVisible, setSourceVisible] = useState(false)
  useEffect(() => {
    if (detail.request.postData?.text) {
      // post
      setPostData(detail.request.postData.text)
      setIsPost(true)
    } else {
      // get
      setQueryString(detail.request.queryString)
      const source = detail.request.queryString.reduce((acc: string, curr: IQueryStringItem) => {
        return `${acc}&${curr.name}=${curr.value}`
      }, '').slice(1)
      setQueryStringSource(source)
      setIsPost(false)
    }
  }, [detail])

  return (
    <div className={styles.payload}>
      <div className={styles.header}>
        <CaretRightOutlined className={styles.icon} rotate={90} />
        <span className={styles.title}>{isPost ? 'Request Payload' : 'Query String Parameters'}</span>
        <div className={styles.btns}>
          <span
            onClick={() => setSourceVisible(!sourceVisible)}
          >
            {sourceVisible ? 'view parsed' : 'view source'}
          </span>
        </div>
      </div>
      <div className={styles.content}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {sourceVisible ? (
          isPost ? postData : queryStringSource
        ) : (isPost ? (
          <div className={styles.treeView}>
            {/* @ts-ignore */}
            <Inspector expandLevel={1} data={JSON.parse(postData)} />
          </div>
        ) : (
          <div className={styles.list}>
            {queryString.map((item) => (
              <div className={styles.listItem}>
                <b>{item.name}:</b>
                {item.value}
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>

  )
}
