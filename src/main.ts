import { createApp } from 'vue';
import router from './router';
import store from './store';
import App from './App.vue';
import 'tdesign-vue-next/es/style/index.css';
import '@/styles/index.less';
import { MessagePlugin } from 'tdesign-vue-next';
// import { Emitter } from './utils/emitter/Emitter';
const app = createApp(App);
app.provide('$messagePlugin', MessagePlugin); // 全局引入 通过 provider => inject 的方式引入
app.use(router).use(store).mount('#app');

if (window instanceof Window && window.$messagePlugin === undefined) {
  window.$messagePlugin = MessagePlugin;
}

// window.$evt = new Emitter();
