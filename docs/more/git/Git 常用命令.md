---
title: Git 常用命令
date: 2020-09-10
categories:
 - Git
tags:
 - Git
author: Ruan
---
`git init` 初始化项目

`git add readme.txt` 将文件到暂存区

> `git add -f App.class`若某些文件被`.gitignore`忽略了，则可以强制将文件添加到暂存区

`git commit -m "wrote a readme"`  提交代码到本地仓库

`git status` 查看当前`git`代码状态

`git diff readme.txt` 查看被修改后，未提交的文件与已提交文件的区别

`git log` 查看最远到最近的提交日志

`git log --pretty=oneline` 功能同上，更清晰，每次提交只在一行显示

> `git log --graph --pretty=oneline --abbrev-commit`查看分支合并情况
>
> `git log --graph`可以查看分支合并图

`git reset --hard HEAD^` 退回到上个版本

> 当前版本，`HEAD`
>
> 上上个版本，`HEAD^^`
>
> 上100个版本，`HEAD~100`

`git reset --hard c377b8` 回到未来某个版本，防止误退回

`git reflog` 查看命令历史，以便确认回到未来哪个版本

`git checkout -- readme.txt` 丢弃本次修改

> 若还没有add，则撤销就和未修改前一模一样
>
> 若已经add，然后继续修改了，则撤销就和add后的状态一样
>
> 这时候就需要使用另外一个命令
>
> `git reset HEAD readme.txt` 撤销暂存区的修改
>
> 然后继续使用`git checkout -- readme.txt`，丢弃本次修改

`git rm test.txt`从版本库中删除改文件

> 与`git add test.txt`相对应

`ssh-keygen -t rsa -C "youremail@example.com"` 创建`ssh key`

`cat ~/.ssh/id_rsa.pub`查看`ssh key`

`git remote add origin git@github.com:WuHaaaaa/LearnGit.git` 将本地内容关联到远程仓库已创建项目

`git push -u origin master`本地仓库内容推送到远程仓库

> `-u`表示关联本地`master`分支与远程`master`分支
>
> 待到第一次关联，推送成功，后续采用下面命令推送到`mster`分支
>
> `git push origin master`
>
> `git push origin dev`推送dev分支到远程仓库

`git clone git@github.com:WuHaaaaa/LearnGit.git`从远程克隆已有的代码到本地

`git checkout -b dev`创建并切换分支到dev

> 相当于下面两条命令的执行：
>
> `git branch dev` 创建dev分支
>
> `git checkout dev`切换到dev分支
>
> `git switch -c dev`新版使用这个命令，可以创建并切换到dev分支
>
> `git switch master`新版使用这个命令，可以直接切换到master分支
>
> `git checkout -b dev origin/dev`创建远程dev分支到本地

`git branch`查看当前分支

`git merge dev`在当前分支上合并`dev`分支，若当前分支在`master`，则将`dev`合并到`master`分支

> `git merge --no-ff -m "merge with no-ff" dev`禁用`Fast forward`
>
> `--no-ff`，禁用`Fast forward`可以让每次合并分支备注信息也记录到历史中，否则每次合并完，合并记录中不存在本次合并说明

`git branch -d dev`删除`dev`分支

> `git branch -D newFeatures`强制删除未合并的分支

`git stash`保存当前现场，先修改临时BUG，改完，继续恢复现场，继续工作

`git stash list`查看`stash`列表

`git stash pop`恢复最近一次`stash`

> 上面这种，恢复完，自动删除本次`stash`，若不想删除本次stash，则使用如下命令：
>
> `git stash apply`恢复
>
> `git stash drop`删除

`git stash apply stash@{0}`恢复指定`stash`，`stash@{0}`在上面的`查看stash列表`中就有

> `git stash drop stash@{0}`删除也可以指定

`git cherry-pick 4c805e2`将某一次提交复制到某个分支中

> 若当前在`dev分支`中，可以将`issue-101`这个`bug分支`修改的内容复制到`dev`分支中

`git remote`查看远程仓库默认名

> `git remote -v`显示更详细的信息

`git pull`拉取当前分支最新的提交到本地

> `git branch --set-upstream-to=origin/dev dev`若本地dev分支与远程origin/dev分支没有链接，则可以使用

`git tag v1.0`将当前`commit`分支打上标签

> `git tag v0.9 2ebf062`对某一次`commit`打上标签，`commit id`可通过`git log`查看

`git tag`查看所有标签

`git show v0.9`查看0.9这个标签的信息

`git tag -a v0.1 -m "version 0.1 released" 777a5a8`对某一个`tag`添加说明信息

> 当再次使用`git show v0.1`时，就可以查看到具体的信息

`git push origin --tags`将所有本地标签推送到远程仓库

>`git push origin v0.1`推送某个标签到远程

`git tag -d v0.1`删除`0.1`这个标签

>`git push origin --delete v0.1`删除远程仓库的`0.1`标签
>
>`git push origin :refs/tags/v0.9`与上面命令同等作用

`git remote add origin git@gitee.com:ruanheng/LearnGit.git`关联`gitee`远程仓库

`git remote -v`查看远程仓库信息

```bash
$ git remote -v
origin  git@github.com:WuHaaaaa/LearnGit.git (fetch)
origin  git@github.com:WuHaaaaa/LearnGit.git (push)
```

`git remote rm origin`删除已有的`origin`远程仓库

推送到远程仓库，多个仓库的情况

> `git remote add github git@github.com:WuHaaaaa/LearnGit.git`关联到`github`仓库
>
> `git remote add gitee git@github.com:ruanheng/LearnGit.git`关联到`gitee`仓库
>
> ```bash
> $ git remote -v
> gitee   git@github.com:ruanheng/LearnGit.git (fetch)
> gitee   git@github.com:ruanheng/LearnGit.git (push)
> github  git@github.com:WuHaaaaa/LearnGit.git (fetch)
> github  git@github.com:WuHaaaaa/LearnGit.git (push)
> ```
>
> `git push github master`推送到`github`
>
> `git push gitee master`推送到`gitee`

`git config --global color.ui true`让Git显示颜色，让某些地方会显示更加醒目

配置常用`git`命令别名配置

> `git config --global alias.st status`将`git status`改为`git st`
>
> `git config --global alias.co checkout`
>
> `git config --global alias.ci commit`
>
> `git config --global alias.br branch`

> `git config --global alias.unstage 'reset HEAD'`，修改后的命令：
>
> `git unstage readme.txt`等同于如下命令：
>
> `git reset HEAD readme.txt`
>
> `git config --global alias.last "log -1"` 查看最近一次提交信息
>
> `git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"`查看提交记录
