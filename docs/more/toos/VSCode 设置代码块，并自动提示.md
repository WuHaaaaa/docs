---
title: VSCode 设置代码块，并自动提示
date: 2020-09-11
categories:
 - 折腾
tags:
 - vscode
author: Ruan
---

## 前言

在写文章的时候，发现`vscode`的`markdown`文件没有响应的代码块，每次创建一个文件，都要写一大堆固定的东西，为此在网上找到一个教程，实现了这个功能

## 正文

首先当然是打开设置：

### 打开选项

文件>首选项>用户代码片段> 

### 进入设置

顶部出现输入框，类似这样

![](https://i.imgur.com/NHxgyq4.png)

### 编写代码块

输入`markdown`，回车

![](https://i.imgur.com/zMp7D66.png)

开始定义我们的代码片段

```json
{
	//标题，供我们自己看，第一个代码块是用于文章开头的
	"VuePress文章标题": {
		//前缀，也就是最终我们输入提示信息，例如，我们输入：md_，将会出现这个代码块
		"prefix": "md_title",
		//代码块，其中内容自定义，$1，表示第一个可输入光标位置，$2,$3,可往后延伸，tab往下移动光标位置
		"body": [
			"---",
			//$TM_FILENAME_BASE:表示当前文件，不含扩展名的文件名，整体是一个选中的状态
			"title: ${1:$TM_FILENAME_BASE}",
			//分别是年-月-日：2020-01-17
			"date: $CURRENT_YEAR - $CURRENT_MONTH - $CURRENT_DATE",
			//下次tab的光标位置
			"tag: $2",
			"---",
			//下下次tab的光标位置
			"$3"
		],
		//描述
		"description": "Markdown 头部",
	},
	//内容，这个功能我主要是利用从别的地方写完，粘贴到这边来，比较方便
	"VuePress文章内容_通过复制": {
		"prefix": "md_content",
		"body": [
			//输入的是剪贴板的内容
			"$CLIPBOARD"
		],
		"description": "Markdown 内容——剪贴板得到",
	}
}
```

### 定义settings.json内容

快捷方式进入`settings.json`中

`[Ctrl]` +`[Shift]`+`[p]`，待出现输入框

输入：`Configure language specific settings…`，回车（不需输完，就有提示）

继续输入：`markdown`

出现settings.json，并自动添加了一个节点`markdown`

看图说话

![](https://i.imgur.com/O3zlq0I.gif)

继续配置内容：（光标移动到相应内容，都有提示，不多说了）

```json
"[markdown]": {
    "editor.wordWrap": "on",
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": false
    }
}
```

当我们配置的时候，也会有提示

![](https://i.imgur.com/RxV9CVv.png)

### 开始使用

![](https://i.imgur.com/zFRuvly.gif)

真香~:😏

## 参考链接

[VSCode 利用 Snippets 设置超实用的代码块](https://juejin.im/post/5d0496415188257fff23b077)

[VSCode Snippets - Markdown](https://mike2014mike.github.io/vscode/2018/08/23/vscode-snippets-markdown/)

## 更新

由于上面的设置代码块，时间那块多了空格，改为以下内容

```json {12,13}
{
	//标题，供我们自己看，第一个代码块是用于文章开头的
	"VuePress文章标题": {
		//前缀，也就是最终我们输入提示信息，例如，我们输入：md_，将会出现这个代码块
		"prefix": "md_title",
		//代码块，其中内容自定义，$1，表示第一个可输入光标位置，$2,$3,可往后延伸，tab往下移动光标位置
		"body": [
			"---",
			//$TM_FILENAME_BASE:表示当前文件，不含扩展名的文件名，整体是一个选中的状态
			"title: ${1:$TM_FILENAME_BASE}",
			//分别是年-月-日：2020-01-17
			//"date: $CURRENT_YEAR - $CURRENT_MONTH - $CURRENT_DATE",
			"date: $CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE",
			//下次tab的光标位置
			"tag: $2",
			"---",
			//下下次tab的光标位置
			"$3"
		],
		//描述
		"description": "Markdown 头部",
	},
	//内容，这个功能我主要是利用从别的地方写完，粘贴到这边来，比较方便
	"VuePress文章内容_通过复制": {
		"prefix": "md_content",
		"body": [
			//输入的是剪贴板的内容
			"$CLIPBOARD"
		],
		"description": "Markdown 内容——剪贴板得到",
	}
}
```

