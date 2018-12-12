# Js数组去重

在实际工作中，经常会遇到“数组去重”的问题，在js进阶中这个问题一定要自己熟练应用多种方法。

## 方法一 - for-for

思路：`双层循环对比去重`，可直接改变原数组，或者定义一个新数组，并存放原数组的第一个元素，然后将原数组一一和新数组的元素对比，若不同则存放在新数组中。

双层循环时间比较慢,splice比push方法更慢.

``` js
// 写法一: 改变原数组 - splice
function unique(arr) {
  for(var i = 0; i < arr.length; i++){
    for (var j = i + 1; j < arr.length; j++){
      if (arr[i] === arr[j]) {
        arr.splice(j, 1)
        j--   // 遇到相同的，则重新回到原来的值（和j++相抵消）
      }
    }
  }
  return arr
}
// 写法二： 改变原数组 - splice
function unique(arr){
  for(var i = 0; i < arr.length; i++){
    for(var j = 0; j < arr.length; j++){
      if (arr[i] == arr[j] && i != j){
        arr.splice(j, 1)
      }
    }
  }
  return arr
}
// 写法三：生成新的数组 - push
function unique(arr){
  var res = [arr[0]]
  for (var i = 0; i < arr.length; i++){
    var repeat = false
    for (var j = 0; j < res.length; j++){
      if(arr[i] === res[j]) {
        repeat = true
        break
      }
    }
    if(!repeat){
      res.push(arr[i])
    }
  }
  return res
}
```

## 方法二 - sort

思路：`原数组排序，生成新数组`。先将原数组排序，在与相邻的进行比较，如果不同则存入新数组

``` js
// 不改变原数组 - push
function unique(arr){
  var arr2 = arr.sort()
  var res = [arr[0]]
  for (var i = 1; i < arr2.length; i++){
    if (arr2[i] !== res[res.length - 1]){
      res.push(arr2[i])
    }
  }
  return res
}
// 改变原数组 - splice
function unique(arr){
  arr.sort() // 将数组排序
  var end = arr[0] // 临时变量用于对比重复元素
  for(var i = 1; i < arr.length; i++){
    if (arr[i] === end){
      arr.splice(i, 1)
      i--  // 抵消i++
    } else {
      end = arr[i] // 排序后只和相邻的有可能相同
    }
  }
  retu
}
```

## 方法三 - {}

思路:利用对象属性存在的特性,如果没有该属性则存入新数组.

``` js
function unique(arr){
  var res = []
  var obj = {}
  for (var i = 0; i < arr.length; i++){
    if (!obj[arr[i]]){
      obj[arr[i]] = 1
      res.push(arr[i])
    }
  }
  return res
}
```

## 方法四-indexOf

思路: `indexOf`利用数组的indexOf下标属性来查询

``` js
// indexOf - push 判断在新数组中是否存在
function unique(arr) {
  var res = []
  for (var i = 0; i < arr.length; i++){
    if (res.indexOf(arr[i]) == -1){
      res.push(arr[i])
    }
  }
  return res
}
// 借助indexOf()判断元素在该数组中首次出现的位置下标与循环的下标是否相等
function unique(arr){
  for (var i = 0; i < arr.length; i++){
    if (arr.indexOf(arr[i]) != i) {
      arr.splice(i ,1) // 删除数组元素后数组长度减1,后面的元素前移
      i-- // 数组下标回退
    }
  }
  return arr
}
```

## 方法五-includes

思路: `includes`利用数组原型对象上的includes方法

``` js
function unique(arr){
  var res = []
  for (var i = 0; i < arr.length; i++){
    if (!res.includes(arr[i])){ // 如果res新数组包含当前循环item
      res.push(arr[i])
    }
  }
  return res
}
```

## 方法六-filter

利用数组原型对象上的filter方法,用于把Array的某些元素过滤掉，然后返回一个新数组.和map()类似，Array的filter()也接收一个函数。和map()不同的是，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素.

