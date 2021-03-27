---
title: OAuth2.0简单介绍
---

## 介绍

关于`OAuth2.0`，网上很多介绍的，可以看一下相关文章

推荐两个：

+ [[[认证 & 授权\] 1. OAuth2授权](https://www.cnblogs.com/linianhui/p/oauth2-authorization.html)](https://www.cnblogs.com/linianhui/p/oauth2-authorization.html)

+ [阮一峰——理解OAuth 2.0](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)

## 正文

简单来说：`OAuth2.0`就是一种授权访问资源的方式（我自己的理解），第三方应用通过用户授权，访问用户另外网站上所拥有的资源

+ 可以使用多种语言，多种方式来实现`OAuth2.0`授权，各种语言都有相应的库实现，使用起来还是比较方便的

+ 只用于授权，不包含身份认证
  + 授权与认证的区别：
    + 授权（Authorization）：你能干什么，`OAuth2.0`
    + 认证（Authentication）：你是谁，`OpenId Connect`

### 大致流程

<img src="K:/Blog/docs/.vuepress/public/images/chrome_Z7zB4AX2Ko.png" alt="chrome_Z7zB4AX2Ko" style="zoom:50%;" />

+ 用户正在使用某第三方应用
+ 第三方应用想要访问用户的某资源，比如图片，然后第三方应用跳到了用户的资源网站的页面
  + 如果需要登录，则用户输入账号密码登录
  + 然后回跳到授权页面
  + 一般是用户点击一个授权的按钮，表示授权完成
+ 第三方应用拿到了用户的授权
+ 去请求授权服务器拿`Token`
+ `Token`被返回后，通过`Token`访问资源，也就是刚开始说到的**图片**

大致流程就是如此

### 授权类型

类型大致分为几种：

1. Authorization Code：授权码；（也就是拿到`Token`，上面流程就是这种）
2. Implicit：隐式许可；（相比第一种，减少了一次获取授权码的步骤，直接拿到`Token`，以及`刷新Token`）
3. Resource Owner Password Credentials：资源所有者密码凭据；（直接使用用户的账号密码获取`Token`）
4. Client Credentials ：客户端凭据。（第三方应用与访问资源属于同一个公司，无需用户授权，可以通过第三方应用自己的名义访问）

5. ...

### 一些术语

+ Socpe：范围，表示资源所有者在被保护资源那边的一些权限，权限范围由开发人员决定

+ Access Token：`token`，访问被保护资源时使用，需要包含`权限范围`、`过期时间`

+ Refresh Token：可选，用于获取`Access Token`的凭据，一般是`token`过期后使用，随着访问次数，权限可以越来越低，下图表示的是`Refresh Token`的工作流程

  ![image-20210127061632586](https://i.loli.net/2021/01/27/cA712VGnKkxO9Qq.png)

