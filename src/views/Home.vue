<template>
  <div class="app">
    <!-- 整个主体 -->
    <el-container
      class="full-screen"
      :class="{
        dark: isDark,
      }"
    >
      <!-- header -->
      <el-header height="36px">
        <!-- 搜索框 -->
        <div class="header_left">
          <!-- logo -->
          <div class="logo">
            <img src="@/assets/logo.png" alt="" />
            <p>方格音乐</p>
          </div>
          <!-- 返回前进 -->
          <div class="historyButton">
            <i class="el-icon-arrow-left" @click="backHistory"></i>
            <i class="el-icon-arrow-right" @click="forwardHistory"></i>
          </div>
          <!-- 搜索框  -->
          <el-input
            width="200px"
            placeholder=" 搜索音乐"
            v-model="searchInfo.querySearch"
            clearable
            ref="input"
            @change="search"
            @input="getSearchSuggest"
            @focus="openInputDialog"
            @clear="handleClearSearch"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-search"
              style="cursor: pointer"
            ></i>
          </el-input>
          <!-- 搜索框 -->
          <transition name="fade" tag="div">
            <div
              class="inputDialog"
              v-show="isShowInnputDialog"
              ref="inputDialog"
            >
              <!-- 搜索建议 -->
              <div
                class="searchSuggest"
                v-if="searchInfo.searchSuggest.length !== 0"
              >
                <div class="search_head">
                  <p class="search_head_title">
                    <span class="tilte_i"></span>大家都在搜...
                  </p>
                </div>
                <div
                  class="search_content"
                  :class="{ load: searchInfo.hotSearch.length == 0 }"
                >
                  <!-- 关键字列表 -->
                  <div
                    class="item"
                    v-for="item in searchInfo.searchSuggest"
                    :key="item.id"
                    @click="search(item.keywords)"
                  >
                    {{ item.keywords }}
                  </div>
                </div>
              </div>
              <!-- 搜索记录 -->
              <div
                class="searchHistory"
                v-show="
                  this.searchInfo.searchHistory.length !== 0 &&
                  searchInfo.searchSuggest.length == 0
                "
              >
                <div class="search_head">
                  <p class="search_head_title">
                    <span class="tilte_i"></span>搜索记录
                  </p>
                  <span class="clear" @click.stop="clearSearchHistory"
                    ><i class="el-icon-delete"></i
                  ></span>
                </div>
                <div class="search_content">
                  <div
                    class="item"
                    v-for="(item, index) in searchInfo.searchHistory"
                    :key="index"
                    @click="search(item)"
                  >
                    {{ item }}
                  </div>
                </div>
              </div>
              <!-- 热门搜索 -->
              <div
                class="hotSearch"
                v-if="
                  searchInfo.hotSearch.length !== 0 &&
                  searchInfo.searchSuggest.length == 0
                "
              >
                <div class="search_head">
                  <p class="search_head_title">
                    <span class="tilte_i"></span>热门搜索
                  </p>
                </div>
                <div
                  class="search_content"
                  :class="{ load: searchInfo.hotSearch.length == 0 }"
                >
                  <!-- 热搜关键字列表 -->
                  <div
                    class="item"
                    v-for="item in searchInfo.hotSearch"
                    :key="item.id"
                    @click="search(item.keywords)"
                  >
                    {{ item.keywords }}
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <!-- 右侧按钮 -->
        <div class="header_right">
          <span
            @click="toggleFullScreen"
            class="fullScreenBtn"
            title="切换全屏模式"
            >全</span
          >
          <my-switch
            v-model="isDarkMode"
            @change="switchChange"
            title="暗黑模式"
          ></my-switch>
        </div>
      </el-header>
      <!-- 侧边栏和主体 -->
      <el-container>
        <!-- 左侧菜单 -->
        <el-aside width="190px">
          <div class="menu_wrapper">
            <el-menu
              collapse
              :default-active="activeIndex"
              @select="handleMenuSelect"
            >
              <!-- 渲染menuItems -->
              <el-menu-item
                :index="item.path"
                v-for="item in menuList"
                :key="item.path"
              >
                <el-badge is-dot :hidden="!badges[item.path]">
                  <i class="iconfont" :class="item.icon"></i>
                </el-badge>
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <!-- 保持活性 -->
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive" />
        </el-main>
      </el-container>
      <!-- 播放页 -->
      <transition name="slide">
        <player v-show="playerVisible"></player>
      </transition>
      <!-- footer 播放组件 -->
      <el-footer height="68px">
        <!-- 音乐组件 -->
        <audio-player @toggleDrawer="showDrawer"></audio-player>
      </el-footer>
    </el-container>
    <!-- 右侧列表 -->
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      direction="rtl"
      :with-header="false"
      :size="310"
      custom-class="drawer"
    >
      <div class="drawer_content">
        <!-- 标题及按钮 -->
        <div class="drawer_head">
          <div class="title">
            播放列表<span>{{ playQueue.length }}</span>
          </div>
          <div class="buttons">
            <div class="clear" @click="clearPlist">
              <i class="iconfont icon-shanchu" title="清空列表"></i>
            </div>
            <div class="close" title="收起列表" @click="drawer = false">
              <i class="iconfont icon-iconfontzhizuobiaozhun023135"></i>
            </div>
          </div>
        </div>
        <!-- 内容 -->
        <div class="drawer_content_i">
          <songs-list
            :opts="{
              type: 'playQ',
            }"
            ref="songsList"
          ></songs-list>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
  
