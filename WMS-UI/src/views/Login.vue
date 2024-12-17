<template>
  <body>
  <div class="container" ref="container">
    <div class="form-box login">
      <form @submit.prevent="submitLoginForm">
        <h1>Login</h1>
        <div class="input-box">
          <input type="text" v-model="loginForm.userName" placeholder="Username" required/>
          <i class="bx bxs-user"></i>
        </div>
        <div class="input-box">
          <input type="password" v-model="loginForm.password" placeholder="Password" required/>
          <i class="bx bxs-lock-alt"></i>
        </div>
        <div class="input-box">
          <div>
            <input type="text" v-model="loginForm.captcha" placeholder="Enter captcha" required />
          </div>
        </div>
        <div>
          <img :src="captchaImageUrl" alt="Captcha" @click="updateCaptcha"/>
        </div>
<!--        <div class="forgot-link">-->
<!--          <a href="#">Forgot Password?</a>-->
<!--        </div>-->
        <button type="submit" class="btn">Login</button>
        <div v-if="loginSucceed || loginFail"
             :class="{'message': true,'success-message': loginSucceed, 'failure-message':loginFail}">
          <p>{{ loginResponseMessage }}</p>
        </div>
        <p>or login with social platforms</p>
        <div class="social-icons">
          <a href="#"><i class="bx bxl-google"></i></a>
          <a href="#"><i class="bx bxl-facebook"></i></a>
          <a href="#"><i class="bx bxl-github"></i></a>
          <a href="#"><i class="bx bxl-linkedin"></i></a>
        </div>
      </form>
    </div>

    <div class="form-box register">
      <form @submit.prevent="submitRegisterForm">
        <h1>Registration</h1>
        <div class="input-box">
          <input
              type="text"
              v-model="registerForm.userName"
              placeholder="Username"
              required
              pattern="^[a-zA-Z0-9]{3,16}$"
              title="用户名只能包含字母和数字，长度为3到16个字符"
          />
          <i class="bx bxs-user"></i>
        </div>
        <div class="input-box">
          <input
              type="password"
              v-model="registerForm.password"
              placeholder="Password"
              required
              pattern="^(?=.*\d).{8,}$"
              title="密码至少包含一个数字且至少八个字符"
          />
          <i class="bx bxs-lock-alt"></i>
        </div>
        <div class="forgot-link">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" class="btn">Register</button>
        <div v-if="registerSucceed || registerFail"
             :class="{'message':true,'success-message': registerSucceed, 'failure-message':registerFail}">
          <p>{{ registerResponseMessage }}</p>
        </div>
        <p>or register with social platforms</p>
        <div class="social-icons">
          <a href="#"><i class="bx bxl-google"></i></a>
          <a href="#"><i class="bx bxl-facebook"></i></a>
          <a href="#"><i class="bx bxl-github"></i></a>
          <a href="#"><i class="bx bxl-linkedin"></i></a>
        </div>
      </form>
    </div>

    <div class="toggle-box">
      <div class="toggle-panel toggle-left">
        <h1>Hello, Welcome!</h1>
        <p>Don't have an account?</p>
        <button class="btn register-btn" ref="registerBtn">Register</button>
      </div>

      <div class="toggle-panel toggle-right">
        <h1>Welcome Back!</h1>
        <p>Already have an account?</p>
        <button class="btn login-btn" ref="loginBtn">Login</button>
      </div>
    </div>
  </div>
  </body>
</template>

<script setup lang="ts">
import useDomInteraction from "@/hooks/Authorization/useDomInteraction.ts";
import useLoginForm from "@/hooks/Authorization/useLoginForm.ts";
import useRegisterForm from "@/hooks/Authorization/useRegisterForm.ts";
import {onMounted} from "vue";

const {container, registerBtn, loginBtn} = useDomInteraction();
const {loginForm, submitLoginForm, loginResponseMessage, loginSucceed, loginFail, captchaImageUrl, updateCaptcha} = useLoginForm();
const {registerForm, submitRegisterForm, registerResponseMessage, registerSucceed, registerFail} = useRegisterForm();

onMounted(async () => {
  await updateCaptcha();
});

</script>

<style scoped>
@import "@/assets/style.css";
@import "@/assets/boxicons.min.css";
@import "@/assets/google-fonts.css";

/* 通用消息样式 */
.message {
  margin-top: 20px;
  padding: 15px;
  color: white;
  border-radius: 8px; /* 圆角 */
  text-align: center;
  font-size: 16px; /* 提升字体大小，增加可读性 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 阴影效果 */
}

/* 成功消息样式 */
.success-message {
  background-color: #28a745;
}

/* 失败消息样式 */
.failure-message {
  background-color: #f44336;
}

.message p {
  margin: 0;
  font-weight: bold; /* 提升文本的强调感 */
}

img {
  width: 400px;
  height: 50px;
  margin-bottom: 20px;
}

</style>
