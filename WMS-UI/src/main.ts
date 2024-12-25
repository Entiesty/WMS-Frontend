import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import piniaPersist from 'pinia-plugin-persistedstate'
import {createPinia} from "pinia";
import './assets/tailwind.css'
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css';
import {useAuthorizationStore} from "@/stores/authorizationStore.ts";
import {useRegisterRoutes} from "@/hooks/Authorization/useRegisterRoutes.ts";


const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)
app.use(elementPlus)
app.use(pinia)
// 获取 Pinia 中的动态路由
const authorizationStore = useAuthorizationStore();
const { registerRoutes } = useRegisterRoutes(router);

// 页面加载时，检查是否已经登录并加载动态路由
if (authorizationStore.token && !authorizationStore.hasLoadedRoutes) {
    const dynamicRoutes = authorizationStore.routes;
    registerRoutes(dynamicRoutes);  // 注册动态路由
}

app.use(router)
app.mount('#app')

