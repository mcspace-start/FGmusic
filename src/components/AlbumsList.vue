<template>
  <div class="albums_main">
    <!-- retry -->
    <retry v-if="showRetry" @retry="getData"></retry>
    <!-- 数据 -->
    <div
      v-show="!showRetry"
      class="content"
      ref="content"
      v-loading="loading"
      element-loading-background="var(--loading-bg-color)"
    >
      <el-scrollbar
        ref="scrollContainer"
        style="height: 100%"
        wrap-style="overflow-x: hidden;"
      >
        <div
          class="content_i"
          v-infinite-scroll="getData"
          infinite-scroll-disabled="infiniteDisabled"
          infinite-scroll-immediate="false"
        >
          <div
            class="item"
            v-for="item in albumListData"
            :title="item.name"
            :key="item.id"
            @click="goToPlaylistDetail(item)"
          >
            <!-- 专辑图片 -->
            <div class="albums_img">
              <img v-if="item.picUrl" :src="item.picUrl" alt="" />
              <svg
                v-else
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
            </div>
            <div class="CD">
              <img src="@/assets/CD.png" alt="" />
            </div>
            <div class="albums_name">{{ item.name }}</div>
            <!-- 按钮 -->
            <div class="btn">
              <i class="iconfont icon-bofang"></i>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlbumsList",
  props: {
    id: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      loading: false,
      showRetry: false,
      albumListData: [
        // {
        //   id: 0,
        //   picUrl: "",
        //   name: "###",
        // },
      ],
      infiniteDisabled: false,
      limit: 10,
      offset: 0,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      this.loading = true;
      this.showRetry = false;
      const id = this.id;
      try {
        await this.getAlbumsListData();
      } catch (error) {
        console.error(error);
        this.showRetry = true;
        this.$message.error("获取专辑列表失败！");
      }
      this.loading = false;
    },
    // 获取歌手专辑列表
    async getAlbumsListData() {
      console.log("获取歌手专辑");
      // this.arId = 6452;
      const id = this.id;
      if (!id) {
        this.showRetry = true;
        return;
      }
      const url = "/artist/album";
      // 发起请求
      let { data } = await this.$http.get(url, {
        params: {
          id: id,
          limit: this.limit,
          offset: this.offset,
        },
      });
      if (!data.more) {
        this.infiniteDisabled = true;
      }
      this.offset += this.limit;
      data = data.hotAlbums;
      const albumListData_temp = data.map((item) => {
        return {
          id: item.id,
          picUrl: item.blurPicUrl + "?param=200y200",
          name: item.name,
        };
      });
      // 赋值
      // this.albumListData = albumListData_temp;
      this.albumListData.push(...albumListData_temp);
    },
    // 跳转专辑详情
    goToPlaylistDetail(item) {
      this.$router.push({
        name: "PlaylistDetailPage",
        query: {
          id: item.id,
          name: item.name,
          picUrl: item.picUrl,
          type: "albums", // 表示为专辑类型
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.albums_main {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  .content {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    .content_i {
      .item {
        position: relative;
        display: flex;
        align-items: center;
        height: 80px;
        margin: 20px 20px 0 20px;
        background: var(--primary-bg-color);
        border-radius: 8px;
        overflow: hidden;

        &:hover {
          .albums_img {
            transform: scale(1.1);
          }
          .CD {
            transform: scale(1.1) translateX(-20px);
          }
          .btn {
            opacity: 1;
            transform: translateX(0px);
          }
        }
        // 专辑图片
        .albums_img {
          flex: 0 0 80px;
          width: 80px;
          height: 80px;
          background-color: var(--secondary-bg-color);
          z-index: 1;
          transition: all var(--transition-duration);
          img,
          svg {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .CD {
          flex: 0 0 70px;
          width: 70px;
          height: 70px;
          transform: translateX(-50%);
          transition: all var(--transition-duration);

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .albums_name {
          font-size: 16px;
          color: var(--secondary-text-color);
          margin-left: -15px;
          font-weight: bold;

          display: flex;
          display: -webkit-box; /* 用于兼容旧版本浏览器 */
          -webkit-box-orient: vertical; /* 用于兼容旧版本浏览器 */
          -webkit-line-clamp: 2; /* 用于兼容旧版本浏览器 */
          line-clamp: 2;
          overflow: hidden;

          /* 确保文本换行 */
          word-wrap: break-word;
        }
        // 右侧按钮
        .btn {
          opacity: 0;
          transition: all 0.5s;
          flex: 0 0 30px;
          width: 30px;
          height: 100%;
          color: var(--primar-color);
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-left: auto;
          transform: translateX(6px) scaleX(0.9);
          .iconfont {
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>