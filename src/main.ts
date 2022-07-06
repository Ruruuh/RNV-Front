import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from '@/router/index'

import BaseButton from '@/components/BaseButton.vue'
import BaseProgress from '@/components/BaseProgress.vue'
import BaseRow from '@/components/BaseRow.vue'
import BaseModal from '@/components/BaseModal.vue'
import BaseToggle from '@/components/BaseToggle.vue'
import BaseRemark from '@/components/BaseRemark.vue'
import TheHeader from '@/components/TheHeader.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.component('BaseButton', BaseButton)
app.component('BaseProgress', BaseProgress)
app.component('BaseRow', BaseRow)
app.component('BaseModal', BaseModal)
app.component('BaseToggle', BaseToggle)
app.component('BaseRemark', BaseRemark)
app.component('TheHeader', TheHeader)

app.mount('#app')