`Array.filter(function(ele,ind,self){})`接受的回调函数可以有3个参数,第一个元素表示Arry的某个元素,第二个表示该元素的位置,第三个为数组本身
``` js
// filter和includes相结合的方法
function unique(arr) {
  var res = []
  res = arr.filter(function(item){
    return res.includes(item) ? '' : res.push(item)
  })
  return res
}
// filter和indexOf相结合的方法
//indexOf总是返回第一个元素的位置，后续的重复元素位置与indexOf返回的位置不相等，因此被filter滤掉了。
function unique(arr){
  var res = arr.filter(function(ele,index,self){
    return self.indexOf(ele) === index
  })
  return res
}
```

## 方法七-forEach

思路: `array.forEach(function(ele,ind,self), thisValue)`,thisValue 默认值为this指数组本身. 和filter()类似,但是不会返回一个新数组

``` js
// forEach 和 includes
function unique(arr) {
  var res = []
  arr.forEach(function(ele) {
    res.includes(ele) ? '' : res.push(ele)
  })
  return res
}
```

## 方法八-map
::: tip 提示
map 是把数组中的值一个一个的进行某种处理，把处理后的值放到一个新的数组中，并返回这个新的数组。

filter是通过某种筛选条件把数组中符合条件的值放到一个新的数组中，并返回这个新数组

想改变数组的时候用map,想对数组进行过滤用filter，累加数组用reduce
:::

思路: map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值.

map() 不会对空数组进行检测。map() 不会改变原始数组。

``` js
function unique(arr) {
  var res = []
  arr.map(function(ele) {
    res.includes(ele) ? '' : res.push(ele)
  })
  return res
}
```

## 方法九-lastIndexOf

思路: lastIndexOf() 方法可返回一个指定的元素在数组中最后出现的位置，在一个数组中的指定位置从后向前搜索.如果要检索的元素没有出现，则该方法返回 -1。

``` js
function unique(arr) {
  var res = []
  for(var i = 0; i < arr.length; i++) {
    res.lastIndexOf(arr[i]) !== -1 ? '' : res.push(arr[i])
  }
  return res
}
```

## 方法十-ES6 set

ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

Set函数可以接受一个数组（或类似数组的对象）作为参数，用来初始化。

``` js
// Array.from()
function unique(arr){
  return Array.from(new Set(arr)) // 利用Array.from将set结构转换成数组
}
// es6复制解构 ...
function unique(arr) {
  var res = new Set(arr)
  return [...res]
}
var aa = [1,2,2,4,9,6,7,5,2,3,5,6,5]
arr2 = unique(aa)
console.log(aa)
console.log(arr2)
```

## 数组对象去重-reduce()

思路: reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值

reduce() 可以作为一个高阶函数，用于函数的 compose

`array.reduce(function(total, currentValue, currentIndex, arr), initialValue)`

``` js
/**
 *  total:必需。初始值, 或者计算结束后的返回值。
 *  currentValue: 必需。当前元素
 *  currentIndex: 可选.当前元素的索引
 *  arr: 可选.当前元素所属的数组对象
 *  initialValue: 可选.传递给函数的初始值
 */
// 数组去重
function unique(arr) {
  var res = []
  res = arr.reduce(function(cur, next){
    cur.includes(next) ? '' : cur.push(next)
    return cur
  },[])
  return res
}
var aa = [1,2,2,4,9,6,7,5,2,3,5,6,5]
arr2 = unique(aa)
console.log(aa)
console.log(arr2)

 // 数组对象去重
 function unique(arr) {
   var obj = {}
   return arr.reduce(function(cur, next) {
     obj[next.id] ? '' : obj[next.id] = true && cur.push(next)
     return cur
   }, [])  //设置cur默认类型为数组，并且初始值为空的数组
 }
 let person = [
     {id: 0, name: "小明"},
     {id: 1, name: "小张"},
     {id: 2, name: "小李"},
     {id: 3, name: "小孙"},
     {id: 1, name: "小周"},
     {id: 2, name: "小陈"},   
]
arr2 = unique(person)
console.log(person)
console.log(arr2)
```
