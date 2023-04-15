import { computed } from 'vue'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'
import { useChatStore } from '@/store'
import TTSSpeaker from '@/tts/TTSSpeaker'

export function useTTSContext() {
  const ms = useMessage()
  const chatStore = useChatStore()
  const usingTTSContext = computed<boolean>(() => chatStore.usingTTSContext)

  function toggleUsingTTSContext() {
    chatStore.setUsingTTSContext(!usingTTSContext.value)
    if (usingTTSContext.value) {
      ms.success(t('chat.turnOnTTSContext'))
      TTSSpeaker.setMute(false)
    }
    else {
      ms.warning(t('chat.turnOffTTSContext'))
      TTSSpeaker.setMute(true)
    }
  }

  return {
    usingTTSContext,
    toggleUsingTTSContext,
  }
}
