<template>
  <div class="main_wrapper">
    <!-- 左侧列表 -->
    <div class="main">
      <!-- 头部 -->
      <div class="head" v-if="!visAreas.head">
        <div class="title">{{ title }}</div>
        <div class="search">
          <el-input
            placeholder="搜索歌单"
            clearable
            v-model="searchInfo"
            @change="handlerSearch"
            @clear="handlerClear"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer"
            ></i>
          </el-input>
        </div>
      </div>
      <!-- 歌单区域 -->
      <div
        class="content"
        :class="{
          isShow: opts.isShow,
          isCol: opts.type == 'col',
        }"
        v-loading="playlistsLoading"
        element-loading-background="var(--loading-bg-color)"
      >
        <!-- 重试 -->
        <retry @retry="getData" v-if="showRetry"></retry>
        <!-- 内容  -->
        <el-scrollbar
          v-if="!showRetry && !showEmpty"
          wrap-style="overflow-x: hidden;"
          style="height: 100%; width: 100%"
          element-loading-background="var(--loading-bg-color)"
        >
          <!-- infinite-scroll-immediate="false" -->
          <div
            class="content_i"
            v-infinite-scroll="getData"
            infinite-scroll-disabled="infiniteDisabled"
            infinite-scroll-immediate="false"
          >
            <div
              class="playlist_item"
              v-for="item in playlists"
              @click="goToPlaylistDetailPage(item)"
              :key="item.id"
              :class="{ isCol: opts.type == 'col' }"
            >
              <!-- el-image -->
              <el-image :src="item.picUrl" fit="cover" lazy>
                <div slot="placeholder">
                  <span>
                    <i class="el-icon-loading"></i>
                  </span>
                </div>
                <div slot="error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="title">{{ item.name }}</div>
            </div>
          </div>
        </el-scrollbar>
        <!-- 无数据 -->
        <div class="empty" v-if="showEmpty && !showRetry && !playlistsLoading">
          <div class="empty_i">没有数据</div>
        </div>
      </div>
    </div>
    <!-- 右侧标签  -->
    <div class="tags" v-if="!visAreas.tags">
      <div
        class="tags_wrap"
        ref="tagsWrap"
        v-show="true"
        v-loading="tagsLoading"
        element-loading-background="var(--loading-bg-color)"
      >
        <el-scrollbar style="height: 100%" wrap-style="overflow-x: hidden;">
          <!-- 类别 -->
          <div class="tags_type" v-for="item in tags" :key="item.id">
            <div class="tags_title">{{ item.name }}</div>
            <div class="tag_item_wrapper">
              <div
                class="tag_item"
                @click="handlerTags(i)"
                v-for="(i, index) in item.sub"
                :key="index"
              >
                {{ i }}
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import Retry from "./Retry.vue";
export default {
  components: { Retry },
  name: "PlaylistPage",
  props: {
    // 接受隐藏项
    visAreas: {
      type: Object,
      default: () => ({
        head: false,
        tags: false,
      }),
    },
    // 展示配置项
    opts: {
      type: Object,
      default: () => ({
        type: "", // rec || trav || col,
        isShow: false,
      }),
    },
  },
  data() {
    return {
      title: "",
      tags: [], // 右侧标签
      playlists: [
        // {
        //   id:0,
        //   picUrl:"",
        //   name:""
        // }
      ],
      searchInfo: "",
      tagsLoading: false,
      playlistsLoading: false,
      showEmpty: false,
      showRetry: false,
      infiniteDisabled: false, // 禁用无限滚动
      type: "", // 获取数据类型 防止切换别的组件选项触发
      offset: 0,
      limit: 30,
      tag: "", //按标签搜索
      keywords: "", // 搜索关键词
    };
  },
  created() {
    // 判断是传值还是直接打开页面
    this.type = this.opts.type ? this.opts.type : "hot";
    this.getData();
  },
  watch: {
    type() {
      // 类型变化清空数组
      this.restState();
    },
  },
  methods: {
    // 跳转至歌单详情页
    goToPlaylistDetailPage(item) {
      this.$router.push({
        name: "PlaylistDetailPage",
        query: {
          ...item,
          type: "playlist", // 表示为歌单类型
        },
      });
    },
    // 清除状态
    restState() {
      this.offset = 0;
      this.playlists = [];
    },
    //  获取数据
    async getData() {
      const type = this.type;
      this.showEmpty = false;
      this.showRetry = false;
      this.playlistsLoading = true;
      // 恢复无限滚动
      this.infiniteDisabled = false;
      // 获取标签
      try {
        await this.getTags();
        this.tagsLoading = true;
      } catch (err) {
        this.$message.error("获取标签数据失败！");
      } finally {
        this.tagsLoading = false;
      }

      // 获取数据
      try {
        switch (type) {
          case "hot":
            await this.getHotPlaylist();
            break;
          case "rec":
            this.infiniteDisabled = true;
            await this.getRecPlaylist();
            break;
          case "trav":
            await this.getTrvePlaylist();
            break;
          case "tag":
            await this.getPlaylistsByTags();
            break;
          case "search":
            await this.searchPlaylist();
            break;
          case "col":
            this.infiniteDisabled = true;
            this.getShowColData();
            break;
          default:
            this.$message.error("参数错误！");
            break;
        }
      } catch (err) {
        console.error(err);
        this.showRetry = true;
        this.$message.error("获取数据失败！");
      } finally {
        // 无数据
        if (!this.playlists.length) {
          this.showEmpty = true;
        }
        this.playlistsLoading = false;
      }
    },
    // 获取所有标签
    async getTags() {
      const { data } = await this.$http.get("/playlist/catlist");
      const cats = data.categories;
      const sub = data.sub;
      const tags_temp = [];
      // 遍历主题
      let index = 0;
      for (const value of Object.values(cats)) {
        tags_temp.push({
          id: index,
          name: value,
          sub: [],
        });
        index++;
      }
      // 遍历标签 根据主体类型添加
      sub.forEach((item) => {
        tags_temp[item.category].sub.push(item.name);
      });
      this.tags = tags_temp;
    },
    //
    handlerTags(tag) {
      if (tag === this.tag) return;
      this.tag = tag;
      this.type = "tag";
      this.restState();
      this.getData();
    },
    // 获取热门歌单
    async getHotPlaylist() {
      console.log("获取热门歌单");
      this.title = "热门歌单";
      this.type = "hot";
      // 推荐歌单
      const url = "/top/playlist";
      let { data } = await this.$http.get(url, {
        params: {
          limit: this.limit,
          offset: this.offset,
          order: "hot",
        },
      });
      // 没有更多的数据
      if (!data.more) {
        this.infiniteDisabled = true;
      }
      data = data.playlists;
      // 数据格式化
      const playlists_item = data.map((item) => {
        return {
          name: item.name,
          id: item.id,
          picUrl: item.coverImgUrl + "?param=200y200",
        };
      });
      // 去除重复项
      const uniqueItems = this.filterUniqueItems(
        this.playlists,
        playlists_item
      );
      this.playlists.push(...uniqueItems);
      this.offset += this.limit;
    },
    // 获取推荐歌单
    async getRecPlaylist() {
      this.type = "rec";
      // 推荐歌单
      const url = "/personalized";
      let { data } = await this.$http.get(url, {
        params: {
          limit: this.limit,
        },
      });
      data = data.result;
      data = data.map((item) => ({
        id: item.id,
        name: item.name,
        picUrl: item.picUrl + "?param=200y200",
      }));
      this.playlists = data;
    },
    // 获取旅行歌单
    async getTrvePlaylist() {
      console.log("获取旅行歌单");
      this.type = "trav";
      // 推荐歌单
      const url = "/top/playlist";
      const cat = "旅行";
      let { data } = await this.$http.get(url, {
        params: {
          cat: cat,
          limit: this.limit,
          offset: this.offset,
        },
      });
      // 没有更多的数据
      if (!data.more) {
        this.infiniteDisabled = true;
      }
      data = data.playlists;
      // 数据格式化
      const playlists_item = data.map((item) => {
        return {
          name: item.name,
          id: item.id,
          picUrl: item.coverImgUrl + "?param=200y200",
        };
      });
      // 排除重复项
      const uniqueItems = this.filterUniqueItems(
        this.playlists,
        playlists_item
      );
      this.playlists.push(...uniqueItems);
      this.offset += this.limit;
    },
    // 根据标签获取歌单
    async getPlaylistsByTags() {
      console.log("根据标签获取数据", this.tag);
      this.type = "tag";
      // 保存tag给用于无限滚动
      this.playlistsLoading = true;
      this.showEmpty = false;
      this.title = this.tag;
      this.showRetry = false;
      //
      // this.$router
      //   .replace({
      //     query: {
      //       tags: tagVal,
      //     },
      //   })
      //   .catch(() => {});

      // 推荐歌单
      const url = "/top/playlist";
      const cat = this.tag;
      let { data } = await this.$http.get(url, {
        params: {
          cat: cat,
          limit: this.limit,
          offset: this.offset,
        },
      });

      // 没有更多的数据
      if (!data.more) {
        this.infiniteDisabled = true;
      }
      data = data.playlists;
      // 数据格式化
      const playlists_item = data.map((item) => {
        return {
          name: item.name,
          id: item.id,
          picUrl: item.coverImgUrl + "?param=200y200",
        };
      });
      const uniqueItems = this.filterUniqueItems(
        this.playlists,
        playlists_item
      );
      this.playlists.push(...uniqueItems);
      this.offset += this.limit;
      this.playlistsLoading = false;
    },
    // 搜索函数
    handlerSearch(val) {
      const trimmedVal = val.trim();
      if (trimmedVal === "") {
        this.searchInfo = "";
        return;
      } else if (trimmedVal === this.keywords) {
        // 去除空格保持不变
        this.searchInfo = trimmedVal;
        return;
      }
      this.keywords = trimmedVal;
      this.type = "search";
      this.restState();
      this.getData();
    },
    // 清空搜索框
    handlerClear() {
      console.log("清空搜索框获取热门标签");
      this.keywords = "";
      this.type = "hot";
      this.restState();
      this.getData();
    },
    // 搜索歌单
    async searchPlaylist() {
      console.log("搜索歌单");
      this.type = "search";
      this.playlistsLoading = true;
      this.showEmpty = false;

      // 更改获取数据方式清空数组
      this.title = "搜索歌单";
      const url = "/search";
      let { data } = await this.$http.get(url, {
        params: {
          type: 1000,
          keywords: this.searchInfo,
          offset: this.offset,
          limit: this.limit,
        },
      });
      data = data.result;
      // 没有更多的数据
      if (!data.hasMore) {
        this.infiniteDisabled = true;
      }
      data = data.playlists;
      // 数据格式化
      const playlists_item = data.map((item) => {
        return {
          name: item.name,
          id: item.id,
          picUrl: item.coverImgUrl + "?param=200y200",
        };
      });
      // 去除重复项
      const uniqueItems = this.filterUniqueItems(
        this.playlists,
        playlists_item
      );
      this.playlists.push(...uniqueItems);
      this.offset += this.limit;
      this.playlistsLoading = false;
    },
    // 展示收藏数据
    getShowColData() {
      console.log("展示收藏数据");
      let myCol = localStorage.getItem("myCol");
      if (myCol) {
        myCol = JSON.parse(myCol);
        this.playlists = myCol.playlists || [];
      }
    },
    // 过滤重复项
    filterUniqueItems(existingItems, allItems) {
      // 从 allItems 中筛选出那些在 existingItems 中不存在的项
      const uniqueItems = allItems.filter((item) => {
        return !existingItems.some(
          (existingItem) => existingItem.id === item.id
        );
      });
      return uniqueItems;
    },
  },
};
</script>

