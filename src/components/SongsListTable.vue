<template>
  <div class="main_wrap" ref="songsListTableMain">
    <div
      class="content"
      ref="content"
      v-loading="loading"
      element-loading-background="var(--loading-bg-color)"
    >
      <!-- 重试 -->
      <retry @retry="getData" v-if="showRetry"></retry>
      <!-- 内容 -->
      <el-scrollbar
        v-if="!showRetry && !showEmpty"
        style="height: 100%"
        wrap-style="overflow-x: hidden;"
      >
        <div
          class="content_i"
          infinite-scroll-immediate="false"
          v-infinite-scroll="getData"
          infinite-scroll-disabled="infiniteDisabled"
        >
          <div
            class="table_item"
            @click="active = item.id"
            v-for="(item, index) in songsListData"
            @dblclick="playSpecificSong(item)"
            :key="item.id"
            :class="{ act: item.id == active }"
          >
            <div class="point" v-show="!visAreas.point"></div>
            <div class="index" v-show="!visAreas.index">{{ index + 1 }}</div>
            <div
              class="song_name"
              :title="item.songName"
              v-show="!visAreas.song_name"
            >
              {{ item.songName }}
            </div>
            <div class="version">
              <span v-if="item.fee == 1"> 试听 </span>
            </div>
            <div class="col" v-show="!visAreas.col" @click="toggleCol(item)">
              <div class="i_wrapper">
                <i
                  class="iconfont"
                  :class="{
                    'icon-xihuan1': !item.isCol,
                    'icon-xihuan2': item.isCol,
                  }"
                ></i>
              </div>
            </div>
            <div
              class="download"
              v-show="!visAreas.download"
              @click="download(item)"
            >
              <div class="i_wrapper">
                <i class="iconfont icon-arrow-down-line"></i>
              </div>
            </div>
            <div class="artist" v-show="!visAreas.artist" :title="item.arName">
              {{ item.arName }}
            </div>
            <div
              class="albumName"
              v-show="!visAreas.albumName"
              :title="item.albumName"
            >
              {{ item.album }}
            </div>
            <div class="duration" v-show="!visAreas.duration">
              {{ formatTime(item.dt) }}
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
import { mapGetters, mapActions } from "vuex";
export default {
  name: "SongsListTable",
  props: {
    // 接受隐藏项
    visAreas: {
      type: Object,
      default: () => ({
        // point: false,
        // index: false,
        // song_name: false,
        // col: false,
        // download: false,
        // artist: false,
        // albumName: false,
        // duration: false,
      }),
    },
    // 接受参数项
    opts: {
      type: Object,
      default: () => ({
        id: 0,
        type: "",
        keywords: "",
        // type:toplist || col || search
      }),
    },
  },
  data() {
    return {
      songsListData: [], // 歌曲内容
      active: 0, //选中高亮
      loading: false,
      showRetry: false,
      showEmpty: false,
      infiniteDisabled: false, //无限滚动
      limit: 30,
      offset: 0,
      keywords: "",
      lastLoadCount: 0, // 用于跳过已经请求过的资源
    };
  },
  watch: {
    opts: {
      handler(value) {
        this.songsListData = [];
        this.getData();
        this.keywords = value.keywords;
        this.lastLoadCount = 0;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["playQueue", "downloadList", "settings", "selectedTrackId"]),
  },
  methods: {
    ...mapActions([
      "pushToPlaylist",
      "updateCurrentTrack",
      "addToDownloadList",
    ]),
    // 格式化时长 HH:mm:ss
    formatTime(duration) {
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`;
    },
    // 拼接歌手名称
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
    // 获取数据
    async getData() {
      this.loading = true;
      this.showEmpty = false;
      this.showRetry = false;

      const opts = this.opts;
      try {
        switch (opts.type) {
          case "col":
            this.infiniteDisabled = true;
            this.getShowColData();
            break;
          case "toplist":
            this.infiniteDisabled = true;
            await this.getToplistData(opts.id);
            break;
          case "search":
            if (opts.keywords) {
              await this.getSearchData(opts.keywords);
            }
            break;
          default: {
            this.$message.error("传入参数错误！");
          }
        }
      } catch (err) {
        console.error(err);
        this.showRetry = true;
        this.$message.error("获取榜单数据失败！");
      }
      this.loading = false;
      if (!this.songsListData.length) this.showEmpty = true;
    },
    // 发起请求
    async getToplistData(toplistId) {
      if (toplistId == 0) return;
      console.log("获取排行榜数据");
      // 19723756
      // 此处获取歌单详情
      const { data: playlistData } = await this.$http.get("/playlist/detail", {
        params: {
          id: toplistId,
        },
      });
      // 拼接 id
      const trackIds = playlistData.playlist.trackIds.map((item) => item.id);
      // 获取音乐详情
      const { data: songsList } = await this.$http.get("song/detail", {
        params: {
          ids: trackIds.join(","),
        },
      });
      // 格式化数据并添加至songsListData
      let songsListData_temp = songsList.songs.map((item) => {
        return {
          id: item.id,
          picUrl: item.al.picUrl,
          songName: item.name,
          arName: this.arNameFormatted(item.ar),
          album: item.al.name,
          dt: item.dt,
          isPlayable: true,
          isCol: this.checkIsCol(item), // 判断本地存储是否存在
          fee: item.fee,
        };
      });
      // 忽略试听歌曲
      if (this.settings?.playSettings?.ignorePreviewTracks) {
        songsListData_temp = songsListData_temp.filter(
          (item) => item.fee !== 1
        );
      }
      this.songsListData = songsListData_temp;
    },
    // 获取搜索数据
    async getSearchData(keywords) {
      if (keywords.trim() == "") return;
      console.log("搜索歌曲");
      if (this.keywords !== keywords) {
        this.songsListData = [];
        this.offset = 0;
      }
      const url = "/cloudsearch";
      const params = {
        limit: this.limit,
        offset: this.offset,
        type: 1, // 1 单曲 10 专辑 100 歌手 1000 歌单 1002用户 1004 mv 1006 歌词 1014视频 1018综合 2000 声音
        keywords: keywords,
      };
      let { data } = await this.$http.get(url, { params });
      data = data.result.songs || [];
      // 格式化数据
      let songsListData_temp = data.map((item) => {
        return {
          id: item.id,
          picUrl: item.al.picUrl,
          songName: item.name,
          arName: this.arNameFormatted(item.ar),
          album: item.al.name,
          dt: item.dt,
          isPlayable: true, // 默认播放源正常
          isCol: this.checkIsCol(item), // 判断是否为喜欢
          fee: item.fee,
        };
      });
      // 排除重复值
      let uniqueItems = this.filterUniqueItems(
        this.songsListData,
        songsListData_temp
      );
      // 关闭无限滚动
      if (!uniqueItems.length) {
        this.infiniteDisabled = true;
      }
      this.offset += this.limit;
      // 忽略试听歌曲
      if (this.settings?.playSettings?.ignorePreviewTracks) {
        // 去除试听歌曲
        uniqueItems = uniqueItems.filter((item) => item.fee !== 1);
        this.songsListData.push(...uniqueItems);
        // 去除试听歌曲后 uniqueItems 数组为空且 infiniteDisabled 为 false
        if (!uniqueItems.length && !this.infiniteDisabled) {
          this.getData();
        }
      } else {
        this.songsListData.push(...uniqueItems);
      }
    },
    // 展示收藏数据
    getShowColData() {
      console.log("展示收藏数据");
      const myCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      const songs = myCol.songs || [];
      this.songsListData = songs;
    },
    // 下载
    async download(item) {
      console.log("尝试下载");
      // 获取 url
      await this.checkPlayable([item]);
      if (!item.url) return this.$message.error("URL为空");
      // 传入参数 用于添加下载列表
      const obj = {
        name: item.songName,
        id: item.id,
        url: item.url,
      };
      // confirm 信息
      let msg = "是否下载？"; // 提示信息
      // 执行方法
      let handleConfirm = () => {
        this.addToDownloadList(obj);
        this.$message.success("添加至下载列表！");
      };
      // 是否为试听版
      if (item.freeTrialInfo.end) {
        const time = item.freeTrialInfo.end - item.freeTrialInfo.start;
        msg = "该歌曲为试听版，是否继续下载？时长" + time + "秒";
      }
      // 判断是否存在下载列表
      const isUnique = this.downloadList.findIndex((i) => i.id == item.id);
      if (isUnique !== -1) {
        msg = "下载列表已经存在，是否重复下载";
      }
      // 弹出提示框
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "messageBox",
      })
        .then(handleConfirm)
        .catch(() => {});
    },
    // 播放指定歌曲
    async playSpecificSong(item) {
      try {
        await this.checkPlayable(this.songsListData);
      } catch (err) {
        return this.$message.error("获取歌曲详情失败！");
      }
      if (!item.isPlayable) return this.$message.error("无法播放！");
      // 判断是否需要更新播放列表
      const isChangePlayQueue = this.eqArr(this.songsListData, this.playQueue);
      if (!isChangePlayQueue) {
        this.pushToPlaylist([...this.songsListData]);
      }
      // console.log(` 当前播放${item.id},正在播放${this.selectedTrackId}`);
      // 是否重新播放当前这首
      if (item.id == this.selectedTrackId) {
        this.updateCurrentTrack(-2); // 传入-2
      } else {
        // 写入播放索引
        this.updateCurrentTrack(item.id);
      }
    },
    // 查询播放源 会对原数组修改
    async checkPlayable(arr) {
      console.log("查询播放源");
      // 跳过之前
      let arrTemp = [];
      // 无需通过网络请求片段不会设置 lastLoadCount
      if (this.lastLoadCount) {
        // 只需要最后添加的片段
        arrTemp = arr.slice(this.lastLoadCount);
        arr = arrTemp;
      }
      const ids = arr.map((i) => i.id).join(",");
      const url = "/song/url";
      let { data } = await this.$http.get(url, {
        params: {
          id: ids,
        },
      });
      data = data.data;
      arr.forEach((itemA) => {
        const itemB = data.find((itemB) => itemA.id == itemB.id);
        // 对原数组进行修改
        itemA.url = itemB.url;
        itemA.freeTrialInfo = itemB.freeTrialInfo || {}; //试听信息
        if (!itemA.url) itemA.isPlayable = false;
      });
      // 保存当前已加载的下标
      this.lastLoadCount += arr.length;
    },
    // 判断是否为本地收藏
    checkIsCol(item) {
      let myCol = localStorage.getItem("myCol");
      if (!myCol) return false;

      myCol = JSON.parse(myCol);
      return myCol.songs ? myCol.songs.some((i) => i.id === item.id) : false;
    },
    // 收藏歌曲
    toggleCol(item) {
      // songs
      console.log("切换喜欢");
      let localMyCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      if (!localMyCol.songs) {
        localMyCol.songs = [];
      }
      const index = localMyCol.songs.findIndex((i) => i.id == item.id);
      if (item.isCol) {
        localMyCol.songs.splice(index, 1);
        item.isCol = false;
        this.$message.success("取消收藏成功！");
      } else {
        localMyCol.songs.push(item);
        item.isCol = true;
        this.$message.success("添加收藏成功！");
      }
      localStorage.setItem("myCol", JSON.stringify(localMyCol));
    },
    // 判断数组是否相同 浅层
    eqArr(a, b) {
      return a.length === b.length && a.every((item, i) => item.id === b[i].id);
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

<style lang="less" scoped>
.main_wrap {
  height: 100%;
  position: relative;
  .content {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    .table_item {
      height: 44px;
      margin-bottom: 7px;
      display: flex;
      font-size: 14px;
      align-items: center;
      padding-left: 16px;
      font-weight: bold;
      color: var(--secondary-text-color);
      border-radius: 12px;
      & > div {
        flex: 1;
        margin-right: 5px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &:hover {
        background: var(--secondary-bg-color);
        color: var(--text-hover-color);
      }
      &.act {
        background: var(--secondary-bg-color);
        color: var(--primary-text-color);
      }
      .point {
        flex: 0 0 10px;
        margin-right: 16px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--primar-color);
      }
      .index {
        width: 46px;
        flex: 0 0 46px;
      }
      // 歌曲名称
      .song_name {
        flex: 1;
      }
      .version {
        flex: 0 0 50px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        & > span {
          color: #fe7360;
          border: 1px solid #fe7360;
          box-sizing: border-box;
          font-size: 10px;
          padding: 2px;
        }
      }
      // 下载和喜欢
      .col,
      .download {
        cursor: pointer;
        width: 34px;
        flex: 0 0 34px;
        font-weight: normal;
        margin-right: 0;
        .iconfont {
          font-size: 12px;
        }
        .icon-xihuan2 {
          color: #e01e1e;
        }
        .i_wrapper {
          width: 25px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          border-radius: 8px;
          transition: background var(--transition-duration);
          &:hover {
            background: var(--primary-button-hover-color);
          }
        }
      }
      // 作者
      .artist {
        width: 220px;
      }
      // 专辑
      .albumName {
        width: 340px;
      }
      // 时长
      .duration {
        width: 110px;
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