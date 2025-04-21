import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import App           from './App.vue'

import router        from './router'           
import VueCookies    from 'vue3-cookies'
import AsyncComputed from 'vue-async-computed'

const app = createApp(App)
app
  .use(router)            
  .use(VueCookies, { expireTimes: '30d' })
  .use(AsyncComputed)
  .mount('#app')