<script>
import AudioPlayer from "@/components/AudioPlayer.vue";
import SongsList from "@/components/SongsList.vue";
import Player from "@/components/Player.vue";
import MySwitch from "@/components/MySwitch.vue";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    SongsList,
    AudioPlayer,
    Player,
    MySwitch,
  },
  data() {
    return {
      searchInfo: {
        querySearch: "",
        inputDialog: false, // 控制搜索框显示
        searchHistory: [], // 搜索历史
        hotSearch: [], // 热门搜索
        searchSuggest: [], // 搜索建议
      },
      activePath: "/MusicLibrary", // 页面激活
      drawer: false, // 播放列表
      isDarkMode: false,
      activeIndex: "/About",
      menuList: [
        {
          path: "MusicLibrary",
          icon: "icon-CD",
          title: "音乐库",
        },
        {
          path: "Ranking",
          icon: "icon-youyinpin",
          title: "排行榜",
        },
        {
          path: "RankingLibrary",
          icon: "icon-yinle",
          title: "更多榜单",
          badge: false,
        },
        {
          path: "Collection",
          icon: "icon-xihuan1",
          title: "我的喜欢",
        },
        {
          path: "DownloadList",
          icon: "icon-download",
          title: "下载列表",
        },
        {
          path: "Settings",
          icon: "icon-shezhi",
          title: "设置",
        },
        {
          path: "About",
          icon: "icon-about",
          title: "关于",
        },
      ],
    };
  },
  created() {
    // 加载本地缓存设置项
    this.loadLocalData();
    this.activeIndex = this.menuList[0].path;
  },
  mounted() {
    document.body.addEventListener("mousedown", this.closeInputDialog);
  },
  beforeDestroy() {
    document.body.removeEventListener("mousedown", this.closeInputDialog);
  },
  // 路由更新守卫
  beforeRouteUpdate(to, from, next) {
    // 根据跳转路由激活菜单项
    const inMenuList = this.menuList.some((item) => item.path === to.name);
    if (inMenuList) {
      this.activeIndex = to.name;
    }
    next();
  },
  computed: {
    ...mapGetters(["playQueue", "playerVisible", "badges", "isDark"]),
    // 控制输入框显示
    isShowInnputDialog() {
      if (!this.searchInfo.inputDialog) return false;
      // 搜索建议，热搜和搜索历史必须有一个才显示搜索框
      return (
        this.searchInfo.searchSuggest.length > 0 ||
        this.searchInfo.searchHistory.length > 0 ||
        this.searchInfo.hotSearch.length > 0
      );
    },
  },
  methods: {
    ...mapActions([
      "clearPlayQueue",
      "setSearchKeywords",
      "updateCurrentTrack",
      "setIsDark",
      "setSettings",
      "setPlayHistory",
    ]),
    // 加载本地缓存
    loadLocalData() {
      // 判断是否为暗黑模式
      const isDarkMode = JSON.parse(
        localStorage.getItem("isDarkMode") || "false"
      );
      this.setIsDark(isDarkMode);
      this.isDarkMode = isDarkMode;
      // 加载全局设置项，若无缓存则默认为空对象
      const settings = JSON.parse(localStorage.getItem("settings")) || "{}";
      this.setSettings(settings);
      // 搜索记录
      const searchHistory = JSON.parse(
        localStorage.getItem("searchHistory") || "[]"
      );
      this.searchInfo.searchHistory = searchHistory;
      // 播放历史
      const playHistory = JSON.parse(
        localStorage.getItem("playHistory") || "[]"
      );
      this.setPlayHistory(playHistory);
    },
    // 菜单项跳转
    handleMenuSelect(path) {
      this.$router.push("/" + path).catch(() => {});
    },
    handleClearSearch() {
      this.$router.push("/" + this.menuList[0].path).catch(() => {});
    },
    // 路由前进
    forwardHistory() {
      // console.log("前进");
      this.$router.go(1);
    },
    // 路由后退
    backHistory() {
      // console.log("后退");
      this.searchInfo.querySearch = "";
      this.$router.go(-1);
    },
    // 清空搜索历史
    clearSearchHistory() {
      this.searchInfo.searchHistory.splice(
        0,
        this.searchInfo.searchHistory.length
      );
      this.$message({
        type: "info",
        message: "清空搜索记录",
        duration: 1000,
      });
      localStorage.removeItem("searchHistory");
    },
    // 展开搜索框
    async openInputDialog() {
      this.searchInfo.inputDialog = true;
      try {
        await this.getHotSearchList();
      } catch (err) {
        console.log("获取热门搜索失败");
        console.log(err);
      }
    },
    // 关闭搜索框
    closeInputDialog(event) {
      if (!this.searchInfo.inputDialog) return;
      const isClickInside =
        this.$refs.input.$el.contains(event.target) ||
        this.$refs.inputDialog.contains(event.target);
      if (!isClickInside) {
        this.searchInfo.inputDialog = false;
      }
    },
    // 获取搜索建议
    async getSearchSuggest() {
      const keywords = this.searchInfo.querySearch.trim();
      if (!keywords) {
        this.searchInfo.searchSuggest = [];
        return;
      }
      // 发送请求
      try {
        const url = "/search/suggest";
        const { data } = await this.$http.get(url, {
          params: { keywords },
        });
        this.searchInfo.searchSuggest = (data.result.songs || []).map(
          (item) => ({
            id: item.id,
            keywords: item.name,
          })
        );
      } catch (error) {
        console.error("获取搜索建议失败！", error);
      }
    },
    // 获取热门搜索
    async getHotSearchList() {
      try {
        const url = "/search/hot";
        const { data } = await this.$http.get(url);
        this.searchInfo.hotSearch = (data.result.hots || []).map(
          (item, index) => ({
            id: index,
            keywords: item.first,
          })
        );
      } catch (error) {
        console.error("获取热门搜索失败！", error);
      }
    },
    // 展开播放列表
    showDrawer() {
      this.drawer = true;
    },
    // 暗黑模式切换
    switchChange(s) {
      // 同步 vuex 用于App.vue
      this.setIsDark(s);
      localStorage.setItem("isDarkMode", s);
    },
    exitFullScreen() {
      if (document.exitFullscreen) {
        return document.exitFullscreen().catch(() => {});
      } else if (document.mozCancelFullScreen) {
        return document.mozCancelFullScreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        return document.webkitExitFullscreen().catch(() => {});
      } else if (document.msExitFullscreen) {
        return document.msExitFullscreen().catch(() => {});
      } else {
        console.error("浏览器不支持退出全屏API");
      }
    },
    enterFullScreen() {
      // 获取文档的根元素
      const docElement = document.documentElement;
      // 检查浏览器是否支持全屏 API
      if (docElement.requestFullscreen) {
        // 标准浏览器
        docElement.requestFullscreen();
      } else if (docElement.mozRequestFullScreen) {
        // Firefox
        docElement.mozRequestFullScreen();
      } else if (docElement.webkitRequestFullscreen) {
        // Chrome, Safari
        docElement.webkitRequestFullscreen();
      } else if (docElement.msRequestFullscreen) {
        // IE11
        docElement.msRequestFullscreen();
      } else {
        console.error("浏览器不支持全屏API");
      }
    },
    // 切换全屏模式
    toggleFullScreen() {
      this.exitFullScreen();
      this.enterFullScreen();
    },
    // 清空当前播放列表
    clearPlist() {
      if (!this.playQueue.length) return;
      this.$confirm("确定清空播放列表吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "messageBox",
      })
        .then(() => {
          this.clearPlayQueue();
          this.updateCurrentTrack(0);
        })
        .catch(() => {});
    },
    // 发起搜索
    search(val) {
      if (val.trim() == "") {
        this.searchInfo.querySearch = "";
        this.searchInfo.inputDialog = false;
        return;
      }
      this.searchInfo.querySearch = val.trim();
      this.searchInfo.inputDialog = false;
      // 构建路由信息
      const route = {
        name: "SearchResult",
        query: {
          keywords: this.searchInfo.querySearch,
        },
      };
      this.$router.push(route).catch(() => {});
      // 失焦
      this.$refs.input.blur();
      // 添加至历史搜索
      this.addSearchHistory(val);
    },
    // 添加搜索历史
    addSearchHistory(keywords) {
      // 去除相同项，保留当前值
      const searchHistory = this.searchInfo.searchHistory;
      const index = searchHistory.indexOf(keywords);
      if (index !== -1) {
        searchHistory.splice(index, 1);
      }
      // 限制历史记录数量为10条
      if (searchHistory.length >= 10) {
        searchHistory.pop();
      }
      searchHistory.unshift(keywords);
      // 写入本地缓存
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    },
  },
};
</script>
  
