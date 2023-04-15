import React from 'react'
import { Tooltip } from 'antd'
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
    <Tooltip placement="topLeft" title={title || children}>
      <div className={classNames('ellipsisCom', className)} style={style}>
        {children}
      </div>
    </Tooltip>
  )
}
