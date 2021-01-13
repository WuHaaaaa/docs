const pluginConf = require('./config/pluginConf.js');
const navConf = require('./config/navConf.js');
const headConf = require('./config/headConf.js');

module.exports = {
  base:"/docs/",
  title: '',
  description: '记录记录学到的，用到的',
  head: headConf,
  plugins: pluginConf,
  themeConfig: {
    lastUpdated: '上次更新',
    repo: 'WuHaaaaa/WuHaaaaa.github.io',
    editLinks: true,
    editLinkText: '编辑文档',
    docsDir: 'docs',
    nav: navConf,
    logo:"/favicon.ico"
  },
}