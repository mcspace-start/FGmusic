<template>
  <div class="main_wrapper">
    <!-- 头部 -->
    <div class="header">
      <!-- 广告栏一 -->
      <div class="banner_1" ref="banner">
        <div class="banner_i">
          <!-- 轮播图 -->
          <el-carousel
            trigger="click"
            arrow="never"
            :height="carouselHeight + 'px'"
            loop
          >
            <el-carousel-item
              v-for="(item, index) in bannerData.area1"
              :key="index"
            >
              <img :src="item.src" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 广告栏二 -->
      <div class="banner_2">
        <div class="banner_i">
          <!-- 轮播图 -->
          <el-carousel
            v-if="true"
            :interval="5000"
            trigger="click"
            :height="carouselHeight + 'px'"
            arrow="never"
            loop
          >
            <el-carousel-item
              v-for="(item, index) in bannerData.area2"
              :key="index"
            >
              <img :src="item.src" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <!-- 我喜欢的歌 -->
      <div class="my_collection" @click="goToCollection">
        <img src="@/assets/5_1-1.png" alt="" />
        <p>我喜欢的歌</p>
        <div class="playMyCollectionBtn" @click.stop="playMyCollection">
          <i class="el-icon-caret-right"></i>
        </div>
      </div>
      <!-- 关于 -->
      <div class="about" @click="goToAbout">
        <p>
          HELLO .
          <br />
          FGMUSIC
        </p>
        <img src="@/assets/about.png" alt="" />
      </div>
    </div>
    <!-- 展示区域 -->
    <div class="main">
      <!-- 歌单 -->
      <div class="playlist">
        <div class="mian_head">
          <div class="nav">
            <div
              class="nav_item"
              @click="toggleActive('playlist', 'rec')"
              :class="{ active: main_show.playlist == 'rec' }"
            >
              推荐歌单
            </div>
            <div
              class="nav_item"
              @click="toggleActive('playlist', 'trav')"
              :class="{ active: main_show.playlist == 'trav' }"
            >
              旅行歌单
            </div>
          </div>
          <div class="allList" @click="goToAllListPage('playlist')">全部</div>
        </div>
        <div class="main_content">
          <!-- 组件 -->
          <playlist-page
            v-if="true"
            :visAreas="{ head: true, tags: true }"
            :opts="{
              type: main_show.playlist,
              isShow: true,
            }"
            :key="main_show.playlist"
          ></playlist-page>
        </div>
      </div>
      <!-- 歌手 -->
      <div class="artistsList">
        <div class="mian_head">
          <div class="nav">
            <div
              class="nav_item"
              @click="toggleActive('artistsList', 'male')"
              :class="{ active: main_show.artistsList == 'male' }"
            >
              男歌手
            </div>
            <div
              class="nav_item"
              @click="toggleActive('artistsList', 'female')"
              :class="{ active: main_show.artistsList == 'female' }"
            >
              女歌手
            </div>
            <div
              class="nav_item"
              @click="toggleActive('artistsList', 'band')"
              :class="{ active: main_show.artistsList == 'band' }"
            >
              乐队
            </div>
          </div>
          <div class="allList" @click="goToAllListPage('artistsList')">
            全部
          </div>
        </div>
        <!-- 组件渲染 -->
        <div class="main_content">
          <artists-list-page
            v-if="true"
            :visAreas="{
              head: true,
            }"
            :opts="{
              type: 'show',
              gender: main_show.artistsList,
              isShow: true,
            }"
            :key="main_show.artistsList"
          ></artists-list-page>
        </div>
      </div>
      <!-- 其他 -->
      <div class="other">
        <!-- 头部 选项及按钮 -->
        <div class="mian_head">
          <!-- 选项 -->
          <div class="nav">
            <div
              class="nav_item"
              @click="toggleActive('other', 'newSongs')"
              :class="{ active: main_show.other == 'newSongs' }"
            >
              新歌推荐
            </div>
            <div
              class="nav_item"
              @click="toggleActive('other', 'hist')"
              :class="{ active: main_show.other == 'hist' }"
            >
              播放历史
            </div>
          </div>
          <!-- 按钮 -->
          <div class="buttons">
            <!-- 清空历史 -->
            <div
              class="clearBtn"
              v-show="main_show.other == 'hist' && playHistory.length"
              @click="clearPlayHist"
            >
              <i class="iconfont icon-shanchu"></i>
            </div>
            <!-- 播放按钮 -->
            <div class="playBtn" @click="playList">
              <i class="el-icon-caret-right"></i>
            </div>
          </div>
        </div>
        <!-- 列表组件渲染 songsList -->
        <div class="main_content">
          <keep-alive>
            <songs-list
              v-if="true"
              ref="songsList"
              :key="main_show.other"
              :showType="{ type: main_show.other }"
              :opts="{
                type: main_show.other,
              }"
            ></songs-list>
          </keep-alive>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import PlaylistPage from "../components/PlaylistPage.vue";
