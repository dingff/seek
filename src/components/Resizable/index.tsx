import React, { useEffect, useRef } from 'react'
import classNames from 'classnames'
import './index.less'

type IHorizontalHandle = 'right' | 'left';
type IVerticalHandle = 'top' | 'bottom';
type IHandle = IHorizontalHandle | IVerticalHandle
type IProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  handles?: IHandle[];
  className?: string;
}

export default function Resizable({
  children,
  style,
  handles = ['top', 'bottom', 'right', 'left'],
  className,
}: IProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(crypto.randomUUID())
  const initHorizontal = (handle: IHorizontalHandle) => {
    const dragBar = document.getElementById(`drag-bar-${handle}-${idRef.current}`)
    if (!dragBar) return
    dragBar.onmousedown = (downEvent) => {
      if (!containerRef.current) return
      const initialX = downEvent.clientX
      const initialWidth = containerRef.current.offsetWidth
      document.body.style.userSelect = 'none'
      document.onmousemove = (moveEvent) => {
        if (!containerRef.current) return
        const disX = moveEvent.clientX - initialX
        containerRef.current.style.width = `${initialWidth + disX}px`
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.body.style.userSelect = 'unset'
    }
  }
  const initVertical = (handle: IVerticalHandle) => {
    const dragBar = document.getElementById(`drag-bar-${handle}-${idRef.current}`)
    if (!dragBar) return
    dragBar.onmousedown = (downEvent) => {
      if (!containerRef.current) return
      const initialY = downEvent.clientY
      const initialHeight = containerRef.current.offsetHeight
      document.body.style.userSelect = 'none'
      document.onmousemove = (moveEvent) => {
        console.log('mm')
        if (!containerRef.current) return
        const disY = moveEvent.clientY - initialY
        containerRef.current.style.height = `${initialHeight + disY}px`
      }
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.body.style.userSelect = 'unset'
    }
  }
  const renderHandle = (handle: IHandle) => {
    const styles = {
      top() {
        return {
          top: 0,
          width: '100%',
          cursor: 'ns-resize',
        }
      },
      bottom() {
        return {
          bottom: 0,
          width: '100%',
          cursor: 'ns-resize',
        }
      },
      right() {
        return {
          right: 0,
          top: 0,
          height: '100%',
          cursor: 'ew-resize',
        }
      },
      left() {
        return {
          left: 0,
          top: 0,
          height: '100%',
          cursor: 'ew-resize',
        }
      },
    }
    return (
      <div id={`drag-bar-${handle}-${idRef.current}`} className="drag-bar" style={styles[handle]()}></div>
    )
  }
  const initHandlesEvent = () => {
    // eslint-disable-next-line no-unused-vars
    const handlesMap: { [p in IHandle]: () => void } = {
      top: () => {
        initVertical('top')
      },
      bottom: () => {
        initVertical('bottom')
      },
      left: () => {
        initHorizontal('left')
      },
      right: () => {
        initHorizontal('right')
      },
    }
    handles.forEach((handle) => handlesMap[handle]())
  }
  useEffect(() => {
    initHandlesEvent()
  }, [handles])
  return (
    <div ref={containerRef} style={style} className={classNames('resizable-com', className)}>
      {children}
      {handles.map((handle: IHandle) => renderHandle(handle))}
    </div>
  )
}
