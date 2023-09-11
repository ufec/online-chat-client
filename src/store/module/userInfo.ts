import type { PublicUserInfoDto } from '@/service/dto/user.dto';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserInfoStore = defineStore(
  'userInfo',
  () => {
    const userInfo = ref<PublicUserInfoDto | null>(null);
    const setUserInfo = (info: PublicUserInfoDto) => (userInfo.value = info);
    const clearUserInfo = () => (userInfo.value = null);

    return { userInfo, setUserInfo, clearUserInfo };
  },
  { persist: true }
);
