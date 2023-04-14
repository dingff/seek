import { ConfigProvider } from 'antd'
import './index.less'

export default function Layout(props: any) {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 2,
          colorText: 'rgba(0, 0, 0, 0.85)',
          fontSize: 13,
          controlInteractiveSize: 14,
        },
      }}
    >
      {props.children}
    </ConfigProvider>
  )
}
