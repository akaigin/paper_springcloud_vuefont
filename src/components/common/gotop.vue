<!--
<template lang="html">
  <aside class="gotop" v-show="toggleGoTop" @click="goTop">
    <i class="fa fa-arrow-circle-up"></i>
  </aside>
</template>

<script>
export default {
  props: ['targetScrollTop'],
  computed: {
    toggleGoTop () {
      // 滑动一屏幕的距离 则展示回到顶部组件
      if (this.targetScrollTop > window.innerHeight / 2) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    goTop () {
      // emit 触发的事件， 采用 goPageTop的方式，无法监听到 ？？？
      this.$emit('go-page-top')
    }
  }
}
</script>

<style lang="scss">
@import "../assets/scss/common.scss";
.gotop{
  font-size: $header-height;
  color: $color42b;
  position: fixed;
  right: $padding;
  bottom: $padding;
  text-align: center;

  i{
    background-color: #fff;
    border-radius: 50%;
  }
}
</style>
-->
