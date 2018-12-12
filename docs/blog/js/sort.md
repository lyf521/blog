# Js排序

## 冒泡排序

``` js
// 原始人冒泡排序
function arrSort(arr) {
  var len = arr.length
  for (var i = 0; i < len; i++){
    for (var j = 0; j < len - 1 - i; j++){
      if (arr[j] > arr[j+1]) {  // 相邻元素相互对比
        var temp = arr[j + 1] // 元素交换的中间值
        arr[j+1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}

// 1.2 进化版冒泡排序
function arrSort(arr) {
  console.time('改进后冒泡排序耗时')
  var i = arr.length - 1  // 初始值,最后位置保持不变
  while(i > 0) {
    var pos = 0   // 每次比较开始时,无记录交换
    for (var j = 0; j < i; j++) {
      if(arr[j] > arr[j+1]){
        pos = j // 记录交换的位置
        var temp = arr[j]
        arr[j] = arr[j+1]
        arr[j + 1] = temp
      }
    }
    i = pos // 为下一次比较做准备
  }
  console.timeEnd('改进后冒泡排序耗时')
  return arr
}

// 1.3 升级版冒泡排序
function arrSort(arr) {
  var low = 0
  var high = arr.length - 1 // 设置变量的初始值
  var tmp,j
  console.time('start')
  while(low < high) {
    for (j = low; j < high; ++j){ // 正向冒泡,找到最大者
      if (arr[j] > arr[j+1]){
        tmp = arr[j]
        arr[j] = arr[j+1]
        arr[j+1] = tmp
      }
    }
    --high  // 修改high值,前移一位
    for (j = high; j > low; --j){// 反向冒泡,找到最小者
      if (arr[j] < arr[j-1]) {
        tmp = arr[j]
        arr[j] = arr[j-1]
        arr[j-1] = tmp
      }
    }
    ++low // 修改low值,后移一位
  }
  console.timeEnd('start')
  return arr
}
var arr=[3,44,38,5,47,15,36,26,27,2,46,4,19,50,48];
console.log(arrSort(arr))
```

## 选择排序

选择排序适合小数据排序，具体这个小数据有多小呢，简单的测试了一下，在1000条以内的数据，选择排序更胜1.3冒泡排序。

``` js
function arrSort(arr) {
  var len = arr.length
  var minIndex, temp
  console.time('选择排序耗时')
  for (var i = 0; i < len-1; i++){
    minIndex = i
    for (var j=i+1; j < len; j++) {
      if (arr[j] < arr[minIndex]) { // 寻找最小的数
        minIndex = j  // 将最小数的索引保存
      }
    }
    temp = arr[i]
    arr[i] = arr[minIndex]
    arr[minIndex] = temp
  }
  console.timeEnd('选择排序耗时')
  return arr
}
var arr=[3,44,38,5,47,15,36,26,27,2,46,4,19,50,48];
console.log(arrSort(arr))
```