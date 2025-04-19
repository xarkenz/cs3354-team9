import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import VueCookies from 'vue3-cookies'
import AsyncComputed from 'vue-async-computed'

const app = createApp(App);
app.config.globalProperties.session = "";
app.use(VueCookies, {expireTimes: "30d",}).use(AsyncComputed).mount('#app');
