<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-form-title">
        <h1>{{ isLogin ? '登录到' : '加入到' }}</h1>
        <h1>Online Chat</h1>
        <div v-if="isLogin" class="sub-title">
          <span>没有账号吗? </span>
          <span class="register action" @click.prevent="onChangeStatus">注册新账号</span>
        </div>
        <div v-else class="sub-title">
          <span>已有帐号? </span>
          <span class="login action" @click.prevent="onChangeStatus">去登陆</span>
        </div>
      </div>
      <Form
        v-if="isLogin"
        ref="loginForm"
        :rules="loginFormRules"
        :data="loginFormData"
        :label-width="60"
        scroll-to-first-error="smooth"
        class="login-form-content"
        @submit="login"
      >
        <FormItem label="账户" name="username">
          <Input v-model="loginFormData.username" clearable placeholder="请输入账户名">
            <template #prefix-icon>
              <DesktopIcon />
            </template>
          </Input>
        </FormItem>
        <FormItem label="密码" name="password">
          <Input
            v-model="loginFormData.password"
            type="password"
            clearable
            placeholder="请输入密码"
          >
            <template #prefix-icon>
              <LockOnIcon />
            </template>
          </Input>
        </FormItem>
        <FormItem style="padding-top: 8px">
          <Space size="small">
            <Button theme="primary" type="submit" block>立即登录</Button>
            <Button theme="default" variant="base" type="reset">重置</Button>
            <Button theme="default" variant="base" @click="handleClearValidate('login')"
              >清空校验结果</Button
            >
          </Space>
        </FormItem>
      </Form>
      <Form
        v-else
        ref="registerForm"
        :rules="registerFormRules"
        :data="registerFormData"
        :label-width="60"
        scroll-to-first-error="smooth"
        class="login-form-content"
        @submit="register"
      >
        <FormItem label="账户" name="username">
          <Input v-model="registerFormData.username" clearable placeholder="请输入账户名">
            <template #prefix-icon>
              <DesktopIcon />
            </template>
          </Input>
        </FormItem>
        <FormItem label="密码" name="password">
          <Input
            v-model="registerFormData.password"
            type="password"
            clearable
            placeholder="请输入密码"
          >
            <template #prefix-icon>
              <LockOnIcon />
            </template>
          </Input>
        </FormItem>
        <FormItem label="昵称" name="nickname">
          <Input v-model="registerFormData.nickname" type="text" clearable placeholder="请输入昵称">
            <template #prefix-icon>
              <TipsIcon />
            </template>
          </Input>
        </FormItem>
        <FormItem label="个签" name="slogan">
          <Input
            v-model="registerFormData.slogan"
            type="text"
            clearable
            placeholder="请输入个性签名"
          >
            <template #prefix-icon>
              <DiscountIcon />
            </template>
          </Input>
        </FormItem>
        <FormItem label="性别" name="gender">
          <RadioGroup v-model="registerFormData.gender">
            <Radio :value="0">男</Radio>
            <Radio :value="1">女</Radio>
            <Radio :value="2">未知</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="头像" name="avatar">
          <div class="avatar-container">
            <RadioGroup v-model="avatarType" variant="default-filled">
              <RadioButton value="upload">上传图片</RadioButton>
              <RadioButton value="remote">图片链接</RadioButton>
            </RadioGroup>
            <div class="avatar-operation">
              <Upload
                v-show="avatarType === 'upload'"
                theme="image"
                accept="image/*"
                draggable
                :request-method="requestMethod"
              ></Upload>
              <Input
                v-show="avatarType === 'remote'"
                v-model="registerFormData.avatar"
                type="text"
                placeholder="请输入图片链接"
              ></Input>
            </div>
          </div>
        </FormItem>
        <FormItem style="padding-top: 8px">
          <Space size="small">
            <Button theme="primary" type="submit" block>立即注册</Button>
            <Button theme="default" variant="base" type="reset">重置</Button>
            <Button theme="default" variant="base" @click="handleClearValidate('register')"
              >清空校验结果</Button
            >
          </Space>
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  MessagePlugin,
  SubmitContext,
  Form,
  FormItem,
  Input,
  Space,
  Button,
  RadioGroup,
  RadioButton,
  Radio,
  Upload,
  Data,
  FormProps,
  UploadFile,
  RequestMethodResponse,
} from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon, DiscountIcon, TipsIcon } from 'tdesign-icons-vue-next';
import { userServices, fileServices } from '@/service/index';
import { UserRegisterDto } from '@/service/dto/user.dto';
import { useUserInfoStore, useTokenStore } from '@/store';

