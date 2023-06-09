export type IResourceType = 'All'| 'Fetch/XHR'| 'JS'| 'CSS'| 'Img'| 'Media'| 'Font'| 'Doc'| 'WS'| 'Wasm'| 'Manifest'| 'Other'
export type IResourceTypeMap = {
  [p in IResourceType]: string[];
}
export type IColumn = {
  title: string;
  visible?: boolean;
  field?: string;
  method?: 'get' | 'post';
  isCustom?: boolean;
  width?: number
}