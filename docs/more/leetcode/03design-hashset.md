---
title: 设计哈希集合
---
## 题目需求：

实现一个操作哈希值的类

方法有`add`、`remove`、`contains`

## 解题思路：

`Javascript`里面，声明一个对象，就可以实现哈希操作，就是这个东西：`{}`

然后还有`delete`用于删除哈希值

## 代码：

```javascript
/**
 * Initialize your data structure here.
 */
var MyHashSet = function() {
   this.hash = {};
};

/** 
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.add = function(key) {
    this.hash[key] = key;
};

/** 
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.remove = function(key) {
    delete this.hash[key];
};

/**
 * Returns true if this set contains the specified element 
 * @param {number} key
 * @return {boolean}
 */
MyHashSet.prototype.contains = function(key) {
    return this.hash[key] !== undefined;
};

/** 
 * Your MyHashSet object will be instantiated and called as such:
 * var obj = new MyHashSet()
 * obj.add(key)
 * obj.remove(key)
 * var param_3 = obj.contains(key)
 */

//test
var obj = new MyHashSet();
console.log(obj.add('0'));
console.log(obj.add('2'));
console.log(obj.contains('1'));
console.log(obj.contains('3'));
console.log(obj.contains('0'));
```

## 其他答案：

有个高效答案，是采用`Set`实现的，不知道算不算违规

```javascript
//set是这么用的
var s = new Set([1, 2, 3]);
s; // Set {1, 2, 3}
s.delete(3);
s; // Set {1, 2}
```

方案：

```javascript
/**
 * Initialize your data structure here.
 */
var MyHashSet = function(key, arrayLen) {
    this.set = new Set();
};

/** 
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.add = function(key) {
    this.set.add(key);
};

/** 
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.remove = function(key) {
    this.set.delete(key);
};

/**
 * Returns true if this set contains the specified element 
 * @param {number} key
 * @return {boolean}
 */
MyHashSet.prototype.contains = function(key) {
    return this.set.has(key);
};
/** 
 * Your MyHashSet object will be instantiated and called as such:
 * var obj = new MyHashSet()
 * obj.add(key)
 * obj.remove(key)
 * var param_3 = obj.contains(key)
 */
```

