<template>
  <div class="chat-panel" @ondragover="handleDragOver">
    <div class="chat-panel__header">
      <span>{{ channel?.aliasChannelName ?? channel?.channel?.channelName ?? '' }}</span>
    </div>
    <div ref="msgListBodyRef" class="chat-panel__body">
      <ul class="msg-list">
        <li
          v-for="message in msgList"
          :key="message.id"
          class="msg-list__item"
          :class="message.authorId === userInfoStore?.userInfo?.id ? 'mine' : ''"
        >
          <div class="msg-item__header">
            <div class="user-avatar">
              <img class="msg-avatar" :src="message.author?.avatar" crossorigin="anonymous" />
            </div>
          </div>
          <div
            :class="{
              'pt-1':
                channel.channel.channelType === ChannelType.FRIEND &&
                message.authorId !== userInfoStore.userInfo?.id,
              'msg-item__content': true,
            }"
          >
            <span
              v-if="
                channel.channel.channelType === ChannelType.GROUP &&
                message.authorId != userInfoStore.userInfo?.id
              "
              class="username"
              >{{ message.author?.nickname }}</span
            >
            <div class="msg-text">
              <span v-if="message.msgType === MsgTypeEnum.TEXT">{{ message.content }}</span>
              <div v-if="message.msgType === MsgTypeEnum.IMAGE">
                <img
                  v-for="attachment in message.attachments"
                  :key="attachment.id"
                  :src="attachment?.fileUrl || `${baseUrl}${attachment.filePath}`"
                  style="
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    cursor: pointer;
                    resize: both;
                  "
                />
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="chat-panel__input">
      <div class="chat-panel__input-operations">
        <div class="chat-panel__input-operations-item">
          <div class="tool__inner">
            <input id="sendFile" type="file" style="display: none" @change="handleSelectFile" />
            <label for="sendFile">
              <svg
                width="21"
                height="21"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 8C5 6.89543 5.89543 6 7 6H19L24 12H41C42.1046 12 43 12.8954 43 14V40C43 41.1046 42.1046 42 41 42H7C5.89543 42 5 41.1046 5 40V8Z"
                  fill="none"
                  stroke="#5C5C66"
                  stroke-width="3"
                  stroke-linejoin="round"
                />
                <path
                  d="M30 25.9867L24 20L18 26"
                  stroke="#5C5C66"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M24 20V34"
                  stroke="#5C5C66"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </label>
          </div>
        </div>
        <div
          v-if="channel.channel.channelType === ChannelType.FRIEND"
          class="chat-panel__input-operations-item"
        >
          <div class="tool__inner" @click="handleCall('audio')">
            <svg
              width="23"
              height="23"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.9961 7.68583C17.7227 7.68583 18.3921 8.07985 18.7448 8.71509L21.1912 13.1219C21.5115 13.6989 21.5266 14.3968 21.2314 14.9871L18.8746 19.7008C18.8746 19.7008 19.5576 23.2122 22.416 26.0706C25.2744 28.929 28.7741 29.6002 28.7741 29.6002L33.487 27.2438C34.0777 26.9484 34.7761 26.9637 35.3533 27.2846L39.7726 29.7416C40.4072 30.0945 40.8008 30.7635 40.8008 31.4896L40.8008 36.5631C40.8008 39.1468 38.4009 41.0129 35.9528 40.1868C30.9249 38.4903 23.1202 35.2601 18.1734 30.3132C13.2265 25.3664 9.99631 17.5617 8.29977 12.5338C7.47375 10.0857 9.33984 7.68583 11.9235 7.68583L16.9961 7.68583Z"
                fill="none"
                stroke="#5C5C66"
                stroke-width="3"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
        <div
          v-if="channel.channel.channelType === ChannelType.FRIEND"
          class="chat-panel__input-operations-item"
        >
          <div class="tool__inner" @click="handleCall('video')">
            <svg
              width="23"
              height="23"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.3756 9.7941C15.1022 9.7941 15.7716 10.1881 16.1242 10.8234L18.5706 15.2302C18.891 15.8072 18.906 16.5051 18.6109 17.0954L16.254 21.809C16.254 21.809 16.937 25.3204 19.7955 28.1789C22.6539 31.0373 26.1535 31.7085 26.1535 31.7085L30.8665 29.3521C31.4572 29.0567 32.1555 29.072 32.7327 29.3929L37.1521 31.8499C37.7867 32.2027 38.1802 32.8718 38.1802 33.5979L38.1802 38.6714C38.1802 41.2551 35.7803 43.1211 33.3323 42.2951C28.3043 40.5986 20.4997 37.3684 15.5528 32.4215C10.606 27.4747 7.37576 19.67 5.67922 14.6421C4.8532 12.194 6.71929 9.7941 9.30293 9.7941L14.3756 9.7941Z"
                fill="none"
                stroke="#5C5C66"
                stroke-width="3"
                stroke-linejoin="round"
              />
              <path
                d="M39 15H27V5H39V8L44 6V14L39 12V15Z"
                fill="none"
                stroke="#5C5C66"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <textarea v-model="msg" class="chat-panel__input-container"></textarea>
      <div class="chat-panel__input-send">
        <Button :disabled="msg === ''" :loading="sendMessageLoading" @click="handleSendMsg"
          >发送</Button
        >
      </div>
    </div>
    <div class="call-wrapper" draggable="true" @ondragend="handleDragEnd">
      <div class="call-inner">
        <video
          id="localStream"
          ref="localVideoRef"
          controls
          autoplay
          width="400"
          height="200"
        ></video>
        <video
          id="remoteStream"
          ref="remoteVideoRef"
          controls
          autoplay
          width="400"
          height="200"
        ></video>
      </div>
    </div>
  </div>
  <Dialog
    theme="info"
    header="提示"
    body="收到语音/视频通话请求"
    confirm-btn="接听"
    cancel-btn="挂断"
    :on-cancel="handleRejectCall"
    :on-confirm="handleAcceptCall"
    :on-close="handleRejectCall"
    :visible="callState === 'ringing'"
  />
