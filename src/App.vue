<template>
  <RouterView />
</template>

<script setup lang="ts"></script>

<style>
html {
  font-size: 62.5%;
}
#nprogress .bar {
  background: #29d !important;
}

*::-webkit-scrollbar {
  width: 0.2rem;
  height: 0.2rem;
}

*::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 5px;
}
</style>
