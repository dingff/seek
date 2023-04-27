import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import './index.less'
import { useLayoutEffect, useState } from 'react'

type MenuItem = Required<MenuProps>['items'][number]
export type IContextMenuItem = {
  label?: string;
  key?: string;
  children?: IContextMenuItem[];
  type?: 'group' | 'divider';
}
type IProps = {
  items: IContextMenuItem[];
  selectedKeys: string[];
  // eslint-disable-next-line no-unused-vars
  onClick?: (key: string) => void;
  // eslint-disable-next-line no-unused-vars
  onSelect: (keys: string[]) => void;
}
export default function ContextMenu({
  items,
  selectedKeys,
  onClick,
  onSelect,
}: IProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    return traverseTree(items as MenuItem[], (item: any) => {
      return { ...item, key: item.key || item.label }
    })
  })
  const handleClick = (e: any) => {
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
    const next = traverseTree(menuItems, (item: any) => {
      return {
        ...item,
        icon: selectedKeys.includes(item.key as never) ? <CheckOutlined /> : <div style={{ width: 12 }}></div>,
      }
    })
    setMenuItems(next)
  }, [selectedKeys])
  return (
    <div className="context-menu-com">
      <Menu
        selectedKeys={selectedKeys}
        multiple
        mode="vertical"
        triggerSubMenuAction="click"
        items={menuItems}
        onClick={handleClick}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
      />
    </div>
  )
}
