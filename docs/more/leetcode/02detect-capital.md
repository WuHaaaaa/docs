---
title: 检测大写格式
---
## 题目需求：

输入`USA`，`leetcode`，`Google`，通过测试，返回`true`

输入`flaG`，返回`false`

## 解题思路：

已知三个不同格式字符串可以通过测试，返回`true`

不妨设置三种状态，返回的时候，某一个状态为`true`，则表示通过测试

若都返回`false`，那么就是`false`

## 代码：

```javascript
/**
 * @param {string} word
 * @return {boolean}
 */
var detectCapitalUse = function(word) {
    var result = false;
    var a = false,b=false,c=false;
    for(var i = 0; i < word.length; i++){
        if (i===0){
            if (/[A-Z]/.test(word[i])){
                a =true,b=true,c=false;
            }
            else if (/[a-z]/.test(word[i])){
                a = false,b=false,c=true;   
            }
        }
        else{
            if (a && /[A-Z]/.test(word[i])){
                a = true,b=false,c=false;
            }else if (b && /[a-z]/.test(word[i])){
                a=false,b=true,c=false;
            }else if (c && /[a-z]/.test(word[i])){
                a=false,b=false,c=true;
            }else{
                a = false,b=false,c=false;
            }
        }
    }
    return a||b||c;
};
```

## 其他答案：

发现自己想复杂了。。。😓

```javascript
//直接正则匹配，合格返回true，不合格返回false
var detectCapitalUse = function(word) {
    if (/^[A-Z]+$/.test(word)) return true
    if (/^[A-Z][a-z]*$/.test(word)) return true
    if (/^[a-z]+$/.test(word)) return true
    return false
};

//甚至可以不用正则
var detectCapitalUse = function(word) {
    if (word === word.toUpperCase()) return true
    let firstCapital = word[0].toUpperCase() + word.slice(1).toLowerCase()
    if (word === firstCapital) return true
    if (word === word.toLowerCase()) return true
};

//其他用ASCII码的
//思路：判断全部字符，大写是否在65-90(A-Z)之间
```

