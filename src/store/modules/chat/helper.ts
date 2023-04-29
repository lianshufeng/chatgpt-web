import { ss } from '@/utils/storage/IndexedDBStore'

const LOCAL_NAME = 'chatStorage'

export function defaultState(): Chat.ChatState {
  const uuid = 1002
  return {
    active: uuid,
    usingContext: true,
    usingTTSContext: true,
    history: [{ uuid, title: 'New Chat', isEdit: false }],
    chat: [{ uuid, data: [] }],
  }
}

// 缓存，解决异步线程同步的问题
let localStateCache = {}
let localStateLoadTime: any = null

const updateCache = () => {
  ss.get(LOCAL_NAME).then((it) => {
    localStateLoadTime = new Date().getTime()
    localStateCache = it
  })
}

updateCache()

export function getLoadTime(): Number {
  return localStateLoadTime
}

export function getLocalState(): Chat.ChatState {
  return { ...defaultState(), ...localStateCache }
}

export function setLocalState(state: Chat.ChatState) {
  Promise.all([
    ss.set(LOCAL_NAME, state),
  ])
}
