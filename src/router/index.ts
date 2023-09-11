/* eslint-disable @typescript-eslint/promise-function-async */
import {
  createRouter,
  type RouteRecord,
  type RouteRecordRaw,
  createWebHashHistory,
} from 'vue-router';
import { loadAllRouterGuards } from '../utils/router';
import { routerGuards } from './router.guard';

const asyncRoutes: RouteRecord[] = [];

const defaultRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: '登录',
    },
    component: async () => await import('@/pages/login/LoginPage.vue'),
  },
  {
    path: '',
    name: 'Home',
    meta: { requiresAuth: true },
    component: () => import('@/layouts/IndexLayout.vue'),
    children: [
      {
        path: 'contracts',
        name: 'Contracts',
        meta: { requiresAuth: true, title: '联系人' },
        component: () => import('@/pages/home/contracts/ContractsPage.vue'),
      },
      {
        path: 'chat',
        name: 'Chat',
        meta: { requiresAuth: true, title: '聊天' },
        component: () => import('@/pages/home/chat/ChatPage.vue'),
        children: [
          {
            path: 'channel/:channelId/:messageId?',
            name: 'Channel',
            meta: { requiresAuth: true, title: '频道详情' },
            component: () => import('@/pages/home/chat/channel/ChatPanel.vue'),
          },
          {
            path: '',
            name: 'ChannelList',
            meta: { requiresAuth: true, title: '频道列表' },
            component: () => import('@/components/EmptyData.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/WebRTC',
    name: 'WebRTC',
    component: () => import('@/pages/WebRTC/WebRTCPage.vue'),
  },
  {
    path: '/:w+',
    name: '404Page',
    redirect: '/404',
  },
];

const routes = defaultRoutes.concat(asyncRoutes);

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return {
      top: 0,
      behavior: 'smooth',
      el: '#app',
    };
  },
});

loadAllRouterGuards(router, routerGuards);

export default router;
