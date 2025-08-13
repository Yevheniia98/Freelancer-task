const path = require('path');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pages: {
    index: {
      entry: 'frontend/src/main.js',
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'frontend/src')
      }
    }
  }
}



