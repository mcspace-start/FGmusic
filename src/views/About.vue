<template>
  <!-- <template functional> -->
  <div class="about_main">
    <!-- 展示 -->
    <div class="content">
      <div class="box">
        <div class="blur_c">
          <div class="fg_logo"><img src="@/assets/fg_logo.png" alt="" /></div>
          <div class="version">v1.0.0</div>
          <div class="app_name">FONGER</div>
          <div class="author">作者：Peng</div>
        </div>
        <div class="blur_lt"></div>
        <div class="blur_rb"></div>
        <div class="bg"></div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="buttons">
      <div class="boxes">
        <div class="btn"><a target="_blank" href="https://gitee.com/mcspace/FGmusic.git">Gitee</a></div>
        <div class="btn"><a target="_blank" href="https://github.com/mcspace-start/FGmusic.git">GitHub</a></div>
      </div>
    </div>
    <div class="decs">
      <div class="decs_i">
        <div
          class="decs_i_content"
          v-for="(item, index) in decsData"
          :key="index"
        >
          <p class="title">{{ item.title }}</p>
          <p class="item" v-for="(i, index_i) in item.items" :key="index_i">
            {{ i }}
          </p>
        </div>
      </div>
    </div>
    <!-- <p>vuex</p>
        <p>vuerouter</p>
        <p>axios</p>
        <p>element-ui</p>
        <p>FastAverageColor</p>
        <p>file-saver</p>
        <p>css变量控制暗黑模式</p>
        <p>iconfont</p> -->
  </div>
</template>

<script>
export default {
  name: "About",
  data() {
    return {
      decsData: [
        {
          title: "构建",
          items: ["Vuex", "Vue Router", "Vue CLI"],
        },
        {
          title: "UI",
          items: [
            "ElementUI",
            "IconFont",
            "Flex布局",
            "CSS变量-暗黑模式",
            "Less",
          ],
        },
        {
          title: "工具",
          items: ["Axios", "File Saver", "FastAverageColor"],
        },
        {
          title: "优化",
          items: ["路由按需导入", "使用CDN导入", "无限滚动", "控制台移除日志"],
        },
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.about_main {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  .content {
    flex: 4;
    display: flex;
    justify-content: center;
    align-items: center;
    .box {
      width: 210px;
      height: 300px;
      position: relative;
      &:hover .bg {
        width: 142px;
        left: 34px;
        transform: skew(0deg);
      }
      // 颜色背景
      .bg {
        transition: all 0.5s;
        border-radius: 10px;
        top: 0px;
        left: 50px;
        position: absolute;
        width: 110px;
        height: 300px;
        background: linear-gradient(to bottom, #fe214c, #fe9a10);
        box-shadow: rgba(238, 156, 44, 0.5) 0px 10px 25px,
          rgba(224, 46, 78, 0.5) 0px -10px 25px;
        transform: skew(15deg);
      }
      // 滤镜板
      .blur_c {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        top: 23px;
        left: 10px;
        width: 190px;
        height: 254px;
        border-radius: 6px;
        z-index: 1;
        // logo
        .fg_logo {
          width: 98px;
          height: 98px;
          & > img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        // 版本
        .version {
          margin-top: 12px;
          width: 58px;
          height: 18px;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.6);
          line-height: 18px;
          text-align: center;
          font-size: 8px;
          color: #444;
        }
        // 软件名
        .app_name {
          margin-top: 8px;
          font-size: 26px;
          color: #fff;
        }
        // 作者
        .author {
          margin-top: 10px;
          font-size: 14px;
          color: #fff;
        }
      }
      // 模糊滤镜
      .blur_c,
      .blur_lt,
      .blur_rb {
        background-color: rgba(255, 255, 255, 0.05); /* 半透明背景 */
        backdrop-filter: blur(6px); /* 背景模糊 */
        -webkit-backdrop-filter: blur(6px); /* 兼容老版本 Safari */
        box-shadow: 0px 0px 6px var(--primary-shadow-color);
      }
      .blur_lt,
      .blur_rb {
        position: absolute;
        border-radius: 6px;
        width: 50px;
        height: 50px;
        z-index: 1;
      }
      .blur_lt {
        top: -40px;
        left: 35px;
      }
      .blur_rb {
        top: 290px;
        right: 35px;
      }
    }
  }
  .buttons {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 30px;
    .btn {
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
      // color: var(--primary-text-color);
      box-shadow: 0 16px 14px var(--primary-shadow-color);
      letter-spacing: 2px;
      border-radius: 10px;
      transition: all var(--transition-duration);
      &:hover {
        background-color: var(--primar-color);
        box-shadow: 0 16px 14px var(--secondary-shadow-color);
        transform: translateY(-4px);
        a {
          color: #fff;
        }
      }
      a {
        color: var(--primary-text-color);
        text-decoration: none;
      }
    }
  }
  .decs {
    position: absolute;
    top: 0;
    left: 0;
    width: 160px;
    height: 100%;
    background: var(--primar-color);
    border-radius: 16px;
    display: flex;
    .decs_i {
      background: var(--secondary-bg-color);
      flex: 1;
      margin: 4px;
      border-radius: 12px;
      padding: 10px;
      overflow-y: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE 10+ */

      .title {
        color: var(--primary-text-color);
        font-size: 16px;
        margin: 6px 0 2px 0;
        background: var(--nav-bg-color);
        padding: 4px 0;
      }
      .item {
        font-size: 14px;
        line-height: 18px;
        border-bottom: 1px solid transparent;
        color: var(--secondary-text-color);
        position: relative;
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          width: 0%;
          background: var(--secondary-text-color);
          transition: width var(--transition-duration);
        }
        &:hover {
          &::after {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>