<style scoped lang="less">
.app {
  background-color: var(--primary-bg-color);
  // width: 100vw;
  height: 100vh;
  // 整个主体区域
  .full-screen {
    width: 100%;
    height: 100%;
    min-height: 590px;
    position: relative;
    overflow: hidden;
    // 头部区域
    .el-header {
      margin: 12px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 60px;

      .header_left {
        display: flex;
        align-items: center;
        position: relative; // 用于input dialog

        .logo {
          width: 150px;
          height: 30px;
          display: flex;
          align-items: center;
          img {
            width: 30px;
            height: 30px;
          }
          p {
            font-size: 18px;
            font-weight: bold;
            color: var(--primary-text-color);
          }
        }
        .historyButton {
          width: 62px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          & i {
            width: 25px;
            height: 25px;
            text-align: center;
            line-height: 25px;
            border-radius: 8px;
            transition: background var(--transition-duration);
            color: var(--primary-text-color);
            &:hover {
              background: var(--primary-button-hover-color);
            }
          }
        }
        .el-input {
          width: 284px;
          margin: 0 18px 0 10px;
          & i {
            color: var(--primar-color);
            font-weight: bold;
          }
        }

        // 搜索框动画
        .fade-enter-active,
        .fade-leave-active {
          transition: all var(--transition-duration);
        }
        .fade-enter,
        .fade-leave-to {
          transform: translateY(-14px); // 进入时从上往下
          opacity: 0;
        }
        .fade-enter-to,
        .fade-leave-from {
          transform: translateY(0px);
          opacity: 1;
        }
        // 搜索框
        .inputDialog {
          position: absolute;
          top: 50px;
          left: 220px;
          width: 300px;
          z-index: 3;
          border-radius: 20px;
          background: var(--secondary-bg-color);
          box-shadow: 1px 1px 3px #ccc;
          padding: 20px 25px;

          & > div {
            margin-bottom: 5px;
          }
          .search_head {
            height: 25px;
            line-height: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            // background-color: #aaa;
            .tilte_i {
              display: block;
              height: 14px;
              width: 0px;
              float: left;
              margin-right: 10px;
              border: 2px solid var(--primar-color);
              border-radius: 4px;
              color: var(--primary-text-color);
            }
            .search_head_title {
              height: 18px;
              line-height: 18px;
              font-size: 16px;
              color: var(--primary-text-color);
            }
            .clear {
              display: block;
              height: 25px;
              width: 25px;
              text-align: center;
              line-height: 25px;
              border-radius: 10px;
              font-size: 14px;
              cursor: pointer;
              color: var(--secondary-text-color);
              transition: background var(--transition-duration);
              &:hover {
                background: var(--primary-button-hover-color);
              }
            }
          }
          .search_content {
            display: flex;
            flex-wrap: wrap;
            color: var(--secondary-text-color);
            .item {
              height: 24px;
              background: var(--button-bg-color);
              font-size: 12px;
              line-height: 24px;
              text-align: center;
              margin-right: 8px;
              padding: 0 15px;
              margin: 8px 8px 8px 0;
              border-radius: 10px;
              color: var(--secondary-text-color);
              cursor: pointer;
              transition: all var(--transition-duration);
              &:hover {
                color: var(--text-hover-color);
                background-color: var(--primar-color);
                box-shadow: 0 3px 10px var(--secondary-shadow-color);
              }
            }
            &.load {
              height: 60px;
            }
          }
        }
      }
      .header_right {
        display: flex;
        align-items: center;
        .fullScreenBtn {
          color: var(--secondary-text-color);
          margin-right: 10px;
          cursor: pointer;
          width: 25px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          font-size: 16px;
          // background: var(--button-bg-color);
          background: var(--secondary-bg-color);
          border: 1px solid var(--primary-shadow-color);
          border-radius: 6px;
          transition: all var(--transition-duration);
          &:hover {
            color: var(--player-control-txt-clolr);
            background: var(--secondary-button-hover-color);
          }
        }
      }
    }
    // 左侧菜单
    .el-aside {
      display: flex;
      justify-content: center; /* 水平居中 */
      align-items: center; /* 垂直居中 */
      flex-shrink: 0; /* 禁止缩放 */

      .menu_wrapper {
        background: var(--secondary-bg-color);
        padding: 10px 18px;
        border-radius: 22px;
      }
      .el-menu {
        background-color: transparent;
        border: none;
        .el-menu-item {
          border-radius: 16px;
          width: 62px;
          margin: 14px 0;
          height: 50px;
          transition: transform var(--transition-duration),
            background var(--transition-duration);
          line-height: 50px;
          & i {
            line-height: 50px;
            vertical-align: top;
            font-size: 22px;
            color: var(--primary-text-color);
          }
          &:hover {
            background-color: var(--primar-color);
            & i {
              color: var(--secondary-bg-color);
            }
          }
          &:active {
            transform: scale(1.1);
          }
          &.is-active {
            background-color: var(--primar-color);
            & i {
              color: var(--primary-bg-color);
            }
          }
        }
      }
    }
    // 主体
    .el-main {
      padding-top: 8px;
    }
    // 播放页动画
    .slide-enter-active {
      transition: transform 0.4s ease-out;
      transform-origin: bottom;
    }
    .slide-leave-active {
      transform-origin: bottom;
      transition: transform 0.4s ease-in;
    }
    .slide-enter,
    .slide-leave-to {
      transform: translateY(100%);
    }
    .slide-enter-to,
    .slide-leave {
      transform: translateY(0);
    }
    // 底部播放组件
    .el-footer {
      background-color: var(--secondary-bg-color);
      padding: 0;
      height: 68px;
      z-index: 3;
    }
  }
  // 右侧播放列表
  .drawer_content {
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: var(--primary-bg-color);
    // 头部及标题
    .drawer_head {
      border-bottom: 2px var(--secondary-bg-color) solid;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 22px 5px 20px;
      .title {
        position: relative;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        color: var(--primary-text-color);
        padding-left: 10px;

        &::before {
          content: "";
          display: block;
          width: 4px;
          height: 18px;
          background-color: var(--primar-color);
          position: absolute;
          left: 0;
          top: 6px;
          border-radius: 4px;
        }
        & > span {
          margin-left: 18px;
          font-size: 12px;
          color: var(--secondary-text-color);
        }
      }

      .buttons {
        display: flex;
        & > div {
          color: var(--secondary-text-color);
          transition: color var(--transition-duration);
        }
        & > div:hover {
          cursor: pointer;
          color: var(--primar-color);
        }
        .clear {
          margin-right: 16px;
          & > i {
            font-size: 14px;
          }
        }
        .close {
          & > i {
            font-size: 12px;
          }
        }
      }
    }
    .drawer_content_i {
      height: 100%;
    }
  }
}
</style>