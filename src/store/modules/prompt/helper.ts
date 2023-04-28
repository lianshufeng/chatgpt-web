import { ss } from '@/utils/storage'

const LOCAL_NAME = 'promptStore'

function getRandomMember(arr: any) {
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}

const DefaultPrompts = [{
  key: '生成图片，如: /画图 一只可爱的小狗',
  value: `/画图 ${getRandomMember(['/画图 一只可爱的小狗,高清,8k,细节,怜爱,质感', '一个美少女', '/画图 精灵在树林里,写实,脸部还原,高清,细节,8k,紫色头发,金属盔甲,装备豪华,年轻,开心', '在屋檐下喝着悲伤的咖啡'])}`,
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
