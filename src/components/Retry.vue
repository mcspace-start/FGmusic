<template>
  <div class="box">
    <p class="title">获取失败</p>
    <div class="btn" @click="handleRetry">重试</div>
  </div>
</template>
  
  <script>
export default {
  name: "Retry",
  methods: {
    handleRetry() {
      // 重试
      this.$emit("retry");
    },
  },
};
</script>
  
<style scoped lang="less">
.box {
  height: 100%;
  width: 100%;
  background-color: var(--secondary-bg-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // border-radius: 20px;
  .title {
    font-size: 14px;
    color: var(--secondary-text-color);
    margin: 24px 0;
  }
  .btn {
    cursor: pointer;
    width: 80px;
    height: 34px;
    margin-bottom: 16px;
    background-color: var(--button-bg-color);
    box-shadow: 0 16px 14px var(--primary-shadow-color);
    text-align: center;
    line-height: 34px;
    font-size: 14px;
    color: var(--primary-text-color);
    border-radius: 10px;
    transition: all var(--transition-duration);

    &:hover {
      color: var(--player-control-txt-clolr);
      background-color: var(--primar-color);
      box-shadow: 0 16px 14px var(--secondary-shadow-color);
      transform: translateY(-4px);
    }
  }
}
</style>