<template>
  <div class="ranking_main">
    <div class="header">
      <!-- nav区域 -->
      <div class="menu_wrapper">
        <el-menu
          :default-active="active"
          class="el-menu-vertical-demo"
          mode="horizontal"
          @select="toggleRanking"
        >
          <el-menu-item
            :index="item.id + ''"
            :key="item.id"
            v-for="item in navData"
            >{{ item.title }}</el-menu-item
          >
        </el-menu>
      </div>
    </div>
    <!-- 列表组件区域 -->
    <div
      class="content"
      v-loading="loading"
      element-loading-background="var(--loading-bg-color)"
    >
      <!-- 重试组件 -->
      <retry v-if="showRetry" @retry="getData"></retry>
      <!-- 内容展示 -->
      <songs-list-table
        v-if="showContent"
        :visAreas="{
          point: true,
        }"
        :opts="{
          type: 'toplist',
          id: toplistOpts[active - 0],
        }"
      ></songs-list-table>
    </div>
  </div>
</template>

<script>
import SongsListTable from "../components/SongsListTable.vue";
import Retry from "../components/Retry.vue";
export default {
  name: "Ranking",
  components: {
    SongsListTable,
    Retry,
  },
  data() {
    return {
      active: "0", // nav选中项
      showRetry: false,
      showContent: false,
      loading: false,
      // 选项数据
      navData: [
        {
          id: 0,
          title: "热歌榜",
        },
        {
          id: 1,
          title: "飙升榜",
        },
        {
          id: 2,
          title: "网络榜", //网络热歌榜
        },
        {
          id: 3,
          title: "说唱榜", // 云音乐说唱榜
        },
        {
          id: 4,
          title: "古典榜", // 云音乐古典榜
        },
        {
          id: 5,
          title: "热度榜", // 实时热度榜
        },
        {
          id: 6,
          title: "日语榜",
        },
        {
          id: 7,
          title: "欧美榜",
        },
      ],
      toplistOpts: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 选项切换时
    toggleRanking(index) {
      this.active = index;
    },
    async getData() {
      this.showRetry = false;
      this.loading = true;
      try {
        await this.getNavData();
        this.showContent = true;
      } catch (err) {
        console.error(err);
        this.showRetry = true;
        this.$message.error("获取导航数据失败！");
      }
      this.loading = false;
    },
    // 获取导航数据
    async getNavData() {
      const url = "/toplist";
      let { data } = await this.$http.get(url);
      data = data.list;
      this.toplistOpts.push(data.find((i) => i.name === "热歌榜").id);
      this.toplistOpts.push(data.find((i) => i.name === "飙升榜").id);
      this.toplistOpts.push(data.find((i) => i.name === "网络热歌榜").id);
      this.toplistOpts.push(data.find((i) => i.name === "云音乐说唱榜").id);
      this.toplistOpts.push(data.find((i) => i.name === "云音乐古典榜").id);
      this.toplistOpts.push(data.find((i) => i.name === "实时热度榜").id);
      this.toplistOpts.push(data.find((i) => i.name === "云音乐日语榜").id);
      this.toplistOpts.push(data.find((i) => i.name === "云音乐欧美热歌榜").id);
    },
  },
};
</script>

<style lang="less" scoped>
.ranking_main {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    height: 88px;
    .menu_wrapper {
      height: 63px;
      background-color: var(--primar-color);
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 5px;
      overflow: hidden;
      .el-menu {
        background: transparent;
        height: 43px;
        flex-shrink: 1;
        border-color: transparent;
        display: flex;

        .el-menu-item {
          margin: 0 5px;
          height: 43px;
          flex: 0 1 82px;
          // width: 82px;
          line-height: 40px;
          border-radius: 14px;
          font-weight: bold;
          color: #fff;
          position: relative;
          text-align: center;
          &::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            height: 1px;
            width: 14px;
            border-radius: 2px;
            border: 2px solid var(--primar-color);
            background-color: var(--primar-color);
            opacity: 0;
          }
          &:focus {
            background: transparent;
          }
          &:hover {
            background-color: #fff;
            color: var(--primar-color);
            &::before {
              opacity: 1;
            }
          }
          &.is-active {
            background-color: #fff;
            border-color: transparent;
            color: var(--primar-color);
            &::before {
              opacity: 1;
            }
          }
        }
      }
    }
  }
  .content {
    height: 100%;
  }
}
</style>