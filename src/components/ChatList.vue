<template>
  <div class="chat-list-container">
    <div class="chat-list-wrapper">
      <div v-for="chatItem in props.chatList" :key="chatItem.userId" class="chat-friend-item">
        <UserInfo
          :user-info="{
            id: chatItem.userId,
            avatar: chatItem.avatar,
            nickname: chatItem.nickName,
          }"
          :message="chatItem.message"
        >
          <div class="chat-message-info">
            <span class="chat-message-read">{{
              chatItem.status == MsgStatusEnum.READ ? '已读' : '未读'
            }}</span>
            <span class="chat-message-time">{{ chatItem.createdAt }}</span>
          </div>
        </UserInfo>
      </div>
    </div>
    <div class="chat-list-bottom-wrapper">
      <InputGroup style="width: 100%">
        <Input clearable placeholder="请输入用户名" />
        <Button>词云</Button>
        <hr />
        <Button>添加</Button>
      </InputGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MsgStatusEnum } from '@/common/interface';
import { Button, Input, InputGroup } from 'tdesign-vue-next';
import UserInfo from './UserInfo.vue';
interface ChatItem {
  userId: number;
  nickName: string;
  avatar: string;
  message: string;
  createdAt: Date;
  status: MsgStatusEnum;
}

interface Props {
  chatList: ChatItem[];
}

const props = defineProps<Props>();
</script>

<style lang="less" scoped>
.chat-list-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e2e2;
  &::-webkit-scrollbar {
    display: none;
  }

  .chat-list-wrapper {
    overflow-y: auto;
    .chat-friend-item {
      margin-bottom: 1rem;
      padding: 0.5rem;
      cursor: pointer;
      &:hover {
        background-color: var(--td-brand-color-hover);
        color: #fff;
        transition: all 0.3s;
      }

      .chat-message-info {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-left: auto;
        color: inherit;
      }
    }
  }
}
</style>
