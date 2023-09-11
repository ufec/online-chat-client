import { TOKEN_STORAGE_KEY } from '@/common/constants';
import { MsgTypeEnum, type OnlineChatToken } from '@/common/interface';

/**
 * 移除缓存的token
 */
export function removeAuthorization() {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * 获取缓存的token
 * @returns
 */
export function getAuthorization() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token === null) {
    return null;
  }
  return JSON.parse(token) as unknown as OnlineChatToken;
}

/**
 * 正则校验url
 * @param url 待校验的url
 * @returns 校验结果
 */
export function regExpUrl(url: string) {
  return /^http(s)?:\/\/((([\w-]+\.)+\w)|localhost)(:\d{0,5})?([/\w-._%]+)/.test(encodeURI(url));
}

/**
 * 根据消息类型展示不同的内容
 * @param type 消息类型
 * @param content 消息内容
 * @returns 展示的内容
 */
export function showContentByType(type: MsgTypeEnum, content: string) {
  switch (type) {
    case MsgTypeEnum.TEXT:
      return content;
    case MsgTypeEnum.IMAGE:
      return '[图片]';
    case MsgTypeEnum.VOICE:
      return '[语音]';
    case MsgTypeEnum.FILE:
      return '[文件]';
    case MsgTypeEnum.VIDEO:
      return '[视频]';
    case MsgTypeEnum.LOCATION:
      return '[位置]';
    case MsgTypeEnum.CARD:
      return '[名片]';
    case MsgTypeEnum.SHARE:
      return '[分享]';
    case MsgTypeEnum.SYSTEM:
      return '[系统消息]';
    case MsgTypeEnum.RECALL:
      return '[撤回消息]';
    case MsgTypeEnum.NOTICE:
      return '[通知消息]';
    default:
      return content;
  }
}

export function buildMsgId() {
  return window.crypto.randomUUID();
}
