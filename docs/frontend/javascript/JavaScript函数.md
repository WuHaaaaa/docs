---
title: JavaScript函数
date: 2020-09-10
categories:
 - 前端
tags:
 - JavaScript
author: Ruan
---
### map()

使用`map()`求数组中元素的平方根：

```javascript
function pow(x) {
    return x * x;
}
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var results = arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
console.log(results);
```

使用`map()`将字符串变成整数：

```javascript
var arr = ['1', '2', '3'];
var r;
r = arr.map((x)=>(parseInt(x)));
console.log(r);
```

### reduce()

使用`reduce()`求数的乘积：

```javascript
function product(arr) {
    return arr.reduce((x,y)=>(x*y));
}

// 测试:
if (product([1, 2, 3, 4]) === 24 && product([0, 1, 2]) === 0 && product([99, 88, 77, 66]) === 44274384) {
    console.log('测试通过!');
}
else {
    console.log('测试失败!');
}
```

想办法把一个字符串`'13579'`变成数字`13579`，不使用`parseInt()`。

```javascript
function string2int(s) {
    return s.split("").map((c)=>(c*1)).reduce((x,y)=>(x*10+y))
}

// 测试:
if (string2int('0') === 0 && string2int('12345') === 12345 && string2int('12300') === 12300) {
    if (string2int.toString().indexOf('parseInt') !== -1) {
        console.log('请勿使用parseInt()!');
    } else if (string2int.toString().indexOf('Number') !== -1) {
        console.log('请勿使用Number()!');
    } else {
        console.log('测试通过!');
    }
}
else {
    console.log('测试失败!');
}
```

将字符串首字母转为大写：输入：`['adam', 'LISA', 'barT']`，输出：`['Adam', 'Lisa', 'Bart']`。

```javascript
function normalize(arr) {
    return arr.map((x)=>{
        var str = "";
        for (let i = 0; i < x.length; i++){
            if (i==0)
                str+=x[i].toUpperCase();
            else
                str+=x[i].toLowerCase();
        }
        return str;
    });
}

// 测试:
if (normalize(['adam', 'LISA', 'barT']).toString() === ['Adam', 'Lisa', 'Bart'].toString()) {
    console.log('测试通过!');
}
else {
    console.log('测试失败!');
}

```

### filter()

使用`filter()`筛选出素数：

```javascript
function get_primes(arr) {
    var r = arr.filter(function (element, index, self) {
        var a = 0;
        for (let j = element; j > 0; j--) {
            if (element % j == 0)
                a++;
        }
        return a == 2;
    });
    return r;
}
//另外一种写法
// function get_primes2(arr) {
//     return arr.filter((element) => {
//         let count = 0;
//         for (let index = 1; index < element; index++) {
//              element % index == 0 && count++
//         }
//         return count;
//     });
// }

// 测试:
var x,r,arr = [];
for (x = 1; x < 100; x++) {
    arr.push(x);
}
r = get_primes(arr);
if (r.toString() === [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97].toString()) {
    console.log('测试通过!');
} else {
    console.log('测试失败: ' + r.toString());
}
```

