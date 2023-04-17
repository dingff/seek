import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/vs.css'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import { Inspector } from 'react-inspector'
import React, { useEffect, useRef, useState } from 'react'
import { RESOURCE_TYPE_MAP } from '@/common/constants'
import styles from './index.less'

type IProps = {
  detail: any;
}
type IType = 'json' | 'img' | 'other';
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
export default function Preview({ detail }: IProps) {
  const typeRef = useRef<IType>('json')
  const [content, setContent] = useState<React.ReactNode>(null)
  const renderContent = (v: string) => {
    // eslint-disable-next-line no-unused-vars
    const handles: { [p in IType]: () => React.ReactNode } = {
      json() {
        return (
          <div style={{ padding: '6px 8px' }}>
            {/* @ts-ignore */}
            <Inspector data={JSON.parse(v)} />
          </div>
        )
      },
      img() {
        return (
          <div className={styles.imgBox}>
            <img alt="" src={`data:${detail.response.content.mimeType};base64,${v}`}></img>
          </div>
        )
      },
      other() {
        return <pre key={detail.request.url}><code>{v}</code></pre>
      },
    }
    setContent(handles[typeRef.current]())
  }
  useEffect(() => {
    if (typeRef.current === 'other') {
      setTimeout(() => {
        hljs.highlightAll()
      }, 50)
    }
  }, [content])
  useEffect(() => {
    switch (true) {
      case RESOURCE_TYPE_MAP['Fetch/XHR'].includes(detail._resourceType):
        typeRef.current = 'json'
        break
      case RESOURCE_TYPE_MAP.Img.includes(detail._resourceType):
        typeRef.current = 'img'
        break
      default:
        typeRef.current = 'other'
        break
    }
    detail.getContent((v: string) => {
      renderContent(v)
    })
  }, [detail])
  return (
    <div className={styles.preview}>
      {content}
    </div>
  )
}
