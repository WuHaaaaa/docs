(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{448:function(e,v,_){"use strict";_.r(v);var r=_(29),t=Object(r.a)({},(function(){var e=this,v=e.$createElement,_=e._self._c||v;return _("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[_("h2",{attrs:{id:"概述"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#概述"}},[e._v("#")]),e._v(" 概述")]),e._v(" "),_("p",[e._v("注：下面内容由于英语阅读水平有限，大多是基于"),_("strong",[e._v("谷歌浏览器插件彩云小译")]),e._v("（说实话，还挺好用的）翻译的文章")]),e._v(" "),_("h3",{attrs:{id:"是什么"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#是什么"}},[e._v("#")]),e._v(" 是什么？")]),e._v(" "),_("p",[e._v("（官方描述）Docker 是一个用于开发、发布和运行应用程序的开放平台。Docker 使您能够将应用程序与基础结构分离开来，从而可以快速交付软件。使用 Docker，您可以像管理应用程序一样管理基础结构。通过利用 Docker 的快速发布、测试和部署代码的方法，可以显著减少编写代码和在生产环境中运行代码之间的延迟。")]),e._v(" "),_("h3",{attrs:{id:"能干什么"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#能干什么"}},[e._v("#")]),e._v(" 能干什么？")]),e._v(" "),_("ul",[_("li",[e._v("快速开发、持续集成，一致性交付（为啥我电脑可以，你电脑不行？）")]),e._v(" "),_("li",[e._v("响应式部署和扩展（运行在任何本地、开发、云端等环境，根据业务需求，灵活扩展应用）")])]),e._v(" "),_("h3",{attrs:{id:"体系结构"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#体系结构"}},[e._v("#")]),e._v(" 体系结构")]),e._v(" "),_("ul",[_("li",[_("p",[e._v("Client-Server结构（客户端与守护进程）")]),e._v(" "),_("p",[e._v("守护进程：管理Docker对象，如："),_("code",[e._v("Images")]),e._v("，"),_("code",[e._v("Containers")]),e._v("，"),_("code",[e._v("Networks")]),e._v("，"),_("code",[e._v("Volumes")]),e._v("，也可以和其他守护进程通信")]),e._v(" "),_("p",[e._v("客户端：Docker实例，负责执行Docker命令，如："),_("code",[e._v("docker run")]),e._v("，可以与多个守护进程通信")])])]),e._v(" "),_("h3",{attrs:{id:"docker注册表"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#docker注册表"}},[e._v("#")]),e._v(" Docker注册表")]),e._v(" "),_("ul",[_("li",[_("code",[e._v("Docker")]),e._v("注册表存储"),_("code",[e._v("Docker")]),e._v("对象")]),e._v(" "),_("li",[_("code",[e._v("Docker Hub")]),e._v("是公共的注册表中心，任何人都可以使用（官方维护的的公共注册中心），你也可以在其中搭建私人的"),_("code",[e._v("Docker")]),e._v("。")]),e._v(" "),_("li",[e._v("你可以从上面拉取（docker pull）所需映像，也可以提交（docker push）映像")])]),e._v(" "),_("h3",{attrs:{id:"docker的一些术语"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#docker的一些术语"}},[e._v("#")]),e._v(" Docker的一些术语")]),e._v(" "),_("h4",{attrs:{id:"image-映像"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#image-映像"}},[e._v("#")]),e._v(" Image（映像）")]),e._v(" "),_("ul",[_("li",[e._v("是一个只读模板，，基通常一个映像基于另外一个映像，比如你想建立一个基于Ubuntu映像的映像，你可以在其中添加一写你开发所需的程序，比如"),_("code",[e._v("SqlServer")]),e._v("、"),_("code",[e._v("Redis")]),e._v("等，你只需要创建一个"),_("code",[e._v("Dockerfile")]),e._v("的文件，而后在该文件添加一些需要执行的命令，运行后，就会生成一个映像。如果你修改了"),_("code",[e._v("Dockerfile")]),e._v("，只需重新执行一次生成，就会生成一个新的映像")]),e._v(" "),_("li",[_("code",[e._v("Dockerfile")]),e._v("每个命令都会在映像中创建一个Layer（图层），更改"),_("code",[e._v("Dockerfile")]),e._v("，并重新生成映像，就会重新生成图层")])]),e._v(" "),_("h4",{attrs:{id:"container-容器"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#container-容器"}},[e._v("#")]),e._v(" Container（容器）")]),e._v(" "),_("ul",[_("li",[e._v("是映像上可运行的一个实例，可以使用"),_("code",[e._v("Docker API")]),e._v("执行创建、删除、启停等操作")]),e._v(" "),_("li",[e._v("一般情况下，容器之间是隔离的，也可以根据所需配置隔离等级")]),e._v(" "),_("li",[e._v("移除容器时，该容器的任何未存储在持久存储中的更改都会消失（谨慎操作）")])]),e._v(" "),_("h3",{attrs:{id:"docker-run-命令详述"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#docker-run-命令详述"}},[e._v("#")]),e._v(" docker run 命令详述")]),e._v(" "),_("div",{staticClass:"language- extra-class"},[_("pre",{pre:!0,attrs:{class:"language-text"}},[_("code",[e._v("docker run -i -t ubuntu /bin/bash\n")])])]),_("p",[e._v("执行当前命令，会发生以下情况")]),e._v(" "),_("ul",[_("li",[e._v("若本地映像中没有"),_("code",[e._v("Ubuntu")]),e._v("映像，那么"),_("code",[e._v("Docker")]),e._v("会从注册中心（官方维护的Hub）拉取（"),_("code",[e._v("docker pull ubuntu")]),e._v("）一个映像")]),e._v(" "),_("li",[e._v("Docker会创建一个新容器，通过运行"),_("code",[e._v("docker container create")])]),e._v(" "),_("li",[e._v("最后，Docker分配一个读写文件系统给容器，这允许容器可以在该系统上创建文件、生成目录等操作")]),e._v(" "),_("li",[e._v("由于没有配置网络连接，Docker会默认创建一个网络接口连接大容器。其中包括为容器分配一个IP，默认情况下，容器可以使用主机网络连接到外网。")]),e._v(" "),_("li",[e._v("Docker启动容器，执行"),_("code",[e._v("/bin/bash")]),e._v("，由于容器是交互式的，"),_("code",[e._v("-i")]),e._v("、"),_("code",[e._v("-t")]),e._v("这两个标志，可以在终端输出日志同时，也可以使用键盘输入信息")]),e._v(" "),_("li",[e._v("然后执行"),_("code",[e._v("exit")]),e._v("，会终止容器运行，但容器不会被删除，除非你需要删除它时，可以手动执行删除命令。你也可以重新启用它。")]),e._v(" "),_("li")])])}),[],!1,null,null,null);v.default=t.exports}}]);