import ArtistsListPage from "../components/ArtistsListPage.vue";
import SongsList from "../components/SongsList.vue";

import { mapActions, mapGetters } from "vuex";
export default {
  name: "MsicLibrary",
  components: {
    PlaylistPage,
    ArtistsListPage,
    SongsList,
  },
  data() {
    return {
      bannerData: {
        area1: [
          // src:""
        ],
        area2: [],
      },
      // 轮播图高度
      carouselHeight: 0,
      Obs: null, // 监控轮播图高度
      // 展示栏配置
      main_show: {
        playlist: "rec", // rec || trve
        artistsList: "male", // maleSinger || femaleSinger || grupSinger
        other: "newSongs", // newSongs || hist
      },
    };
  },
  computed: {
    ...mapGetters(["playHistory", "playQueue"]),
  },
  created() {
    // 获取轮播图数据
    this.getBannerData();
  },
  mounted() {
    // 监听banner高度
    this.Obs = new ResizeObserver((entries) => {
      let height = 0;
      for (let entry of entries) {
        height = entry.contentRect.height;
        this.carouselHeight = height;
      }
    });
    if (this.$refs.banner) this.Obs.observe(this.$refs.banner);
  },
  beforeDestroy() {
    if (this.Obs) this.Obs.disconnect();
  },
  methods: {
    ...mapActions(["clearPlayHistory", "pushToPlaylist", "updateCurrentTrack"]),
    // 去收藏页面
    goToCollection() {
      this.$router.push({
        name: "Collection",
      });
    },
    // 去关于页面
    goToAbout() {
      this.$router.push({
        name: "About",
      });
    },
    // 跳转至详情列表
    goToAllListPage(page) {
      if (page == "playlist") {
        this.$router.push({
          name: "PlaylistPage",
        });
      } else if (page == "artistsList") {
        this.$router.push({
          name: "ArtistsListPage",
        });
      }
    },
    // 展示区nav的切换
    toggleActive(page, active) {
      this.main_show[page] = active;
    },
    // 清空历史播放
    clearPlayHist() {
      this.$confirm("确定清空播历史吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "messageBox",
      })
        .then(() => {
          this.clearPlayHistory();
        })
        .catch(() => {});
    },
    // 播放新歌推荐和播放历史
    playList() {
      // 调用组件内方法
      if (this.$refs.songsList) this.$refs.songsList.playEntirePlaylist();
    },
    // 播放我的喜欢
    async playMyCollection() {
      const myCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      // 如果喜欢列表为空，直接提示并返回
      if (!myCol.songs || !myCol.songs.length) {
        return this.$message.info("喜欢列表为空！");
      }
      // 检查是否需要更新播放队列
      const isQueueChanged = this.compareArrays(myCol.songs, this.playQueue);
      // 等待更新歌曲的可播放状态
      try {
        await this.checkPlayable(myCol.songs);
      } catch (err) {
        return this.$message.error("检查播放源失败！");
      }
      // 根据是否需要更新播放队列，决定播放逻辑
      if (!isQueueChanged) {
        this.pushToPlaylist([...myCol.songs]); // 更新播放队列
        this.updateCurrentTrack(-1); // 设置播放索引为第一首
      } else {
        this.updateCurrentTrack(-2); // 重新播放第一首
      }
    },
    // 获取轮播图数据
    async getBannerData() {
      const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

      try {
        const url = "/banner";
        const type = 0;
        let { data } = await this.$http.get(url, {
          params: {
            type: type,
          },
        });
        data = data.banners;
        // 格式化数据
        const bannerData_temp = data.map((item) => {
          return {
            src: item.imageUrl + "?param=400y150",
          };
        });
        this.bannerData.area1 = bannerData_temp.slice(0, 4);
        this.bannerData.area2 = shuffleArray([...bannerData_temp]).slice(0, 4);
      } catch (err) {
        console.log(err);
        return this.$message.error("获取轮播图数据失败！");
      }
    },
    // 判断是否数组相同
    compareArrays(arr1, arr2) {
      // 如果数组长度不同，直接返回 false
      if (arr1.length !== arr2.length) return false;
      // 创建一个新数组，存储 arr1 中的 id
      const ids1 = arr1.map((item) => item.id);
      // 遍历 arr2，检查每个 id 是否在 ids1 中
      for (let i = 0; i < arr2.length; i++) {
        if (ids1.indexOf(arr2[i].id) === -1) {
          return false;
        }
      }
      return true;
    },
    // 检查是否可播放
    async checkPlayable(arr) {
      const ids = arr.map((i) => i.id).join(",");
      const url = "/song/url";
      const { data: res } = await this.$http.get(url, {
        params: {
          id: ids,
        },
      });
      arr.forEach((itemA) => {
        const itemB = res.data.find((itemB) => itemB.id === itemA.id);
        itemA.url = itemB.url;
        if (itemB.url === null) {
          itemA.isPlayable = false;
        }
      });
    },
  },
};
</script>
  
