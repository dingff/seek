import { IColumn, IResourceType, IResourceTypeMap } from '@/types'

export const RESOURCE_TYPES: IResourceType[] = ['All', 'Fetch/XHR', 'JS', 'CSS', 'Img', 'Media', 'Font', 'Doc', 'WS', 'Wasm', 'Manifest', 'Other']
export const KNOWN_TYPES = {
  fetch: 'fetch',
  xhr: 'xhr',
  script: 'script',
  stylesheet: 'stylesheet',
  image: 'image',
  media: 'media',
  font: 'font',
  document: 'document',
  websocket: 'websocket',
  wasm: 'wasm',
  manifest: 'manifest',
}
// 映射请求的 _resourceType
export const RESOURCE_TYPE_MAP: IResourceTypeMap = {
  All: [''],
  'Fetch/XHR': [KNOWN_TYPES.fetch, KNOWN_TYPES.xhr],
  JS: [KNOWN_TYPES.script],
  CSS: [KNOWN_TYPES.stylesheet],
  Img: [KNOWN_TYPES.image],
  Media: [KNOWN_TYPES.media],
  Font: [KNOWN_TYPES.font],
  Doc: [KNOWN_TYPES.document],
  WS: [KNOWN_TYPES.websocket],
  Wasm: [KNOWN_TYPES.wasm],
  Manifest: [KNOWN_TYPES.manifest],
  Other: [''],
}
export const STORED_COLUMNS_KEY = 'COLUMNS'
export const DEFAULT_COLUMNS: IColumn[] = [
  { title: 'Name', visible: true },
  { title: 'Method', visible: true },
  { title: 'Status', visible: true },
  { title: 'Type', visible: true },
  { title: 'Size', visible: true },
  { title: 'Time', visible: true },
]
