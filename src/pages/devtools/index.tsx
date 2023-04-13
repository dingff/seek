import { useEffect } from 'react'

declare const chrome:any

export default function Devtools() {
  useEffect(() => {
    chrome.devtools.panels.create('Seek', '', 'panel.html')
  }, [])
}
