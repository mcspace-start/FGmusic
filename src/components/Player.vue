<template>
  <div
    class="player_main"
    :style="{
      '--bgImageUrl': stylePicUrl,
    }"
  >
    <main>
      <!-- 头部按钮 -->
      <div class="options_panel">
        <div
          class="buttonItem"
          :class="{
            active: isExclusiveLyrics,
          }"
          title="独显歌词专注模式"
          @click="isExclusiveLyrics = !isExclusiveLyrics"
        >
          <i class="iconfont icon-geci"></i>
        </div>
        <div class="buttonItem" title="切换频谱样式">
          <i class="iconfont icon-yinbo"></i>
        </div>
        <div class="buttonItem" @click="toggleFullScreen" title="全屏模式">
          <i class="">全</i>
        </div>
        <div class="buttonItem" @click="closePlayer" title="收起">
          <i class="iconfont icon-icon_shuangjiantou-xia"></i>
        </div>
      </div>
      <!-- 左侧频谱 -->
      <div class="spectrum" v-if="!isExclusiveLyrics">
        <!-- 旋转唱片模式 -->
        <div class="album_rotation">
          <div class="album_rotation_wrap">
            <div class="albumImage">
              <img v-if="picUrl !== ''" :src="picUrl" alt="" ref="image" />
              <img v-else src="@/assets/album.jpg" alt="" />
            </div>
            <!-- 唱片 -->
            <div
              class="CD"
              :style="{
                animationPlayState: isPlaying ? 'running' : 'paused',
              }"
            >
              <img v-if="picUrl !== ''" :src="picUrl" alt="" />
              <img v-else src="@/assets/album.jpg" alt="" />
              <div class="cd_center"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧歌词 -->
      <div class="lyrics">
        <!-- 包裹，与空白占位相对 -->
        <div class="lyrics_wrap" v-show="lyrics.length !== 0">
          <div
            class="lyrics-container"
            ref="lyricsContainer"
            :style="{
              flex: isExclusiveLyrics ? '0 0 auto' : 1,
            }"
          >
            <div
              class="lyrics-content"
              ref="lyricsContent"
              :class="{
                dark: isDark,
              }"
              :style="{ marginTop: adjustMargin }"
            >
              <p
                v-for="(line, index) in lyrics"
                :key="index"
                :class="{ active: currentLine === index }"
              >
                {{ line.text }}
              </p>
            </div>
          </div>
          <!-- 歌词延迟显示按钮  -->
          <div class="lyrics_control">
            <div class="btnLyric_wrap" :class="{ dark: isDark }">
              <div class="btnLyric slow" @click="decreaseDelay">
                <i class="iconfont icon-shuangjiantoushang"></i>
              </div>
              <div class="time">{{ lyricsDelay }}</div>
              <div class="btnLyric slow" @click="increaseDelay">
                <i class="iconfont icon-icon_shuangjiantou-xia"></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 空白占位 -->
        <div
          class="space"
          v-if="!isExclusiveLyrics && lyrics.length !== 0"
        ></div>
        <!-- 暂无歌词 -->
        <div class="empty" v-if="!lyrics.length">
          <p>[暂无歌词]</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { FastAverageColor } from "fast-average-color";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Player",
  data() {
    return {
      lyrics: [
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记 " },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词 每一行歌词都有时间" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记 " },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词 每一行歌词都有时间" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
        // { time: 0, text: "这是一首歌的歌词" },
        // { time: 5, text: "每一行歌词都有时间标记" },
        // { time: 10, text: "根据音乐播放进度滚动" },
      ],
      currentLine: 0,
      lyricsDelay: 0, // 歌词延迟显示
      isExclusiveLyrics: false, // 独显歌词
      lyricsMarginTop: 242,
      picUrl: "", //
      isDark: false, // 图片为暗色掉
      isMouseEnterLyrics: false, // 鼠标是否进入歌词区域
    };
  },
  computed: {
    ...mapGetters(["audioCurrentTime", "selectedTrackId", "isPlaying"]),
    // 调整歌词margintop
    adjustMargin() {
      const marginTop = this.currentLine * 42;
      return this.lyricsMarginTop - marginTop + "px";
    },
    // 模糊背景图片
    stylePicUrl() {
      let url = "";
      if (this.picUrl) {
        url = `url("${this.picUrl}")`;
      } else {
        url = `url(${require("@/assets/album.jpg")})`;
      }
      return url;
    },
  },
  watch: {
    // 监控播放进度 同步歌词显示
    audioCurrentTime(time) {
      this.audioLyricsSync(time);
    },
    selectedTrackId(id) {
      if (id > 0) {
        console.log("歌曲变化重新获取歌词和图片");
        this.getData();
      } else {
        this.picUrl = "";
        this.lyrics = [];
      }
    },
    picUrl() {
      this.getAverageColor();
    },
  },
  mounted() {
    // 注册歌词自动滚动回正事件
    if (this.$refs.lyricsContainer) {
      const delay = 2000;
      this.$refs.lyricsContainer.addEventListener("mouseenter", () => {
        this.isMouseEnterLyrics = true;
      });
      this.$refs.lyricsContainer.addEventListener("mouseleave", () => {
        this.isMouseEnterLyrics = false;
        setTimeout(() => {
          this.scrollToTop();
        }, delay);
      });
    }
  },
  methods: {
    ...mapActions(["setPlayerVisible"]),
    // 关闭播放页
    closePlayer() {
      this.setPlayerVisible(false);
    },
    // 歌词滚动条自动回正
    scrollToTop() {
      if (!this.$refs.lyricsContainer) return;
      let currentScrollTop = this.$refs.lyricsContainer.scrollTop; // 当前滚动位置
      const frameRate = 60; // 帧率（60帧/秒）
      const durationMs = 500; // 动画持续时间（毫秒）
      const totalFrames = Math.ceil(frameRate * (durationMs / 1000)); // 总帧数
      const step = Math.ceil(currentScrollTop / totalFrames); // 每帧滚动距离
      let frames = 0; // 已执行的帧数

      const scrollStep = () => {
        if (frames < totalFrames) {
          this.$refs.lyricsContainer.scrollTop -= step;
          frames++;
          if (!this.isMouseEnterLyrics) {
            requestAnimationFrame(scrollStep); // 递归调用
          }
        }
      };

      requestAnimationFrame(scrollStep);
    },
    // 歌词延迟显示
    decreaseDelay() {
      if (this.lyricsDelay > 0) {
        this.lyricsDelay -= 0.5;
        if (this.lyricsDelay > 0) {
          this.$message({
            message: `歌词提前时间 ${this.lyricsDelay} 秒`,
            type: "success",
            duration: 800,
          });
        }
      }
    },
    increaseDelay() {
      if (this.lyricsDelay < 5.5) {
        this.lyricsDelay += 0.5;
        this.$message({
          message: `歌词提前时间 ${this.lyricsDelay} 秒`,
          type: "success",
          duration: 800,
        });
      }
    },
    // 将 LRC 时间戳转换为秒
    timeToSeconds(time) {
      // [mm:ss.ms]
      const [minutes, seconds] = time.split(":");
      // 将秒和毫秒拆开
      const [sec, ms] = seconds.split(".");
      return Number(minutes) * 60 + Number(sec) + Number(ms) / 1000;
    },
    // 解析 LRC 内容
    parseLRC(content) {
      // 分割字符串
      const lines = content.split("\n");
      const lyrics = [];
      lines.forEach((line) => {
        const match = line.match(/\[(\d{2}:\d{2}\.\d{0,3})\](.*)/);
        // const match = line.match(/\[(\d{2}:\d{2}(\.\d{2,3})?)\](.*)/);
        if (match) {
          const time = match[1];
          const text = match[2].trim();
          // 跳过空的歌词行
          if (text) {
            const seconds = this.timeToSeconds(time);
            lyrics.push({ time: seconds, text });
          }
        }
      });
      return lyrics;
    },
    // 同步歌词显示
    audioLyricsSync(time) {
      if (this.lyrics.length === 0) return;
      const delay = this.lyricsDelay;
      this.lyrics.forEach((item, index) => {
        //  判断当前时长加延迟不大于某句歌词
        if (time + delay >= item.time) {
          // 为当前歌词
          this.currentLine = index;
        }
      });
    },
    // 获取歌词数据
    async getData() {
      try {
        await this.getLyrics(this.selectedTrackId);
        await this.getImageUrl(this.selectedTrackId);
      } catch (err) {
        this.$message.error("播放页获取数据失败！");
      }
    },
    // 获取歌词
    async getLyrics(id) {
      const url = "/lyric";
      // const id = 33894312;
      let { data } = await this.$http.get(url, {
        params: {
          id,
        },
      });
      data = data.lrc.lyric;
      if (data) this.lyrics = this.parseLRC(data);
    },
    // 获取图片picUrl
    async getImageUrl(id) {
      const url = "/song/detail";
      const ids = id;

      let { data } = await this.$http.get(url, {
        params: {
          ids,
        },
      });
      const picUrl = data.songs[0].al.picUrl + "?param=300y300";
      this.picUrl = picUrl;
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
    // 获取平均颜色
    getAverageColor() {
      if (!this.picUrl) return;
      const fac = new FastAverageColor();
      fac
        .getColorAsync(this.picUrl)
        .then((color) => {
          // console.log(color);
          // 背景为暗色调
          this.isDark = color.isDark;
        })
        .catch((e) => {
          console.error(e);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.player_main {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 64px;
  z-index: 2;
  overflow: hidden;
  // padding-top: 26pxs;
  background-color: var(--player-bg-color);
  --bgImageUrl: url("@/assets/album.jpg");
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // 使用vue动态修改css变量
    background: var(--bgImageUrl) repeat-x;
    background-size: 30% 100%;
    filter: blur(120px);
    opacity: 0.65;
  }

  & > main {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    @boxShadowHeight: 220px;
    &::after,
    &::before {
      // display: none;
      // border: 1px solid #000;
      position: absolute;
      content: "";
      width: 100%;
      height: @boxShadowHeight;
      left: 0;
      pointer-events: none;
    }
    &::before {
      z-index: 1;
      top: 0;
      background: linear-gradient(
        to bottom,
        rgba(var(--player-shadow-color-rgb), 0.6),
        rgba(var(--player-shadow-color-rgb), 0)
      );
    }
    &::after {
      bottom: 0;
      background: linear-gradient(
        to top,
        rgba(var(--player-shadow-color-rgb), 0.9),
        rgba(var(--player-shadow-color-rgb), 0)
      );
    }
    // 顶部右侧选项按钮
    .options_panel {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 0;
      padding: 18px 8px 18px 18px;
      display: flex;
      .buttonItem {
        width: 25px;
        height: 25px;
        border-radius: 5px;
        margin-right: 10px;
        background-color: transparent;
        transition: background var(--transition-duration);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--primary-text-color);
        &.active {
          background-color: var(--secondary-button-hover-color);
        }
        &:hover {
          background: var(--secondary-button-hover-color);
        }
        & i {
          font-size: 14px;
        }
      }
    }
    // 频谱
    .spectrum {
      flex: 1;
      position: relative;
      // 旋转专辑样式
      .album_rotation {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .album_rotation_wrap {
          position: relative;
          height: 310px;
          width: 310px;
          .albumImage {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: var(--secondary-bg-color);
            box-shadow: 4px 4px 10px var(--primary-shadow-color);
            & img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            z-index: 1;
          }
          // 旋转动画
          @keyframes rotation {
            0% {
              transform: translateY(-50%) translateX(44%) rotate(0deg);
            }
            100% {
              transform: translateY(-50%) translateX(44%) rotate(360deg);
            }
          }
          .CD {
            border-radius: 50%;
            position: absolute;
            right: 0;
            top: 50%;
            width: 275px;
            height: 275px;
            transform: translateY(-50%) translateX(44%);
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            animation: rotation 60s linear infinite;
            animation-play-state: paused;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              opacity: 0.9;
            }
            .cd_center {
              position: absolute;
              width: 102px;
              height: 102px;
              border-radius: 50%;
              overflow: hidden;
              background: url("@/assets/changpian.png") center center;
              background-size: 100%;
            }
          }
        }
      }
    }
    // 歌词区域
    .lyrics {
      flex: 1;
      padding: 26px 0px 26px 0;
      display: flex;
      .lyrics_wrap {
        flex: 2.3;
        display: flex;
        // background-color: #aea2fa;
        justify-content: center;
        .lyrics-container {
          // background-color: blue;
          flex: 1;
          height: 100%;
          overflow-y: scroll;
          position: relative;
          scrollbar-width: none;
          // display: flex;
          // justify-content:center;
          .lyrics-content {
            transition: all var(--transition-duration);
            // margin: 200px 0 1200px 0;
            margin-bottom: 1200px;
            // background-color: #b03c9b;
            display: block;

            // 暗色掉单独设置颜色
            &.dark p {
              color: #fff6e6;
            }
            p {
              font-size: 14px;
              color: #2e2c2c;
              border-radius: 10px;
              font-size: 20px;
              line-height: 28px;
              text-align: center;
              font-weight: 600;
              padding: 7px 10px;
              transition: all var(--transition-duration);
            }
            p.active {
              padding: 10px 10px;
              color: var(--primar-color);

              display: block;
              font-weight: 900;
              font-size: 22px;
              background: #fdfcfc;
              text-shadow: 0px 0px 3px var(--secondary-shadow-color);
            }
          }
        }
        // 设置右侧按钮显示
        &:hover .lyrics_control .btnLyric_wrap {
          opacity: 1;
        }
        // 右侧按钮
        .lyrics_control {
          flex: 0 0 30px;
          // background-color: pink;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .btnLyric_wrap {
            color: var(--player-control-txt-clolr);
            padding-left: 5px;
            font-size: 12px;
            transition: all var(--transition-duration);
            opacity: 0;
            & > div {
              width: 25px;
              height: 25px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 8px;
              & i {
                font-size: 10px;
              }
            }
            .time {
              color: var(--primary-text-color);
              margin: 4px 0;
            }
            .fast,
            .slow {
              cursor: pointer;
              transition: background var(--transition-duration);
              &:hover {
                background-color: var(--secondary-button-hover-color);
              }
            }
          }
          .btnLyric_wrap.dark {
            color: #999;
            .time {
              color: #fff;
              margin: 4px 0;
            }
          }
        }
      }
      .space {
        flex: 1;
      }
    }
    // 暂无歌词
    .empty {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      & > p {
        padding: 10px 10px;
        color: var(--primar-color);
        display: block;
        font-weight: 900;
        font-size: 22px;
        background: #fdfcfc;
        text-shadow: 0px 0px 3px var(--secondary-shadow-color);
        border-radius: 10px;
        line-height: 28px;
      }
    }
  }
}
</style>