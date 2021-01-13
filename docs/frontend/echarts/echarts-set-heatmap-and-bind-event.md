---
title: Echarts 设置周日历图并绑定事件
date: 2020-12-29
categories:
 - 前端
tags:
 - Echarts
author: Ruan
---

文章比较长，算是一个功能开发的完整思路

先来个动图

![](https://i.imgur.com/Xiyur9S.gif)

### 前言

需求：拿到的这么一张图（开局一张图，内容全靠编）

功能大概就是右边选择颜色，左边框选，然后变成相应颜色

![](https://i.imgur.com/p6eB62l.png)

分析：首先是技术栈选择（本来打算自己用`table标签`实现，因为一开始不知道这种图[Echarts](https://imgur.com/a/JwHifnT)里面有没有），后面翻了一下之前的官方社区[Gallery](https://gallery.echartsjs.com/)，有人做过，哈哈哈哈，那就不用自己实现了，而且功能肯定比自己的要强大

>前端框架：`vue.js`
>
>前端控件：`Echart`,`ElementUI`

参考[Gallery](https://imgur.com/a/JwHifnT)的几个项目：

+ https://www.makeapie.com/editor.html?c=xK2E4ZLehh（这个是我一开始参考的项目）
+ https://www.makeapie.com/editor.html?c=xqQV7w0IXV（然后想怎么实现点击事件，发现有人用这个实现了扫雷游戏，真大佬👍）
+ https://www.makeapie.com/editor.html?c=xWSk-5_qTZ（最后做了个大概的样式，自己也传了一下，不过没有加事件，后面看看有空改一下）

### 核心代码

由于其他的一些配置，在我提供的Demo中都有，所以，我这里就放一些核心的东西出来（其实就是怎么实现跨几个图实现框选）

首先：我们拿到两个两个坐标，是可以计算这两个坐标间的所有点的

```javascript
let start_x = 0;
let start_y = 0;

function calc(start, end) {
  let result = [];
  let [sx, sy] = start;
  let [ex, ey] = end;

  if ((ex - sx >= 0) && (ey - sy >= 0)) {
    // [0,0]~[2,2]左上角到右下角
    for (let i = sx; i <= ex; i++) {
      for (let j = sy; j <= ey; j++)
        result.push([i, j])
    }
    console.log(...result);
  } else if (ex - sx < 0 && ey - sy >= 0) {
    // [2,0]~[0,2]左下角到右上角
    for (let i = ex; i <= sx; i++) {
      for (let j = sy; j <= ey; j++)
        result.push([i, j])
    }
    console.log(...result);
  } else if (ex - sx >= 0 && ey - sy < 0) {
    // [0,2]~[2,0]右上角到左下角
    for (let i = sx; i <= ex; i++) {
      for (let j = ey; j <= sy; j++)
        result.push([i, j])
    }
    console.log(...result);
  } else {
    // [2,2]~[0,0]右下角到左上角
    for (let i = ex; i <= sx; i++) {
      for (let j = ey; j <= sy; j++)
        result.push([i, j])
    }
    console.log(...result);
  }
}


calc([0, 0], [0, 3]);//[ 0, 0 ] [ 0, 1 ] [ 0, 2 ] [ 0, 3 ]
```

按上面的代码，可以很容易实现单个热力图中绘制矩形选区（其实不算是绘制，因为出现不了边框，只能用选中样式来仿制一下效果）

![](https://i.imgur.com/N6FzTea.png)

但是如果是多个区域呢？

需要解释一下

![](https://i.imgur.com/F6Plv9l.png)

然后是代码

```js

//鼠标向左还是向右移动，获取对应的dataIndex
export function LeftOrRight(current, start, planData) {
  let selectZoneXY = []
  if (current.zone < start.zone) {	//如果当前区域小于开始区域，就表明框选是从右往左的，反之亦然（因为Echarts是从左往右依次0，1，2，3排列的区域）
    let zoneNum = start.zone - current.zone	//计算跨区域
    for (let i = 0; i <= zoneNum; i++) {	//遍历跨区
      if (i == 0) {						  //i=0的时候，先计算一下起始区域的点位	
        //第一个区域的起止点
        let startXY_1 = [start.x, start.y]
        let startXY_2 = [0, current.y]
        let startXY = CalcMouseOver(planData[start.zone], startXY_1, startXY_2)
        selectZoneXY.push({ zone: start.zone, index: startXY })
      } else if (i > 0 && i < zoneNum) {//TODO:中间点(中间区域，跨了多个区域 zoneNum>1的情况)
        let middleXY_1 = [minutes.length - 1, start.y]
        let middleXY_2 = [0, current.y]
        let middleXY = CalcMouseOver(planData[start.zone - i], middleXY_1, middleXY_2)
        selectZoneXY.push({ zone: start.zone - i, index: middleXY })
      } else {							//计算结束区域，即：最后一次遍历
        let endXY_1 = [minutes.length - 1, start.y]
        let endXY_2 = [current.x, current.y]
        let endXY = CalcMouseOver(planData[current.zone], endXY_1, endXY_2)
        selectZoneXY.push({ zone: current.zone, index: endXY })
      }
    }
    // console.log('end:' + JSON.stringify(selectZoneXY))
    // console.log('right->left')
  } else if (current.zone > start.zone) {     //从左往右框选
    let zoneNum = current.zone - start.zone
    for (let i = 0; i <= zoneNum; i++) {
      if (i == 0) {
        //第一个区域的起止点
        let startXY_1 = [start.x, start.y]
        let startXY_2 = [minutes.length - 1, current.y]
        let startXY = CalcMouseOver(planData[start.zone], startXY_1, startXY_2)
        selectZoneXY.push({ zone: start.zone, index: startXY })
      } else if (i > 0 && i < zoneNum) {//TODO:中间点
        let middleXY_1 = [0, start.y]
        let middleXY_2 = [minutes.length - 1, current.y]
        let middleXY = CalcMouseOver(planData[start.zone + i], middleXY_1, middleXY_2)
        selectZoneXY.push({ zone: start.zone + i, index: middleXY })
      } else {
        let endXY_1 = [0, start.y]
        let endXY_2 = [current.x, current.y]
        let endXY = CalcMouseOver(planData[current.zone], endXY_1, endXY_2)
        selectZoneXY.push({ zone: current.zone, index: endXY })
      }
    }
    // console.log('end:' + JSON.stringify(selectZoneXY))
    // console.log('left->right')
  } else {
    let XY_1 = [start.x, start.y]
    let XY_2 = [current.x, current.y]
    let XY = CalcMouseOver(planData[current.zone], XY_1, XY_2)
    selectZoneXY.push({ zone: current.zone, index: XY })
    // console.log('end:' + JSON.stringify(selectZoneXY))
    // console.log('no zone')
  }
  return selectZoneXY
}
```

核心代码就是上面这些

效果图

![](https://i.imgur.com/ArH6OR5.gif)

贴个链接：https://www.makeapie.com/editor.html?c=xnoPzc9bq-B&v=1

剩下的就是一些基础的东西，比如隐藏了`visualmap`，然后自己实现一个，绑定对应的鼠标覆盖事件即可，事件看看官方的API，还是挺简单的

以上：）


2021年1月13日：补充说明
在上面的示例中，有个问题没有解决
就是鼠标按下，选中相应块的时候，若此时鼠标在 heatmap 之外的区域，鼠标松开，将会造成无法监听鼠标释放事件
以下是我的解决方案：
  在整个地图添加监听事件，遇到鼠标释放，则触发应有的鼠标释放，原有代码不动，这样，就不担心在 heatmap 外的区域释放鼠标了

