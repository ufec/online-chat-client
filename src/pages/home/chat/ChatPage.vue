<template>
  <Layout>
    <Aside class="side-nav-bar"> <ChatView /> </Aside>
    <Content class="side-content">
      <RouterView />
    </Content>
  </Layout>
</template>

<script lang="ts" setup>
import { Layout, Aside, Content } from 'tdesign-vue-next';
import ChatView from './components/ChatView.vue';
</script>

<style scoped lang="less">
.side-nav-bar {
  height: 100vh;
  flex: 0 0 31rem;
  box-sizing: border-box;
  border-right: 1px solid #e5e5e5;
}
.side-content {
  height: 100vh;
  min-width: 0;
  max-height: 100vh;
}
</style>
