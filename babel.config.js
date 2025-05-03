module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    ["component", { libraryName: "element-ui", styleLibrary: { name: "theme-chalk" } }]
  ],
  // 根据环境不同配置不同
  env: {
    development: {
      plugins: []
    },
    production: {
      plugins: [
        ["transform-remove-console", { exclude: ["error", "warn"] }]
      ]
    }
  }
};