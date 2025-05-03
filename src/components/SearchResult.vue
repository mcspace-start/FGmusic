<template>
  <div class="search_main">
    <div class="head">
      <div class="search_title">搜歌曲：{{ keywords }}</div>
    </div>
    <div class="content">
      <songs-list-table
        :visAreas="{
          duration: true,
        }"
        :opts="{
          type: 'search',
          keywords: keywords,
        }"
      ></songs-list-table>
    </div>
  </div>
</template>

<script>
import SongsListTable from "./SongsListTable.vue";
export default {
  name: "SearchResult",
  components: {
    SongsListTable,
  },
  data() {
    return {
      keywords: "逆战",
    };
  },
  watch: {
    "$route.query": {
      handler(newValue) {
        this.keywords = newValue.keywords;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.search_main {
  display: flex;
  flex-direction: column;
  height: 100%;
  .head {
    height: 98px;
    background-color: var(--secondary-bg-color);
    border-radius: 15px;
    padding: 0 40px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .search_title {
      font-size: 20px;
      color: var(--primary-text-color);
      font-weight: bold;
    }
  }
  .content {
    flex: 1;
    height: 100%;
    width: 100%;
  }
}
</style>