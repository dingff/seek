import { useState } from 'react'
import styles from './index.less'
import ContextMenu, { IContextMenuItem } from '@/components/ContextMenu'
import useContextMenu from '@/hooks/useContextMenu'

export default function Test() {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const { style } = useContextMenu({
    target: document.body,
  })
  const items: IContextMenuItem[] = [
    {
      label: 'test',
      children: [
        {
          label: '1-1',
          key: '1-1',
        },
      ],
    },
    {
      label: 'custom',
    },
    {
      type: 'divider',
    },
    {
      label: 'custom666',
    },
  ]
  return (
    <div className={styles.container}>
      <ContextMenu
        selectable
        style={style}
        selectedKeys={selectedKeys}
        items={items}
        onSelect={(keys) => setSelectedKeys(keys)}
      />
    </div>
  )
}
