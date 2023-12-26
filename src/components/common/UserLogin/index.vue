<script setup lang='ts'>
import { ref } from 'vue'
import { NButton, NInput, NModal } from 'naive-ui'

const userName = ref('')
const passWord = ref('')
const showUserLogin = ref(true)

const userLoginWindowTips = ref('重要通知')

const userLoginMethod = () => {
 showUserLogin.value = false
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
					<span>本站将于2023年12月27日起，将停止对外的聊天业务。  QQ交流群：675745755</span>
				</p>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <span class="flex-shrink-0 w-[100px]" />
        <NButton size="small" :on-click="userLoginMethod">
          我知道了
        </NButton>
      </div>
    </div>
  </NModal>
</template>