<style scoped lang="less">
.main_wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    flex: 1 1 25%;
    display: flex;
    justify-content: space-between;
    margin: 0 -10px;
    margin-bottom: 35px;
    & > div {
      border-radius: 20px;
      overflow: hidden;
      margin: 0 10px;
    }
    .banner_1,
    .banner_2 {
      position: relative;
      cursor: pointer;
      background-color: var(--secondary-bg-color);
      & .banner_i {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: transform 0.3s;
        &:hover {
          transform: scale(1.05);
        }
      }
      & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .banner_1 {
      width: 240px;
    }
    .banner_2 {
      width: 318px;
    }
    .my_collection {
      cursor: pointer;
      width: 160px;
      position: relative;
      overflow: hidden;
      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
      }
      &::before {
        z-index: 1;
        background: linear-gradient(
          to bottom,
          rgb(62, 62, 62),
          rgba(0, 0, 0, 0.1)
        );
      }
      &::after {
        z-index: 1;
        background: linear-gradient(
          to bottom,
          rgb(62, 62, 62),
          rgba(0, 0, 0, 0.2)
        );
        opacity: 0;
        transition: opacity var(--transition-duration);
      }
      &:hover {
        &::after {
          opacity: 1;
        }
      }
      img {
        position: absolute;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      p {
        position: absolute;
        width: 100%;
        height: 22px;
        font-size: 22px;
        line-height: 22px;
        text-align: center;
        color: #fff;
        font-weight: bold;
        text-align: center;
        margin-top: 18px;
        z-index: 2;
      }
      .playMyCollectionBtn {
        position: absolute;
        right: 10%;
        bottom: 10%;
        width: 30px;
        height: 30px;
        border-radius: 40%;
        text-align: center;
        line-height: 30px;
        color: #fff;
        font-size: 22px;
        z-index: 2;
        background: var(--primar-color);
        transition: transform var(--transition-duration);
        &:hover {
          transform: scale(1.05);
        }
      }
    }
    .about {
      cursor: pointer;
      width: 280px;
      flex: 0 0 280px;
      background-color: var(--secondary-bg-color);
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        position: absolute;
        right: 5%;
        bottom: 0;
        height: 80%;
      }
      p {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        color: var(--primar-color);
      }
    }
  }
  .main {
    flex: 1 1 75%;
    margin-top: 34px;
    display: flex;
    margin: 0 -10px;
    & > div {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      margin: 0 10px;
      .mian_head {
        height: 32px;
        width: 100%;
        position: relative;
        margin-bottom: 4px;
        .nav {
          position: absolute;
          left: 6px;
          top: 0;
          display: flex;
          background-color: var(--nav-bg-color);
          color: var(--secondary-text-color);
          height: 30px;
          justify-content: flex-start;
          align-items: center;
          border-radius: 8px;
          white-space: nowrap;
          .nav_item {
            font-size: 12px;
            padding: 9px 20px;
          }
          .nav_item.active {
            position: relative;
            color: var(--secondary-bg-color);
            background-color: var(--primar-color);
            border-radius: inherit;
            &::before {
              content: "";
              position: absolute;
              top: 8px;
              left: 8px;
              height: 12px;
              width: 4px;
              background-color: var(--secondary-bg-color);
              border-radius: 4px;
            }
          }
        }
        .allList {
          position: absolute;
          right: 10px;
          top: 4px;
          background-color: var(--button-bg-color);
          font-size: 12px;
          width: 44px;
          color: var(--secondary-text-color);
          transition: background var(--transition-duration);
          cursor: pointer;
          height: 24px;
          line-height: 25px;
          text-align: center;
          border-radius: 8px;
          &:hover {
            background-color: var(--secondary-button-hover-color);
          }
        }
      }
      .main_content {
        background-color: var(--secondary-bg-color);
        border-radius: 10px;
        overflow: hidden;
        flex-grow: 1;
      }
    }
    // 歌单组件
    .playlist {
      flex: 1.5;
    }
    // 歌手组件
    .artistsList {
      flex: 1;
    }
    // 其他页 固定宽度
    .other {
      flex: 0 0 280px;
      .buttons {
        height: 30px;
        position: absolute;
        top: 12px;
        right: 10px;
        display: flex;
        z-index: 1;
        .clearBtn {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 40%;
          text-align: center;
          font-weight: bold;
          background: var(--nav-bg-color);
          color: var(--primary-text-color);
          transition: background var(--transition-duration);
          line-height: 30px;
          &:hover {
            background-color: var(--secondary-button-hover-color);
          }
        }
        .playBtn {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 40%;
          text-align: center;
          line-height: 30px;
          color: #fff;
          font-size: 22px;
          margin-left: 12px;
          background: var(--primar-color);
          transition: transform var(--transition-duration);
          &:hover {
            transform: scale(1.05);
          }
        }
      }
    }
  }
}
</style>