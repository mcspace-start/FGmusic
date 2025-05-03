<template>
  <div id="app" class="">
    <router-view />
  </div>
</template>
<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["isDark", "theme"]),
  },
  watch: {
    isDark(newVal) {
      document.body.classList.toggle("dark-mode", newVal);
    },
    theme(theme) {
      // 添加主题类名
      document.body.className = theme;
      // 将暗黑模式重新添加
      if (this.isDark) {
        document.body.classList.add("dark-mode");
      }
    },
  },
};
</script>

<style lang="less"></style>
