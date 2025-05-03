<template>
  <div class="main_wrapper">
    <!-- 个人简介 -->
    <div class="bio">
      <div class="bio_head">
        <!-- 歌手头像和按钮 -->
        <div class="avatar_wrapper">
          <!-- 头像 -->
          <el-image class="avatar" :src="arInfo.picUrl" fit="cover">
            <!-- 加载动画 -->
            <div slot="placeholder" class="image-slot box">
              <span>
                <i class="el-icon-loading"></i>
              </span>
            </div>
            <!-- 错误动画 -->
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <!-- 收藏歌手按钮 -->
          <div class="colBtn" @click="toggleCol(arInfo)">
            <i :class="arInfo.isCol ? 'el-icon-check' : 'el-icon-plus'"></i>
          </div>
        </div>
        <!-- 歌手名称 -->
        <div class="name">{{ arInfo.name ? arInfo.name : "####" }}</div>
      </div>
      <!-- 个人介绍 -->
      <div
        class="description"
        v-loading="loading"
        element-loading-background="var(--loading-bg-color)"
      >
        <!-- 介绍内容 -->
        <div class="content" v-if="!showRetry">
          <p v-for="(line, inedx) in arInfo.description" :key="inedx">
            {{ line }}
          </p>
        </div>
        <!-- retry -->
        <retry v-else @retry="getData"></retry>
      </div>
    </div>
    <!-- 音乐列表 -->
    <div class="songList">
      <div class="head">
        <span>TA的音乐</span>
        <!-- 按钮 -->
        <div class="playListBtn global-scale" @click.stop="playArSongs()">
          <i class="el-icon-caret-right"></i>
        </div>
      </div>
      <!-- 列表 -->
      <div class="list_content">
        <songsList
          ref="songsList"
          :opts="{
            type: 'aSongs',
            id: arInfo.id,
          }"
        ></songsList>
      </div>
    </div>
    <!-- 专辑列表 -->
    <div class="albums">
      <div class="head">
        <span>TA的专辑</span>
      </div>
      <!-- 列表 -->
      <div class="list_content">
        <albumsList :id="arInfo.id"></albumsList>
      </div>
    </div>
  </div>
</template>

<script>
import albumsList from "./AlbumsList.vue";
import Retry from "./Retry.vue";
import songsList from "./SongsList.vue";
export default {
  name: "ArtistsDetailPage",
  components: {
    songsList,
    albumsList,
    Retry,
  },
  data() {
    return {
      arInfo: {
        id: 0, // 歌手id
        name: "",
        picUrl: "",
        description: "",
        isCol: false, //是否收藏该歌手
      },
      showRetry: false,
      loading: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    // 收藏歌手
    toggleCol(item) {
      if (!item.id) return;
      let localMyCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      const arr = localMyCol.artists || [];
      const index = arr.findIndex((i) => i.id == item.id);
      if (item.isCol) {
        arr.splice(index, 1);
        this.$message.success("取消收藏成功！");
        item.isCol = false;
      } else {
        arr.push({
          id: item.id,
          name: item.name,
          picUrl: item.picUrl,
        });
        this.$message.success("添加收藏成功！");
        item.isCol = true;
      }
      localMyCol.artists = arr;
      localStorage.setItem("myCol", JSON.stringify(localMyCol));
    },
    // 判断是否为本地收藏歌曲
    checkIsCol(id) {
      let myCol = localStorage.getItem("myCol");
      if (myCol) {
        myCol = JSON.parse(myCol);
        return myCol.artists
          ? myCol.artists.some((i) => i.id === Number(id))
          : false;
      }
      return false;
    },
    // 开始获取数据
    async getData() {
      if (!Object.keys(this.$route.query)) return;
      this.loading = true;
      const item = this.$route.query;
      this.arInfo.id = Number(item.id);
      this.arInfo.picUrl = item.picUrl;
      this.arInfo.name = item.name;
      this.arInfo.isCol = this.checkIsCol(item.id);
      try {
        await this.getArDetail(item.id);
      } catch (err) {
        console.error(err);
        this.showRetry = true;
        this.$message.error("获取歌手详情数据失败!");
      }
      this.loading = false;
    },
    // 获取歌手详情
    async getArDetail(id) {
      const url = "/artist/detail";
      let { data } = await this.$http.get(url, {
        params: {
          id: id,
        },
      });
      let desc = data.data.artist.briefDesc;
      // 以\n分割成数组
      const descArr = desc.split(/\n/);
      this.arInfo.description = descArr;
    },
    // 播放歌手歌曲
    playArSongs() {
      console.log("播放歌手歌曲");
      if (this.$refs.songsList) this.$refs.songsList.playEntirePlaylist();
    },
  },
};
</script>

<style lang="less" scoped>
.main_wrapper {
  height: 100%;
  display: flex;
  margin: 0 -20px;
  & > div {
    flex: 1;
    margin: 0 20px;
  }
  // 个人简介
  .bio {
    position: relative;
    @headHeight: 68px;
    // 头部
    .bio_head {
      position: absolute;
      height: @headHeight;
      display: flex;
      align-items: center;
      padding-left: 30px;
      width: 100%;
      // 头像和按钮
      .avatar_wrapper {
        position: relative;
        z-index: 1;
        width: 100px;
        height: 100px;
        .avatar {
          width: 96px;
          height: 96px;
          border: 2px solid var(--secondary-text-color);
          border-radius: 50%;
          transform: translateY(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--secondary-bg-color);
          font-size: 30px;
        }
        .colBtn {
          cursor: pointer;
          position: absolute;
          right: -4px;
          bottom: -6px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          line-height: 30px;
          text-align: center;
          transition: transform var(--transition-duration);
          background: var(--primar-color);
          color: var(--text-hover-color);
          & > i {
            font-weight: bold;
          }
          &:hover {
            transform: scale(1.15);
          }
        }
      }
      // 名称
      .name {
        font-size: 20px;
        margin-left: 20px;
        color: var(--primary-text-color);
        transform: translateY(14px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    // 介绍
    .description {
      position: absolute;
      border-radius: 25px;
      overflow: hidden;
      font-size: 12px;
      line-height: 16px;
      color: var(--secondary-text-color);
      background: var(--secondary-bg-color);
      padding: 10px 14px 54px 14px;
      top: @headHeight;
      width: 100%;
      bottom: 0;
      box-sizing: border-box;
      .content {
        height: 100%;
        width: 100%;
        overflow-y: scroll;
        scrollbar-width: none;
        padding-top: 32px;
        text-indent: 2em;
        p {
          min-height: 16px;
          width: 100%;
          line-height: 16px;
        }
      }
    }
  }
  // 音乐列表
  .songList,
  .albums {
    display: flex;
    flex-direction: column;
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
      .playListBtn {
        cursor: pointer;
        z-index: 1;
        position: absolute;
        right: 10px;
        top: 18px;
        width: 30px;
        height: 30px;
        font-size: 22px;
        line-height: 30px;
        border-radius: 40%;
        text-align: center;
        color: #fff;
        background-color: var(--primar-color);
      }
    }
    .list_content {
      flex: 1;
      border-radius: 18px;
      overflow: hidden;
      background-color: var(--secondary-bg-color);
    }
  }
}
</style>