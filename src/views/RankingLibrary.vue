<template>
  <div class="main_wrap">
    <div
      class="content"
      v-loading="loading"
      element-loading-background="var(--loading-bg-color)"
    >
      <!-- 重试组件 -->
      <retry v-if="showRetry" @retry="getData"></retry>
      <!-- 内容区域 -->
      <div class="ranking" v-for="item in rankings" :key="item.id">
        <!-- {{ item.name }} -->
        <el-image
          :src="item.coverImgUrl"
          fit="cover"
          lazy
          @click="goToRankingDetailPage(item)"
          :title="item.description"
        >
          <!-- 加载动画 -->
          <div slot="placeholder">
            <span>
              <i class="el-icon-loading"></i>
            </span>
          </div>
          <!-- 错误动画 -->
          <div slot="error">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </div>
  </div>
</template>

<script>
import Retry from "@/components/Retry.vue";
export default {
  name: "RankingLibrary",
  components: {
    Retry,
  },
  data() {
    return {
      rankings: [],
      loading: false,
      showRetry: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      this.showRetry = false;
      try {
        await this.getAllToplist();
      } catch (err) {
        this.showRetry = true;
        console.error(err);
        this.$message.error("获取所有榜单数据失败！");
      }
      this.loading = false;
    },
    // 获取所有榜单数据
    async getAllToplist() {
      console.log("获取所有榜单数据");
      const url = "/toplist";
      let { data } = await this.$http.get(url);
      this.rankings = data.list;
    },
    // 跳转页面
    goToRankingDetailPage(item) {
      this.$router.push({
        name: "RankingDetailPage",
        query: {
          id: item.id,
          name: item.name,
          description: item.description,
          updateFrequency: item.updateFrequency,
          coverImgUrl: item.coverImgUrl,
          updateTime: item.updateTime,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main_wrap {
  height: 100%;
  position: relative;
  .content {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow-y: auto;
    scrollbar-width: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-right: 20px;
    .ranking {
      flex: 1;
      margin: 15px;
      cursor: pointer;
      min-width: 150px;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      // background-color: #ccc;

      .el-image {
        border-radius: 14px;
        background: var(--secondary-bg-color);
        width: 140px;
        height: 140px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: transform var(--transition-duration);
        box-shadow: 1px 1px 10px 3px var(--primary-shadow-color);
        will-change: transform;
        font-size: 28px;
        color: var(--primary-text-color);

        &:hover {
          transform: scale(1.05);
        }
      }
    }
  }
}
</style>