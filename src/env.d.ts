/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string; // 网站标题
  readonly VITE_APP_BASE_URL: string; // API URL
  readonly VITE_APP_API_PREFIX: string; // API 前缀
  readonly VITE_APP_API_VERSION: string; // API 版本
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
