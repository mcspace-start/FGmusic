<template>
  <div class="audio-player">
    <!-- 进度条 -->
    <div class="progress-bar" ref="progress">
      <div
        class="progress-fill"
        ref="progressFill"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
    <!-- 控制面板 -->
    <div class="control-panel">
      <!-- 歌曲信息 -->
      <div class="song-info">
        <!-- 歌曲图片 -->
        <el-image
          v-if="currentMusicItem.picUrl"
          class="song-avatar"
          :src="currentMusicItem.picUrl + '?param=50y50'"
          fit="cover"
          @click="openPlayerPage"
        >
          <!-- 加载动画 -->
          <div slot="placeholder" class="image-slot box">
            <span>
              <i class="el-icon-loading"></i>
            </span>
          </div>
          <!-- 错误动画 -->
          <div slot="error" class="image-slot-error">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <svg
          v-else
          @click="openPlayerPage"
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width="423.000000pt"
          height="423.000000pt"
          viewBox="0 0 423.000000 423.000000"
          preserveAspectRatio="xMidYMid meet"
          class="song-avatar"
        >
          <g
            transform="translate(0.000000,423.000000) scale(0.100000,-0.100000)"
            fill="var(--primar-color)"
            stroke="none"
          >
            <path
              d="M2215 3538 c-39 -21 -126 -114 -156 -164 -84 -148 -92 -380 -24 -710
