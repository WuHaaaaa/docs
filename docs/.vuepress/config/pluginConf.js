const moment = require('moment');
const secretKeyConf = require('./secretKeyConf.js');

moment.locale("zh-cn");

module.exports = {
  '@vuepress/pwa': {
    serviceWorker: true,
    updatePopup: {
      message: "发现新内容可用.",
      buttonText: "刷新"
    }
  },
  '@vuepress/back-to-top': true,
  // '@vuepress/google-analytics': {
  //   'ga': secretKeyConf.ga
  // },
  '@vuepress/medium-zoom': {
    selector: '.content__default img',
  },
  '@vuepress/last-updated': {
    transformer: (timestamp) => moment(timestamp).format('LLLL')
  },
  "vuepress-plugin-auto-sidebar": {
    titleMode: "default",
    titleMap: {
      "guide":"先导",
      "csharp":"C#",
      javascript: "JavaScript",
      "dot-net-mvc5":".NET MVC 5",
      "gRPC":"Grpc",
      "echarts":"Echarts",
      "books":"看过的书",
      "git":"Git",
      "leetcode":"LeetCode",
      "toos":"折腾",
      "ubuntu":"Ubuntu",
    },
    // collapseList: [
    //   "/frontend/javascript/"
    // ]
  }
};