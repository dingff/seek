import ContextMenu from '@/components/ContextMenu'

export default function HeaderContextMenu() {
  const contextMenuItems = [
    { label: 'Edit Columns' },
    { label: 'Reset Columns' },
  ]
  const handleContextMenuClick = (key: string) => {
    const handles = {
      'Edit Columns': () => {
      },
    }
    handles[key as keyof typeof handles]()
  }
  return (
    <ContextMenu
      target={document.querySelector('.ant-table-header')}
      items={contextMenuItems}
      onClick={handleContextMenuClick}
    />
  )
}
