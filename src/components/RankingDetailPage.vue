<template>
  <div class="main_wrap">
    <div class="header">
      <!-- 图片 -->
      <el-image
        class="cover"
        :src="topListInfo.coverImgUrl"
        fit="cover"
        :title="topListInfo.description"
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
      <!-- 右侧信息 -->
      <div class="info">
        <div class="name-update">
          <div class="name">{{ topListInfo.name }}</div>
          <div class="update">
            <div class="updateFrequency">{{ topListInfo.updateFrequency }}</div>
            <div class="uptateTime">{{ formatUpdateTime }}</div>
          </div>
        </div>
        <!-- 描述 -->
        <div class="desc" v-if="topListInfo.description">
          <div class="desc_i" :title="topListInfo.description">
            {{ topListInfo.description }}
          </div>
        </div>
      </div>
    </div>
    <!-- 内容渲染 -->
    <div class="content">
      <!-- 内容区域 -->
      <songs-list-table
        :opts="{
          type: 'toplist',
          id: topListInfo.id,
        }"
      ></songs-list-table>
    </div>
  </div>
</template>

<script>
import SongsListTable from "./SongsListTable.vue";
export default {
  name: "RankingDetailPage",
  components: {
    SongsListTable,
  },
  data() {
    return {
      topListInfo: {},
    };
  },
  computed: {
    formatUpdateTime() {
      let str = "";
      const updateTime = Number(this.topListInfo.updateTime);
      const date = this.formatDate(updateTime, "MM-DD");
      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = oneDay * 7;
      const timeDiff = now - updateTime;
      if (timeDiff < oneDay) {
        str = "刚刚更新";
      } else if (timeDiff < oneWeek) {
        const dayMap = {
          1: "一",
          2: "二",
          3: "三",
          4: "四",
          5: "五",
          6: "六",
        };
        str = `${dayMap[Math.floor(timeDiff / oneDay)]}天前更新`;
      } else {
        str = date;
      }
      return str;
    },
  },
  created() {
    this.topListInfo = this.$route.query;
  },
  methods: {
    formatDate(timestamp, format = "YYYY-MM-DD HH:mm:ss") {
      const date = new Date(timestamp);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份从 0 开始，需要 +1
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      // 替换格式字符串中的占位符
      return format
        .replace("YYYY", year)
        .replace("MM", month)
        .replace("DD", day)
        .replace("HH", hours)
        .replace("mm", minutes)
        .replace("ss", seconds);
    },
  },
};
</script>
<style lang="less" scoped>
.main_wrap {
  height: 100%;
  position: relative;
  .header {
    height: 100px;
    background: var(--primar-color);
    border-radius: 20px;
    padding: 10px;
    display: flex;
    .cover {
      flex: 0 0 100px;
      width: 100px;
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
      color: var(--primary-text-color);
      background: var(--secondary-bg-color);
      margin-right: 22px;
      border-radius: 16px;
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;

      .name-update {
        flex: 1;
        margin-bottom: 6px;
        min-height: 34px;
        vertical-align: middle;
        display: flex;
        align-items: center;
        .name {
          font-weight: bold;
          font-size: 26px;
          color: var(--primary-text-color);
          margin-right: 20px;
        }
        .update {
          flex: 1;
          display: flex;
          .updateFrequency {
            margin-bottom: 2px;
            font-size: 12px;
            color: var(--primary-text-color);
            margin-right: 6px;
          }
          .uptateTime {
            font-size: 20px;
            font-size: 12px;
            color: var(--primary-text-color);
          }
        }
      }
      .desc {
        overflow: hidden;
        background: #fff;
        font-size: 14px;
        padding: 6px;
        line-height: 18px;
        border-radius: 8px;
        color: #505050;
        display: flex;
        .desc_i {
          overflow-y: auto;
          scrollbar-width: none;
        }
      }
    }
  }
  .content {
    width: 100%;
    position: absolute;
    top: 130px;
    bottom: 0;
  }
}
</style>