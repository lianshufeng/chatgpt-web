import { ss } from '@/utils/storage'

const LOCAL_NAME = 'promptStore'

function getRandomMember(arr: any) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

const DefaultPrompts = [{
  key: '生成图片，如: /画图 一只可爱的小狗',
  value: `/画图 ${getRandomMember(['一只可爱的小狗', '一个美少女', '精灵在树林里', '迷路的小羊羔', '在屋檐下喝着悲伤的咖啡'])}`,
}]

export type PromptList = []

export interface PromptStore {
  promptList: PromptList
}

export function getLocalPromptList(): PromptStore {
  const promptStore: PromptStore | undefined = ss.get(LOCAL_NAME)
  const ret = promptStore ?? { promptList: [] }
  return <PromptStore>{ promptList: DefaultPrompts.concat(ret.promptList) }
}

export function setLocalPromptList(promptStore: PromptStore): void {
  ss.set(LOCAL_NAME, promptStore)
}
