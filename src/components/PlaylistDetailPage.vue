<template>
  <div class="main">
    <!-- 左侧 -->
    <div class="info" ref="info">
      <!-- 内包裹 -->
      <div class="info_wrap">
        <!-- 头像及按钮 -->
        <div class="info_i_top">
          <!-- el-image -->
          <el-image class="logo" :src="playlistsData.picUrl" fit="cover">
            <div slot="placeholder">
              <span>
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <!-- 按钮 -->
          <div
            class="btn"
            :class="{
              isCol: playlistsData.isCol,
            }"
            @click="toggleCol(playlistsData)"
          >
            <i class="iconfont icon-tx-shizixing"></i>
            {{ playlistsData.isCol ? "取消收藏" : "收藏歌单" }}
          </div>
        </div>
        <!-- 介绍 -->
        <div class="info_i_bottom">
          <p class="name">《{{ playlistsData.name }}》</p>
          <p class="description">{{ playlistsData.description }}</p>
        </div>
      </div>
    </div>
    <!-- 右侧 -->
    <div class="list">
      <!-- 标题 -->
      <div class="head">
        <span>音乐列表</span>
        <!-- 按钮 -->
        <div class="playListBtn" @click.stop="playAlSongs">
          <i class="el-icon-caret-right"></i>
        </div>
      </div>
      <!-- 渲染组件 -->
      <div class="list_content">
        <songs-list
          ref="songsList"
          :opts="{
            type: playlistsData.type,
            id: playlistsData.id,
          }"
        ></songs-list>
      </div>
    </div>
  </div>
</template>

<script>
import songsList from "./SongsList.vue";
export default {
  name: "PlaylistDetailPage",
  components: {
    songsList,
  },
  data() {
    return {
      loading: false,
      playlistsData: {
        id: 0,
        name: "",
        picUrl: "",
        songs: [],
        description: "",
        isCol: false,
        type: "",
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 判断是否为本地收藏
    checkIsCol(item) {
      let myCol = localStorage.getItem("myCol");
      if (myCol) {
        myCol = JSON.parse(myCol);
        return myCol.playlists
          ? myCol.playlists.some((i) => i.id === item.id)
          : false;
      }
      return false;
    },
    // 切换收藏
    toggleCol(item) {
      if (!this.playlistsData.id) return;
      let localMyCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      if (!localMyCol.playlists) {
        localMyCol.playlists = [];
      }
      const index = localMyCol.playlists.findIndex((i) => i.id == item.id);
      if (item.isCol) {
        localMyCol.playlists.splice(index, 1);
        this.$message.success("取消收藏成功！");
        item.isCol = false;
      } else {
        const item_temp = { ...item };
        item_temp.songs = [];
        localMyCol.playlists.push(item_temp);
        this.$message.success("添加收藏成功！");
        item.isCol = true;
      }
      localStorage.setItem("myCol", JSON.stringify(localMyCol));
    },
    // 播放歌单
    playAlSongs() {
      if (this.$refs.songsList) this.$refs.songsList.playEntirePlaylist();
    },
    async getData() {
      const item = this.$route.query;
      this.playlistsData.name = item.name ? item.name : "####";
      this.playlistsData.id = item.id;
      this.playlistsData.picUrl = item.picUrl ? item.picUrl : "";
      try {
        if (this.$route.query.type == "albums") {
          this.playlistsData.type = "alSongs";
          await this.getAlbumsData();
        } else if (this.$route.query.type == "playlist") {
          this.playlistsData.type = "plSongs";
          await this.getPlaylistData();
        }
      } catch (err) {
        console.error(err);
        this.$message.error("获取歌单数据失败！");
      }
    },
    // 获取歌单数据
    async getPlaylistData() {
      console.log("获取歌单信息");
      if (!this.playlistsData.id) return;
      const url = "/playlist/detail";
      const id = this.playlistsData.id;
      let { data } = await this.$http.get(url, {
        params: {
          id: id,
        },
      });
      this.playlistsData.description = data.playlist.description;
      this.playlistsData.isCol = this.checkIsCol(this.playlistsData);
    },
    // 获取专辑数据
    async getAlbumsData() {
      if (!this.playlistsData.id) return;
      console.log("获取专辑详情");
      // /album?id=32311
      const url = "/album";
      const id = this.playlistsData.id;
      let { data } = await this.$http.get(url, {
        params: {
          id: id,
        },
      });
      this.playlistsData.description = data.album.description;
      this.playlistsData.isCol = this.checkIsCol(this.playlistsData);
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  display: flex;
  height: 100%;
  // 个人信息
  .info {
    flex: 1;
    margin-right: 40px;
    position: relative;
    .info_wrap {
      position: absolute;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      // 头部
      .info_i_top {
        width: 100%;
        position: relative;
        z-index: 1;
        flex: 1;
        min-height: 160px;
        max-height: 50%;
        .logo {
          position: absolute;
          bottom: -40px;
          left: 30px;
          width: 200px;
          height: 200px;
          border-radius: 36px;
          z-index: 1;
          font-size: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--secondary-bg-color);
        }
        // 收藏按钮
        .btn {
          position: absolute;
          right: 20px;
          bottom: -48px;
          cursor: pointer;
          width: 136px;
          height: 34px;
          background-color: var(--button-bg-color);
          box-shadow: 0 16px 14px var(--primary-shadow-color);
          letter-spacing: 2px;
          vertical-align: top;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          color: var(--secondary-text-color);
          border-radius: 10px;
          transition: all var(--transition-duration);
          &:hover {
            background-color: var(--primar-color);
            box-shadow: 0 16px 14px var(--secondary-shadow-color);
            transform: translateY(-4px);
            color: var(--text-hover-color);
            & > i {
              color: var(--text-hover-color);
            }
          }
          &.isCol:hover {
            background-color: #ef5350;
            box-shadow: 0 16px 14px #f25a57;
          }
        }
      }
      // 内容区域
      .info_i_bottom {
        border-radius: 20px;
        background-color: var(--secondary-bg-color);
        box-shadow: 1px 1px 4px var(--primary-shadow-color);
        padding: 60px 15px 35px 15px;
        overflow-y: scroll;
        scrollbar-width: none;
        .name {
          font-size: 18px;
          line-height: 30px;
          color: var(--secondary-text-color);
        }
        .description {
          font-size: 12px;
          line-height: 18px;
          color: var(--secondary-text-color);
        }
      }
    }
  }
  // 音乐列表
  .list {
    position: relative;
    flex: 1.5;
    .head {
      position: relative;
      height: 30px;
      padding-left: 14px;
      line-height: 30px;
      font-size: 14px;
      color: var(--primary-text-color);

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
      & > .playListBtn {
        cursor: pointer;
        width: 30px;
        height: 30px;
        text-align: center;
        border-radius: 40%;
        line-height: 30px;
        color: #fff;
        font-size: 22px;
        z-index: 1;
        position: absolute;
        right: 10px;
        top: 18px;
        background: var(--primar-color);
        transition: transform var(--transition-duration);
        &:hover {
          transform: scale(1.05);
        }
      }
    }
    .list_content {
      position: absolute;
      overflow: hidden;
      width: 100%;
      top: 30px;
      bottom: 0;
      border-radius: 16px;
      background: var(--secondary-bg-color);
      overflow: hidden;
    }
  }
}
</style>