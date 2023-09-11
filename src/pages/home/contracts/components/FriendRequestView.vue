<template>
  <div class="main-content-wrapper friend-requests-wrapper">
    <div class="header">新的朋友</div>
    <div class="content">
      <ul class="friend-requests-list">
        <li
          v-for="friendRequests in friendRequestsMsgStore.friendRequestsMsg"
          :key="friendRequests.id"
          class="friend-requests-item"
        >
          <div class="friend-requests">
            <UserInfo :user-info="friendRequests.fromUser" :message="friendRequests.extra">
              <template #operations>
                <div
                  v-if="friendRequests.status === FriendRequestsStatusEnum.PENDING"
                  class="operations"
                >
                  <Button
                    class="operate"
                    :loading="taskQueue.includes(friendRequests.id)"
                    @click="handleAccessFriendRequest($event, friendRequests.id)"
                    >接受好友请求</Button
                  >
                  <Button
                    class="operate"
                    theme="danger"
                    :loading="taskQueue.includes(friendRequests.id)"
                    @click="handleRejectFriendRequest($event, friendRequests.id)"
                    >拒绝好友请求</Button
                  >
                </div>
                <span
                  v-else-if="friendRequests.status === FriendRequestsStatusEnum.ACCEPTED"
                  class="accept-tips"
                  >已接受好友请求</span
                >
                <span v-else class="accept-tips">已拒绝好友请求</span>
              </template>
            </UserInfo>
          </div>
        </li>
      </ul>
    </div>
    <Dialog
      :visible="visibleDialog"
      :on-close="handleCancelDialog"
      :on-confirm="handleConfirmDialog"
      :theme="actionName === 'reject' ? 'warning' : 'info'"
      :header="actionName === 'reject' ? '警告' : '提示'"
    >
      <template #body>
        <div v-show="actionName === 'access'">
          <p class="dialog-accept-tips">接受好友请求后，双方将成为好友，是否继续？</p>
          <Input v-model="acceptRemark" label="好友备注：" clearable style="margin: 1rem 0" />
          <p class="dialog-accept-fast">
            将验证消息中的<span class="username" @click="fastSetRemark">{{
              currentFriendRequest?.extra
            }}</span
            >填入
          </p>
        </div>
        <div v-if="actionName === 'reject' && currentFriendRequest !== null">
          <p>
            确定要拒绝来自<span class="username">
              {{ currentFriendRequest!.fromUser.nickname }} </span
            >的好友申请吗？
          </p>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { Button, Dialog, Input } from 'tdesign-vue-next';
import UserInfo from '@/components/UserInfo.vue';
import { useFriendRequestsMsgStore } from '@/store';
import { FriendRequestsStatusEnum } from '@/common/constants';
import { friendRequestServices } from '@/service';
import type { FriendRequestsRecordDto } from '@/service/dto/friend.dto';

const taskQueue = reactive<number[]>([]); // 任务队列, 同一时刻只能有一个任务
const friendRequestsMsgStore = useFriendRequestsMsgStore();
const visibleDialog = ref<boolean>(false); // 是否显示弹窗
const actionName = ref<'access' | 'reject' | ''>(''); // 操作名称
const currentFriendRequest = ref<FriendRequestsRecordDto | null>(null); // 当前操作的好友请求
const acceptRemark = ref<string>(''); // 接受好友请求时的备注

const prevAction = (friendRequestsId: number) => {
  if (taskQueue.length !== 0) return;
  taskQueue.push(friendRequestsId);
  visibleDialog.value = true;
  currentFriendRequest.value = friendRequestsMsgStore.friendRequestsMsg.find(
    (item) => item.id === friendRequestsId
  ) as FriendRequestsRecordDto;
};

const handleAccessFriendRequest = (evt: MouseEvent, friendRequestsId: number) => {
  prevAction(friendRequestsId);
  actionName.value = 'access';
};

const handleRejectFriendRequest = (evt: MouseEvent, friendRequestsId: number) => {
  prevAction(friendRequestsId);
  actionName.value = 'reject';
};

const handleConfirmDialog = () => {
  if (currentFriendRequest.value === null) return;
  const { id: friendRequestsId } = currentFriendRequest.value;
  const finallyCallback = () => {
    taskQueue.pop();
    actionName.value = '';
    visibleDialog.value = false;
  };
  if (actionName.value === 'access') {
    friendRequestServices
      .acceptFriendRequest({ id: friendRequestsId, remark: acceptRemark.value })
      .then((res) => {
        if (res.data.code === 0) {
          friendRequestsMsgStore.updateFriendRequestsMsgStatus(friendRequestsId, {
            status: FriendRequestsStatusEnum.ACCEPTED,
          });
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      })
      .finally(() => finallyCallback());
  } else if (actionName.value === 'reject') {
    friendRequestServices
      .rejectFriendRequest(friendRequestsId)
      .then((res) => {
        if (res.data.code === 0) {
          friendRequestsMsgStore.friendRequestsMsg =
            friendRequestsMsgStore.friendRequestsMsg.filter((item) => item.id !== friendRequestsId);
        }
      })
      .catch((err: unknown) => {
        console.log(err);
      })
      .finally(() => finallyCallback());
  }
};

const handleCancelDialog = () => {
  visibleDialog.value = false;
  taskQueue.pop();
  currentFriendRequest.value = null;
};

const fastSetRemark = () => {
  if (currentFriendRequest.value != null) {
    acceptRemark.value = currentFriendRequest.value.extra;
  }
};
</script>

<style scoped lang="less">
.friend-requests-wrapper {
  .content {
    max-height: calc(100vh - 6rem);
    overflow-y: scroll;
    .friend-requests-list {
      .friend-requests-item {
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--td-brand-color);
        .friend-requests {
          .operations {
            display: flex;
            flex-direction: column;
            justify-content: center;
            .operate {
              font-size: small;
              text-align: center;
              &:not(:first-child) {
                margin-top: 0.5rem;
              }
            }
          }
          .accept-tips {
            color: #b2adad;
            font-size: small;
            text-align: center;
          }
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .content {
      padding: 5rem 1rem 0px;
    }
  }
}
.username {
  color: var(--td-brand-color);
  font-weight: bolder;
}
.dialog-accept-tips {
  font-weight: bolder;
}
.dialog-accept-fast {
  color: var(--td-text-color-placeholder);
  font-size: small;
  .username {
    cursor: pointer;
  }
}
</style>
