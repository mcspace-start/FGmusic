import Vue from 'vue'
import Vuex from 'vuex'
import { saveAs } from "file-saver";
import axios from 'axios'; // 直接引入 axios


Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    selectedTrackId: 0, // 当前播放的音乐索引 -1播放第一首 -2 重新播放 0 清空播放列表后
    playQueue: [], // 播放列表
    playHistory: [], // 播放历史记录
    downloadList: [],// 下载列表
    playerVisible: false,// 播放页是否可见
    audioCurrentTime: 0,// 用于歌词显示
    isPlaying: false,// 用于专辑cd转动
    badges: {},// 控制小红点
    isDark: false,// 是否为暗黑模式
    settings: {},// 设置页配置项
    theme: "",// 主题
    // 音量
  },
  getters: {
    playQueue: state => state.playQueue, // 获取播放列表
    playHistory: state => state.playHistory,// 获取播放历史
    selectedTrackId: state => state.selectedTrackId, // 获取当前播放的音乐索引
    downloadList: state => state.downloadList,
    searchKeywords: state => state.searchKeywords,
    playerVisible: state => state.playerVisible,
    audioCurrentTime: state => state.audioCurrentTime,
    isPlaying: state => state.isPlaying,
    badges: state => state.badges,
    isDark: state => state.isDark,
    settings: state => state.settings,
    theme: state => state.theme,
  },
  mutations: {
    // 设置当前播放的音乐索引
    UPDATE_CURRENT_TRACK(state, id) {
      state.selectedTrackId = id
    },
    // 添加音乐到播放列表 playQueue
    PUSH_TO_PLAY_QUEUE(state, songList) {
      const playableSongs = songList.filter(item => item.isPlayable)
      state.playQueue = playableSongs
    },
    // 清空播放列表
    CLEAR_PLAY_QUEUE(state) {
      state.selectedTrackId = -1;
      state.playQueue.splice(0, state.playQueue.length);
    },
    // 添加到播放历史记录
    ADD_TO_PLAY_HISTORY(state, track) {
      // 检查是否存在相同的 track
      const index = state.playHistory.findIndex(item => item.id === track.id);
      // 如果存在，删除旧的记录
      if (index !== -1) {
        state.playHistory.splice(index, 1);
      }
      // 添加新的 track 到历史记录
      state.playHistory.unshift(track);
      // 保存 20 条历史记录
      if (state.playHistory.length > 30) {
        state.playHistory.pop();
      }
      // 写入本地缓存
      localStorage.setItem("playHistory", JSON.stringify(state.playHistory));
    },
    // 设置整个播放历史记录
    SET_PLAY_HISTORY(state, list) {
      state.playHistory = list
    },
    // 清空播放历史
    CLEAR_PLAY_HISTORY(state) {
      state.playHistory.splice(0, state.playHistory.length);
      // 写入本地缓存 删除整个 playHistory
      localStorage.removeItem("playHistory");
    },
    // 添加下载状体
    ADD_TO_DOWNLOAD_LIST(state, obj) {
      console.log("添加下载任务");
      state.downloadList.push(obj)
    },
    // 清空下载列表
    CLEAR_DOWNLOAD_LIST(state) {
      console.log("清空下载列表");
      state.downloadList.splice(0, state.downloadList.length);
    },
    // 设置播放页显示状态
    SET_PLAYER_VISIBLE(state, status) {
      state.playerVisible = status
    },
    // 同步audio currentTime
    SET_AUDIO_CURRENTTIME(state, time) {
      state.audioCurrentTime = time
    },
    // 设置是否为播放状态
    SET_IS_PLAYING(state, status) {
      state.isPlaying = status
    },
    // 设置小红点状态
    SET_BADGES(state, obj) {
      Vue.set(state.badges, obj.key, obj.status);
    },
    // 设置暗黑状态
    SET_IS_DARK(state, status) {
      state.isDark = status
    },
    // 设置设置项
    SET_SETTINGS(state, options) {
      // 同步设置
      Object.keys(options).forEach(item => {
        if (!state.settings[item]) {
          state.settings[item] = {}
        }
        Object.keys(options[item]).forEach(i => {
          state.settings[item][i] = options[item][i]
        })
      })
      // 修改主题样式
      const theme = options?.appearanceSettings?.themeColor
      if (theme) {
        const themeMap = {
          "蓝色": 'theme1',
          "绿色": 'theme2',
          "红色": 'theme3',
          "紫色": 'theme4',
        }
        if (themeMap[theme])
          state.theme = themeMap[theme];
      }
      // 写入本地缓存
      localStorage.setItem("settings", JSON.stringify(state.settings))
    },
    SET_THEME(state, theme) {
      state.theme = theme
    },
  },
  actions: {
    // 设置当前播放索引
    updateCurrentTrack({ commit }, id) {
      commit("UPDATE_CURRENT_TRACK", id)
    },
    // 添加播放列表
    pushToPlaylist({ commit }, track) {
      // 添加音乐到播放列表
      commit('PUSH_TO_PLAY_QUEUE', track)
    },
    // 清空播放列表 
    clearPlayQueue({ commit },) {
      commit('CLEAR_PLAY_QUEUE')
    },
    // 添加历史
    addToPlayHistory({ commit }, track) {
      // 添加到播放历史记录
      commit('ADD_TO_PLAY_HISTORY', track)
    },
    // 清空播放历史记录
    clearPlayHistory({ commit }) {
      commit('CLEAR_PLAY_HISTORY')
    },
    // 设置整个播放历史列表
    setPlayHistory({ commit }, list) {
      commit("SET_PLAY_HISTORY", list)
    },
    // 添加下载任务
    async addToDownloadList({ commit, dispatch }, info) {
      const obj = {
        id: info.id,
        name: info.name,
        progress: 0,
        status: "downloading" //downloading completed failed
      }
      // 添加红点
      dispatch("setBadges", {
        key: "DownloadList",
        status: true,
      })
      // 添加至下载列表
      commit('ADD_TO_DOWNLOAD_LIST', obj)
      await axios.get(info.url, {
        responseType: "blob",
        // 监控监督条
        onDownloadProgress: (progressEvent) => {
          const percentDownloaded = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // 同步进度条
          obj.progress = percentDownloaded;
          console.log(percentDownloaded);
        },
      })
        .then((response) => {
          // 下载成功
          obj.status = "completed"
          // 保存文件
          const blob = new Blob([response.data], {
            type: "application/octet-stream",
          });
          saveAs(blob, obj.name + ".mp3");
        })
        .catch((error) => {
          obj.status = "failed"
          console.log(error);
        });
    },
    // 清空下载列表
    clearDownloadList({ commit }) {
      commit('CLEAR_DOWNLOAD_LIST')
    },
    // 设置播放页显示状态
    setPlayerVisible({ commit }, status) {
      commit('SET_PLAYER_VISIBLE', status)
    },
    // 设置之当前播放时长
    setAudioCurrentTime({ commit }, time) {
      commit("SET_AUDIO_CURRENTTIME", time)
    },
    // 设置播放状态
    setIsPlaying({ commit }, status) {
      commit("SET_IS_PLAYING", status)
    },
    // 设置小红点
    setBadges({ commit }, obj) {
      commit("SET_BADGES", obj)
    },
    setIsDark({ commit }, status) {
      commit("SET_IS_DARK", status)
    },
    // 设置设置选项
    setSettings({ commit }, options) {
      commit("SET_SETTINGS", options)
    },
  },
  modules: {}
})