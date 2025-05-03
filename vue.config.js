const { defineConfig } = require('@vue/cli-service')

// CDN预加载使用
const externals = {
  vue: 'Vue',
  'vue-router': 'VueRouter',
  vuex: 'Vuex',
  axios: 'axios',
  'element-ui': 'ELEMENT',
  'file-saver': 'FileSaver',
}
// 定义对应CDN链接
const cdn = {
  css: [
    'https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css'
  ],
  js: [
    'https://unpkg.com/vue@2.6.14/dist/vue.min.js',
    'https://unpkg.com/vue-router@3.5.1/dist/vue-router.min.js',
    'https://unpkg.com/vuex@3.6.2/dist/vuex.min.js',
    'https://unpkg.com/axios@1.7.9/dist/axios.min.js',
    'https://unpkg.com/element-ui@2.15.14/lib/index.js',
    'https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js'
  ]
}

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  configureWebpack: config => {
    if (process.env.VUE_APP_CDN === 'true') {
      // 或略打包改为CDN导入
      config.externals = externals
    }
  },
  chainWebpack: config => {
    if (process.env.VUE_APP_CDN === 'true') {
      config.plugin('html')
        .tap(args => {
          // 自定义变量
          args[0].cdn = cdn
          return args
        })
    }
  }
})
