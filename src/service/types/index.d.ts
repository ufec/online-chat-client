export interface ApiPath {
  url: string;
  version: string;
}

export interface UserApi {
  loginApi: string;
  logoutApi: string;
  registerApi: string;
  refreshTokenApi: string;
  searchApi: string;
  userInfoApi: ApiPath;
  account: {
    sub_module: string;
    updateApi: ApiPath;
    deleteApi: string;
  };
}

export interface FriendApi {
  sendApi: string;
  acceptApi: string;
  rejectApi: string;
  getFriendListApi: string;
  deleteFriendApi: string;
}

export interface FileApi {
  uploadAvatarApi: string;
}

export interface MessageApi {
  getMsgListApi: string;
  queryChannelMessageApi: string;
  queryMessagesByChannelIdsApi: string;
  createAttachmentMessageApi: string;
}

export interface ChannelApi {
  getMyChannelsApi: string;
  queryChannelMemberInfoApi: string;
  createGroupApi: string;
}

export interface AttachmentApi {
  uploadAttachmentApi: string;
}

export type ApiGroup<T> = {
  [P in keyof T]: T[P] extends ApiPath ? ApiPath : T[P] extends string ? string : ApiGroup<T[P]>;
};

export type ApiMap<T> = {
  [P in keyof T]: T[P] extends ApiPath
    ? string
    : T[P] extends string
    ? string
    : Omit<ApiMap<T[P]>, 'sub_module'>;
};
