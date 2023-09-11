import type {
  ApiGroup,
  ApiPath,
  ApiMap,
  UserApi,
  FriendApi,
  FileApi,
  MessageApi,
  ChannelApi,
  AttachmentApi,
} from './types';
export const apiPrefix = import.meta.env.VITE_APP_API_PREFIX ?? '/api';

export const defaultApiVersion = import.meta.env.VITE_APP_API_VERSION ?? 'v1';

export const defaultApiPrefix = `${apiPrefix}/${defaultApiVersion}`;

function assertApiPath(it: unknown): it is ApiPath {
  // 如果是 ApiPath 类型，那么它有且仅有 url 和 version 两个属性
  return (
    typeof it === 'object' &&
    it !== null &&
    'url' in it &&
    'version' in it &&
    Object.keys(it).toString() === 'url,version'
  );
}

function assertHasSubModule(it: unknown): it is { sub_module: string } {
  return typeof it === 'object' && it != null && 'sub_module' in it;
}

function buildApi<T, K>(apiGroup: K, moduleName: string): T {
  const result: Record<string, T | string> = {};
  for (const key in apiGroup) {
    const value = apiGroup[key];
    if (typeof value === 'string') {
      result[key] = `${defaultApiPrefix}/${moduleName}${value}`;
    } else {
      if (assertApiPath(value)) {
        result[key] = `${apiPrefix}/${value.version}/${moduleName}${value.url}`;
      } else if (assertHasSubModule(value)) {
        result[key] = buildApi<T, K>(value as K, `${moduleName}/${value.sub_module}`);
      }
    }
  }
  if ('sub_module' in result) {
    delete result.sub_module;
  }
  return result as T;
}

// 用户模块
const userApiGroup: ApiGroup<UserApi> = {
  loginApi: '/login',
  logoutApi: '/logout',
  registerApi: '/register',
  refreshTokenApi: '/refreshToken',
  searchApi: '/search',
  userInfoApi: {
    url: '/userInfo',
    version: 'v1',
  },
  account: {
    sub_module: 'account',
    updateApi: {
      url: '/update',
      version: 'v2',
    },
    deleteApi: '/delete',
  },
};

// 从 对应模块构建 业务接口
export const user = buildApi<ApiMap<UserApi>, typeof userApiGroup>(userApiGroup, 'user');

// 好友模块
const friendApiGroup: ApiGroup<FriendApi> = {
  sendApi: '/send',
  acceptApi: '/accept',
  rejectApi: '/reject',
  getFriendListApi: '/getFriendList',
  deleteFriendApi: '/deleteFriend',
};

export const friend = buildApi<ApiMap<FriendApi>, typeof friendApiGroup>(friendApiGroup, 'friend');

const fileApiGroup: ApiGroup<FileApi> = {
  uploadAvatarApi: '/uploadAvatar',
};

export const file = buildApi<ApiMap<FileApi>, typeof fileApiGroup>(fileApiGroup, 'file');

// 消息模块
const messageApiGroup: ApiGroup<MessageApi> = {
  getMsgListApi: '/getMsgList',
  queryChannelMessageApi: '/:channelId/messages',
  queryMessagesByChannelIdsApi: '/queryMessagesByChannelIds',
  createAttachmentMessageApi: '/:channelId/createAttachmentMessage',
};

export const message = buildApi<ApiMap<MessageApi>, typeof messageApiGroup>(
  messageApiGroup,
  'message'
);

// 频道模块
const channelApiGroup: ApiGroup<ChannelApi> = {
  getMyChannelsApi: '/getMyChannels',
  queryChannelMemberInfoApi: '/queryChannelMemberInfo',
  createGroupApi: '/createGroup',
};

export const channel = buildApi<ApiMap<ChannelApi>, typeof channelApiGroup>(
  channelApiGroup,
  'channels'
);

const attachmentApiGroup: ApiGroup<AttachmentApi> = {
  uploadAttachmentApi: '/uploadAttachment',
};

export const attachment = buildApi<ApiMap<AttachmentApi>, typeof attachmentApiGroup>(
  attachmentApiGroup,
  'attachment'
);
