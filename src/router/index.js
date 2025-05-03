import Vue from 'vue'
import Home from '../views/Home.vue'
import VueRouter from 'vue-router'
import MusicLibrary from '../views/MusicLibrary.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/MusicLibrary',
    children: [
      // 首页
      {
        path: '/MusicLibrary',
        name: 'MusicLibrary',
        component: MusicLibrary,
        meta: { keepAlive: true }
      },
      // 排行榜
      {
        path: '/Ranking',
        name: 'Ranking',
        component: () => import('../views/Ranking.vue'),
        meta: { keepAlive: true }
      },
      // 收藏
      {
        path: '/Collection',
        name: 'Collection',
        component: () => import('../views/Collection.vue'),
        meta: { keepAlive: true }
      },
      // 下载
      {
        path: '/DownloadList',
        name: 'DownloadList',
        component: () => import('../views/DownloadList.vue'),
        meta: { keepAlive: false }
      },
      // 榜单库
      {
        path: '/RankingLibrary',
        name: 'RankingLibrary',
        component: () => import('../views/RankingLibrary.vue'),
        meta: { keepAlive: true }
      },
      // 榜单详情页
      {
        path: '/RankingDetailPage',
        name: 'RankingDetailPage',
        component: () => import('../components/RankingDetailPage.vue'),
        meta: { keepAlive: false }
      },
      // 设置
      {
        path: '/Settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: { keepAlive: true }
      },
      // 关于
      {
        path: '/About',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: { keepAlive: true }
      },
      // 歌单列表页
      {
        path: '/PlaylistPage',
        name: 'PlaylistPage',
        component: () => import('../components/PlaylistPage.vue'),
        meta: { keepAlive: false }
      },
      // 歌单详情页
      {
        path: '/PlaylistDetailPage',
        name: 'PlaylistDetailPage',
        component: () => import('../components/PlaylistDetailPage.vue'),
        meta: { keepAlive: false }
      },
      // 歌手列表页
      {
        path: '/ArtistsListPage',
        name: 'ArtistsListPage',
        component: () => import('../components/ArtistsListPage.vue'),
        meta: { keepAlive: false }
      },
      // 歌手详情页
      {
        path: '/ArtistsDetailPage',
        name: 'ArtistsDetailPage',
        component: () => import('../components/ArtistsDetailPage.vue'),
        meta: { keepAlive: false }
      },
      // 搜索结果展示页
      {
        path: '/SearchResult',
        name: 'SearchResult',
        component: () => import('../components/SearchResult.vue'),
        meta: { keepAlive: false }
      }

    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
