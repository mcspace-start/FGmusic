<template>
  <div class="download_main">
    <!-- 头部 -->
    <div class="head">
      <!-- 标题 -->
      <div class="title">下载列表</div>
      <!-- 按钮 -->
      <div class="buttons">
        <div class="btn" @click="clearDownLoadList">清空歌曲</div>
      </div>
    </div>
    <!-- 渲染列表 -->
    <div class="content" ref="content">
      <!-- empty -->
      <div class="empty" v-if="downloadList.length == 0">
        <div class="empty_i">没有数据</div>
      </div>
      <el-scrollbar style="height: 100%" wrap-style="overflow-x: hidden;">
        <div class="content_i">
          <div
            class="table_item"
            v-for="(item, index) in downloadList"
            :key="index"
            @dblclick="playSpecificSong(item)"
          >
            <div class="index">{{ index + 1 }}</div>
            <div class="song_name">{{ item.name }}</div>
            <div class="item_empty"></div>
            <div class="progress_wrap">
              <div
                class="progress"
                :style="{
                  width: item.progress + '%',
                }"
              ></div>
            </div>
            <div class="progress_txt">{{ item.progress }}%</div>
            <div v-if="item.status == 'completed'" class="msg">
              <div class="msg_i completed">完成</div>
            </div>
            <div v-if="item.status == 'failed'" class="msg">
              <div class="msg_i failed">失败</div>
            </div>
            <div v-if="item.status == 'downloading'" class="msg">
              <div class="msg_i downloading">下载中</div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      // downloadList: [
      //   {
      //     id: 0,
      //     name: "歌曲名称",
      //     progress: 0,
      //     status: "downloading", // Downloading Completed Failed
      //     song: {},
      //   },
      //   {
      //     id: 2,
      //     name: "歌曲名称",
      //     progress: 100,
      //     status: "completed", // Dowvnloading Completed Failed
      //     song: {},
      //   },
      //   {
      //     id: 3,
      //     name: "歌曲名称",
      //     progress: 100,
      //     status: "failed", // Downloading Completed Failed
      //     song: {},
      //   },
      // ],
    };
  },
  mounted() {
    // 取消红点
    this.setBadges({
      key: "DownloadList",
      status: false,
    });
  },
  updated() {
    // 取消红点
    this.setBadges({
      key: "DownloadList",
      status: false,
    });
  },
  computed: {
    ...mapGetters(["downloadList"]),
  },
  methods: {
    ...mapActions([
      "clearDownloadList",
      "setBadges",
      "pushToPlaylist",
      "updateCurrentTrack",
    ]),
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
    // 判断是否为本地收藏
    checkIsCol(item) {
      let myCol = localStorage.getItem("myCol");
      if (myCol) {
        myCol = JSON.parse(myCol);
        return myCol.songs ? myCol.songs.some((i) => i.id === item.id) : false;
      }
      return false;
    },
    // 播放指定索引歌曲
    async playSpecificSong(song) {
      console.log("播放下载列表歌曲");
      try {
        let songData = await this.$http.get("/song/detail?ids=" + song.id);
        songData = songData.data.songs[0];
        // 获取url
        let urlData = await this.$http.get("/song/url?id=" + song.id);
        urlData = urlData.data.data[0];
        const isPlayable = !!urlData.url;

        const obj = {
          id: song.id,
          songName: song.name,
          album: songData.al.name,
          arName: this.arNameFormatted(songData.ar),
          dt: songData.dt,
          fee: songData.fee,
          freeTrialInfo: urlData.freeTrialInfo,
          isCol: this.checkIsCol(song),
          isPlayable: isPlayable,
          picUrl: songData.al.picUrl,
          url: urlData.url,
        };
        // 添加至播放列表
        this.pushToPlaylist([obj]);
        this.updateCurrentTrack(-1);
      } catch (err) {
        this.$message.error("播放下载列表歌曲失败！");
      }
    },
    // 清空下载列表
    clearDownLoadList() {
      if (this.downloadList.length == 0) return;
      this.$confirm("确定清空下载列表吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "messageBox",
      })
        .then(() => {
          this.clearDownloadList();
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
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
.download_main {
  height: 100%;
  position: relative;
  .head {
    height: 48px;
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    padding: 0 88px 0 10px;
    position: relative;

    .title {
      flex: 1;
      font-size: 28px;
      line-height: 48px;
      color: var(--primary-text-color);
    }
    .buttons {
      flex: 1;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: var(--secondary-text-color);

      .btn {
        transition: all var(--transition-duration);
        margin-left: 16px;
        display: inline-block;
        height: 34px;
        padding: 0 24px;
        cursor: pointer;
        background-color: var(--button-bg-color);
        vertical-align: top;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        color: var(--primary-text-color);
        box-shadow: 0 16px 14px var(--primary-shadow-color);
        letter-spacing: 2px;
        border-radius: 10px;
        &:hover {
          color: var(--text-hover-color);
          background-color: var(--primar-color);
          box-shadow: 0 16px 14px var(--secondary-shadow-color);
          transform: translateY(-4px);
        }
      }
    }
  }
  .content {
    width: 100%;
    top: 62px;
    bottom: 0;
    position: absolute;
    overflow: hidden;
    box-sizing: border-box;

    .table_item {
      padding-right: 70px;
      height: 44px;
      margin-bottom: 20px;
      background: var(--downloadlist-bg-color);
      display: flex;
      font-size: 14px;
      align-items: center;
      padding-left: 16px;
      font-weight: bold;
      color: var(--secondary-text-colo);
      transition: all var(--transition-duration);

      border-radius: 12px;
      & > div {
        flex-shrink: 0;
        color: var(--secondary-text-color);
      }
      &:hover {
        background: var(--secondary-bg-color);
      }
      .index {
        width: 46px;
        flex: 0 0 46px;
      }
      .song_name {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 14px;
      }
      .item_empty {
        flex: 1;
      }
      .progress_wrap {
        width: 152px;
        margin-right: 10px;
        background-color: var(--progress-bar-bg-color);
        .progress {
          width: 0%;
          height: 10px;
          background-color: var(--primar-color);
          border-radius: 4px;
          transition: width var(--transition-duration);
        }
      }
      .progress_txt {
        width: 40px;
        font-size: 14px;
        color: var(--secondary-text-color);
        font-weight: bold;
      }
      .msg {
        width: 90px;
        height: 24px;
        text-align: center;
        .msg_i {
          display: inline-block;
          height: 100%;
          line-height: 24px;
          padding: 0 10px;
          border-radius: 5px;
          color: #dcdcdc;
          font-size: 14px;
          &.completed {
            background-color: #7566e8;
          }
          &.downloading {
            background-color: #32a78b;
          }
          &.failed {
            background-color: #ef5350;
          }
        }
      }
    }
  }
}
// .btns {
//   position: absolute;
//   bottom: 0;
//   width: 100%;
// }
</style>