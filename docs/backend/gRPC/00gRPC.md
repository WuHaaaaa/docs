---
title: 常规用法
date: 2020-12-29
categories:
 - 后端
tags:
 - .NET Core Grpc
author: Ruan
---

### 前言

> 最近在学`gRPC`，看了一下，还是挺有用的，先记录一些笔记

### 正文

#### 一些常规用法

```protobuf
syntax = "proto3";		//不在头部声明，则使用proto2协议

import "date.proto";	//导入其他包

//假设打包，C#的命名空间就是My.Project
package  my.project;

option csharp_namespace = "My.WebApis"; //假设加上这句，上面的命名空间会变成这个，但是在proto文件里面，他的包还是上面的my.project

message Person{			//定义一个message，类似于C#类
  int32 id = 1;			//定义一个 tag int32是数据类型， id是名称，1是tag（tag不能重复，常用建议使用1-15(占一个bit)，不常用用16-2^32-1(占用2bit)），19000-19999是保留的，不能用
  string name = 2;
  float height = 3;
  float weight = 4;
  bytes avatar = 5;
  string email = 6;
  bool email_verifed = 7;

  repeated string phone_number = 8;			//类似List<T> repeated 表示存在多个

  //保留字段
  reserved 9,10,11 to 20;  //数值，字符串，分开		一个字段，若不使用，而且后面也不许其他人使用tag，那么就可以使用reserved表明
  reserved "foo","bar";
  //也可以使用 OBSOLETE_xxxx 来表示字段已经废弃了
  //例: bool OBSOLETE_email_verifed = 7;


  enum Gender{
    option allow_alias = true;  //允许枚举值别名
    NOT_SPECIFIED = 0;		//枚举默认从0开始
    FEMALE = 1;
    WOMAN = 1;		//需要设置允许别名，tag才能重复
    MALE = 2 ;
    MAN = 2;

    reserved 7,8,9,20 to max; 	//保留枚举中的值，max表示可能的最大值
    reserved "BOY","GIRL";		//枚举中也可以存在保留字段
    
    
  }

  Gender gender = 21;

  Date birthday = 22;		

  repeated Address address = 23;	//可以自定义属性

  message Address{
    string province = 1;
    string city = 2;
    string zip_code = 3;
    string street = 4 
    string number = 5;
  }
}

```

#### 默认值

默认值要不影响业务逻辑（无法区分的默认值可能对程序造成破坏性影响）

比如人口`pop`，如果要赋默认值，则可以赋值`-1`

或者在代码中进行判断

枚举中的默认值：

```protobuf
enum POST{
	UNSPECIFIED = 0;
	DEVELOPER = 1;
	TESTER = 2;
	//假设这时候程序一端接收到一个值为3的枚举，那么它会默认当前值为0
}
```

#### 生成代码（打包，工具protocol buffer 编译器，protoc）

将`first.proto`编译生成到`csdir`文件夹中

```bash
protoc --csharp_out=csdir *.proto 
```

生成当前目录下所有的`proto`文件到指定目录中

```bash
protoc --csharp_out=csdir *.proto 
```

### 简单理解原理

#### 简单理解结构

![](https://i.imgur.com/OG39Q8a.png)

`Client`与`Server`不直接通信，而是通过proto文件生成的代码来解释

但是生成的代码不负责传输，传输层使用的是`protocol buffers`协议传输，并且在设计的时候，这个协议采用可插拔方式，若功能不满足，则可以自己参考文档开发自己的传输类型

#### 设计步骤

![](https://i.loli.net/2021/01/05/lLCIV5ecsH9kYWt.png)

+ 定义消息，即：创建`.proto`文件
+ 生成代码，执行打包命令
+ 开发`Client/Server`，具体的业务逻辑

#### 生命周期

![](https://i.loli.net/2021/01/05/SPcoZj1ClgFR4Vd.png)

如果需要身份认证，需要在`gRPC`里面实现

#### 身份认证

不是用户的身份认证，而是多个`server`和`client`之间的认证，分辨谁是谁，并且进行数据传输

四种认证机制：

1. 不采取任何措施的连接（不安全连接）

   采用HTTP1，使用明文在网络上传输，不需要任何特殊处理，快速建立`gRPC`的情况，可以后续再添加安全处理

2. `TLS/SSL`连接，`client`会对证书进行安全认证，需要做一些额外的工作

3. 基于`Google Token`身份认证，在安全连接（HTTPS）之上使用

4. 自定义身份认证提供商（OAuth2）

#### 消息传输类型

四种传输类型：

1. 一元消息（请求——响应）

   消息格式：**（即使请求不需要传输数据，也要在请求传输一个空对象）**

   ```protobuf
   rpc methodname (requestmessagetype) returns (responsemessagetype)
   ```

2. server streaming（流），server把数据streaming回给client（分成多块返回）

   消息格式：（不会把整个消息一起返回，而是把消息拆分多次发送，比如**流视频**）

   ```protobuf
   rpc methodname (requestmessagetype) returns (stream responsemessagetype) 
   ```

3. client streaming，client把数据streaming给server（多块）

   消息格式：（分多次传输，比如**上传文件**，server在接收时会一直等待，直到接收完所有的块，才会处理，返回） 

   ```protobuf
   rpc methodname (stream requestmessagetype) returns (responsemessagetype) 
   ```

4. 最后是双向的streaming

   消息格式：（client，先发送一次，后面接着发，server会将收到的先处理，返回，后面接着返回）**异步**

   ```protobuf
   rpc methodname (stream requestmessagetype) returns (stream responsemessagetype) 
   ```

#### Demo



