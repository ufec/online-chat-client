<template>
  <Layout>
    <Aside class="side-nav-bar">
      <div class="nav-list">
        <div
          v-for="navItem in sideNavList"
          :key="navItem.id"
          class="nav-item"
          :class="{ active: navItem.componentName === currentComponent }"
          :data-component-name="navItem.componentName"
          @click="handleClickContracts($event, navItem.componentName)"
        >
          <div class="contract-icon" :style="navItem.style">
            <img :src="navItem.icon" :alt="navItem.desc" />
          </div>
          <div class="desc">{{ navItem.desc }}</div>
        </div>
      </div>
    </Aside>
    <Content class="side-content">
      <component :is="asyncComponents[currentComponent]" class="content"></component>
    </Content>
  </Layout>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent, reactive } from 'vue';
import { Layout, Aside, Content } from 'tdesign-vue-next';

type AsyncComponentsName = 'Friends' | 'FriendRequest';

const currentComponent = ref<AsyncComponentsName>('FriendRequest');

const asyncComponents = {
  Friends: defineAsyncComponent(() => import('./components/FriendsView.vue')),
  FriendRequest: defineAsyncComponent(() => import('./components/FriendRequestView.vue')),
};

const handleClickContracts = (evt: MouseEvent, componentName: AsyncComponentsName) => {
  currentComponent.value = componentName;
};

interface SideNavItem {
  id: number;
  componentName: AsyncComponentsName;
  icon: string;
  desc: string;
  style?: string;
}

const sideNavList = reactive<SideNavItem[]>([
  {
    id: 1,
    componentName: 'FriendRequest',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAYBJREFUSEvNVlFRw0AU3FVAHQAKAAWAAkABVAGggFQBlVAcgIKCg9ZBHFAULLMhlyGZ3OUymen0/d7d29339r2E2FNwTzg4HCBJJwBuAMxq9R8kN2MrkVQkaQngsSfpJ4A7krtcwCiQpBWA+0SiDcmLSUCSrgCsM5LMSZrQYPQqylATEn+RNKkmJM36ShoDcg8uB2kCINnKIclvS5IP/99PBdqSPO8oMpAJtJTGgJ4AvGYoejPzegSO6/t2qsM5HCaziwF5ZkoARwNgpyRLSQWAl8jdBckiZW9Lf0+ANY6zAQCEErYUkfwrZYpxgumS5HPf29oM2T26rXvk9RMLbwUDLjpmcBXsutCj6rhrTZfAJmhZc6BPWeuoC2Q2XqBjw0v2OrX7GiBJuZaOkViRnMcOK6DaNd9jZfTct6rKZd0IQKk5GINfDXAKyDU+G5MxWqLO7gv3giJvgbBCpuD9kAxf4laeAOSp9ndliqotgIKkndvfoykSct8ezl9QLuOhe78OqI0bw5FsHgAAAABJRU5ErkJggg==',
    desc: '新的朋友',
    style: 'background-color: rgb(250, 157, 59)',
    // style: { backgroundColor: 'rgb(250, 157, 59)' },
  },
  {
    id: 2,
    componentName: 'Friends',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAAA2VJREFUWEftmWtIU2Ecxp//NjcvTSZajLbJsgsSotWHLKIoiigqkii6IFGYEpRgtYqggr5JtaAsiAqTrESjrCAoun2IElOooLIyN8vryLJ2qXZ940gXsuXes3N0Bb4fxuA85/n/9vzPec/77hB+jCIWZ0y2ryPG1hIhByDtz2ND+YXByQhPGFDZ7hxTgRPkF8qT8KEvsZtVSnZJQZg8lEwRazE89gN5XdaMN6Qrseu0ytB9IpoY8cTYCJrgcc8gw7aWLUqiQ7Fh4KsaZGwrmbbZ6okwle+U2KgYw0NKt7R4AVLHBoG3KvNRusXGeOWx1A2Dyp3+cKL/ZKLC421hdhLyp2mRbdJAoyK86PbhXJ0TNQ1uhGS4XSW3foRGgVPrR2H62ISwIda1fEFBuQMenzRayaDH8kdicc6IATt9ocEFS02PpKtBEmiWQY1rJQYugPnWdrzs7lsIRTUkgW5fkILNc3Vcha03enHk1kcubTiRJND9K9KwcirfsvViowtbq6NvvyTQXYtSsHE2X6Ll9z5h39UPsUl0TmYCKgr0XMU3nHbg5vPPXFrZW08EXCkejRyTZkCAZocP860dkuZTSa0X6Mxpqj5YXaIyLGxHbwD5J7thexf9HS8YSwYVTCala3C+SI8kjeI3WNfXEJYd7cQrhzRIyaCZ+jhsmqvDgqwkqFV9+8Q/hj/AcP2pB2W3P8ZmHl2Tq8W+vNS/AvYn9gUY9l7uQVW9O6obKqrWr87VonR5WlQFd9S8Q3WDeFjRoDPGxaOyUA+lInyrI9EHQgyrj3fhod0bSfrbcVGgwvLt7g4jDCkqUUX6i1t7/Jh3sB3+IL+NKNDCWcnYvSSV330A5Z7a9zjzwMntJQpUmC+FqUiO8fitF0vLOrmtRIG+LjUjThndtdmfKBhiyNjZOjigZwv1mDkh/Eqeu+J34Z2mz1hf7uA+TVSiyfEKrMrVIlEtLVWPN4SqehfcXv7tiShQ7p8/CMJhULlD/X8SNVlsHgIS5U5AVj8Gp/BHbh0RpslqLLcZowdktNh3KsBK5faW048xWMi4pS1BofA14h992cAYe9amzZjy/fVNk1mt0tQKuwo5k5DsxfAoEGB5nYfHvv31iClu1pjUyu1EyAPYhJi9EANcAGtmjGrbfMEDKBvft3D9BhO/RRwV0WBfAAAAAElFTkSuQmCC',
    desc: '我的好友',
    style: 'background-color: rgb(66, 139, 229)',
    // style: { backgroundColor: 'rgb(66, 139, 229)' },
  },
]);
</script>

<style scoped lang="less">
.side-nav-bar {
  height: 100vh;
  flex: 0 0 31rem;
  .nav-list {
    padding: 12px 6px 0;
    height: 100%;
    .nav-item {
      display: flex;
      align-items: center;
      padding: 11px 16px;
      border-radius: 8px;
      cursor: pointer;
      &:hover {
        background-color: #f5f5f5;
      }
      .contract-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 42px;
        min-height: 42px;
        border-radius: 4px;
        margin-right: 12px;
      }
    }

    .active {
      background-color: #eeeeee;
    }
  }
}

.side-content {
  height: 100vh;
  min-width: 0;
}
</style>
