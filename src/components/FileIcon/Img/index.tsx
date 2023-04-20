import './index.less'

type IProps = {
  src: string;
}
export default function Img({ src }: IProps) {
  return (
    <div className="img-icon">
      <img src={src} alt="" />
    </div>
  )
}
