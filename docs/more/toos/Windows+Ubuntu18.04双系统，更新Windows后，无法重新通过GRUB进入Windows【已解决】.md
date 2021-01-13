---
title: Windows+Ubuntu18.04双系统，更新Windows后，无法重新通过GRUB进入Windows【已解决】
date: 2020-10-24
categories:
 - 折腾
tags:
 - 双系统
 - GURB引导
author: Ruan
---
## 前言

> 注：以下尝试仅供参考，系统这东西，不了解，得从方法面面来分析。
>
> 好几次了，每次想点击从1809升级1903的版本，就会出错，然后就是一大堆的修复，怪谁呢，怪我手贱😓，还怪Windows太霸道，每次都要覆盖Grub引导。
>
> 搞得我现在Ubuntu引导都整没有了。

## 问题截图

![图片来源网络](https://i.imgur.com/rJvzVCs.png)

## 正文

+ 首先准备U盘，8G以上
+ 下载当前出问题的电脑的系统，我的是`win10-1809`，[下载地址](http://msdn.itellyou.cn/)。

+ 准备制作启动盘工具，[下载地址](https://rufus.ie/zh_CN.html)

### 开始制作

+ 选择U盘
+ 选择引导类型=>`镜像文件`=>`选择`，选择下载的系统
+ 选择分区类型（分区类型，可以在文章底部查看）
+ 其他的默认，最后点击**开始**，开始制作启动盘

![](https://i.imgur.com/M5u63LV.png)

### 开始修复

+ Boot模式选用`Legacy`（传统），首选项使用U盘启动

+ 进入后，选择语言，下一步

+ 选择修复系统，疑难解答，启动修复

+ 然后关机重启，首选项使用系统盘启动

+ 若还是有问题（一般都是有问题，不过执行上面这几步，是为了解决部分隐藏的其他问题）

+ 关机重启，选择U盘启动

+ 进入系统，选择语言，下一步

+ 选择修复系统，疑难解答，命令提示符，输入`bootrec /rebuildbcd`

  ```bash
  X:\Source> bootrec /rebuildbcd
  ```

  我的问题解决了🙂。

## 其他参考

上面的解决方案，其实在下面有详细说明：

+ [win10误删引导文件，0xc0000098的解决方案，bcd引导文件受损情况分析]( https://blog.csdn.net/weixin_42252980/article/details/80862638 )
+ [如何修復Windows啟動錯誤0xc0000098？](https://www.reneelab.net/error-0xc0000098-html.html)

Ubuntu18.04，被我搞没了，盘没有删，先留着这个链接，有时间折腾一下

+ [双系统Ubuntu 引导修复（Boot Repair）](https://www.reneelab.net/error-0xc0000098-html.html)

详解UEFI启动，以及其他知识，推荐看一下，增加了解，少走弯路，少给自己挖坑

+ [（译）UEFI 启动：实际工作原理](https://blog.woodelf.org/2014/05/28/uefi-boot-how-it-works.html)
+ [简单讲解UEFI及MBR，及UEFI系统安装引导修复](http://cnxysw.com/?p=722)

## 收集到的有效信息：

### 查看系统配置`msconfig`

+ `[win]`+`[R]`+`msconfig`

+ 可以查看启动项，但是使用原有引导不行，因为windows担心还原问题

  ![](https://i.imgur.com/sD6ywex.png)

### 查看当前系统使用的启动模式`msinfo32`

+ `[win]`+`[R]`+`msinfo32`

+ 可以查看BIOS模式

  ![](https://i.imgur.com/I9qSatN.png)

### 查看当前系统盘使用MBR格式还是GPT格式

+ `我的电脑`=>`鼠标右键`=>`管理`=>`磁盘管理`

  ![](https://i.imgur.com/Hr1Kjtc.png)

## 遇到问题

### 问题一：内存高占用率【未找到答案】

不知什么原因，我的系统使用`UEFI`模式启动，内存开机就会占用`70%-90%`。我的内存是16G的，不应该这样。而且开机启动项也不多，也按照网上的关闭服务`Superfetch`以及`TimeBroker`，但就是不管用。

然后我使用`Legacy`模式启动，内存开机就稳定在`30%~50%`之间，所以也是我为什么一直折腾，要把`Legacy`模式启动成功的原因。

## 最后，建议

网上看到的一句话，送给自己：

> 没事别瞎折腾，系统，稳定最重要

折腾两天，又耽误自己的学习时间😓