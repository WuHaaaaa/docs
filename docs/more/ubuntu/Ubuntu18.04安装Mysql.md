---
title: Ubuntu18.04安装Mysql
date: 2020-02-29
categories:
 - Ubuntu
tags:
 - 安装Mysql
 - 环境搭建
author: Ruan
---

## 步骤如下

1. 安装Mysql服务、Mysql客户端

   > sudo apt-get update
   >
   > sudo apt-get install -y mysql-server mysql-client

2. 常用命令

   > sudo service mysql start【启动】
   >
   > sudo service mysql stop【停止：】
   >
   > sudo service musql restart【重启：】

3. 初始化mysql，设置登录用户、密码

   > mysql -u root -p
   >
   > \#输入密码

4. 更新密码：

   > UPDATE user SET PASSWORD('newpass') WHERE user = 'root';

5. 配置远程访问：【注释掉指定行即可解除限制】

   > vi /etc/mysql/my.cnf
   >
   > 注释此行：
   >
   > bind-address = 127.0.0.1