</template>

<script lang="ts" setup>
import { ref, computed, watchEffect, onUnmounted, onMounted } from 'vue';
import { ChannelType, MsgFromTypeEnum, MsgStatusEnum, MsgTypeEnum } from '@/common/interface';
import { Button, Dialog } from 'tdesign-vue-next';
import { useChannelMapStore, useUserInfoStore, useMessageListStore } from '@/store';
import { useRouter } from 'vue-router';
import {
  createAttachmentMessage,
  queryChannelMessage,
  sendMessage,
} from '@/service/message.service';
import { CreateMessageDto } from '@/service/dto/message.dto';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useWebSocket } from '@/hooks/useWebSocket';

interface SdpPayload {
  sdp: RTCSessionDescriptionInit;
  channelId: string;
  channelType: ChannelType;
  callType: 'video' | 'audio';
  userId: number;
}

interface IceCandidatePayload {
  candidate: RTCIceCandidate;
  channelId: number;
  channelType: ChannelType;
  userId: number;
}

/**
 * 视频通话流程
 * 1. 发起方点击发起通话按钮，获取本地视频流，创建offer
 * 2. 先将offer设置为本地描述，然后推送到频道内的其他人
 * 3. 频道内其他人收到offer后，设置为远端描述，弹框提示，用户点击接听后，获取本地视频流，创建answer
 * 4. 将
 */

const baseUrl = import.meta.env.VITE_APP_BASE_URL;

const localVideoRef = ref<HTMLVideoElement | null>(null);
const remoteVideoRef = ref<HTMLVideoElement | null>(null);

const onicecandidate = (evt: RTCPeerConnectionIceEvent) => {
  if (evt.candidate === null || userInfoStore.userInfo === null || evt.candidate === null) return;
  console.log('onicecandidate: ');
  window.$socket?.emit('ice_candidate', {
    candidate: evt.candidate,
    channelId: channel.value?.channel.id,
    channelType: channel.value?.channel.channelType,
    userId: userInfoStore.userInfo?.id,
  });
};

const ontrack = (evt: RTCTrackEvent) => {
  console.log('evt: ', evt);
  if (evt.streams.length > 0) {
    remoteVideoRef.value!.srcObject = evt.streams[0];
  }
};
useWebSocket();
const { offer, answer, rtcPeerConnection, callState } = useWebRTC({
  localVideoRef,
  onicecandidate,
  ontrack,
});

// pina
const messageListStore = useMessageListStore();
const channelMapStore = useChannelMapStore();
const userInfoStore = useUserInfoStore();

const router = useRouter();
const msg = ref('');
const msgListBodyRef = ref<HTMLDivElement>();
const sdpPayload = ref<SdpPayload | null>(null);

const sendMessageLoading = ref(false);

// 路由参数变化时，channelId会重新计算
const channelId = computed(() => {
  if (typeof router.currentRoute.value.params.channelId === 'string') {
    return router.currentRoute.value.params.channelId;
  }
  return '';
});
// channelId变化时，channel会重新计算
const channel = computed(() => channelMapStore.getChannel(channelId.value));
const msgList = computed(() => messageListStore.messageList[channelId.value]);