<style scoped lang="less">
.main_wrapper {
  height: 100%;
  display: flex;
  .main {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
    .head {
      height: 46px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        position: relative;
        height: 32px;
        line-height: 32px;
        font-size: 22px;
        padding-left: 10px;
        margin-left: 14px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        line-clamp: 1;
        overflow: hidden;
        color: var(--primary-text-color);
        &::before {
          content: "";
          position: absolute;
          width: 4px;
          height: 20px;
          border-radius: 4px;
          top: 6px;
          left: 0;
          background-color: var(--primar-color);
        }
      }
      .search {
        width: 280px;
        height: 32px;
      }
      .el-input {
        i {
          color: var(--primar-color);
          font-weight: bold;
        }
        /deep/ .el-input__inner {
          border-radius: 20px;
          height: 32px;
        }
      }
    }
    .content {
      position: absolute;
      width: 100%;
      top: 46px;
      bottom: 0;
      .content_i {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding-top: 8px;
        .playlist_item {
          flex: 0 0 118px;
          width: 118px; // 88
          height: 156px; // 84
          margin: 0 16px 20px 16px;
          cursor: pointer;
          transition: transform var(--transition-duration);
          &:hover {
            transform: scale(1.05) translateY(-3px);
          }
          .el-image {
            width: 118px;
            height: 112px;
            border-radius: 12px;
            font-size: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--secondary-bg-color);
          }
          .title {
            width: 100%;
            height: 44px;
            font-size: 12px;
            line-height: 22px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 设置为2表示最多显示两行 */
            line-clamp: 2;
            overflow: hidden;
            color: var(--secondary-text-color);
          }
        }
      }
      // 作为主页展示时
      &.isShow {
        top: 0;
        .content_i {
          padding: 0 18px;
          .playlist_item {
            flex: 0 0 88px;
            width: 88px; // 88
            height: 114px; // 84
            margin: 18px 18px 0 0px;
            .el-image {
              width: 88px;
              height: 84px;
            }
            .title {
              height: 28px;
              line-height: 28px;
              display: block;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: center;
            }
          }
        }
      }
      // 作为展示收藏
      &.isCol {
        top: 0;
        .content_i {
          .playlist_item {
            margin-bottom: 0;
            .title {
              height: 28px;
              line-height: 28px;
              display: block;
              white-space: nowrap;
              text-overflow: ellipsis;
              text-align: center;
            }
          }
        }
      }
    }
    // 无数据
    .empty {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      & > .empty_i {
        width: 134px;
        height: 42px;
        background-color: var(--nav-bg-color);
        border-radius: 12px;
        line-height: 42px;
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 16px;
      }
    }
  }
  .tags {
    flex: 0 0 270px;
    height: 100%;
    margin-left: 14px;
    position: relative;
    .tags_wrap {
      border-radius: 20px;
      background: var(--secondary-bg-color);
      position: absolute;
      overflow: hidden;
      padding: 8px 0 10px 20px;
      width: 250px;
      top: 0;
      bottom: 0;

      .tags_type {
        .tags_title {
          margin: 16px 0 13px 0;
          font-size: 12px;
          color: var(--primary-text-color);
        }
        .tag_item_wrapper {
          display: flex;
          flex-wrap: wrap;
          .tag_item {
            font-size: 10px;
            width: 74px;
            height: 24px;
            border-radius: 8px;
            background-color: var(--button-bg-color);
            text-align: center;
            color: var(--secondary-text-color);
            line-height: 24px;
            margin: 0 8px 8px 0;
            cursor: pointer;

            &:hover {
              color: var(--text-hover-color);
              background-color: var(--primar-color);
              box-shadow: 0 2px 10px var(--secondary-shadow-color);
            }
          }
        }
      }
    }
  }
}
</style>