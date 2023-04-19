import React from 'react'
import classNames from 'classnames'
import './index.less'

type IProps = {
  children: string | number;
  style?: React.CSSProperties;
  title?: string | number;
  className?: string;
}

export default function Ellipsis({ children, style, title, className }: IProps) {
  return (
    // @ts-ignore
    <div title={title || children} className={classNames('ellipsisCom', className)} style={style}>
      {children}
    </div>
  )
}
