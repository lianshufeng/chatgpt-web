import { createApp } from 'vue'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import { getLoadTime } from '@/store/modules/chat/helper'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  await checkPre()

  app.mount('#app')
}

function checkPre() {
  function checkStoreLoad() {
    return getLoadTime() !== null
  }

  return new Promise((resolve: Function) => {
    const timerId = setInterval(() => {
      if (checkStoreLoad()) {
        clearInterval(timerId)
        resolve()
      }
    }, 300)
  })
}

bootstrap()
