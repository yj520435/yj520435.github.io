const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  devServer: {
    proxy: 'https://www.googleapis.com/blogger/v3/blogs/'
  }
})