# FG Music - 音乐播放器

## 项目介绍
FG Music 是一个基于 Vue.js 开发的在线音乐播放器应用，提供音乐播放、搜索、收藏等功能。

## 在线展示

你可以通过以下链接访问项目的展示页面，查看实际运行效果：
[FGMusic 展示页面](https://mcspace-start.github.io/FGmusic/#/MusicLibrary)

## 功能特性
- 音乐播放与控制
  - 播放/暂停/上一首/下一首
  - 音量控制
  - 播放进度控制
  - 播放模式切换
  - 播放速率调节
- 音乐功能
  - 搜索音乐
  - 排行榜
  - 音乐库
  - 歌手列表
  - 下载音乐
  - 音乐收藏功能
- 界面功能
  - 响应式设计
  - 暗色模式支持
  - 歌词滚动显示
  - 主题切换

## 技术栈
### 构建
- Vue 2.6
- Vuex 3.6
- Vue Router 3.5
- Vue CLI 5.0
- Babel

### UI
- Element UI 2.15
- IconFont
- Flex布局
- CSS变量实现暗黑模式
- Less 4.0

### 工具
- Axios 1.7
- File Saver 2.0
- FastAverageColor 9.5

### 优化
- 路由按需导入
- 无限滚动
- 使用CDN导入
- Babel插件优化
- 控制台日志移除

## 开发环境配置
1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run serve
```

3. 构建生产版本
```bash
npm run build
```

## 项目结构
```
src/
  ├── assets/
  ├── components/
  ├── router/
  ├── store/
  ├── style/
  ├── views/
  ├── App.vue
  └── main.js
```

## 环境要求
- Node.js >= 12.0.0
- npm >= 6.0.0

  ​      
