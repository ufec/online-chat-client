<template>
  <div class="search-bar">
    <div class="wrapper">
      <Input v-model="searchUserParam" clearable placeholder="请输入用户名" />
      <Button :loading="searchLoading" @click="handleSearchUser">搜索</Button>
      <Button @click="handleCreateGroupClick">
        <template #icon><AddIcon size="3rem" /></template>
      </Button>
    </div>
  </div>
  <!-- 搜索用户结果 -->
  <Dialog
    v-model:visible="showSearchResDialog"
    :footer="false"
    :on-close="handleSearchResDialogClose"
  >
    <p style="margin-bottom: 1.5rem">为您找到以下用户</p>
    <div v-show="showUserInfo" class="user-list" @click="handleFriendRequestDialogStatus">
      <UserInfo v-for="(userRes, index) in searchUserRes" :key="index" :user-info="userRes">
        <template v-if="userInfoStore.userInfo?.id !== userRes.id" #operations>
          <Button :data-id="userRes.id" :data-index="index">申请加好友</Button>
        </template>
      </UserInfo>
    </div>
  </Dialog>
  <!-- 好友申请表单 -->
  <Dialog v-model:visible="showFriendRequestDialog" :footer="false" :on-cancel="handleCloseFRInfo">
    <Form ref="FRInfo" :data="friendRequestForm">
      <FormItem label="验证信息">
        <Input v-model="friendRequestForm.extra" placeholder="请输入验证信息" />
      </FormItem>
      <FormItem label="备注信息">
        <Input v-model="friendRequestForm.remark" placeholder="请输入备注" />
      </FormItem>
      <FormItem style="margin-top: 1rem">
        <Button @click="handleFriendRequest">发送</Button>
      </FormItem>
    </Form>
  </Dialog>
  <!-- 创建群组表单 -->
  <Dialog
    v-model:visible="showCreateGroupDialog"
    :on-cancel="() => (showCreateGroupDialog = false)"
    header="选择好友来创建群聊"
    :footer="false"
  >
    <Form
      :ref="createGroupFormRef"
      :data="createGroupRequestFrom"
      label-align="top"
      :rules="createGroupFormRules"
      @reset="onResetCreateGroupForm"
      @submit="onSubmitCreateGroupForm"
    >
      <FormItem label="群聊名称" name="groupName">
        <Input v-model="createGroupRequestFrom.groupName" placeholder="请输入群聊名称" />
      </FormItem>
      <FormItem label="群聊头像" name="avatar">
        <Input v-model="createGroupRequestFrom.avatar" placeholder="请输入群聊头像地址" />
      </FormItem>
      <FormItem label="选择群聊成员" name="selectedFriendList">
        <CheckboxGroup v-model="createGroupRequestFrom.selectedFriendList">
          <UserInfo
            v-for="friend in friendList"
            :key="friend.friendInfo.id"
            :user-info="friend.friendInfo"
          >
            <template #operations>
              <Checkbox :value="friend.friendInfo.id"></Checkbox>
            </template>
          </UserInfo>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
        <Button theme="default" variant="base" type="reset">重置</Button>
        <Button
          theme="primary"
          type="submit"
          style="margin-left: 1rem"
          :disabled="createGroupLoading"
          :loading="createGroupLoading"
          >创建</Button
        >
      </FormItem>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, inject, reactive, computed } from 'vue';
import { searchUser } from '@/service/user.service';
import { sendFriendRequest, getFriendList } from '@/service/friend.service';
import { createGroup } from '@/service/channel.service';
import {
  Form,
  FormItem,
  Input,
  Dialog,
  Button,
  CheckboxGroup,
  Checkbox,
  FormRules,
  SubmitContext,
  Data,
} from 'tdesign-vue-next';
import { AddIcon } from 'tdesign-icons-vue-next';
import { FriendRequestsTypeEnum } from '@/common/constants';
import UserInfo from '@/components/UserInfo.vue';
import type { MessagePluginType } from 'tdesign-vue-next';
import type { FriendRequestsDto, PublicUserInfoDto } from '@/service/dto/user.dto';
import type { AxiosError } from 'axios';
import { useUserInfoStore, useFriendListStore } from '@/store';

const $messagePlugin = inject<MessagePluginType>('$messagePlugin');
const userInfoStore = useUserInfoStore();
const searchUserParam = ref(''); // 搜索参数
const searchLoading = ref(false); // 搜索按钮 loading
const showSearchResDialog = ref(false); // 展示搜索结果Dialog
const searchUserRes = ref<PublicUserInfoDto[]>([]); // 搜索结果
const showUserInfo = ref(false); // 展示用户信息(搜索结果异步)
const showFriendRequestDialog = ref(false); // 展示好友申请表单框
const showCreateGroupDialog = ref(false); // 展示创建群组表单框
const searchUserResIndex = ref<number>(-1);
const friendListStore = useFriendListStore();
const friendRequestForm = reactive<FriendRequestsDto>({
  extra: '',
  remark: '',
  toUserId: 0,
  type: <number>FriendRequestsTypeEnum.WEB,
});
const createGroupRequestFrom = reactive({
  groupName: '', // 群聊名称
  selectedFriendList: [] as number[], // 选择的好友
  avatar: '', // 群聊头像
});
const FRInfo = ref();
const createGroupFormRef = ref();
const createGroupLoading = ref(false);

