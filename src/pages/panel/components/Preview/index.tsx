import { Inspector } from 'react-inspector'
import React, { useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
// eslint-disable-next-line camelcase
import { css_beautify, html_beautify, js_beautify } from 'js-beautify'
import { RESOURCE_TYPE_MAP } from '@/common/constants'
import styles from './index.less'

type IProps = {
  detail: any;
}
type IType = 'js' | 'css' | 'doc' | 'json' | 'img' | 'other';
export default function Preview({ detail }: IProps) {
  const typeRef = useRef<IType>('json')
  const [content, setContent] = useState<React.ReactNode>(null)
  const renderContent = (v: string) => {
    // eslint-disable-next-line no-unused-vars
    const handles: { [p in IType]: () => React.ReactNode } = {
      js() {
        return (
          <CodeMirror
            value={js_beautify(v)}
            extensions={[javascript()]}
          />
        )
      },
      css() {
        return (
          <CodeMirror
            value={css_beautify(v)}
            extensions={[css()]}
          />
        )
      },
      doc() {
        return (
          <CodeMirror
            value={html_beautify(v)}
            extensions={[html()]}
          />
        )
      },
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
        return (
          <CodeMirror
            value={v}
          />
        )
      },
    }
    setContent(handles[typeRef.current]())
  }
  useEffect(() => {
    switch (true) {
      case RESOURCE_TYPE_MAP.JS.includes(detail._resourceType):
        typeRef.current = 'js'
        break
      case RESOURCE_TYPE_MAP.CSS.includes(detail._resourceType):
        typeRef.current = 'css'
        break
      case RESOURCE_TYPE_MAP.Doc.includes(detail._resourceType):
        typeRef.current = 'doc'
        break
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