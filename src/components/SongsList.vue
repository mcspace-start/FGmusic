<template>
  <div
    class="songsList_main"
    ref="songsListMain"
    v-loading="loading"
    element-loading-background="var(--loading-bg-color)"
  >
    <div class="content" ref="content">
      <!-- retry -->
      <retry @retry="getData" v-if="showRetry"></retry>
      <!-- 内容区 -->
      <el-scrollbar
        v-if="!showRetry && !showEmpty"
        wrap-style="overflow-x: hidden;"
        style="height: 100%"
      >
        <!-- 内容体 -->
        <div
          class="content_i"
          v-infinite-scroll="getData"
          infinite-scroll-disabled="infiniteDisabled"
          infinite-scroll-immediate="false"
        >
          <div
            class="item"
            v-for="item in renderData"
            :class="{ act: item.id === activeId, unplayable: !item.isPlayable }"
            :title="item.songName"
            :key="item.id"
            @click="toggleActive(item)"
            @dblclick="playSpecificSong(item)"
          >
            <!-- <img :src="item.picUrl" alt="" class="song_logo" /> -->
            <el-image :src="item.picUrl" fit="cover" :lazy="imageLazy">
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
            <!-- 名称 -->
            <div class="song_info">
              <p class="song_name">{{ item.songName }}</p>
              <p class="artist_name">{{ item.arName }}</p>
            </div>
            <!-- 按钮 -->
            <div class="btn" @click="playSpecificSong(item)">
              <i class="iconfont icon-bofang"></i>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!-- 无数据 -->
      <div class="empty" v-if="showEmpty && !showRetry && !loading">
        <div class="empty_i">没有数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    opts: {
      type: Object,
      default: () => ({
        type: "",
        id: 0,
      }),
    },
  },
  data() {
    return {
      loading: false,
      showRetry: false,
      showEmpty: false,
      songsListData: [], // 存储所有数据
      renderData: [], // 存储渲染数组
      infiniteDisabled: false, // 禁用无限滚动
      type: "",
      offset: 0,
      limit: 30,
      lastLoadCount: 0, // 用于跳过已经获得的数据
      activeId: -1, // 元素高亮
      imageLazy: true,
    };
  },
  computed: {
    ...mapGetters(["playQueue", "playHistory", "selectedTrackId"]),
  },
  watch: {
    playQueue() {
      if (this.opts.type == "playQ") this.getData();
    },
    playHistory() {
      if (this.opts.type == "hist") this.getData();
    },
  },
  created() {
    this.getData();
  },
  methods: {
    ...mapActions(["updateCurrentTrack", "pushToPlaylist"]),
    // 切换激活
    toggleActive(item) {
      // 可播放
      if (item.isPlayable) {
        this.activeId = item.id;
      }
    },
    // 格式化名字
    arNameFormatted(nameList) {
      let str = "";
      const nameArr = nameList.map((item) => {
        return item.name;
      });
      if (nameArr.length > 3) {
        str = "群星";
      } else {
        str = nameArr.join(" & ");
      }
      return str;
    },
    // 播放指定索引歌曲
    playSpecificSong(item) {
      if (!item.isPlayable) return this.$message.error("无法播放！");
      const isChangePlayQueue = this.eqArr(this.songsListData, this.playQueue);
      // 播放列表不相同时更新泪飙
      if (!isChangePlayQueue) {
        this.pushToPlaylist(
          // 去掉指定图片尺寸
          this.songsListData.map((song) => ({
            ...song,
            picUrl: song.picUrl.split("?")[0], // 去除url参数
          }))
        );
      }
      if (item.id === this.selectedTrackId) {
        this.updateCurrentTrack(-2);
      } else {
        this.updateCurrentTrack(item.id);
      }
    },
    // 播放整个列表
    playEntirePlaylist() {
      if (!this.songsListData.length) return;
      const isChangePlayQueue = this.eqArr(this.songsListData, this.playQueue);
      if (!isChangePlayQueue) {
        // this.pushToPlaylist([...this.songsListData]);
        this.pushToPlaylist(
          // 去掉指定图片尺寸
          this.songsListData.map((song) => ({
            ...song,
            picUrl: song.picUrl.split("?")[0],
          }))
        );
      }
      this.updateCurrentTrack(-1);
    },
    // 获取数据
    async getData() {
      this.loading = true;
      this.showRetry = false;
      this.showEmpty = false;
      this.activeId = -1;

      const id = this.opts.id;
      const type = this.opts.type;
      try {
        switch (type) {
          case "newSongs":
            await this.getNewSongs();
            break;
          case "hist":
            this.infiniteDisabled = true;
            this.imageLazy = false;
            this.getHistoryList();
            break;
          case "playQ":
            this.imageLazy = false;
            this.getPlayQueue();
            break;
          case "aSongs":
            await this.getArtistSongs(id);
            break;
          case "alSongs":
            await this.getAlbumSongs(id);
            break;
          case "plSongs":
            await this.getPlaylistSongs(id);
            break;
          default:
            this.$message.error("歌曲列表传入参数错误！");
        }
        await this.checkPlayable(this.songsListData);
      } catch (error) {
        console.error(error);
        this.showRetry = true;
        this.$message.error("获取歌曲数据失败！");
      }
      this.loading = false;
      if (!this.songsListData.length) this.showEmpty = true;
    },
    // 获取新歌推荐
    async getNewSongs() {
      // 如果已经有数据则跳过获取数据
      if (this.songsListData.length) {
        this.renderData.push(
          ...this.songsListData.slice(this.offset, this.limit + this.offset)
        );
        if (this.offset >= this.songsListData.length) {
          this.infiniteDisabled = true;
        }
        this.offset += this.limit;
        return;
      }
      console.log("获取新歌推荐");
      const url = "/personalized/newsong";
      const { data } = await this.$http.get(url, {
        params: {
          limit: 100,
        },
      });
      const songsList = data.result;
      const songsListData_temp = songsList.map((item) => ({
        // ...item,
        id: item.id,
        picUrl: item.picUrl + "?param=50y50",
        songName: item.name,
        arName: this.arNameFormatted(item.song.artists),
        isPlayable: true,
        album: item.song.album.name,

        dt: item.song.duration,
        isCol: this.checkIsCol(item), // 判断本地存储是否存在
        fee: item.song.fee,
      }));
      this.songsListData = songsListData_temp;
      if (songsListData_temp.length < this.limit) this.infiniteDisabled = true;

      this.offset += this.limit;
      // 第一次部分加载
      this.renderData = this.songsListData.slice(0, this.limit);
    },
    // 获取历史记录
    getHistoryList() {
      console.log("获取播放历史");
      const songsListData_temp = this.playHistory.map((song) => ({
        ...song,
        picUrl: song.picUrl + "?param=50y50",
        url: "",
      }));
      this.songsListData = songsListData_temp;
      this.renderData = this.songsListData;
    },
    // 获取播放列表
    getPlayQueue() {
      console.log("获取播放列表数据");
      const eq = this.eqArr(this.songsListData, this.playQueue);
      if (!eq) {
        // 列表变化
        this.songsListData = [];
        this.renderData = [];
        this.infiniteDisabled = false;
        this.offset = 0;
      }
      // 如果已经有数据则跳过获取数据
      if (this.songsListData.length) {
        this.renderData.push(
          ...this.songsListData.slice(this.offset, this.limit + this.offset)
        );
        if (this.offset >= this.songsListData.length) {
          this.infiniteDisabled = true;
        }
        this.offset += this.limit;
        return;
      }
      const songsListData_temp = this.playQueue.map((song) => ({
        ...song,
        picUrl: song.picUrl + "?param=50y50",
      }));
      this.songsListData = songsListData_temp;

      if (songsListData_temp.length < this.limit) {
        this.infiniteDisabled = true;
      }

      this.offset += this.limit;
      // 第一次部分加载
      this.renderData = this.songsListData.slice(0, this.limit);
    },
    // 获取歌手音乐
    async getArtistSongs(arId) {
      console.log("获取歌手热门歌曲");
      if (!arId) return this.$message.error("获取歌手歌曲：参数错误");
      // 获取图片地址
      const getPicUrl = async (alId) => {
        const { data } = await this.$http.get("/album?id=" + alId);
        // 返回url并指定尺寸大小
        return data.album.blurPicUrl + "?param=50y50";
      };
      // const url = "/artist/top/song";
      const url = "/artist/songs";
      const limit = this.limit;
      const offset = this.offset;
      const { data } = await this.$http.get(url, {
        params: {
          id: arId,
          limit: limit,
          offset: offset,
          order: "hot",
        },
      });
      if (!data.more) {
        // 禁用无限滚动
        this.infiniteDisabled = true;
      }

      let songsList = data.songs;
      // 过滤无效值
      songsList = songsList.filter((i) => i.al.id !== 0);
      // 返回指定格式
      const songPromises = songsList.map(async (item) => {
        const picUrl = await getPicUrl(item.al.id);
        return {
          id: item.id,
          picUrl: picUrl,
          songName: item.name,
          arName: this.arNameFormatted(item.ar),
          isPlayable: true,
          isAct: false,
          album: item.al.name,
          dt: item.dt,
          isCol: this.checkIsCol(item), // 判断本地存储是否存在
          fee: item.fee,
        };
      });
      let songsListData_temp = await Promise.allSettled(songPromises);
      songsListData_temp = songsListData_temp.filter(
        (i) => i.status === "fulfilled"
      );
      songsListData_temp = songsListData_temp.map((i) => i.value);
      // this.songsListData = songsListData_temp;
      this.songsListData.push(...songsListData_temp);
      // 部分加载
      this.renderData.push(
        ...this.songsListData.slice(this.offset, this.limit + this.offset)
      );
      this.lastLoadCount = songsListData_temp.length;
      this.offset += this.limit;
    },
    // 获取专辑音乐
    async getAlbumSongs(alId) {
      // 如果已经有数据则跳过获取数据
      if (this.songsListData.length) {
        this.renderData.push(
          ...this.songsListData.slice(this.offset, this.limit + this.offset)
        );
        if (this.offset >= this.songsListData.length) {
          this.infiniteDisabled = true;
        }
        this.offset += this.limit;
        return;
      }
      console.log("获取专辑音乐");
      const url = "/album";
      const { data } = await this.$http.get(url, {
        params: {
          id: alId,
        },
      });
      const songsList = data.songs;
      const songsListData_temp = songsList.map((item) => ({
        id: item.id,
        picUrl: item.al.picUrl + "?param=50y50",
        songName: item.name,
        arName: this.arNameFormatted(item.ar),
        album: item.al.name,
        isPlayable: true,
        dt: item.dt,
        isCol: this.checkIsCol(item), // 判断本地存储是否存在
        fee: item.fee,
      }));
      this.songsListData = songsListData_temp;
      // 防止第一词获取数据长度不大于limit
      if (songsListData_temp.length < this.limit) this.infiniteDisabled = true;
      this.offset += this.limit;
      // 部分加载
      // 第一次部分加载
      this.renderData = this.songsListData.slice(0, this.limit);
    },
    // 获取歌单音乐
    async getPlaylistSongs(pId) {
      // 如果已经有数据则跳过获取数据
      if (this.songsListData.length) {
        this.renderData.push(
          ...this.songsListData.slice(this.offset, this.limit + this.offset)
        );
        if (this.offset >= this.songsListData.length) {
          this.infiniteDisabled = true;
        }
        this.offset += this.limit;
        return;
      }
      console.log("获取歌单音乐", pId);
      const url = "/playlist/detail";
      const id = pId;
      // 通过歌单id获取歌曲ids
      const { data: playlistData } = await this.$http.get(url, {
        params: {
          id: id,
          limit: 20,
          offset: 0,
        },
      });
      let trackIds = playlistData.playlist.trackIds.map((item) => item.id);
      // 通过歌曲ids获取歌曲详情
      let songsList = await this.$http.get("song/detail", {
        params: {
          ids: trackIds.join(","),
        },
      });
      songsList = songsList.data.songs;
      const songsListData_temp = songsList.map((item) => ({
        id: item.id,
        picUrl: item.al.picUrl + "?param=50y50",
        songName: item.name,
        arName: this.arNameFormatted(item.ar),
        album: item.al.name,
        isPlayable: true,
        dt: item.dt,
        isCol: this.checkIsCol(item), // 判断本地存储是否存在
        fee: item.fee,
      }));
      this.songsListData = songsListData_temp;
      // 防止第一词获取数据长度不大于limit
      if (songsListData_temp.length < this.limit) this.infiniteDisabled = true;
      this.offset += this.limit;
      // 第一次部分加载
      this.renderData = this.songsListData.slice(0, this.limit);
    },
    // 检查是否可播放
    async checkPlayable(arr) {
      console.log("查询播放源");
      // 跳过之前
      let arrTemp = [];
      // 无需通过网络请求片段不会设置 lastLoadCount
      if (this.lastLoadCount) {
        // 只需要最后添加的片段
        arrTemp = arr.slice(
          this.songsListData.length - this.lastLoadCount,
          this.songsListData.length
        );
        arr = arrTemp;
      }
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
        itemA.freeTrialInfo = itemB.freeTrialInfo || {}; //试听信息
        if (itemB.url === null) {
          itemA.isPlayable = false;
        }
      });
    },
    // 判断数组是否相同 浅层
    eqArr(a, b) {
      return a.length === b.length && a.every((item, i) => item.id === b[i].id);
    },
    // 判断是否为本地收藏
    checkIsCol(item) {
      let myCol = localStorage.getItem("myCol");
      if (myCol) {
        myCol = JSON.parse(myCol);
        return myCol.songs ? myCol.songs.some((i) => i.id === item.id) : false;
      }
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
.songsList_main {
  height: 100%;
  width: 100%;
  position: relative;

  .content {
    width: 100%;
    height: 100%;
    position: absolute;
    .content_i {
      width: 100%;
      .item {
        height: 60px;
        display: flex;
        align-items: center;
        transition: background var(--transition-duration);

        &:hover {
          background: var(--songslist-active);

          .btn {
            opacity: 1;
            transform: translateX(-6px) scaleX(0.9);
          }
        }
        .btn {
          width: 30px;
          height: 100%;
          cursor: pointer;
          display: flex;
          opacity: 0;
          align-items: center;
          justify-content: center;
          color: var(--primar-color);
          margin-left: auto;
          transform: translateX(0px);
          transition: all 0.5s;

          .iconfont {
            font-size: 14px;
          }
        }
        &.act {
          background-color: var(--songslist-active);
        }
        // 使用el-image
        .el-image {
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin: 0 20px 0 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--secondary-bg-color);
          font-size: 22px;
        }

        .song_info {
          display: flex;
          flex-direction: column;
          .song_name {
            font-size: 14px;
            color: var(--primary-text-color);
            font-weight: bold;
            margin-bottom: 6px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .artist_name {
            font-size: 10px;
            color: var(--secondary-text-color);
          }
        }
      }
      // 无法播放样式
      .item.unplayable {
        .song_name {
          color: var(--primary-unplayable-text-color);
        }

        .artist_name {
          color: var(--primary-unplayable-text-color);
        }

        .el-image {
          filter: grayscale(75%);
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
        color: var(--secondary-text-color);
        border-radius: 12px;
        line-height: 42px;
        text-align: center;
        font-size: 16px;
      }
    }
  }
}
</style>