const userInfoStore = useUserInfoStore();
const router = useRouter();
const avatarType = ref<'remote' | 'upload'>('upload');
const loginForm = ref();
const registerForm = ref();
const isLogin = ref(true);
const { setToken } = useTokenStore();
const onChangeStatus = (evt?: MouseEvent): MouseEvent | undefined => {
  isLogin.value = !isLogin.value;
  registerForm.value?.reset();
  loginForm.value?.reset();
  return evt;
};
// 清空校验结果
const handleClearValidate = (type: 'login' | 'register') => {
  if (type === 'login') {
    loginForm.value?.clearValidate();
  } else {
    registerForm.value?.clearValidate();
  }
};

// 登录表单数据
const loginFormData = reactive({
  username: '',
  password: '',
});

// 登录表单校验规则
const loginFormRules: FormProps['rules'] = {
  username: [
    { required: true, message: '请输入账户名', type: 'error', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', type: 'error', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', type: 'error', trigger: 'blur' }],
};

const login = async (ctx: SubmitContext<Data>) => {
  if (ctx.validateResult !== true) {
    return;
  }
  const res = await userServices.login(loginFormData);
  if (res.data.code === 0) {
    if (res.data.data.token.access_token && res.data.data.token.refresh_token) {
      const { token, ...publicUserInfo } = res.data.data;
      setToken({
        accessToken: token.access_token,
        refreshToken: token.refresh_token,
      });
      userInfoStore.setUserInfo(publicUserInfo);
      await MessagePlugin.success(res.data?.msg);
      loginForm.value?.reset();
      await router.push({ name: 'ChannelList' });
    }
  }
};

// 注册表单数据
const registerFormData = reactive<UserRegisterDto>({
  username: '',
  password: '',
  nickname: '',
  slogan: '',
  gender: 0,
  avatar: '',
});

const registerFormRules: FormProps['rules'] = {
  username: [
    { required: true, message: '请输入账户名', type: 'error', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', type: 'error', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', type: 'error', trigger: 'blur' }],
  nickname: [
    { required: true, message: '请输入昵称', type: 'error', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', type: 'error', trigger: 'blur' },
  ],
  avatar: [
    {
      url: {
        protocols: ['http', 'https'],
        require_protocol: true,
      },
      message: '请输入正确的图片地址',
      trigger: 'blur',
    },
  ],
};

const register = async (ctx: SubmitContext<Data>) => {
  if (ctx.validateResult === false) {
    return;
  }
  const res = await userServices.register(registerFormData);
  if (res.data.code === 0) {
    await MessagePlugin.success(res.data.msg);
    registerForm.value?.reset();
    onChangeStatus();
  } else {
    await MessagePlugin.error(res.data.msg);
  }
};

const requestMethod = async (file: UploadFile): Promise<RequestMethodResponse> => {
  if (!file.raw) {
    return Promise.resolve({
      status: 'fail',
      error: '文件不可为空',
      response: {},
    });
  }
  const formData = new FormData();
  formData.append('file', file.raw);
  const uploadRes = await fileServices.uploadAvatar(formData);
  if (uploadRes.data.code === 0) {
    const url = import.meta.env.VITE_APP_BASE_URL + uploadRes.data.data.url;
    registerFormData.avatar = url;
    return Promise.resolve({
      status: 'success',
      error: '',
      response: {
        url,
      },
    });
  }
  return Promise.resolve({
    status: 'fail',
    error: uploadRes.data.msg,
    response: {},
  });
};
</script>

<style scoped lang="less">
.login-container {
  width: 100vw;
  height: 100vh;
  background-color: rgb(235, 236, 237);
  display: flex;
  justify-content: center;
  align-items: center;

  .login-form {
    width: 46rem;
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    // 靠左
    .login-form-title {
      text-align: center;
      margin: 2rem auto;

      h1 {
        font-size: 3rem;
        font-weight: 500;
        margin: 0;
      }

      span {
        font-size: 1.4rem;
        color: #999;
      }

      .sub-title {
        .action {
          cursor: pointer;

          &:hover {
            color: var(--td-brand-color-hover);
            transition: all 0.3s;
          }
        }
      }
    }

    .login-form-content {
      width: 80%;
      margin-bottom: 2rem;
    }
  }
}

.avatar-container {
  width: 100%;
  .avatar-operation {
    margin-top: 1rem;
  }
}
</style>
