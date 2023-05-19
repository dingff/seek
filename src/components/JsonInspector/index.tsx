import { useEffect, useState } from 'react'
import { Inspector, ObjectRootLabel } from 'react-inspector'
import './index.less'

type IProps = {
  data: string;
  expandLevel?: number;
}

export default function JsonInspector({
  data,
  expandLevel = 2,
}: IProps) {
  const [parsedData, setParsedData] = useState(null)
  const nodeRenderer = ({ name, data: v }: any) => {
    return <ObjectRootLabel name={name} data={v} />
  }
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
