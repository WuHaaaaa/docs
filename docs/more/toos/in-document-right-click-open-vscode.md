---
title: 文件夹内右键vscode打开
date: 2020-02-08
categories:
 - 折腾
tags:
 - vscode
author: Ruan
---

## 前言

> 一个偶然的发现，学习`WebApi`的时候，看到居然可以右键打开`VSCode`，网上搜了一下，答案还真不少，赶紧学习一波，哈哈哈哈，真香

## 正文

1. 打开注册表，`[win]`+`[R]`，输入`regedit`
2. 找到目录：`计算机\HKEY_CLASSES_ROOT\Directory\Background\shell`
3. 在`shell`下，新建**项**，名为`vscode`
4. 点击`vscode`，默认的数值数据改为`Open With Code`
5. 在`vscode`，新建**字符串值**，数值改为`vscode`的程序位置所在：`C:\Program Files\Microsoft VS Code\Code.exe`
6. 在左侧菜单中，`vscode`右键，新建项，名为`command`
7. 其中默认值数据为：`"C:\Program Files\Microsoft VS Code\Code.exe" "%V"`
8. 大功告成！！！
9. 真香😋