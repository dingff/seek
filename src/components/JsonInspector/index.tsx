import { useEffect, useState } from 'react'
import { Inspector } from 'react-inspector'
import './index.less'

type IProps = {
  data: string;
  expandLevel?: number;
  nodeRenderer?: any;
}

export default function JsonInspector({
  data,
  expandLevel = 1,
  nodeRenderer,
}: IProps) {
  const [parsedData, setParsedData] = useState(null)
  useEffect(() => {
    let next = null
    try {
      next = JSON.parse(data)
    } catch (err) {
      next = null
    }
    setParsedData(next)
  }, [data])

  return (
    <div className="json-inspector-com">
      {parsedData ? (
        // @ts-ignore
        <Inspector nodeRenderer={nodeRenderer} expandLevel={expandLevel} data={parsedData} />
      ) : (
        <div>{data}</div>
      )}
    </div>
  )
}
