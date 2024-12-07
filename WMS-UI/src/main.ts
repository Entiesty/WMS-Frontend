import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persistedstate'
import {createPinia} from "pinia";
import './assets/tailwind.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
pinia.use(piniaPersist)