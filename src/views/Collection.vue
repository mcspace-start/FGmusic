<template>
  <div class="col_main">
    <!-- 左侧 -->
    <div class="left">
      <div class="head">
        <!-- 标题 -->
        <div class="title">收藏{{ compLabelMap[activeComp] }}</div>
        <!-- 按钮 -->
        <div class="buttons">
          <div class="btn" @click="handleClear">
            清空{{ compLabelMap[activeComp] }}
          </div>
        </div>
      </div>
      <!-- 组件渲染 -->
      <div class="content">
        <component
          :is="activeComp"
          :opts="{
            type: 'col',
          }"
          :visAreas="visAreas"
          :key="key"
        >
        </component>
      </div>
    </div>
    <!-- 右侧菜单 -->
    <div class="right">
      <div class="menu_wrapper">
        <el-menu default-active="SongsListTable" @select="handleSelect">
          <el-menu-item index="SongsListTable">
            <span slot="title">收藏歌曲</span>
          </el-menu-item>
          <el-menu-item index="ArtistsList">
            <span slot="title">收藏歌手</span>
          </el-menu-item>
          <el-menu-item index="Playlist">
            <span slot="title">收藏歌单</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
  </div>
</template>

<script>
import SongsListTable from "../components/SongsListTable.vue";
import ArtistsList from "../components/ArtistsListPage.vue";
import Playlist from "../components/PlaylistPage.vue";
export default {
  name: "Collection",
  components: { SongsListTable, ArtistsList, Playlist },
  data() {
    return {
      // 隐藏配置项
      visAreas: {
        duration: true, // 默认为sonsListTable
      },
      activeComp: "SongsListTable",
      key: 0, // 用于刷新组件渲染数据
      compLabelMap: {
        SongsListTable: "歌曲",
        ArtistsList: "歌手",
        Playlist: "歌单",
      },
    };
  },
  methods: {
    // nav切换时
    handleSelect(index) {
      this.visAreas = {};
      // 设置组件内隐藏项
      switch (index) {
        case "SongsListTable":
          this.visAreas = {
            duration: true,
          };
          break;
        case "ArtistsList":
          this.visAreas = {
            head: true,
          };
          break;
        case "Playlist":
          this.visAreas = {
            head: true,
            tags: true,
            max: true,
          };
          break;
      }
      this.activeComp = index;
    },
    // 清空按钮事件
    handleClear() {
      switch (this.activeComp) {
        case "SongsListTable":
          this.clearColSongs();
          break;
        case "ArtistsList":
          this.clearColArtists();
          break;
        case "Playlist":
          this.clearPlaylists();
          break;
        default:
          break;
      }
    },
    // 清空收藏歌曲
    clearColSongs() {
      const myCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      // 如果没有收藏的歌曲，直接返回
      if (!myCol.songs || myCol.songs.length === 0) return;

      this.$confirm("确定清空收藏歌曲吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "messageBox",
      })
        .then(() => {
          this.$message.info("收藏歌曲已清空");
          myCol.songs = [];
          localStorage.setItem("myCol", JSON.stringify(myCol));
          this.key++;
          if (this.key > 1000) this.key = 0;
        })
        .catch(() => {});
    },
    // 清空收藏歌手
    clearColArtists() {
      const myCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      if (!myCol.songs || myCol.artists.length === 0) return;
      this.$confirm("确定清空收藏歌手吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        customClass: "messageBox",

        type: "warning",
      })
        .then(() => {
          this.$message.info("收藏歌手已清空");
          myCol.artists = [];
          localStorage.setItem("myCol", JSON.stringify(myCol));
          this.key++;
          if (this.key > 1000) this.key = 0;
        })
        .catch(() => {});
    },
    // 清空收藏歌单
    clearPlaylists() {
      const myCol = JSON.parse(localStorage.getItem("myCol") || "{}");
      if (myCol.playlists.length == 0) return;
      this.$confirm("确定清空收藏歌单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "messageBox",
      })
        .then(() => {
          this.$message.info("收藏歌单已清空");

          myCol.playlists = [];
          localStorage.setItem("myCol", JSON.stringify(myCol));
          // 刷新组件渲染
          this.key++;
          if (this.key > 1000) this.key = 0;
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="less">
.col_main {
  display: flex;
  height: 100%;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    .head {
      height: 48px;
      flex: 0 0 48px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      padding: 0 28px 0 10px;

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
            color: #fff;
            background-color: var(--primar-color);
            box-shadow: 0 16px 14px var(--secondary-shadow-color);
            transform: translateY(-4px);
          }
        }
      }
    }
    .content {
      height: 100%;
    }
  }
  .right {
    margin-left: 25px;
    width: 156px;
    flex: 0 0 156px;
    .menu_wrapper {
      background: var(--primar-color);
      padding: 45px 30px 35px 30px;
      border-radius: 22px;
      .el-menu {
        background-color: transparent;
        border: none;
      }
      .el-menu-item {
        height: 43px;
        line-height: 40px;
        border-radius: 16px;
        margin-bottom: 10px;
        transition: all var(--transition-duration);
        color: #fff;
        font-weight: bold;
        font-size: 14px;
        text-align: center;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          height: 1px;
          width: 14px;
          border-radius: 2px;
          border: 2px solid var(--primar-color);
          background-color: var(--primar-color);
          opacity: 0;
        }
        &:focus {
          background: transparent;
        }
        &:hover {
          background-color: #fff;
          color: var(--primar-color);
          &::before {
            opacity: 1;
          }
        }
        &:active {
          transform: scale(1.1);
        }
        &.is-active {
          background-color: #fff;
          color: var(--primar-color);
          &::before {
            opacity: 1;
          }
        }
      }
    }
  }
}
</style>