const friendList = computed(() => friendListStore.friendList);

const createGroupFormRules = reactive<FormRules<typeof createGroupRequestFrom>>({
  selectedFriendList: [
    {
      required: true,
      message: '请选择群聊成员',
      type: 'error',
    },
    {
      validator: (val: any) => {
        if (!Array.isArray(val) || val.length < 2) {
          return {
            result: false,
            message: '群聊成员至少两人',
            type: 'error',
          };
        }
        return true;
      },
    },
  ],
  avatar: [
    {
      validator: (value: string) => {
        if (value === '') {
          return true;
        }
        if (!value.startsWith('http')) {
          return {
            result: false,
            message: '请输入正确的头像地址',
            type: 'error',
          };
        }
        return true;
      },
    },
  ],
});

const onResetCreateGroupForm = () => {
  createGroupFormRef.value?.resetFields();
};

const onSubmitCreateGroupForm = async (context: SubmitContext<Data>) => {
  context?.e?.preventDefault(); // 阻止表单默认提交
  createGroupLoading.value = true;
  if (!context.validateResult && context.firstError) {
    await window?.$messagePlugin?.error(context.firstError);
    return;
  }
  const createGroupRes = await createGroup({
    groupName: createGroupRequestFrom.groupName || undefined,
    avatar: createGroupRequestFrom.avatar || undefined,
    memberIds: createGroupRequestFrom.selectedFriendList,
  });
  if (createGroupRes.data.code === 0) {
    await window?.$messagePlugin?.success('创建成功');
  }
  createGroupLoading.value = false;
  showCreateGroupDialog.value = false;
};

// 处理搜索用户
const handleSearchUser = async () => {
  if (searchUserParam.value === '') {
    await $messagePlugin?.error('请先输入搜索条件');
    return;
  }
  searchLoading.value = !searchLoading.value;
  searchUserRes.value = [];
  searchUser({ username: searchUserParam.value })
    .then((res) => {
      if (res.data.code === 0) {
        searchUserRes.value.push(...res.data.data);
        showUserInfo.value = true;
        showSearchResDialog.value = true;
      }
    })
    .catch((err: AxiosError) => {
      console.log(err.response?.status);
    })
    .finally(() => {
      searchLoading.value = false;
    });
};

// 处理搜索结果Dialog状态
const handleFriendRequestDialogStatus = (evt: Event) => {
  let target: HTMLElement | null = null;
  if (evt.target instanceof HTMLButtonElement) {
    target = evt.target;
  } else if (
    evt.target instanceof HTMLElement &&
    evt.target.parentElement instanceof HTMLButtonElement
  ) {
    target = evt.target.parentElement;
  }
  if (target != null && target.dataset.id && target.dataset.index) {
    friendRequestForm.toUserId = Number(target.dataset.id);
    showFriendRequestDialog.value = true;
    searchUserResIndex.value = Number(target.dataset.index);
  }
};

// 发送好友申请
const handleFriendRequest = async () => {
  const friendRequestRes = await sendFriendRequest(friendRequestForm);
  showSearchResDialog.value = false; // 关闭搜索结果Dialog
  if (friendRequestRes.data.code === 0) {
    await $messagePlugin?.success('好友申请发送成功');
    showFriendRequestDialog.value = false;
  } else {
    await $messagePlugin?.error(friendRequestRes.data.msg);
  }
};

// 关闭搜索结果Dialog
const handleSearchResDialogClose = () => {
  searchUserParam.value = '';
  showUserInfo.value = false;
};

// 关闭好友申请Dialog
const handleCloseFRInfo = () => {
  FRInfo.value?.reset();
};
// 点击创建群组
const handleCreateGroupClick = async () => {
  showCreateGroupDialog.value = true;
  if (friendList.value.length === 0) {
    const res = await getFriendList();
    if (res.data.code === 0) {
      if (res.data.data.total === 0) {
        await $messagePlugin?.error('您还没有好友，快去添加好友吧');
      } else {
        friendListStore.setFriendList(res.data.data.list);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.search-bar {
  margin-top: 1.5rem;
  padding: 0 0.5rem;
  .wrapper {
    display: flex;
    align-items: center;
    padding: 1rem;
    & > button {
      margin-left: 1rem;
    }
  }
}
.user-action {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.friend-request-to-user-info {
  margin: 1rem 1.5rem 1rem 2rem;
}

.user-list {
  & > div:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>
