<template>
  <div :class="containerClass">
    <div :class="wrapperClass">
      <img v-bind="$attrs" class="oc-image__img oc-image--fit-fill oc-image--position-center" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ImgHTMLAttributes, computed } from 'vue';
interface Props extends ImgHTMLAttributes {
  shape?: 'circle' | 'round';
  size?: 'large' | 'medium' | 'small';
}
const props = defineProps<Props>();

const containerClass = computed(() => {
  return {
    'oc-avatar': true,
    'oc-avatar--circle': props.shape === 'circle',
    'oc-avatar--round': props.shape === 'round',
  };
});

const wrapperClass = computed(() => {
  return {
    'oc-image__wrapper': true,
    'oc-image__wrapper--large': props.size === 'large',
    'oc-image__wrapper--medium': props.size === 'medium',
    'oc-image__wrapper--small': props.size === 'small',
  };
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style scoped lang="less">
.oc-avatar {
  font: var(--td-font-body-medium);
  color: var(--td-text-color-primary);
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  display: inline-flex;
  color: var(--td-text-color-brand);
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
  box-sizing: content-box;
  width: var(--td-comp-size-m);
  height: var(--td-comp-size-m);
  font-size: var(--td-font-size-body-large);
  line-height: var(--td-comp-size-m);
  // 撑满父元素
  width: 100%;
  height: 100%;
  .oc-image__wrapper {
    width: 100%;
    height: 100%;
    .oc-image__img {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      position: relative;
      z-index: inherit;
    }
    .oc-image--fit-fill {
      object-fit: fill;
    }
    .oc-image--position-center {
      object-position: center;
    }
  }
}
.oc-avatar--circle {
  border-radius: 50%;
}
.oc-avatar--round {
  border-radius: 0.2rem;
}
</style>
