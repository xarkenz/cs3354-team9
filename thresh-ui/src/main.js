import './assets/main.css'
import './index.css'

import { createApp } from 'vue'
import Spline from 'vue-spline'
import App           from './App.vue'

import VueCookies    from 'vue3-cookies'
import AsyncComputed from 'vue-async-computed'

const app = createApp(App)
app
  .use(VueCookies, { expireTimes: '30d' })
  .use(AsyncComputed)
  .component('Spline', Spline)
  .mount('#app')
