const path = require('path');

module.exports = {
  title: 'IP Address Utils',
  description: ' ',
  base: '/ip-address-utils/',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: 'GitHub', link: 'https://github.com/oathihs/ip-address-utils' }
    ]
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@dist': path.resolve(__dirname, '../../dist')
      }
    }
  }
};
