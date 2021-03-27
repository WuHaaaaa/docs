/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "f932ba3e370f90ae6f2114537ca83650"
  },
  {
    "url": "app.png",
    "revision": "2475b22265f36b629d181ec2ce2415a8"
  },
  {
    "url": "apple-touch-icon.png",
    "revision": "009fe51b49792e13ad14d52191977d88"
  },
  {
    "url": "assets/css/0.styles.f7b3d1c5.css",
    "revision": "0b782c76545549dcc5fe28f6a34a301d"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.b4b51801.js",
    "revision": "7d5995e4efa4ae600d40dfbc3906ea09"
  },
  {
    "url": "assets/js/11.a431a81f.js",
    "revision": "85680a863c17e2c9bf1aa9685842faf9"
  },
  {
    "url": "assets/js/12.1f6b7235.js",
    "revision": "086ec58b0d1380c8773f77eb66912038"
  },
  {
    "url": "assets/js/13.d9ff6aa4.js",
    "revision": "138e8e515ce74769b277628779d395d7"
  },
  {
    "url": "assets/js/14.f7885770.js",
    "revision": "2c048553acce2548c0608992fccbff49"
  },
  {
    "url": "assets/js/15.17c99732.js",
    "revision": "5845259a2baee8748d2d73ce2e20b4b8"
  },
  {
    "url": "assets/js/16.71c687bf.js",
    "revision": "2d7e85f7f0c49b74b68ffd1725fcef6a"
  },
  {
    "url": "assets/js/17.8ad4810f.js",
    "revision": "d7438bbdfe1523f2333bcca9a163c6d1"
  },
  {
    "url": "assets/js/18.fd691143.js",
    "revision": "9377f3e2c5b7e4cc65540d938c4ef26b"
  },
  {
    "url": "assets/js/19.afb702b1.js",
    "revision": "34fd300ace950fbfb3124f1eb6c63f69"
  },
  {
    "url": "assets/js/2.e91ea41e.js",
    "revision": "ab293d853f731fb89c9f8e7033045b1d"
  },
  {
    "url": "assets/js/20.a4e19a04.js",
    "revision": "407533efc35644b91e8947e5a5e15d27"
  },
  {
    "url": "assets/js/21.8b804b37.js",
    "revision": "721fefdaf0190e584192239177c23042"
  },
  {
    "url": "assets/js/22.b82986ab.js",
    "revision": "fe775c761d6060d3966b7bc819a93dfb"
  },
  {
    "url": "assets/js/23.7917dd64.js",
    "revision": "586d2ac212f3719fd7d05760abdbf797"
  },
  {
    "url": "assets/js/24.2b2e5ffb.js",
    "revision": "1758aea55cf0497c339f4210e625c5a4"
  },
  {
    "url": "assets/js/25.48503e12.js",
    "revision": "ee2db3e12434db2967434cab12e79f77"
  },
  {
    "url": "assets/js/26.efa1f7d6.js",
    "revision": "cae784a42eac1d82edffd43bbd8af7a2"
  },
  {
    "url": "assets/js/27.b7c67ff6.js",
    "revision": "48cb590a0d6791a66b70fc9c19db8520"
  },
  {
    "url": "assets/js/28.43e104a6.js",
    "revision": "bce3ee8441673126e22951caf60b068f"
  },
  {
    "url": "assets/js/29.4d280c4e.js",
    "revision": "a218dc32e1c14845183928e28a73fadb"
  },
  {
    "url": "assets/js/3.f31d052a.js",
    "revision": "75d183e1e534c25d190884ab09ab6c88"
  },
  {
    "url": "assets/js/30.b22c2f67.js",
    "revision": "763967d80bdca089d01ef8c1c6327591"
  },
  {
    "url": "assets/js/31.ad804432.js",
    "revision": "556dd91ba5e5ce6e7a6670f24b683c14"
  },
  {
    "url": "assets/js/32.1099049b.js",
    "revision": "aaceab568224b4459b0f926268860bbd"
  },
  {
    "url": "assets/js/33.3dd5e29c.js",
    "revision": "cab08109ab444f718c7156cbfacc1c42"
  },
  {
    "url": "assets/js/34.98d646da.js",
    "revision": "4ad3498f9a5deb7b56b3039ec6fd4762"
  },
  {
    "url": "assets/js/35.8f1d466f.js",
    "revision": "fc3c90bc156f134ad87ddb28101930f4"
  },
  {
    "url": "assets/js/36.bbed7c7a.js",
    "revision": "0a42d7f0ca7146a4f91ece82ee037c01"
  },
  {
    "url": "assets/js/37.777ee62c.js",
    "revision": "6d262cba96945cab44b58bc913216d31"
  },
  {
    "url": "assets/js/38.934e506a.js",
    "revision": "80a6e6bac7d4c43cb82563d02f3229ae"
  },
  {
    "url": "assets/js/39.2e252bff.js",
    "revision": "8d0656d9e44327106fe71754b22fb0b2"
  },
  {
    "url": "assets/js/4.e3a22a46.js",
    "revision": "7b67927a9208f26aefa4e6aae67f0502"
  },
  {
    "url": "assets/js/40.659d935c.js",
    "revision": "4daa9bfd85a49a53f1062aa4d93b6b6a"
  },
  {
    "url": "assets/js/41.f2c2f7ee.js",
    "revision": "0c0fa9b0a4101f8ddd0eb034746dcaa4"
  },
  {
    "url": "assets/js/42.619321e9.js",
    "revision": "65fd830eef7c93d68348d46056387e6e"
  },
  {
    "url": "assets/js/43.42d4eb10.js",
    "revision": "aff692320f1182aa4ca21780be068258"
  },
  {
    "url": "assets/js/44.cb7ff5d2.js",
    "revision": "fcc5207ea25150d6c2e0aff6f8fc3075"
  },
  {
    "url": "assets/js/45.6e09cc4a.js",
    "revision": "711446f59e5d16179d0309c9897a2b75"
  },
  {
    "url": "assets/js/46.dea94a79.js",
    "revision": "cdb11518ee0ef72818d99a6cca6a9fd2"
  },
  {
    "url": "assets/js/47.57b2831e.js",
    "revision": "c6ea8b0b329ef122687ffecd9627ca21"
  },
  {
    "url": "assets/js/48.8e723307.js",
    "revision": "a5b706ef64375e1bb0358ec4085645cc"
  },
  {
    "url": "assets/js/49.e5c8403c.js",
    "revision": "3fb0509edfb383116e34c9f2ce60b4a5"
  },
  {
    "url": "assets/js/5.1f4073b2.js",
    "revision": "bc00cbf88a77f78b66c04395eb55049d"
  },
  {
    "url": "assets/js/50.d6e3c8e4.js",
    "revision": "3c734720ce5c536bcd932bf60388631d"
  },
  {
    "url": "assets/js/51.c3667e29.js",
    "revision": "58ac2f1963a9720c4c4afc4fedef6bb9"
  },
  {
    "url": "assets/js/52.bb18881d.js",
    "revision": "843d6567561113b19ea2c475d8d559b9"
  },
  {
    "url": "assets/js/53.be51bb0b.js",
    "revision": "e1ee26630654af2f9e97a63b9bad7204"
  },
  {
    "url": "assets/js/54.840b7a76.js",
    "revision": "7f288e78fdc05d489ee1d009387385f2"
  },
  {
    "url": "assets/js/55.2fa45451.js",
    "revision": "8c5aff593b3db80e6ae5b1654fa91ff1"
  },
  {
    "url": "assets/js/56.5494f328.js",
    "revision": "e6e0b984af4f7d9f900f3d16a3662b18"
  },
  {
    "url": "assets/js/57.38d0acdd.js",
    "revision": "03c667355cefb95db8f3efdacced7aa6"
  },
  {
    "url": "assets/js/58.6ebf3d7a.js",
    "revision": "e4f768c5ca35452c89d9743589f53eb9"
  },
  {
    "url": "assets/js/59.d3d76087.js",
    "revision": "d3e5791835990d4b0301f6fe6a76185b"
  },
  {
    "url": "assets/js/6.fbc0230d.js",
    "revision": "da6335c227af3cb74844a07c2a6a0256"
  },
  {
    "url": "assets/js/60.967b85b2.js",
    "revision": "dfdf7f38b6f492b74208d744a026ef06"
  },
  {
    "url": "assets/js/61.43942bea.js",
    "revision": "0c1de86d4ebc9cfb4e2da7aeb622c8cc"
  },
  {
    "url": "assets/js/62.2448d643.js",
    "revision": "a45ace2efc4d10d8ae8bd318edd829aa"
  },
  {
    "url": "assets/js/63.2a2d7f97.js",
    "revision": "a60d672b8efaee53891c2ef1ee7ab18a"
  },
  {
    "url": "assets/js/64.42a5680c.js",
    "revision": "f25f3b789b742dcedd4e40880d89d7e8"
  },
  {
    "url": "assets/js/65.12f7634e.js",
    "revision": "cbf26f769251870b78a416ff5ef68c68"
  },
  {
    "url": "assets/js/66.83f182f5.js",
    "revision": "0647eb25b75284e9916c431ab31e98e0"
  },
  {
    "url": "assets/js/67.791074e3.js",
    "revision": "8d54d254ba3972800c98c45a759dd018"
  },
  {
    "url": "assets/js/68.f57897f8.js",
    "revision": "249cde0de07b92c5f59524e986546d6b"
  },
  {
    "url": "assets/js/7.170c203a.js",
    "revision": "cac879d185fda16c22ef889060303b00"
  },
  {
    "url": "assets/js/8.280ea156.js",
    "revision": "84256881c45f5bd5ee8401b80a9ab4b7"
  },
  {
    "url": "assets/js/9.85c7d6b8.js",
    "revision": "2db893350acbd1d75eda27dcf85ea69a"
  },
  {
    "url": "assets/js/app.ebbf42bd.js",
    "revision": "4b2ff28a2b149799b1fc2dc8262617dc"
  },
  {
    "url": "backend/container/index.html",
    "revision": "323c8b79e313e2341a722a9f2da37803"
  },
  {
    "url": "backend/csharp/base/csharp-delegate.html",
    "revision": "62458f2404c7eda3e44deadbdfd341e7"
  },
  {
    "url": "backend/csharp/base/csharp-thread.html",
    "revision": "f9c997ed290bf09784bd0ea271f23199"
  },
  {
    "url": "backend/csharp/csharp-use-exceldatareader-import-excel-file.html",
    "revision": "4c446707ca953f2e7bdb499f013105e5"
  },
  {
    "url": "backend/csharp/dotnet-mvc-customer-remoteattribute-submit-valid.html",
    "revision": "0a73ae8e15c66e2ba86e1ed26a0af9b1"
  },
  {
    "url": "backend/csharp/index.html",
    "revision": "db6826f1de048906bd031330d79e04db"
  },
  {
    "url": "backend/dot-net-mvc5/01asp-dot-net-mvc5.html",
    "revision": "3a236432ca7a0d847fd60b9adc6c8671"
  },
  {
    "url": "backend/dot-net-mvc5/02asp-dot-net-mvc5.html",
    "revision": "d3f1301d6769a0598514669f374f06b9"
  },
  {
    "url": "backend/dot-net-mvc5/03asp-dot-net-mvc5.html",
    "revision": "25f8acd54528e407062bd6b999552a47"
  },
  {
    "url": "backend/dot-net-mvc5/04asp-dot-net-mvc5.html",
    "revision": "0a04cad332bd2fcd8d712c0b321bd5e9"
  },
  {
    "url": "backend/dot-net-mvc5/05asp-dot-net-mvc5.html",
    "revision": "e04f3328e32c61b7e83c2fa68a4d9684"
  },
  {
    "url": "backend/dot-net-mvc5/06asp-dot-net-mvc5.html",
    "revision": "a9bf307b3265a599dc558df3b2200d74"
  },
  {
    "url": "backend/dot-net-mvc5/index.html",
    "revision": "a721a94b7eff807f34d27a778ee7e7a1"
  },
  {
    "url": "backend/gRPC/00gRPC.html",
    "revision": "c96079d57014cdd102a90adb65a38212"
  },
  {
    "url": "backend/gRPC/01gRPC.html",
    "revision": "aeb6dce5d169ede62d58d36a88ba8b7b"
  },
  {
    "url": "backend/gRPC/02gRPC.html",
    "revision": "7cc938ba296211ae3d06d7e6d6ac6954"
  },
  {
    "url": "backend/gRPC/03gRPC.html",
    "revision": "45edcbcddde80106cdfd23960d051fd7"
  },
  {
    "url": "backend/gRPC/04gRPC.html",
    "revision": "e3c998ec224a7ec18064ea151f5e0b3e"
  },
  {
    "url": "backend/gRPC/05gRPC.html",
    "revision": "bd3a1cec5987588ce4ec3cb9c19c5eaa"
  },
  {
    "url": "backend/gRPC/06gRPC.html",
    "revision": "0f6e85e2d34328531006900d56175830"
  },
  {
    "url": "backend/gRPC/07gRPC.html",
    "revision": "297f48fe4c2b5083d5dcb31a4b43a513"
  },
  {
    "url": "backend/gRPC/08gRPC.html",
    "revision": "f3f5e841ba063b146ac14b9f2ad993a7"
  },
  {
    "url": "backend/gRPC/index.html",
    "revision": "32d6d98b50bd32f35a20c95b2078795b"
  },
  {
    "url": "backend/identity-server-4/01oauth2.html",
    "revision": "a43363a5f6ada4d3b848ec99111a712b"
  },
  {
    "url": "backend/identity-server-4/02openid-connect.html",
    "revision": "b77dd4ac73cd940a7c60d0ae908f3e9c"
  },
  {
    "url": "backend/identity-server-4/03identity-server-4.html",
    "revision": "7ee8e704d37f85b725c0f5ab45d3bc90"
  },
  {
    "url": "backend/identity-server-4/index.html",
    "revision": "f8da6b81569ca240b29d641cc4a6dc96"
  },
  {
    "url": "backend/IOC&AOP/index.html",
    "revision": "0ef9c9a8a441709f3af6c34b72373558"
  },
  {
    "url": "backend/micro-service/00-micro-service.html",
    "revision": "09e5162935c17216b78dc25e45e43fb0"
  },
  {
    "url": "backend/micro-service/01-micro-service-single-mode.html",
    "revision": "9ef2efb83f433530263339e9105842cd"
  },
  {
    "url": "backend/micro-service/02-micro-service-nginx.html",
    "revision": "57cb2bf8ca53644b41467458b7fcc817"
  },
  {
    "url": "backend/micro-service/03-micro-service-consul.html",
    "revision": "604c3aba6dd86a73101bb6f079f20ae8"
  },
  {
    "url": "backend/micro-service/04-micro-service-ocelot.html",
    "revision": "8e5d29d997712a3524392c88c4eaafbf"
  },
  {
    "url": "backend/micro-service/Untitled.html",
    "revision": "fec64514a59edb16e7b95472b5c8186f"
  },
  {
    "url": "base/interview/javascript-value-range.png",
    "revision": "869bcbbc99e38b6f63d56e2ab5663b00"
  },
  {
    "url": "bookmark/bookmark-scripts.gif",
    "revision": "b2a54dfaadc2464d22fc6909c7206e09"
  },
  {
    "url": "computer/how-networks-work-1.jpg",
    "revision": "7f320d1baecd3659cb1bb8fd53ad4657"
  },
  {
    "url": "computer/how-networks-work-2.jpg",
    "revision": "4eb385c02824d777f417d3fec686a30d"
  },
  {
    "url": "computer/how-networks-work-3.jpg",
    "revision": "60e7aea37e5103247aafff518f9bb9ce"
  },
  {
    "url": "computer/how-networks-work-4.jpg",
    "revision": "adb42920ea0a2b933f858b761c3661c1"
  },
  {
    "url": "computer/network-architecture-1.jpeg",
    "revision": "5953742ce4466bd2a36ac5d7db535f8f"
  },
  {
    "url": "computer/network-architecture-2.jpeg",
    "revision": "bd2d1a61182cfca81574b2f30f3869bd"
  },
  {
    "url": "frontend/echarts/echarts-set-heatmap-and-bind-event.html",
    "revision": "7dcde29d8740477d9338b178c03c0910"
  },
  {
    "url": "frontend/echarts/index.html",
    "revision": "a8a0b4582a90d76a4f511fb69fa0400b"
  },
  {
    "url": "frontend/javascript/index.html",
    "revision": "1f3f89a50164e7c99daad0efdc0ebc15"
  },
  {
    "url": "frontend/javascript/javascript-func.html",
    "revision": "dbef0c0781e8334705d70fffbc72c237"
  },
  {
    "url": "frontend/javascript/prototype-chains-function.jpg",
    "revision": "8eedf7b0b7a667ee145161d4a53f23a9"
  },
  {
    "url": "frontend/javascript/prototype-chains.jpg",
    "revision": "eaeeff3482a626079a774577eff9aeec"
  },
  {
    "url": "git/git_lifecycle.png",
    "revision": "b65dc1f4245a9a1230e78bac21f5ee6f"
  },
  {
    "url": "git/github-add-ssh-key.png",
    "revision": "9f897b5e1f906c6f540d90791c0492ac"
  },
  {
    "url": "guide/about-me.html",
    "revision": "ecd1dc4417d4200631e8fc72378fbbdd"
  },
  {
    "url": "guide/index.html",
    "revision": "5aeb13e93794eaf554dc9f571a463460"
  },
  {
    "url": "icons/icon-128x128.png",
    "revision": "135c2aba490db14f8200cd772995f35d"
  },
  {
    "url": "icons/icon-144x144.png",
    "revision": "a4271dfcd229369a16522b36b4241afa"
  },
  {
    "url": "icons/icon-152x152.png",
    "revision": "dc7ac2de31649de6f88df341b87d744f"
  },
  {
    "url": "icons/icon-192x192.png",
    "revision": "6171be93b691ce4f9546def624bcadc3"
  },
  {
    "url": "icons/icon-384x384.png",
    "revision": "f5ff44fc10f11d717056f8108e7f4a9d"
  },
  {
    "url": "icons/icon-512x512.png",
    "revision": "cee47d4601b5a5c4dada3693ffd3ef94"
  },
  {
    "url": "icons/icon-72x72.png",
    "revision": "61eb9ebb22b0c68b6e236b859094a865"
  },
  {
    "url": "icons/icon-96x96.png",
    "revision": "c430ea29655773327896f7d65fe94c46"
  },
  {
    "url": "index.html",
    "revision": "c75909bb07167e1aa621d0994aa34fa6"
  },
  {
    "url": "more/books/1984.html",
    "revision": "bed8bfa39685e99c6ff9e9d6e92b6f34"
  },
  {
    "url": "more/books/camellia-stationery-store.html",
    "revision": "0a16263d4a9b6c2f49fcf28c821f62e4"
  },
  {
    "url": "more/books/everything-i-never-told-you.html",
    "revision": "6db498837278e8006d7174a1ca049429"
  },
  {
    "url": "more/books/index.html",
    "revision": "6bfef9bc164aa00104943e0a98ecde01"
  },
  {
    "url": "more/books/to-kill-a-mockingbird.html",
    "revision": "81f3f42e9ee7619039de0bcd41f70557"
  },
  {
    "url": "more/git/git-command.html",
    "revision": "64b42ecf412bab07b9eb28a640f5dc78"
  },
  {
    "url": "more/git/index.html",
    "revision": "46b2f130504b489d57d0c09fdda6e563"
  },
  {
    "url": "more/leetcode/01valid-palindrome.html",
    "revision": "fd51d82eccff4681ff537d28cbce7fcc"
  },
  {
    "url": "more/leetcode/02detect-capital.html",
    "revision": "5954b5b10d287b0ae4222a44e76fbe67"
  },
  {
    "url": "more/leetcode/03design-hashset.html",
    "revision": "c7427fceb0bb9e88935d01863e12e6b0"
  },
  {
    "url": "more/leetcode/04find-pivot-index.html",
    "revision": "aaa6f0257a8ad0f94c6cc65a5416b772"
  },
  {
    "url": "more/leetcode/index.html",
    "revision": "36c1e214c966eed4b94309f029e264b9"
  },
  {
    "url": "more/toos/in-document-right-click-open-vscode.html",
    "revision": "de2133a7c0404ab8738c76f75280dcb9"
  },
  {
    "url": "more/toos/index.html",
    "revision": "aa46590af6c8604cb7bd93bc0f8d8ce9"
  },
  {
    "url": "more/toos/vscode-set-code-block-and-tips.html",
    "revision": "90fe93e79f5d6ea49ef6a1b07c23a315"
  },
  {
    "url": "more/toos/windows-and-ubuntu-system-grub-failed.html",
    "revision": "4dcc3bb84b46f608470ec62c351ffb43"
  },
  {
    "url": "more/toos/work.html",
    "revision": "dd5b1dfefc83bb8e9b5f3d146acea841"
  },
  {
    "url": "more/ubuntu/index.html",
    "revision": "010ef5b0b2e05da3712d75a4fe0c3d27"
  },
  {
    "url": "more/ubuntu/ubuntu-install-mysql.html",
    "revision": "b92968a18a8eff212f28fcd2dd88a049"
  },
  {
    "url": "os/manjaro/konsole-profile-command.png",
    "revision": "ac1c4dd351d9eba32f589e5dee7407be"
  },
  {
    "url": "os/manjaro/screen-flashing-when-recording.png",
    "revision": "3a69b153e25bbc18c0d9bccb0405f4b1"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
