---
title: 回文字符串
---
## 题目需求：

判断字符串是否是回文字符串，比如：

`Noon`，是一个回文字符串

`apple`就不是一个回文字符串

## 解题思路：

输入字符串，去掉除数字、字母之外的东西，然后逆转字符串，两个对比，答案就出来了

如果是回文，那么两个字符串是一样的，反之，则不是回文字符串

## 代码：

```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    let a = s.replace(/[^a-zA-Z0-9]/g,"").toLowerCase();
    let b = a.split('').reverse().join('').toLowerCase();
    return a == b;
}
```

## 其他答案：

看了一下其他人的解决方案

+ 思路1：

  将字符过滤，然后转成小写，一个遍历顺序增加，一个倒序减减，若遇到不同则返回false，直到所有遍历完成，返回true

  ```javascript
  /**
   * @param {string} s
   * @return {boolean}
   */
  var isPalindrome = function(s) {
      let charResultArr = [];
      for(let i = 0; i < s.length;i++){
          if (isNumOrLetter(s[i])) charResultArr.push(s[i].toLocaleLowerCase());
      }
      let i=0,j=charResultArr.length-1;
      console.log(charResultArr.join(''));
      while(i<=j){
          if (charResultArr[i] !== charResultArr[j]){
              return false;
          }
          i++;
          j--;
      }
      return true
  
  }
  
  var isNumOrLetter = function(char){
      let code = char.charCodeAt(0);
      if ((code >47 && code < 58) ||( code >64  && code < 91) || (code >96 && code < 123) ){
          return true;
      }
      return false;
  }
  
  
  let result = isPalindrome("race a car");
  console.log(result)
  let result = isPalindrome("A man, a plan, a canal: Panama");
  console.log(result)
  ```

+ 思路2：

  使用正则匹配字符串，剩下思路一样，代码更精简

  ```javascript
  /**
   * @param {string} s
   * @return {boolean}
   */
  
  var isPalindrome = function (s) {
      s = s.replace(/[^0-9a-z]/gi, '')
      s = s.toLocaleLowerCase();
      let i = 0, j = s.length - 1;
      while (i < j) {
          if (s[i] !== s[j]) {
              return false;
          }
          i++;
          j--;
      }
      return true;
  }
  
  
  let result = isPalindrome("race a car");
  console.log(result)
  let result = isPalindrome("A man, a plan, a canal: Panama");
  console.log(result)
  ```

  

