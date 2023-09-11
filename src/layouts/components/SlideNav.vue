<template>
  <div class="slide-nav-wrapper">
    <Popup placement="right">
      <div class="nav-logo">
        <Avatar :src="userInfo?.avatar" :alt="userInfo?.username" crossorigin="anonymous" />
      </div>
      <template #content>
        <div class="user-info-popup-container">
          <div class="user-info-popup-item">个人信息</div>
          <div class="user-info-popup-item">修改信息</div>
          <div class="user-info-popup-item" @click="() => (logoutDialogVisible = true)">
            退出登录
          </div>
        </div>
      </template>
    </Popup>
    <div class="nav-list-wrapper">
      <RouterLink to="/chat" class="nav-item" tool-tip-content="聊天">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9337">
          <path
            d="M32 480C32 267.936 246.912 96 512 96c265.088 0 480 171.936 480 384s-214.912 384-480 384c-42.816 0-84.352-4.48-123.84-12.896l-204.16 134.592 11.52-216.96C95.328 698.336 32 595.104 32 480z m638.4-99.872a96.128 96.128 0 0 1 0 135.776L512 674.304l-158.4-158.4a96.064 96.064 0 0 1 0-135.776 96.128 96.128 0 0 1 135.776 0l22.624 22.624 22.624-22.624a96.064 96.064 0 0 1 135.776 0z"
            p-id="9338"
          ></path>
        </svg>
      </RouterLink>
      <Badge :count="friendRequestsCount">
        <RouterLink to="/contracts" class="nav-item" tool-tip-content="通讯录">
          <svg
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="11571"
          >
            <path
              d="M2.56 271.380021m28.157695 0l135.668892 0q28.157695 0 28.157694 28.157694l0-0.639947q0 28.157695-28.157694 28.157694l-135.668892 0q-28.157695 0-28.157695-28.157694l0 0.639947q0-28.157695 28.157695-28.157694Z"
              p-id="11572"
            ></path>
            <path
              d="M2.56 494.081787m28.157695 0l135.668892 0q28.157695 0 28.157694 28.157695l0-0.639948q0 28.157695-28.157694 28.157695l-135.668892 0q-28.157695 0-28.157695-28.157695l0 0.639948q0-28.157695 28.157695-28.157695Z"
              p-id="11573"
            ></path>
            <path
              d="M2.56 717.423501m28.157695 0l135.668892 0q28.157695 0 28.157694 28.157695l0 0q0 28.157695-28.157694 28.157694l-135.668892 0q-28.157695 0-28.157695-28.157694l0 0q0-28.157695 28.157695-28.157695Z"
              p-id="11574"
            ></path>
            <path
              d="M935.603607 0.042237H184.30512A83.193189 83.193189 0 0 0 98.552141 80.035687v168.30622h63.99476a52.475704 52.475704 0 0 1 54.395546 50.555861 52.475704 52.475704 0 0 1-54.395546 51.195808h-63.99476v120.950097h63.99476a51.195808 51.195808 0 1 1 0 102.391617h-63.99476v120.950097h63.99476a51.195808 51.195808 0 1 1 0 102.391617h-63.99476v147.187949A83.193189 83.193189 0 0 0 184.30512 1023.958403h751.298487a83.193189 83.193189 0 0 0 85.752979-79.99345V80.035687A83.193189 83.193189 0 0 0 935.603607 0.042237z m-111.990831 790.335291h-447.963323a37.756909 37.756909 0 0 1-31.99738-45.43628A298.215584 298.215584 0 0 1 546.515464 481.922783a127.989521 127.989521 0 1 1 106.231302 0 298.215584 298.215584 0 0 1 202.863391 263.018465 37.756909 37.756909 0 0 1-31.997381 45.43628z"
              p-id="11575"
            ></path>
          </svg>
        </RouterLink>
      </Badge>
    </div>
    <div class="nav-operation"></div>
  </div>
  <Dialog
    v-model:visible="logoutDialogVisible"
    header="退出登录"
    body="确定退出登录吗？"
    :on-cancel="() => (logoutDialogVisible = false)"
    :on-confirm="handleConfirmLogout"
  />
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { Badge, Popup, Dialog } from 'tdesign-vue-next';
import Avatar from '@/components/Avatar.vue';
import { useRouter } from 'vue-router';
import { useFriendRequestsMsgStore, useUserInfoStore } from '@/store';
import { FriendRequestsStatusEnum } from '@/common/constants';

const router = useRouter();
const { friendRequestsMsg } = useFriendRequestsMsgStore();
const { userInfo } = useUserInfoStore();
const logoutDialogVisible = ref(false);

const handleConfirmLogout = () => {
  if (window.$socket) {
    window.$socket.disconnect();
  }
  window.localStorage.clear();
  logoutDialogVisible.value = false;
  window.$messagePlugin
    .success('退出登录成功')
    .then(async () => {
      await router.push({ name: 'Login' });
    })
    .catch(() => null);
};

const friendRequestsCount = computed(() => {
  return friendRequestsMsg.filter((item) => item.status === FriendRequestsStatusEnum.PENDING)
    .length;
});
</script>

<style scoped lang="less">
.slide-nav-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  .nav-logo {
    cursor: pointer;
    width: 3.5rem;
    height: 3.5rem;
  }

  .nav-list-wrapper {
    margin-top: 2rem;
    .nav-item {
      width: 4rem;
      height: 4rem;
      padding: 0.8rem;
      margin-bottom: 1rem;
      box-sizing: border-box;
      border-radius: 0.7rem;
      position: relative;
      cursor: pointer;
      display: block;
      &:hover {
        background-color: rgba(255, 255, 255, 0.342);
      }
      &:hover:after {
        content: attr(tool-tip-content);
        display: block;
        width: 6rem;
        height: 3.5rem;
        background-color: rgb(0, 0, 0);
        color: #fff;
        text-align: center;
        line-height: 3.5rem;
        position: absolute;
        top: 0;
        left: 4.4rem;
        z-index: 1;
      }
      & > svg {
        fill: rgb(140 136 136);
      }
    }

    .router-link-active {
      & > svg {
        fill: var(--td-brand-color);
      }
    }
  }
}

.user-info-popup-container {
  width: 10rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  .user-info-popup-item {
    text-align: center;
    margin-bottom: 1rem;
    cursor: pointer;

    &:hover {
      color: var(--td-brand-color);
    }
  }
}

:deep(.t-badge--circle, .t-badge--round) {
  z-index: 1;
}
</style>