const loadMoreMsg = (channelId: string, page = 1, pageSize = 10) => {
  // 加载更多历史聊天记录
  if (userInfoStore.userInfo === null) {
    return;
  }
  queryChannelMessage(page, pageSize, channelId)
    .then(async (res) => {
      if (res.data.code === 0) {
        // 为什么要reverse？因为后端返回的是倒序的
        res.data.data.list.reverse().forEach((message) => {
          messageListStore.addMessage(channelId, message);
        });
      } else {
        await window.$messagePlugin?.error(res.data.msg);
      }
    })
    .catch((err) => {
      console.log('err', err);
    });
};

const stopWatchChannelId = watchEffect(
  () => {
    if (router.currentRoute.value.name !== 'Channel') {
      return;
    }
    if (!channel.value) {
      router
        .push({ name: 'ChannelList' })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    } else {
      // 滚动到底部
      if (msgListBodyRef.value) {
        msgListBodyRef.value.scrollTo({
          top: msgListBodyRef.value.scrollHeight,
          behavior: 'smooth',
        });
      }
      if (msgList.value === undefined) {
        loadMoreMsg(channel.value.channel.id);
      }
    }
  },
  { flush: 'post' }
);

const handleSendMsg = () => {
  if (msg.value === '' || window.$socket === null || channel.value === null) {
    return;
  }

  const msgBody: CreateMessageDto = {
    channelId: channel.value.channel.id,
    content: msg.value,
    msgType: MsgTypeEnum.TEXT,
    msgStatus: MsgStatusEnum.SEND,
    msgFromType: MsgFromTypeEnum.USER,
  };
  sendMessageLoading.value = true;
  sendMessage(msgBody)
    .then((res) => {
      if (res.data.code === 0) {
        if (res.data.data?.author && userInfoStore.userInfo) {
          res.data.data.author = userInfoStore.userInfo;
        }
        messageListStore.addMessage(channel.value.channel.id, res.data.data);
      }
    })
    .catch((err) => {
      console.log('err', err);
    })
    .finally(() => {
      msg.value = '';
      sendMessageLoading.value = false;
    });
};

const handleSelectFile = async (e: Event) => {
  const files = (e.target as HTMLInputElement)?.files;
  if (files === null || files.length === 0) {
    return;
  }
  const file = files[0];
  if (file.size > 1024 * 1024 * 10) {
    await window.$messagePlugin?.error('文件大小不能超过10M');
    return;
  }
  const formData = new FormData();
  formData.append('file', file);
  sendMessageLoading.value = true;
  createAttachmentMessage(formData, channel.value?.channel.id)
    .then((res) => {
      if (res.data.code === 0) {
        messageListStore.addMessage(channel.value?.channel.id, res.data.data);
      }
    })
    .catch((err) => {
      console.log('err: ', err);
    })
    .finally(() => {
      sendMessageLoading.value = false;
    });
};

// 拨号
const handleCall = (callType: 'video' | 'audio') => {
  offer(callType)
    .then((sdp) => {
      if (!sdp || window.$socket === null || userInfoStore.userInfo === null) {
        return;
      }
      // 发送offer
      window.$socket.emit('create_offer', {
        sdp,
        channelId: channel.value?.channel.id,
        channelType: channel.value?.channel.channelType,
        callType,
        userId: userInfoStore.userInfo?.id, // 发送者的用户id
      });
    })
    .catch((err) => {
      console.log('err: ', err);
      // const privateTip = callType === 'video' ? '打开摄像头和麦克风' : '打开麦克风';
      // const url = `chrome://settings/content/siteDetails?site=${window.location.origin}`;
      // const msg = `请前往设置页面${url}，${privateTip},否则无法正常使用${
      //   callType === 'video' ? '视频' : '语音'
      // }通话功能`;
      // await window.$messagePlugin?.error(msg, 2000);
    });
};

// 接听
const handleAcceptCall = () => {
  if (callState.value !== 'ringing' || sdpPayload.value === null || window.$socket === null) {
    return;
  }
  console.log('callType: ', sdpPayload.value.callType);
  answer(sdpPayload.value.callType)
    .then((sdp) => {
      if (!sdp || window.$socket === null) {
        return;
      }
      // 将接收者的sdp发送给发起者
      window.$socket.emit('create_answer', {
        sdp,
        channelId: channel.value?.channel.id,
        channelType: channel.value?.channel.channelType,
        userId: userInfoStore.userInfo?.id, // 接收者的用户id
      });
      callState.value = 'connected';
    })
    .catch((err) => {
      console.log('err: ', err);
    });
};

// 拒绝
const handleRejectCall = () => {
  callState.value = 'idle';
};

const handleDragOver = (e: DragEvent) => {
  console.log('e: ', e);
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
};

