import { DocIcon, CssIcon, JsIcon, FontIcon } from '@/components/FileIcon'
import styles from './index.less'

export default function Test() {
  return (
    <div className={styles.container}>
      <JsIcon />
      <CssIcon />
      <DocIcon />
      <FontIcon />
    </div>
  )
}
