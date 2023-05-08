import { ConfigProvider } from 'antd'
import './index.less'

export default function Layout(props: any) {
  return (
    <ConfigProvider
      componentSize="small"
      theme={{
        token: {
          borderRadius: 2,
          colorText: '#222',
          fontSize: 12,
          controlInteractiveSize: 14,
          fontFamily: 'sans-serif',
        },
      }}
    >
      {props.children}
    </ConfigProvider>
  )
}
