<template>
  <div class="user-info-wrapper">
    <div class="user-avatar">
      <img :src="props.userInfo.avatar" :alt="props.userInfo.nickname" crossorigin="anonymous" />
    </div>
    <div class="user-info">
      <div class="user-name">
        {{ props.remark ?? props.userInfo.nickname ?? props.userInfo.username ?? '' }}
      </div>
      <div class="user-slogan">
        {{ props.message ?? props.userInfo.slogan ?? '' }}
      </div>
    </div>
    <div class="user-operations">
      <slot name="operations"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PublicUserInfoDto } from '@/service/dto/user.dto';
interface Props {
  userInfo: Partial<PublicUserInfoDto>;
  message?: string;
  remark?: string;
}
const props = defineProps<Props>();
</script>

<style scoped lang="less">
.user-info-wrapper {
  display: flex;
  align-items: center;
  padding: 0.7rem 0.5rem;
  width: 100%;
  .user-avatar {
    flex: 0 0 6rem;
    height: 6rem;
    background-color: aqua;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-left: 10px;
    justify-content: center;
    min-width: 0;
    .user-name {
      font-size: larger;
    }
    .user-slogan {
      font-size: small;
      margin-top: 6px;
    }
    .user-name,
    .user-slogan {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .user-operations {
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
  }
}
</style>
