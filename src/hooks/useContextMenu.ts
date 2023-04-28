import React, { useEffect, useState } from 'react'

type IProps = {
  target: HTMLElement;
}
export default function useContextMenu({
  target,
}: IProps) {
  const [style, setStyle] = useState<React.CSSProperties>({ display: 'none' })
  useEffect(() => {
    target.oncontextmenu = (e: MouseEvent) => {
      e.preventDefault()
      setStyle({
        position: 'fixed',
        top: e.clientY,
        left: e.clientX,
        display: 'block',
      })
    }
    document.body.onclick = () => {
      setStyle({
        display: 'none',
      })
    }
  }, [])
  return {
    style,
  }
}
