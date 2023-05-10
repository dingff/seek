import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import './index.less'

type MenuItem = Required<MenuProps>['items'][number]
export type IContextMenuItem = {
  label?: string;
  key?: string;
  children?: IContextMenuItem[];
  type?: 'group' | 'divider';
}
type IProps = {
  target: HTMLElement | null;
  items: IContextMenuItem[];
  selectedKeys?: string[];
  style?: React.CSSProperties;
  selectable?: boolean;
  // eslint-disable-next-line no-unused-vars
  onClick?: (key: string) => void;
  // eslint-disable-next-line no-unused-vars
  onSelect?: (keys: string[]) => void;
}
export default function ContextMenu({
  target,
  items,
  selectedKeys = [],
  style,
  selectable = false,
  onClick,
  onSelect,
}: IProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    return traverseTree(items as MenuItem[], (item: any) => {
      return { ...item, key: item.key || item.label }
    })
  })
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [style_, setStyle_] = useState<React.CSSProperties>({ display: 'none' })

  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }
  const handleClick = (e: any) => {
    setOpenKeys([])
    onClick?.(e.key)
  }
  const handleSelect = (e: any) => {
    onSelect?.(e.selectedKeys)
  }
  const handleDeselect = (e: any) => {
    onSelect?.(e.selectedKeys)
  }
  // eslint-disable-next-line no-unused-vars
  function traverseTree(root: MenuItem[], cb: (data: MenuItem) => MenuItem) {
    const doNext = (arr: any[]) => {
      return arr.map((item) => {
        if (item.children) {
          item.children = doNext(item.children)
        }
        return cb(item)
      })
    }
    return doNext(root)
  }
  useLayoutEffect(() => {
    if (!selectable) return
    const next = traverseTree(menuItems, (item: any) => {
      return {
        ...item,
        icon: selectedKeys.includes(item.key as never) ? <CheckOutlined /> : <div style={{ width: 12 }}></div>,
      }
    })
    setMenuItems(next)
  }, [selectedKeys])
  useEffect(() => {
    if (!target) return
    target.oncontextmenu = (e: MouseEvent) => {
      e.preventDefault()
      setStyle_({
        position: 'fixed',
        zIndex: 999,
        top: e.clientY,
        left: e.clientX,
        display: 'block',
      })
    }
    const hideFn = () => {
      setStyle_({
        display: 'none',
      })
    }
    document.body.addEventListener('click', hideFn)
    return () => {
      document.body.removeEventListener('click', hideFn)
    }
  }, [target])
  return (
    <div className="context-menu-com">
      <Menu
        style={{ ...style, ...style_ }}
        selectable={selectable}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        multiple
        mode="vertical"
        items={menuItems}
        onClick={handleClick}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />
    </div>
  )
}
