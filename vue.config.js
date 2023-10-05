const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'docs',
  devServer: {
    proxy: 'https://drive.google.com/'
  }
})