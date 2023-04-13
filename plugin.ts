import { IApi } from 'umi'

export default (api: IApi) => {
  if (process.env.NODE_ENV === 'production') {
    api.modifyConfig((memo) => {
      memo.publicPath = './'
      return memo
    })
  }
}
