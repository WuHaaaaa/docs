---
title: OpenId Connect 简单介绍
---
## 前言

> `OpenId Connect`：身份认证协议，它可以告诉当前正在使用应用的人是谁，这些人是否正在使用应用，通常是使用一套**安全凭据**让应用证明这一点
>
> 官方定义：`OpenID Connect`是建立在`OAuth2.0`协议上的一个简单的身份表示层，`OpenID Connect`兼容`OAuth2.0`

## 正文

OIDC

+ ID Token：会同`access token`一同发给客户端应用

+ `UserInfo`端点：通过这个端点可以获取用户的信息

+ 提供一组标识身份的`scopes`和`claims`：
  + profile
  + email
  + address
  + phone

OIDC的三个流程（Flow）：

+ Authorization Code Flow：类似Authorization Grant
+ Implicit Flow：类似Implicit Grant
+ Hybrid Flow：前两个流程的混合