import { onMounted, ref } from 'vue';

export default function useDomInteraction() {
    const container = ref<HTMLElement | null>(null); // 声明容器的引用
    const registerBtn = ref<HTMLElement | null>(null); // 声明注册按钮的引用
    const loginBtn = ref<HTMLElement | null>(null); // 声明登录按钮的引用

    onMounted(() => {
        // 确保 ref 已经绑定并且 DOM 元素存在
        if (container.value && registerBtn.value && loginBtn.value) {
            // 为按钮添加点击事件
            registerBtn.value.addEventListener('click', () => {
                container.value?.classList.add('active');  // 添加 'active' 类来触发过渡
            });

            loginBtn.value.addEventListener('click', () => {
                container.value?.classList.remove('active');  // 移除 'active' 类来返回登录页面
            });
        }
    });

    return {
        container,
        registerBtn,
        loginBtn
    };
}