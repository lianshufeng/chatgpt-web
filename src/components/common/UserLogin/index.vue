<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NModal } from 'naive-ui'

const showUserLogin = ref(true)

const userLoginWindowTips = ref('重要通知')

const openNewPage = () => {
  showUserLogin.value = false
  window.open('//www.chatman.app')
}
</script>

<template>
  <NModal v-model:show="showUserLogin" style="width: 90%; max-width: 900px;" preset="card" :title="userLoginWindowTips" :close-on-esc="false" :mask-closable="false" :closable="false">
    <div class="space-y-4">
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <p>
            <span>感谢大家一直以来对我们网站的支持和厚爱。基于国家网络安全相关规定的响应，我们决定对本站进行暂停服务。</span>
          </p>
          <p>
            <span>本站将于2023年12月27日起，将停止对外的聊天业务。 </span>
          </p>
          <p>
            <span>请访问其他站: https://www.chatman.app</span>
          </p>
          <p>
            <span>QQ群1：675745755 (满)</span>
          </p>
          <p>
            <span>QQ群2：817424284</span>
          </p>
          <p>
            <span>QQ群3：720653178</span>
          </p>
          <p>
            <span>QQ群4：839285738</span>
          </p>
          <p>
            <span>QQ群5：839281663</span>
          </p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]" />
        <NButton size="small" :on-click="openNewPage">
          访问其他站
        </NButton>
      </div>
    </div>
  </NModal>
</template>
