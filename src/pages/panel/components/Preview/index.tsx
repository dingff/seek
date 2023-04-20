import { ObjectRootLabel } from 'react-inspector'
import React, { useEffect, useRef, useState } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { css } from '@codemirror/lang-css'
import { html } from '@codemirror/lang-html'
// eslint-disable-next-line camelcase
import { css_beautify, html_beautify, js_beautify } from 'js-beautify'
import JsonInspector from '@/components/JsonInspector'
import styles from './index.less'

type IProps = {
  detail: any;
}
type IType = 'js' | 'css' | 'doc' | 'json' | 'img' | 'unknown' | 'other';
export default function Preview({ detail }: IProps) {
  const containerRef = useRef<HTMLDivElement>(null)
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
        const nodeRenderer = ({ name, data }: any) => {
          return <ObjectRootLabel name={name} data={data} />
        }
        return (
          <div style={{ padding: '6px 8px' }}>
            <JsonInspector nodeRenderer={nodeRenderer} expandLevel={2} data={v} />
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
      unknown() {
        let errMsg = 'Failed to load response data: No data found for resource with given identifier'
        if (detail._resourceType === 'preflight') {
          errMsg = 'Failed to load response data: No content available for preflight request'
        }
        return (
          <div className={styles.unknown}>
            {errMsg}
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
    const { mimeType } = detail.response.content
    switch (true) {
      case mimeType.includes('javascript'):
        typeRef.current = 'js'
        break
      case mimeType.includes('css'):
        typeRef.current = 'css'
        break
      case mimeType.includes('html'):
        typeRef.current = 'doc'
        break
      case mimeType.includes('json'):
        typeRef.current = 'json'
        break
      case mimeType.includes('image'):
        typeRef.current = 'img'
        break
      case mimeType.includes('unknown'):
        typeRef.current = 'unknown'
        break
      default:
        typeRef.current = 'other'
        break
    }
    detail.getContent((v: string) => {
      renderContent(v)
    })
    return () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = 0
      }
    }
  }, [detail])
  return (
    <div ref={containerRef} className={styles.preview}>
      {content}
    </div>
  )
}