6 -29 3 -33 -97 -105 -56 -42 -125 -91 -153 -109 -225 -152 -313 -273 -337
-462 -36 -288 115 -557 388 -692 127 -62 247 -79 438 -61 l73 7 14 -63 c24
-113 18 -149 -52 -294 -21 -44 -84 -96 -138 -114 -86 -28 -231 -5 -271 44 -8
11 -10 16 -5 13 18 -11 105 11 136 33 45 32 72 93 67 150 -9 94 -78 151 -189
157 -59 4 -74 1 -119 -24 -115 -63 -145 -164 -85 -284 29 -57 75 -100 145
-136 52 -28 62 -29 185 -29 125 0 132 1 197 32 87 41 169 118 198 186 20 46
22 62 16 162 -3 60 -9 128 -12 151 -6 39 -4 41 28 54 58 22 152 91 196 144
141 168 159 408 45 603 -32 55 -116 130 -185 165 -66 33 -201 53 -271 40 -26
-5 -49 -7 -51 -3 -2 3 -12 35 -21 70 l-16 63 75 73 c125 121 217 284 254 449
24 108 21 282 -6 379 -32 114 -96 229 -152 274 -19 15 -88 16 -115 1z m148
-282 c34 -31 41 -61 35 -147 -7 -91 -54 -188 -141 -290 -64 -75 -143 -146
-153 -136 -3 2 -10 59 -16 127 -17 185 5 292 82 399 52 72 143 94 193 47z
m-249 -973 c11 -71 8 -82 -26 -97 -50 -22 -143 -100 -176 -148 -104 -152 -71
-394 73 -530 81 -77 175 -111 183 -66 2 9 -5 19 -16 22 -73 24 -182 237 -182
359 0 94 62 197 139 232 23 10 43 16 45 14 4 -5 176 -752 176 -766 0 -5 -33
-14 -72 -20 -126 -17 -294 15 -389 75 -66 42 -150 129 -181 188 -68 127 -48
293 54 443 57 83 325 331 358 331 4 0 10 -17 14 -37z m236 -225 c52 -23 142
-123 179 -201 82 -171 77 -352 -12 -453 -38 -44 -94 -81 -104 -70 -8 7 -180
740 -177 747 5 9 72 -5 114 -23z"
            />
          </g>
        </svg>
        <div class="song-details">
          <div
            class="song-name"
            :title="currentMusicItem.songName || '歌曲名称'"
          >
            {{ currentMusicItem.songName || "歌曲名称" }}
          </div>
          <div class="artist-name" :title="currentMusicItem.arName || '作者'">
            {{ currentMusicItem.arName || "作者" }}
          </div>
        </div>
        <div class="version">
          <!-- currentMusicItem.freeTrialInfo.end -->
          <span
            v-if="currentMusicItem.fee === 1"
            :title="
              currentMusicItem.freeTrialInfo.end
                ? `试听${currentMusicItem.freeTrialInfo.end}秒`
                : '试听歌曲'
            "
            >试听</span
          >
        </div>
      </div>
      <!-- 播放控制 -->
      <div class="playback-controls">
        <!-- 上一首 -->
        <div class="prev-trak" @click="playPrev">
          <i class="iconfont icon-shangyishouweidianji"></i>
        </div>
        <!-- 播放与暂停 -->
        <div class="play_btn_wrapper" v-show="!isLoading">
          <div v-if="isPlaying" class="toggle-play" @click="pause">
            <i class="iconfont icon-zanting1"></i>
          </div>
          <div v-else class="toggle-play" @click="play">
            <i class="iconfont icon-bofang"></i>
          </div>
        </div>
        <!-- 加载 -->
        <div class="toggle-play" v-show="isLoading">
          <i class="el-icon-loading play_load"></i>
        </div>
        <!-- 下一首 -->
        <div class="next-track" @click="playNext">
          <i class="iconfont icon-xiayishouweidianji"></i>
        </div>
      </div>
      <!-- 功能控制 -->
      <div class="media-controls">
        <!-- 时间进度 -->
        <div class="player-time">
          {{ currentTimeFormatted }} / {{ durationFormatted }}
        </div>
        <!-- 收藏 -->
        <div class="toggle-col controls-icon" title="收藏" @click="toggleCol">
          <i
            class="iconfont"
            :class="currentMusicItem.isCol ? 'icon-xihuan2' : 'icon-xihuan1'"
          ></i>
        </div>
        <!-- 下载 -->
        <div
          class="download-track controls-icon"
          title="下载"
          @click="download"
        >
          <i class="iconfont icon-download"></i>
        </div>
        <!-- 倍速 -->
        <div class="play-rate" title="倍速" @click.stop="togglePlaybackRate">
          {{ playbackRate.toFixed(1) + "x" }}
        </div>
        <!-- 音量 -->
        <div class="play-volume-icon-wrap">
          <!-- 图标 muted: !isShowVolume -->
          <div
            class="toggle-volume controls-icon"
            title="音量"
            :class="{ muted: !isShowVolume }"
            @click="toggleVolumeIcon"
          >
            <i class="iconfont icon-yinliang"></i>
          </div>
          <!-- 音量条 -->
          <div class="play-volume-wrap" ref="playVolumeWrap">
            <div
              class="play-volume"
              ref="playVolume"
              :style="{
                width: isShowVolume ? currentVolume * 100 + '%' : '0%',
              }"
            ></div>
          </div>
        </div>
        <!-- 模式 -->
        <div
          class="play-mode controls-icon"
          title="播放模式"
          @click="setPlayMode"
        >
          <i class="iconfont" :class="playModeIcon"></i>
        </div>
        <!-- 播放列表 -->
        <div
          class="show-play-list controls-icon"
          title="播放列表"
          @click.stop="toggleDrawer"
        >
          <!-- <i class="iconfont icon-bofangliebiao-bofangqi"></i> -->
          <i class="iconfont icon-a-menumanegement"></i>
        </div>
      </div>
    </div>
    <!-- audio标签 -->
    <audio
      ref="audio"
      class="audio"
      :src="audioList[currentPlayIndex] ? audioList[currentPlayIndex].url : ''"
      v-bind="$attrs"
      @ended="onEnded"
      @durationchange="onDurationchange"
    >
      浏览器太老咯，请升级浏览器吧~
    </audio>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "AudioPlayer",
  data() {
    return {
      isIOS: /iPhone|iPad|iPod/i.test(navigator?.userAgent), // 是否是IOS设备
      isPlaying: false, // 音频是否正在播放
      isDragging: false, // 是否正在拖拽音频进度
      isShowVolume: true, // 是否显示音量条
      currentVolume: 0.5, // 当前音量 音量条长度
      isDraggingVolume: false, // 是否正在拖拽音量进度

      timer: null,
      progressInterval: 500, //进度条更细间隔
      progress: 0, // 进度条进度

      isLoading: false, // 音频加载中
      duration: 0, // 音频持续时间
      currentTime: "", // 音频当前播放时间
      playbackRate: 1, // 当前播放速率

      currentPlayIndex: 0, // 当前播放的音频位置索引

      playMode: "list", // 播放模式 list loop shuffle repeat
      audioList: [],
      currentMusicItem: {},

      shuffledIndexArray: [], // 打乱数组后的索引
      currentShuffledIndex: 0, // 用于记录现在是
      throttledTimeUpdate: null, // 节流函数
    };
  },
  computed: {
    ...mapGetters([
      "selectedTrackId",
      "playQueue",
      "downloadList",
      "playerVisible",
      "audioCurrentTime",
    ]),
    playModeIcon() {
      // 播放模式对应 icon class
      const iconNameMap = {
        list: "icon-a-liebiaobofang1",
        repeat: "icon-24gl-repeat2",
        shuffle: "icon-24gl-shuffle",
        loop: "icon-24gl-repeatOnce2",
      };
      return iconNameMap[this.playMode];
    },
    // 当前播放时间
    currentTimeFormatted() {
      return this.currentTime ? this.formatTime(this.currentTime) : "00:00";
    },
    durationFormatted() {
      const duration = this.currentMusicItem.dt / 1000;
      // return this.duration ? this.formatTime(this.duration) : "00:00";
      return duration ? this.formatTime(duration) : "00:00";
    },
  },
  watch: {
    playQueue(arr) {
      this.pushToPlaylist(arr);
    },
    // 监控当前播放音乐当前播放
    selectedTrackId(id) {
      this.playSongAtIndex(id);
    },
    // 监控播放状态
    isPlaying(s) {
      this.setIsPlaying(s);
    },
    // 监控音量条进行缓存
    currentVolume(volume) {
      this.setVolumeCache(volume);
      this.setVolume(volume);
    },
  },
  created() {
    // 获取缓存音量值
    const volume = localStorage.getItem("volume") || 0.5;
    this.currentVolume = volume;
  },
  mounted() {
    this.$nextTick(() => {
      // 为进度条拖动点添加鼠标按下事件监听器，用于开始拖动进度条
      this.$refs.progress.addEventListener(
        "mousedown",
        this.handleProgressPanstart
      );
      // 为音量条拖动点添加鼠标按下事件监听器，用于开始拖动音量条
      this.$refs.playVolumeWrap.addEventListener(
        "mousedown",
        this.handleVolumePanstart
      );
      // 为文档添加鼠标移动事件监听器，用于在拖动进度条时更新进度
      document.addEventListener("mousemove", this.handleMouseMove);
      // 为文档添加鼠标抬起事件监听器，用于结束进度条拖动
      document.addEventListener("mouseup", this.handleMouseUp);
      // 强制加载音频元数据 这是为了确保音频的 durationchange 事件能够正确触发，避免在某些浏览器或框架中第一次加载时事件不执行的问题
      this.$refs.audio.load();
      // 为timeupdate挂载节流函数 直接在模板内调用节流函数会导致无效
      this.throttledTimeUpdate = this.throttle(this.handleTimeUpdate, 500);
      this.$refs.audio.addEventListener("timeupdate", this.throttledTimeUpdate);
    });
  },
  methods: {
    ...mapActions([
      "addToPlayHistory",
      "updateCurrentTrack",
      "addToDownloadList",
      "setPlayerVisible",
      "setAudioCurrentTime",
      "setIsPlaying",
    ]),
    // #region
    // 更新媒体元数据，用于浏览器媒体控制中心显示 浏览器自带播放组件
    updateMediaMetadata() {
      // 检查浏览器是否支持 MediaSession API
      if ("mediaSession" in navigator) {
        // 设置媒体元数据，包括标题、艺术家、专辑和封面图片
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentMusicItem.songName || "未知标题",
          artist: this.currentMusicItem.arName || "未知艺术家",
          album: this.currentMusicItem.album || "未知专辑",
          artwork: [
            {
              src: this.currentMusicItem.picUrl
                ? this.currentMusicItem.picUrl + "?param=100y100"
                : "@/assets/3.jpg",
              sizes: "96x96", // 默认尺寸
              type: "image/jpeg", // 默认图片类型
            },
          ],
        });
        // 设置播放按钮的事件处理器
        navigator.mediaSession.setActionHandler("play", () => {
          this.play(); // 调用播放方法
        });
        // 设置暂停按钮的事件处理器
        navigator.mediaSession.setActionHandler("pause", () => {
          this.pause(); // 调用暂停方法
        });
        // 设置上一首按钮的事件处理器
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          this.playPrev(); // 调用播放上一首方法
        });
        // 设置下一首按钮的事件处理器
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          this.playNext(); // 调用播放下一首方法
        });
      }
    },
    // 展开歌曲列表
    toggleDrawer() {
      this.$emit("toggleDrawer");
    },
    // 打开播放页
    openPlayerPage() {
      this.setPlayerVisible(!this.playerVisible);
    },
    // 格式化秒数为 MM:SS 格式
    formatTime(second) {
      let minute = 0; // 初始化分钟数
      minute = Math.floor(second / 60); // 计算分钟数
      second = Math.ceil(second % 60); // 计算剩余秒数
      // 如果秒数达到 60，分钟加 1，秒数重置
      if (second >= 60) {
        minute++;
        second = 0;
      }
      // 将分钟和秒数转换为字符串
      minute = String(minute);
      second = String(second);
      // 如果分钟或秒数只有一位数，前面补 0
      minute = minute.length === 1 ? "0" + minute : minute;
      second = second.length === 1 ? "0" + second : second;
      return minute + ":" + second; // 返回格式化后的时间
    },
    // 设置音量
    setVolume(volume) {
      // console.log(`设置音量${Number(volume * 100).toFixed(2)}%`);
      // 设置音频的音量
      if (this.$refs.audio) {
        this.$refs.audio.volume = volume;
      }
    },
    // 切换音量条的显示和隐藏
    toggleVolumeIcon() {
      this.isShowVolume = !this.isShowVolume; // 切换 `isShowVolume` 的布尔值
      if (this.isShowVolume) {
        this.setVolume(this.currentVolume);
      } else {
        this.setVolume(0);
      }
    },
    // 设置音量缓存
    setVolumeCache(volume) {
      localStorage.setItem("volume", volume);
    },
    // 切换播放模式
    setPlayMode() {
      const modeList = ["list", "repeat", "shuffle", "loop"];
      const modeNames = {
        list: "列表播放",
        repeat: "循环列表",
        shuffle: "随机播放",
        loop: "单曲循环",
      };

      // 循环切换播放模式
      const currentIndex = modeList.indexOf(this.playMode);
      this.playMode = modeList[(currentIndex + 1) % modeList.length];

      // 弹窗提示
      this.$message({
        type: "success",
        duration: 800,
        message: modeNames[this.playMode],
      });
    },
    // 切换播放速率
    togglePlaybackRate() {
      // 定义播放速度的范围和步长
      const minRate = 0.5;
      const maxRate = 2.0;
      const step = 0.5;
      // 更新播放速度
      this.playbackRate += step;
      // 如果超过最大值，重置为最小值
      if (this.playbackRate > maxRate) {
        this.playbackRate = minRate;
      }
      // 更新音频播放速度
      this.$refs.audio.playbackRate = this.playbackRate;
    },
    // 收藏歌曲
    toggleCol() {
      console.log("切换喜欢");
      if (!this.currentMusicItem.id) return;
      const item = this.currentMusicItem;
      let localMyCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      if (!localMyCol.songs) {
        localMyCol.songs = [];
      }
      const index = localMyCol.songs.findIndex((i) => i.id == item.id);
      if (item.isCol) {
        localMyCol.songs.splice(index, 1);
        this.$message.success("取消收藏成功！");
        item.isCol = false;
      } else {
        localMyCol.songs.push(item);
        this.$message.success("添加收藏成功！");
        item.isCol = true;
      }
      localStorage.setItem("myCol", JSON.stringify(localMyCol));
    },
    // 下载
    download() {
      if (!this.currentMusicItem.url) return;
      console.log("尝试下载");
      const item = this.currentMusicItem;
      // 传入参数
      const obj = {
        name: item.songName,
        id: item.id,
        url: item.url,
      };
      // confirm 信息
      let msg = "是否下载？"; // 提示信息
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
    // 进度条按下时
    handleProgressPanstart(event) {
      // 播放源并未准备好
      if (!this.isAudioReady()) return;
      this.isDragging = true; // 设置拖拽状态为 true
      // 按下时立即同步进度条
      this.handleMouseMove(event);
    },
    // 音量条按下时
    handleVolumePanstart(event) {
      this.isDraggingVolume = true; // 设置拖拽状态为 true
      // 按下时立即同步进度条
      this.handleMouseMove(event);
    },
    // 全局移动事件
    handleMouseMove(event) {
      // 进度条
      if (this.isDragging) {
        const pageX = event.pageX;
        const bcr = this.$refs.progress.getBoundingClientRect();
        let offsetLeft = pageX - bcr.left;
        // 限制偏移量在进度条容器范围内
        offsetLeft = Math.min(offsetLeft, bcr.width);
        offsetLeft = Math.max(offsetLeft, 0);
        // 设置过渡时间为零
        this.$refs.progressFill.style.transitionDuration = "0s";
        // 更新进度条的宽度
        this.progress = (offsetLeft / bcr.width) * 100;
        // 更新当前播放时间
        const currentTime = (offsetLeft / bcr.width) * this.duration;
        this.currentTime = currentTime;
      }
      //  音量条 playVolume
      if (this.isDraggingVolume) {
        // 获取音量条容器的边界信息
        const bcr = this.$refs.playVolumeWrap.getBoundingClientRect();
        // 获取鼠标或触摸点的  坐标
        const pageX = event.pageX;

        const offsetRight = Math.round(pageX - bcr.left);
        // 设置动画事件为零
        this.$refs.playVolume.style.transitionDuration = "0s";
        // 计算音量值（0 到 1 之间）
        let volume = offsetRight / this.$refs.playVolumeWrap.offsetWidth;
        // 限制音量值在 0 到 1 之间，保证不溢出
        volume = Math.min(volume, 1); // 若值大于1则取1
        volume = Math.max(volume, 0); // 若值小于0则取0
        // 更新当前音量值
        this.currentVolume = volume;
      }
    },
    // 结束拖拽进度条 全局事件
    handleMouseUp() {
      // 判断是否是在拖拽进度条
      if (this.isDragging) {
        this.isDragging = false; // 设置拖拽状态为 false
        // 还原过渡时间
        this.$refs.progressFill.style.transitionDuration = ".15s";
        // 从当前进度开始播放
        this.play({
          currentTime: this.currentTime,
        });
      }
      // 设置音量条
      if (this.isDraggingVolume) {
        this.isDraggingVolume = false;
        // 还原过渡时间
        this.$refs.playVolume.style.transitionDuration = ".15s";
      }
    },
    // 播放逻辑
    play(opts = {}) {
      if (this.audioList.length == 0)
        return this.$message.info("播放列表为空！");
      // 加载音频动画
      this.isLoading = true;
      this.currentMusicItem = this.audioList[this.currentPlayIndex];
      // 主要播放方法
      const handlePlay = () => {
        this.$refs.audio
          .play()
          .then(() => {
            // 关闭音频加载动画
            this.isLoading = false;
            // 设置播放状态
            this.isPlaying = true;
            // 设置总时长
            this.duration = this.$refs.audio.duration;
            // 是否传入时间
            if (opts.currentTime !== undefined) {
              // 设置新的播放时间
              this.$refs.audio.currentTime = opts.currentTime;
            }
            // 是否存在计时器
            if (this.timer) {
              // 更新进度条
              this.currentTime = this.$refs.audio.currentTime;
            } else {
              // 创建计时器进行进度条更新
              this.timer = setInterval(this.playing, this.progressInterval);
            }
            // 添加至历史播放记录
            this.addToPlayHist();
            // 更新媒体元数据
            this.updateMediaMetadata();
          })
          .catch((err) => {
            // 错误处理
            const errorMsg = "错误代码：" + err.code;
            switch (err.code) {
              case 9: {
                errorMsg = "错误！指定的资源未找到";
                break;
              }
              case 10: {
                errorMsg = "错误！网络中断";
                break;
              }
              case 11: {
                errorMsg = "错误！不支持指定的音频格式";
                break;
              }
            }
            // 弹窗提示
            this.$message.error({
              message: errorMsg,
              duration: 2000,
            });
            // 关闭音频加载动画
            this.isLoading = false;
            // 错误处理
            this.handlePlayError(err);
          });
      };
      // 解决 iOS 设备异步请求后无法播放的问题
      if (this.isIOS) {
        // 激活后暂停
        this.$refs.audio
          .play()
          .then(() => {
            this.$refs.audio.pause();
          })
          .catch((error) => {
            console.error("播放失败:", error);
          });
      }
      // 直接播放
      handlePlay();
    },
    // 暂停播放音频
    pause() {
      this.$refs.audio.pause(); // 调用 HTML5 音频的 pause 方法
      this.$nextTick(() => {
        this.clearTimer(); // 清除定时器
        this.isPlaying = false; // 设置播放状态为 false
      });
    },
    // 播放中时的处理 更新进度条
    playing() {
      // 如果正在拖拽进度条，直接返回
      if (this.isDragging) {
        return;
      }
      // 防止页面刷新后audio元素未加载
      if (!this.$refs.audio) {
        return this.clearTimer();
      }
      // 计算进度条的偏移量 百分比
      let offsetLeft =
        (this.$refs.audio.currentTime / this.$refs.audio.duration) * 100;
      // 更新当前播放时间
      this.currentTime = this.$refs.audio.currentTime;
      // 更新进度条的宽度
      this.progress = offsetLeft;
    },
    // 播放上一首
    playPrev() {
      console.log("播放上一首");
      // 如果播放列表为空，直接返回
      if (this.audioList.length === 0) return;
      // 暂停播放
      this.isPlaying = false;
      this.pause();
      const playMode = this.playMode;
      // 随机播放逻辑
      if (playMode == "shuffle") return this.handleShufflePlay();
      let nextPlayIndex = this.currentPlayIndex - 1;
      // 循环列表和顺序列表模式 第一首
      if (nextPlayIndex < 0) {
        if (playMode === "repeat") {
          nextPlayIndex = this.audioList.length - 1;
        } else if (playMode === "list") {
          return this.$message.info("已经是第一首！");
        }
      }
      this.progress = 0;
      const currentId = this.audioList[nextPlayIndex].id;
      this.updateCurrentTrack(currentId);
      // 播放上一首
      // this.$nextTick(() => this.play({ currentTime: 0 }));
    },
    // 播放下一首
    playNext() {
      console.log("播放下一首");
      // 如果播放列表为空，直接返回
      if (this.audioList.length === 0) return;
      // 暂停播放
      this.isPlaying = false;
      this.pause();
      const playMode = this.playMode;
      // 随机播放逻辑
      if (playMode == "shuffle") return this.handleShufflePlay();
      let nextPlayIndex = this.currentPlayIndex + 1;
      // 循环列表和顺序列表模式 最后一首
      if (nextPlayIndex >= this.audioList.length) {
        if (playMode === "repeat") {
          nextPlayIndex = 0;
        } else if (playMode === "list") {
          return this.$message.info("已经是最后一首！");
        }
      }
      this.progress = 0;
      const currentId = this.audioList[nextPlayIndex].id;
      this.updateCurrentTrack(currentId);
      // 播放下一首
      // this.$nextTick(() => this.play({ currentTime: 0 }));
    },
    // 切换音乐时触发
    onDurationchange() {
      this.currentTime = 0;
      this.duration = 0;
    },
    // 播放完毕时触发
    onEnded() {
      // 等待组后一次进度条更新
      setTimeout(() => {
        this.pause();
        this.playNext();
      }, this.progressInterval);
    },
    // #endregion
    // 播放指定索引歌曲
    playSongAtIndex(id) {
      if (id === 0) return;
      let trackId;
      if (this.selectedTrackId === -1) {
        // 播放第一首
        trackId = this.audioList[0].id;
      } else if (this.selectedTrackId === -2) {
        // 重复播放当前音乐
        if (!this.currentMusicItem.id) {
          return this.$message.error("当前没有播放音乐，无法重新播放");
        } else {
          trackId = this.currentMusicItem.id;
        }
      } else {
        // 查找播放index
        let index = 0;
        index = this.audioList.findIndex((item) => {
          return item.id == id;
        });
        // 重置进度和动画
        this.pause();
        this.$refs.audio.currentTime = 0;
        this.duration = 0;
        this.currentTime = 0;
        this.progress = 0;
        this.currentPlayIndex = index;
        // 自动播放
        return this.$nextTick(() => {
          this.play({ currentTime: 0 });
        });
      }
      this.updateCurrentTrack(trackId);
    },
    // 获取播放列表数据
    pushToPlaylist(arr) {
      console.log("获取列表数据");
      // 重置状态
      this.pause();
      this.progress = 0;
      this.currentTime = 0;
      this.duration = 0;
      this.currentMusicItem = arr[0] || {}; // 清空播放列表也会触发
      this.audioList = arr;
    },
    // 添加至播放历史记录
    addToPlayHist() {
      console.log("添加至历史播放");
      this.addToPlayHistory(this.currentMusicItem);
    },
    // 随机播放逻辑
    handleShufflePlay() {
      console.log("随机播放");
      // 创建一个随机索引数组
      const shuffleIndexes = (n) => {
        // 创建一个从 0 到 n-1 的索引数组
        let indexes = [];
        for (let i = 0; i < n; i++) {
          indexes.push(i);
        }
        // 使用 Fisher-Yates 洗牌算法打乱数组
        for (let i = n - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
        }
        // 返回打乱后的索引数组
        return indexes;
      };
      // 是否存在索引数组
      if (this.shuffledIndexArray.length === 0) {
        // 创建随机播放索引数组
        this.shuffledIndexArray = shuffleIndexes(this.audioList.length);
      }
      // 边界值
      if (this.currentShuffledIndex === this.audioList.length) {
        this.shuffledIndexArray = [];
        this.currentShuffledIndex = 0;
        this.pause();
        this.progress = 0;
        this.currentTime = 0;
        return this.$message.info("列表播放完毕！");
      }
      // 获取下一个随机播放索引
      const index = this.shuffledIndexArray[this.currentShuffledIndex];
      // 修改为随机播放索引
      this.currentPlayIndex = index;
      this.$nextTick(() => this.play({ currentTime: 0 }));
      // 随机索引数组 index 自增
      this.currentShuffledIndex++;
    },
    // 播放错误处理
    handlePlayError(error) {
      console.log(error);
      this.$message.error("播放错误！");
    },
    // 清除定时器
    clearTimer() {
      clearInterval(this.timer); // 清除定时器
      this.timer = null; // 重置定时器
    },
    // 播放源是否准备就绪
    isAudioReady() {
      const audio = this.$refs.audio;
      return audio ? audio.readyState === 4 : false;
    },
    // 节流函数
    throttle(fn, wait) {
      let throttled = false;
      return function (...args) {
        if (!throttled) {
          fn.apply(this, args);
          throttled = true;
          setTimeout(() => {
            throttled = false;
          }, wait);
        }
      };
    },
    // 向vuex同步当前播放时间
    handleTimeUpdate(e) {
      this.setAudioCurrentTime(e.target.currentTime);
    },
  },
};
</script>

