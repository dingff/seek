declare const chrome: any
const store = {
  get(key: string) {
    return new Promise((resolve) => {
      chrome.storage.sync.get([key]).then((res: any) => {
        resolve(res[key])
      })
    })
  },
  set(key: string, value: any) {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ [key]: value }).then(() => {
        resolve()
      })
    })
  },
  remove(key: string) {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.remove(key).then(() => {
        resolve()
      })
    })
  },
  clear() {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.clear().then(() => {
        resolve()
      })
    })
  },
}
export default store
