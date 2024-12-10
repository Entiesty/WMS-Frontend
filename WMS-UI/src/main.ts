import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persistedstate'
import {createPinia} from "pinia";
import './assets/tailwind.css'
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css';

const app = createApp(App)
const pinia = createPinia()
app.use(elementPlus)
app.use(pinia)
app.use(router)
app.mount('#app')
pinia.use(piniaPersist)