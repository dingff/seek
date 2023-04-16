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
  const realTitle = title || children
  return realTitle.length > 150 ? (
    <div title={realTitle} className={classNames('ellipsisCom', className)} style={style}>
      {children}
    </div>
  ) : (
    <Tooltip mouseEnterDelay={1} placement="topLeft" title={realTitle}>
      <div className={classNames('ellipsisCom', className)} style={style}>
        {children}
      </div>
    </Tooltip>
  )
}
