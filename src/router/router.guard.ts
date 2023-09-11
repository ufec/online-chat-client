import { TOKEN_STORAGE_KEY } from '@/common/constants';
import {
  type NavigationFailure,
  type NavigationGuard,
  type NavigationGuardNext,
  type NavigationHookAfter,
  type RouteLocationNormalized,
} from 'vue-router';
import { type OnlineChatToken, type RouterGuards } from '@/common/interface';

const loginGuard: NavigationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const checkLoginToken = () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token === null) {
      return false;
    }
    const { accessToken = '', refreshToken = '' } = JSON.parse(token) as unknown as OnlineChatToken;
    if (accessToken === '' || refreshToken === '') {
      return false;
    }
    return true;
  };
  if (
    to.name?.toString().toLowerCase() !== 'login' &&
    to.meta?.requiresAuth === true &&
    !checkLoginToken()
  ) {
    next({ name: 'Login' });
  } else {
    next();
  }
};

const titleGuard: NavigationHookAfter = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  failure?: NavigationFailure | void
) => {
  if (to.path === '/login') {
    document.title =
      (to.meta?.title as string) !== '' ? (to.meta?.title as string) : (to.name as string);
  } else {
    document.title = `${import.meta.env.VITE_APP_TITLE} | ${
      (to.meta?.title as string) !== '' ? (to.meta?.title as string) : (to.name as string)
    }`;
  }
};

export const routerGuards: RouterGuards = {
  beforeEach: [loginGuard], // 全局前置守卫
  beforeResolve: [], // 全局解析守卫
  afterEach: [titleGuard], // 全局后置钩子
};