<style lang="less" scoped>
.audio-player {
  position: relative;
  height: 68px;
  // 进度条
  .progress-bar {
    cursor: pointer;
    position: relative;
    width: 100%;
    height: 5px;
    background-color: var(--progress-bar-bg-color);
    .progress-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 4px;
      transition: all 0.15s;
      border-radius: 0 3px 3px 0;
      background: linear-gradient(
        to right,
        var(--nav-bg-color),
        var(--primar-color)
      );
    }
    &:hover .progress-fill {
      height: 8px;
      top: -2px;
    }
  }
  // 控制面板
  .control-panel {
    padding: 0 34px;
    height: 63px;
    display: flex;
    justify-content: space-between;
    position: relative;
    //  歌曲信息
    .song-info {
      display: flex;
      align-items: center;
      width: auto;
      // 头像
      .song-avatar {
        flex: 0 0 50px;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 12px;
        overflow: hidden;
        cursor: pointer;
        position: relative;
        border: solid 1px var(--nav-color);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        pointer-events: auto;
        &::after {
          content: "";
          position: absolute;
          opacity: 0;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          transition: opacity 0.3s;
          pointer-events: none; /* 允许点击事件穿透 */
        }
        &:hover {
          &::after {
            opacity: 0.3;
          }
        }
      }
      .song-details {
        .song-name {
          max-width: 380px;
          font-size: 14px;
          color: var(--primary-text-color);
          margin-bottom: 6px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .artist-name {
          font-size: 12px;
          color: var(--secondary-text-color);
          white-space: nowrap; /* 防止内容换行 */
        }
      }
      // 试听
      .version {
        flex: 0 0 50px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 20px;
        & > span {
          color: #fe7360;
          border: 1px solid #fe7360;
          box-sizing: border-box;
          font-size: 10px;
          padding: 2px;
        }
      }
    }
    // 播放控制
    .playback-controls {
      position: absolute;
      width: 114px;
      height: 100%;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > div {
        cursor: pointer;
      }
      .prev-trak,
      .next-track {
        margin-top: -6px;
        color: var(--primary-text-color);
        & > i {
          font-size: 10px;
        }
      }
      .toggle-play {
        width: 30px;
        height: 30px;
        // background-color: #a89dfa;
        background: var(--primar-color);
        border-radius: 40%;
        text-align: center;
        color: #fff;
        line-height: 28px;
        & > i {
          font-size: 12px;
        }
        // 加载状态
        & .play_load {
          font-size: 14px;
        }
        .icon-bofang {
          margin-left: 2px;
        }
      }
    }
    // 功能控制
    .media-controls {
      display: flex;
      align-items: center;
      .controls-icon {
        flex: 0 0 25px;
        width: 25px;
        height: 25px;
        line-height: 22px;
        border-radius: 10px;
        text-align: center;
        margin-left: 10px;
        color: var(--primary-text-color);
        transition: background 0.15s;
        cursor: pointer;
        &:hover {
          background-color: var(--primary-button-hover-color);
          // background-color: #9c91f8;
        }
        & > i {
          font-size: 12px;
        }
      }
      // 时间进度
      .player-time {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-right: 35px;
      }
      // 歌词
      .show-lyrics {
      }
      // 收藏
      .toggle-col {
        & .icon-xihuan2 {
          color: red;
        }
      }
      // 下载
      .download-track {
        & > i {
          font-size: 14px;
        }
      }
      // 倍速
      .play-rate {
        font-size: 12px;
        height: 25px;
        line-height: 25px;
        padding: 0 6px;
        border-radius: 8px;
        text-align: center;
        margin-left: 10px;
        color: var(--primary-text-color);
        transition: background 0.15s;
        cursor: pointer;
        &:hover {
          background-color: var(--primary-button-hover-color);
        }
      }
      // 音量
      .play-volume-icon-wrap {
        display: flex;
        align-items: center;
        .toggle-volume {
          margin-right: 10px;
          &.muted {
            background-color: var(--primar-color);
          }
        }
        .play-volume-wrap {
          width: 60px;
          cursor: pointer;
          background-color: var(--play-volume-wrap-color);
          .play-volume {
            transition: all 0.15s;
            height: 4px;
            background: var(--primar-color);
            border-radius: 3px;
          }
          &:hover .play-volume {
            height: 8px;
          }
        }
      }
      // 模式
      .play-mode {
      }
      // 播放列表
      .show-play-list {
        & > i {
          font-weight: bold;
        }
      }
    }
  }
}
</style>
