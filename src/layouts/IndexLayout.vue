<template>
  <Layout>
    <Aside class="nav-bar"> <SlideNav /> </Aside>
    <RouterView />
  </Layout>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { WebNotify } from '@/utils/notify';
import { Aside, Layout } from 'tdesign-vue-next';
import SlideNav from './components/SlideNav.vue';
import type {
  FriendRequestsRecordListDto,
  FriendRequestsRecordDto,
} from '@/service/dto/friend.dto';
import {
  useFriendRequestsMsgStore,
  useUserInfoStore,
  useTokenStore,
  useChannelMapStore,
  useMessageListStore,
} from '@/store';
// import { initBackend } from 'absurd-sql/dist/indexeddb-main-thread';
import { ChannelMemberDto, ChannelType, PongData } from '@/common/interface';
import { MessageDto } from '@/service/dto/message.dto';
import { useWebSocket } from '@/hooks/useWebSocket';
// const { addSession, updateSession, hasSession } = useSessionListStore();

const router = useRouter();
const friendRequestList = reactive<FriendRequestsRecordListDto>([]);
const webNotify = new WebNotify();

// pina store
const friendRequestsMsgStore = useFriendRequestsMsgStore();
const userInfoStore = useUserInfoStore();
const channelMapStore = useChannelMapStore();
const messageListStore = useMessageListStore();
const tokenStore = useTokenStore();

useWebSocket();

onMounted(() => {
  if (userInfoStore.userInfo === null) {
    router
      .push({ name: 'Login' })
      .then()
      .catch((err) => {
        throw err;
      });
    return;
  }
  // const worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' });
  // initBackend(worker); // 初始化sql.js持久后端
  // // 初始化数据库
  // worker.postMessage({ method: 'initDB', args: userInfo?.id });
  // // 监听worker消息
  // worker.addEventListener('message', (event) => {
  //   console.log('Message from worker', event.data);
  // });
  if (window.$socket) {
    const timerId = setInterval(() => {
      if (window.$socket === null || window.$socket === undefined) {
        clearInterval(timerId);
      } else {
        window.$socket.emit('ping', {
          userId: userInfoStore.userInfo?.id,
          accessToken: tokenStore.accessToken,
        });
      }
    }, 1000 * 60);

    window.$socket.on('connect', () => {
      console.log('开始建立连接');
    });

    window.$socket.on('connection_denied', ({ data }: { data: string }) => {
      // 连接被拒绝
      window.$messagePlugin
        .error(data)
        .then(async () => {
          window.localStorage.clear();
          if (window.$socket) {
            window.$socket.disconnect(); // 连接被拒绝时置空连接，防止一直重试
          }
          await router.push({ name: 'Login' });
        })
        .catch((error: any) => {
          console.error(error);
        });
    });

    window.$socket.on('disconnect', () => {
      window.$socket = null; // 断开连接时置空连接，防止一直重试
    });

    window.$socket.on(
      'pending_friend_request_list',
      async (data: FriendRequestsRecordListDto, id: string) => {
        if (data.length !== 0) {
          await webNotify.notify('待处理的好友请求列表', {
            body: `你还有${data.length}条未处理的好友请求`,
            icon: './vite.svg',
            tag: 'pending_friend_request_list',
            data: id,
          });
          friendRequestList.push(...data);
          friendRequestsMsgStore.pushFriendRequestsMsg(data);
        }
      }
    );

    window.$socket.on('friend_request', async (data: FriendRequestsRecordDto) => {
      await webNotify.notify('你有一条好友请求', {
        body: `用户 ${data.fromUser.nickname} 申请添加你为好友`,
        icon: './vite.svg',
        tag: 'friend_request',
      });
      friendRequestList.push(data);
    });

    window.$socket.on('channel_create', (channelMember: ChannelMemberDto) => {
      channelMapStore.addChannel(channelMember);
    });

    // 新版消息回调
    window.$socket.on('message_create', async (message: MessageDto) => {
      messageListStore.addMessage(message.channelId, message);
      const channelMember = channelMapStore.getChannel(message.channelId);
      const notifyBody =
        channelMember.channel.channelType === ChannelType.GROUP
          ? `${message.author?.nickname} 在群聊 ${channelMember.channel.channelName} 中发了一条消息`
          : `${
              channelMember.aliasChannelName ?? message.author?.nickname ?? message.author?.username
            } 给您发来了一条消息`;
      const avatar =
        channelMember.channel.channelType === ChannelType.GROUP
          ? channelMember.channel.avatar
          : message.author?.avatar;
      await webNotify.notify(message.content, {
        body: notifyBody,
        icon: avatar,
        tag: 'message',
      });
    });

    // 心跳检测
    window.$socket.on('pong', (data: PongData) => {
      if (!data.alive) {
        switch (data.action) {
          case 'refresh_token':
            // TODO: 刷新token
            console.log('need refresh token');
            break;
          case 'logout':
            window.$messagePlugin
              .error('请重新登陆')
              .then(async () => {
                window.localStorage.clear();
                if (window.$socket) {
                  window.$socket.disconnect(); // 连接被拒绝时置空连接，防止一直重试
                }
                await router.push({ name: 'Login' });
              })
              .catch((error: any) => {
                console.error(error);
              });
            break;
          default:
            break;
        }
      }
    });
  }
});

onUnmounted(() => {
  window.$socket = null; // 销毁socket
});
</script>

<style scoped lang="less">
.nav-bar {
  height: 100vh;
  width: 6rem;
  min-width: 6rem;
  background-color: rgba(49, 49, 49, 1);
}
.content {
  height: 100vh;
  width: calc(100vw - 6rem);
}
</style>
