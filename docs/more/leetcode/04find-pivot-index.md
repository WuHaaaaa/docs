---
title: 数组中心索引
---
## 题目需求：

给定一个整数类型的数组 nums，请编写一个能够返回数组 “中心索引” 的方法。

我们是这样定义数组 中心索引 的：数组中心索引的左侧所有元素相加的和等于右侧所有元素相加的和。

如果数组不存在中心索引，那么我们应该返回 -1。如果数组有多个中心索引，那么我们应该返回最靠近左边的那一个。

示例 1：

> **输入：**`nums = [1, 7, 3, 6, 5, 6]`
>
> **输出：**`3`
>
> **解释：** 索引`3 (nums[3] = 6)`的左侧数之和`(1 + 7 + 3 = 11)`，与右侧数之和`(5 + 6 = 11)`相等。
> 同时,`3`也是第一个符合要求的中心索引。

示例 2：

> **输入：**`nums = [1, 2, 3]`
>
> **输出：**`-1`
>
> **解释：** 数组中不存在满足此条件的中心索引。

## 解题思路：

第一种：（没有尝试）

> 写一个函数`sum(start,end,nums)`，接收开始、结束、整个数组，将给定范围内的数字加起来
>
> 主函数循环，每次对比`i`前面的结果与`i`后面的结果，如果相同，则返回当前数组下标对应结果，否则，知道循环结束，仍没有，则返回`-1`

第二种：（成功），我的第二种思路应该比第一种思路要效率高些

>将整个数组加起来，保存结果
>
>循环数组，将`i`前面的结果每次加起来，用于后面每次判断，将总结果每次减去`i`，当作`i`后面的结果，对比，若相同，则返回下标对应值，否则，到最后，返回`-1`

## 代码：

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function (nums) {
  let res1 = 0, res2 = 0;
  let tempRes = 0;
  for (let tmp of nums) {
    tempRes += tmp;
  }
  for (let i = 0; i < nums.length; i++) {
    if (i == 0) {
      res1 = 0;
      res2 = tempRes - nums[i];
    } else {
      res1 += nums[i - 1];
      res2 = res2 - nums[i];
    }
    if (res1 == res2) {
      return i;
    }
  }
  return -1;
};

console.log(pivotIndex([-1, -1, 0, 1, 1, 0]))//5
// console.log(pivotIndex([1, 7, -3, 6, 5, 6]))//-1
// console.log(pivotIndex([1, 7, 3, 6, 5, 6]))//3
// console.log(pivotIndex([-1, -1, -1, 0, 1, 1]))//0
```

## 其他答案：

看了一下其他思路，我的代码确实有待优化。。。

简洁明了

```javascript{10-13}
/**
 * @param {number[]} nums
 * @return {number}
 */
var pivotIndex = function(nums) {
  let sum = 0;
  nums.forEach(num => sum += num);
  let leftSum = 0;
  for(i = 0; i < nums.length; i++){
      if((sum - nums[i]) - leftSum == leftSum){
          return i;
      }else{
          leftSum += nums[i];
      }
  }
  return -1;
};

console.log(pivotIndex([-1, -1, 0, 1, 1, 0]))//5
// console.log(pivotIndex([1, 7, -3, 6, 5, 6]))//-1
// console.log(pivotIndex([1, 7, 3, 6, 5, 6]))//3
// console.log(pivotIndex([-1, -1, -1, 0, 1, 1]))//0
```