const handleDragEnd = (e: DragEvent) => {
  console.log('e: ', e);
  e.preventDefault();
  const target = e.target as HTMLElement;
  target.style.top = `${e.clientY}px`;
  target.style.left = `${e.clientX - 369}px`;
};

onMounted(() => {
  if (window.$socket !== null) {
    // 收到呼叫请求
    window.$socket?.on('offer_create', async (createOffer: SdpPayload) => {
      console.log('createOffer: ', createOffer);
      sdpPayload.value = createOffer; // 保存发起者的sdp
      // 接受者设置远端sdp(即发起者的sdp)
      await rtcPeerConnection.value?.setRemoteDescription(
        new RTCSessionDescription(createOffer.sdp)
      );
      callState.value = 'ringing'; // 被呼叫
      console.log('setRemoteDescription success');
    });

    // 通话被接听
    window.$socket?.on('answer_create', async (createAnswer: SdpPayload) => {
      console.log('createAnswer: ', createAnswer);
      // 发起者设置远端sdp(即接收者的sdp)
      await rtcPeerConnection.value?.setRemoteDescription(
        new RTCSessionDescription(createAnswer.sdp)
      );
      callState.value = 'connected'; // 已连接
      console.log('setRemoteDescription success');
    });

    window.$socket?.on('swap_candidate', async (iceCandidate: IceCandidatePayload) => {
      console.log('iceCandidate: ', iceCandidate);
      await rtcPeerConnection.value?.addIceCandidate(new RTCIceCandidate(iceCandidate.candidate));
    });
  }
});

onUnmounted(() => {
  stopWatchChannelId();
});
</script>

<style scoped lang="less">
.chat-panel {
  height: 100%;
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background-color: rgb(245, 245, 245);
  position: relative;
  .chat-panel__header {
    flex: 0 0 6.1rem;
    line-height: 6.1rem;
    max-height: 6.1rem;
    padding: 0 2.4rem;
    font-size: larger;
    border-bottom: 1px solid #e5e5e5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chat-panel__body {
    padding-bottom: 2.4rem;
    border-bottom: 1px solid #e7e6e6;
    overflow-y: auto;
    flex: 1;
    .msg-list {
      .msg-list__item {
        display: flex;
        padding: 2.4rem 2.4rem 0;
        .msg-item__header {
          padding-top: 1rem;
          .user-avatar {
            width: 3.5rem;
            height: 3.5rem;
            background-color: var(--td-brand-color-focus);
            .msg-avatar {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
        .msg-item__content {
          .username {
            font-size: 0.8rem;
            color: #999;
            margin: 0 1.4rem;
          }
          .msg-text {
            background: #fff;
            display: block;
            max-width: 35rem;
            text-align: left;
            word-break: break-all;
            padding: 0.7rem 1.2rem;
            border-radius: 4px;
            box-sizing: border-box;
            position: relative;
            margin: 0 1.4rem;
            &::before {
              background-color: #fff;
              border-radius: 0 2px 0 0;
              content: ' ';
              display: block;
              height: 1rem;
              margin-right: -0.5rem;
              margin-top: -0.5rem;
              position: absolute;
              top: 1.8rem;
              left: -0.5rem;
              transform: rotate(45deg);
              transform-origin: 50%;
              width: 1rem;
            }
          }
        }
      }
      .mine {
        flex-direction: row-reverse;
        .msg-item__header {
          padding-top: 0;
        }
        .msg-item__content {
          .msg-text {
            background-color: #95ec69;
            &::before {
              left: auto;
              right: 0;
              background-color: #95ec69;
            }
          }
        }
      }
    }
  }
  .chat-panel__input {
    flex: 0 0 19rem;
    max-height: 19rem;
    display: flex;
    flex-direction: column;
    background-color: #f5f5f5;
    &:focus-within {
      background-color: #fff;
    }
    .chat-panel__input-operations {
      display: flex;
      padding: 0.5rem 1.6rem;
      .chat-panel__input-operations-item {
        height: 2.1rem;
        .tool__inner {
          cursor: pointer;
        }
        &:not(:last-child) {
          margin-right: 1.6rem;
        }
      }
    }
    .chat-panel__input-container {
      border: none;
      flex: 1;
      padding: 0 1.6rem;
      resize: none;
      background-color: inherit;
    }
    .chat-panel__input-send {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      line-height: 3.2rem;
      padding: 0.8rem 1.6rem;
    }
  }
}
.pt-1 {
  padding-top: 1rem;
}

.call-wrapper {
  position: absolute;
  max-width: 50rem;
  overflow-y: scroll;
  z-index: 99999999;
  background-color: antiquewhite;
  top: 10rem;
  left: 10rem;
  .call-inner {
    display: flex;
    padding: 1rem;
    video {
      margin-right: 1rem;
    }
  }
}
</style>
