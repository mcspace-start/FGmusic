<template>
  <div class="main_wrapper">
    <!-- 头部 -->
    <div class="head" v-if="!visAreas.head">
      <!-- 歌手 -->
      <div class="gender">
        <div class="nav">
          <div
            class="nav_item"
            @click="toggleActive('gender', 'All')"
            :class="{ active: searchCriteria.gender == 'All' }"
          >
            全部
          </div>
          <div
            class="nav_item"
            @click="toggleActive('gender', 'male')"
            :class="{ active: searchCriteria.gender == 'male' }"
          >
            男歌手
          </div>
          <div
            class="nav_item"
            @click="toggleActive('gender', 'female')"
            :class="{ active: searchCriteria.gender == 'female' }"
          >
            女歌手
          </div>
          <div
            class="nav_item"
            @click="toggleActive('gender', 'band')"
            :class="{ active: searchCriteria.gender == 'band' }"
          >
            乐队
          </div>
        </div>
      </div>
      <!-- 地区 -->
      <div class="region">
        <div class="nav">
          <div
            class="nav_item"
            @click="toggleActive('region', 'All')"
            :class="{ active: searchCriteria.region == 'All' }"
          >
            全部
          </div>
          <div
            class="nav_item"
            @click="toggleActive('region', 'China')"
            :class="{ active: searchCriteria.region == 'China' }"
          >
            华语
          </div>
          <div
            class="nav_item"
            @click="toggleActive('region', 'West')"
            :class="{ active: searchCriteria.region == 'West' }"
          >
            欧美
          </div>
          <div
            class="nav_item"
            @click="toggleActive('region', 'Japan')"
            :class="{ active: searchCriteria.region == 'Japan' }"
          >
            日本
          </div>
          <div
            class="nav_item"
            @click="toggleActive('region', 'Korea')"
            :class="{ active: searchCriteria.region == 'Korea' }"
          >
            韩国
          </div>
          <div
            class="nav_item"
            @click="toggleActive('region', 'Other')"
            :class="{ active: searchCriteria.region == 'Other' }"
          >
            其他
          </div>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search">
        <el-input
          placeholder="输入歌手名"
          v-model="searchValue"
          clearable
          @change="handlerSearch"
        >
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            style="cursor: pointer"
          ></i>
        </el-input>
      </div>
    </div>
    <!-- 内容展示区域 -->
    <div
      class="content"
      :class="{
        isShow: opts.isShow || opts.type === 'col',
      }"
      v-loading="loading"
      element-loading-background="var(--loading-bg-color)"
    >
      <!-- retry -->
      <retry v-if="showRetry" @retry="getData"></retry>
      <!-- 渲染列表 -->
      <el-scrollbar
        v-if="!showEmpty && !showRetry"
        ref="scrollContainer"
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
            class="artist_item"
            v-for="item in arListData"
            :key="item.id"
            @click="goToDetailPage(item)"
            :title="item.name"
          >
            <div class="avatar">
              <el-image :src="item.picUrl" fit="cover" lazy>
                <div slot="placeholder">
                  <span>
                    <i class="el-icon-loading"></i>
                  </span>
                </div>
                <div slot="error">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
            <div class="name">
              {{ item.name }}
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
export default {
  name: "ArtistsListPage",
  props: {
    // 接受隐藏项
    visAreas: {
      type: Object,
      default: () => ({
        head: false,
      }),
    },
    opts: {
      type: Object,
      default: () => ({
        type: "list",
        isShow: false,
      }),
    },
  },
  data() {
    return {
      // nav选项
      searchCriteria: {
        gender: "All", // 可选值：male（男歌手）、female（女歌手）、band（组合） All
        region: "All", // 可选值：China（华语）、Europe（欧美）、JapanKorea（日韩） All
      },
      arListData: [
        // {
        // id:0,
        //   picUrl:"",
        //   name:""
        // }
      ],
      searchValue: "", // 搜索内容
      type: "list", // list show search
      limit: 60,
      offset: 0,
      infiniteDisabled: false, // 禁用无限滚动
      keywords: "", // 搜索关键词
      artistCount: 0, // 数量
      loading: false,
      showRetry: false,
      showEmpty: false,
    };
  },
  created() {
    const prop = this.opts;
    // 如果传入的值与当前搜索条件一致，直接返回
    if (prop.gender === this.searchCriteria.gender) return;
    // 更新性别搜索条件
    this.searchCriteria.gender = prop.gender || "All";
    this.type = prop.type;
    // 获取数据
    this.getData();
  },
  methods: {
    // 切换选项
    toggleActive(opts, value) {
      if (this.searchCriteria[opts] === value) return;
      this.searchCriteria[opts] = value;
      this.type = "list";
      // 初始化
      this.arListData = [];
      this.infiniteDisabled = false;
      this.offset = 0;
      this.keywords = "";
      this.searchValue = "";
      this.getData();
    },
    // 跳转至详情页
    goToDetailPage(item) {
      this.$router.push({
        name: "ArtistsDetailPage",
        query: item,
      });
    },
    // 开始获取数据
    async getData() {
      this.loading = true;
      this.showRetry = false;
      this.showEmpty = false;
      const type = this.type;
      const keywords = this.keywords;
      try {
        switch (type) {
          case "show":
            this.limit = 30;
            await this.getListData();
            break;
          case "list":
            await this.getListData();
            break;
          case "col":
            this.infiniteDisabled = true;
            this.getShowColData();
            break;
          case "search":
            await this.getSearchData(keywords);
            break;
          default:
            this.$message.error("歌手列表传入参数错误！");
        }
      } catch (err) {
        console.error(err);
        this.showRetry = true;
        this.$message.error("获取歌手数据失败！");
      }
      // 显示 暂无数据
      if (!this.arListData.length) this.showEmpty = true;
      this.loading = false;
    },
    // 获取歌手
    async getListData() {
      console.log("获取歌手数据");
      const url = "/artist/list";
      const params = {
        type: -1, //  1 男 2 女 3 乐队 -1 全部
        area: -1, // 7华语 96欧美 8日本 16韩国 0其他 -1 全部
        initial: -1, //  b 为顺序排列, 热门传-1,#传 0
        limit: this.limit,
        offset: this.offset,
      };
      // 根据搜索条件设置参数 映射表
      const genderMap = { All: -1, male: 1, female: 2, band: 3 };
      const regionMap = {
        All: -1,
        China: 7,
        West: 96,
        Japan: 8,
        Korea: 16,
        Other: 0,
      };
      params.type = genderMap[this.searchCriteria.gender] || -1;
      params.area = regionMap[this.searchCriteria.region] || -1;
      // 发起请求
      const response = await this.$http.get(url, { params });
      const data = response.data;
      // 检查数据是否存在
      if (!data || !data.artists) {
        return this.$message.error("数据为空!");
      }
      // 没有更多数据了，禁止无限滚动
      if (!data.more) {
        this.infiniteDisabled = true;
      }
      // 创建数据结构
      const arList = data.artists.map(function (item) {
        return {
          id: item.id,
          name: item.name,
          picUrl: item.img1v1Url + "?param=100y100",
        };
      });
      // 去重并更新数据
      const uniqueItems = this.filterUniqueItems(this.arListData, arList);
      this.arListData.push(...uniqueItems);
      this.offset += this.limit;
    },
    // 搜索
    handlerSearch(val) {
      const trimmedVal = val.trim();
      // 如果输入为空，重置并加载默认数据
      if (trimmedVal === "") {
        this.type = "list";
        this.searchValue = "";
        this.resetSearchState();
        this.getData();
        return;
      }
      // 如果输入与当前关键词相同，无需重复搜索
      if (trimmedVal === this.keywords) {
        this.searchValue = this.keywords;
        return;
      }
      console.log("发起搜索");
      // 更新搜索关键词并初始化数据
      this.type = "search";
      this.keywords = trimmedVal;
      this.resetSearchState();
      this.getData();
    },
    // 发起搜索
    async getSearchData(value) {
      console.log("搜索歌手");
      if (!value || value.trim() == "")
        return this.$message.error("搜索参数错误！");
      const url = "/cloudsearch";
      const params = {
        type: 100, // 歌手 1000
        limit: this.limit,
        offset: this.offset,
        keywords: value,
      };
      let { data } = await this.$http.get(url, { params });
      data = data.result || {};
      // 获取全部歌手数量
      this.artistCount = data.artistCount || 0;
      // 边界值处理
      data.artists = data.artists || [];
      const arListData_temp = data.artists.map((item) => ({
        id: item.id,
        name: item.name,
        picUrl: item.picUrl + "?param=100y100",
      }));
      // 如果有去除重复值
      const uniqueItems = this.filterUniqueItems(
        this.arListData,
        arListData_temp
      );
      // 赋值
      this.arListData.push(...uniqueItems);
      this.offset += this.limit;
      if (this.offset > this.artistCount) {
        this.infiniteDisabled = true;
      }
    },
    // 重置搜索状态
    resetSearchState() {
      this.arListData = [];
      this.infiniteDisabled = false;
      this.offset = 0;
      this.searchCriteria.gender = "All";
      this.searchCriteria.region = "All";
    },
    // 展示收藏数据
    getShowColData() {
      console.log("展示收藏歌手数据");
      let myCol = localStorage.getItem("myCol");
      if (myCol) {
        myCol = JSON.parse(myCol);
        this.arListData = myCol.artists || [];
      }
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

<style scoped lang="less">
.main_wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .head {
    height: 32px;
    display: flex;
    padding: 0 44px 0 8px;
    & > div {
      flex: 0 0 auto;
    }
    .gender {
      cursor: pointer;
      margin-right: 10px;
    }
    .region {
      cursor: pointer;
    }
    .search {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
    .nav {
      width: auto;
      display: flex;
      background-color: var(--nav-bg-color);
      color: var(--secondary-text-color);
      border-radius: 8px;
      .nav_item {
        font-size: 12px;
        padding: 8px 20px;
      }
      .nav_item.active {
        position: relative;
        color: var(--secondary-button-hover-color);
        background-color: var(--primar-color);
        border-radius: 8px;
        &::before {
          content: "";
          position: absolute;
          top: 8pxpx;
          left: 8px;
          height: 12px;
          width: 4px;
          background-color: var(--primary-bg-color);
          border-radius: 4px;
        }
      }
    }
    .el-input {
      width: 100%;
      max-width: 280px;
      & i {
        color: var(--primar-color);
        font-weight: bold;
      }
      & /deep/ .el-input__inner {
        height: 32px;
      }
    }
  }
  .content {
    position: absolute;
    width: 100%;
    top: 32px;
    bottom: 0px;
    padding-top: 10px;
    .content_i {
      padding-top: 14px; // 以免scale溢出
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin: 0 -15px;
      .artist_item {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 80px;
        height: 104px;
        margin: 0 15px 10px 15px;
        transition: transform var(--transition-duration);
        &:hover {
          transform: scale(1.05);
        }
        &:hover .avatar {
          border: 2px solid var(--primar-color);
          box-shadow: 0 0 4px var(--secondary-shadow-color);
        }
        // 头像
        .avatar {
          width: 60px;
          height: 60px;
          border: 2px solid transparent;
          font-size: 20px;
          border-radius: 25px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: var(--secondary-bg-color);
          transition: border var(--transition-duration);
          .el-image {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
        // 名称
        .name {
          width: 100%;
          height: 32px;
          font-size: 12px;
          line-height: 32px;
          color: var(--secondary-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
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

    &.isShow {
      padding-top: 0;
      top: 0;
      .content_i {
        margin: 0;
        padding-top: 0;
        .artist_item {
          margin: 12px 10px 0px 10px;
        }
        .name {
          height: 28px;
          line-height: 28px;
        }
      }
    }
  }
}
</style>