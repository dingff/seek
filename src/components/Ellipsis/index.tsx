import React from 'react'
import classNames from 'classnames'
import './index.less'

type IProps = {
  children: string;
  style?: React.CSSProperties;
  title?: string;
  className?: string;
}

export default function Ellipsis({ children, style, title, className }: IProps) {
  return (
    <div title={title || children} className={classNames('ellipsisCom', className)} style={style}>
      {children}
    </div>
  )
}
