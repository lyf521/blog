# jsBridge 使用文档

::: tip 提示
[jsBridge引入Demo地址](https://zhaodifont.github.io/kajicam/bridge.html)
:::

## 文件目录

最新的jsBridge文档请从Demo代码中获取，引入的文件结构如下：

```
.
├─  js
    ├─  bridge
    │   ├─  model
    │   │   ├─  AppCommonResult.js
    │   │   ├─  AppInfo.js
    │   │   ├─  CameraResult.js
    │   │   ├─  EventCameraResult.js
    │   │   └─  GetCameraResult.js
    │   ├─  param
    │   │   ├─  BridgeParam.js
    │   │   ├─  SaveShareParam.js
    │   │   └─  EventCameraParam.js
    │   ├─  AbstractBridge.js
    │   ├─  AndroidBridge.js
    │   ├─  BridgeFactory.js
    │   ├─  IosBridge.js
    │   ├─  NullBridge.js
    │   └─  bridgeContext.js
    └─ util
       └─ BrowserChecker.js  // 判断浏览器类型
```

## 引入方式

引入前先认真查看jsBridge内的方法。

首先判断当前运行环境是B612咔叽APP内（分为ios、Android），还是B612咔叽APP外即手机浏览器中。`判断为ios: 引入iosBridge`  `android: 引入AndroidBridge`
[]()
`其他系统: 引入NullBridge` (不触发咔叽的功能 只会给一个log提示)

``` js
...
// 项目中引入，可直接获取当前环境
import BridgeFactory from '@/js/bridge/BridgeFactory'
// APP内可直接调用
BridgeFactory.getBridge().appInfo....

=====================================

// @/js/bridge/BridgeFactory.js 中的调用方式
import BrowserChecker from '../util/BrowserChecker'
import NullBridge from './NullBridge'
import AndroidBridge from './AndroidBridge'
import IosBridge from './IosBridge'

export default class BridgeFactory {
    static getBridge() {
        if (BrowserChecker.isIos()) {
            return new IosBridge(); // 返回IOS内的方法
        } else if (window.B612KajiBridgeInterface != undefined && BrowserChecker.isAndroid()) {
            return new AndroidBridge(); // 返回Android内的方法
        } else {
            return new NullBridge();
        }
    }
}
```

* 实际开发中APP又有测试版（`betaApp`）和正式版(`realApp`)的区分。
* android中`betaApp`和`realApp`引用的jsbridge（`AndroidBridge.js`）代码是一模一样的 没有区别
* 在ios中`betaApp`和`realApp`引用的jsbridge有且只有一处区别 (`IosBridge.js`中 -> `_calliOSFunction` 函数中) : 
  
```js
...
// IosBridge.js
 _calliOSFunction(functionName, args, sCallback) {
    let url = scheme + "native/"; 
    // - ios betaApp 设置此处scheme为 **b612cnb://native/** 
    // - ios realApp 设置此处scheme为 **b612cn://native/**
    ...
 }
    // 可在config中配置本地环境、测试环境、预上线环境、正式环境
    // 如果scheme设置错误 出现的场景是 在betaApp跳至realApp 或反之
    // 当然 这个场景只会只会出现在ios中
```

## appInfo

在APP内运行时，获取APP的信息,调用方式`BridgeFactory.getBridge().appInfo(userCallback)`

```js
/**
  * app 在app内部获取app的信息
  * @param userCallback
  *    : callback param 0 - ./model/AppInfo
*/
    appInfo(userCallback) {
        // 注册一个回调函数  此回调函数是属于 AppInfo的
        const callbackMethodFullName = this._registerCallback("appInfo", userCallback, AppInfo);
        
        // 通过与app约定好的功能名称唤起此功能  
        this._calliOSFunction("appInfo", null, callbackMethodFullName);
         // this.calliOSFunction("appInfo", null, "B612Kaji.Native.ios.Function.getInstance().callback.appInfo")
    }
```
::: tip 使用场景
用appInfo方法的回调来判断 h5页面属于app内/外 
:::

```js
    let isInApp = false
    bridgeFactory.getBridge().appInfo(res => {
      // res : {app: '7.3.1', 'os': '23', 'deviceModel': 'CAM-TL00', 'language': 'zh-CN', 'country': 'CN'}
      if (res.app) {
        isInApp = true
      }
    })
  // 注 返回的res信息属于异步返回的数据 如果同步的代码中需要使用此信息会失误
```

## save

在app内调用保存图片的功能，调用方式`BridgeFactory.getBridge().save(...)`

使用频率较低,注意和`shareWidthCallback`的区别

``` js
    /**
     * 将页面中的图片或视频 保存到用户的手机终端
     * @param saveShareParam (@see ./param/SaveShareParam)
     * @param userCallback
    */
    save(saveShareParam, userCallback) {
        const callbackMethodFullName = this._registerCallback("save", userCallback, AppCommonResult);
        this._calliOSFunction("save", saveShareParam, callbackMethodFullName);
    }
 ```

## shareWithCallback

在app内调用保存图片和分享图片功能，调用方式`BridgeFactory.getBridge().shareWithCallback()`。

``` js
/**
  * 将页面中的图片或视频 保存到用户的手机终端 并触发分享
  * @param saveShareParam (@see ./param/SaveShareParam)
  * @param sharePoppedCallback - app中分享面板弹出时触发 (关闭面板时可能会再次触发) callback
  * @param shareMediaClickedCallback - app选择分享媒介时触发 callback (现阶段无效 ??)
*/
shareWithCallback(saveShareParam, sharePoppedCallback, shareMediaClickedCallback) {
    const sharePoppedCallbackName = this._registerCallback('sharePoppedCallback', sharePoppedCallback, AppCommonResult);
    const shareMediaClickedCallbackName = this._registerCallback('shareMediaClickedCallback', shareMediaClickedCallback, AppCommonResult);

    const options = JSON.parse(saveShareParam.toString());
    options.clickShareButton = shareMediaClickedCallbackName;

    this._calliOSFunction("share", options, sharePoppedCallbackName);
}
 ```
::: tip 提示
  在`param/SaveShareParam.js`中查看调用该方法时需要的参数设置。

  `SaveShareParam()`方法为`save()`方法的进化版，不仅能保存图片还能分享。

  分享面板弹出一次的过程中 弹出和关闭都会触发此函数的回调函数 
:::

``` js
import SaveShareParam from "@/common/bridge/param/SaveShareParam";

export function handleSave(){
  const param = new SaveShareParam($('#distImg')[0].src, SaveShareParam.types.image);
  let stat = false; //  初始一个变量 这次未统计
  bridgeFactory.getBridge().shareWithCallback(param, result => {
    if(!stat){ //  这样只统计一次
      showToast('保存成功')
      iosState = !iosState
      // 百度统计方法
      _hmt.push(['_trackEvent', eventCategory+ inState, 'Btn', '保存分享' + _years[yearAct].imgTial[_styleAct]])
    }
  }, res => {
  });
}
```

## 调用相机和相册

在B612咔叽APP内的H5页面有时候需要调用B612咔叽的相机和相册进行选择图片上传。

在 `param/EventCameraParam.js`中查看调用相机或者相册 以及滤镜、分栏、贴纸、摄像头、表情的参数设置。

`eventCamera()`: 调用相机和相册

`eventCameraWithLandmarks()`: 获取的图片中带人脸坐标
``` js
// *** 源码解析
/**
  * 调用相机或相册功能 并将拍摄或获取的照片返回给页面.
  * @param eventCameraParam : (@see ./param/EventCameraParam)
  * @param userCallback
*/
// ios
eventCamera(eventCameraParam, userCallback) {
    const callbackMethodFullName = this._registerCallback("eventCamera", userCallback,
        CameraResult, eventCameraParam.type, eventCameraParam.cameraPosition);

    this._calliOSFunction("eventCamera", eventCameraParam, callbackMethodFullName);
}

// eventCameraWithLandmarks 仅兼容app7.6.0以上
// 在android中 如果拍照非人脸 则无法触发回调函数 慎用！！
// （2018.11.21更新）android 版本7.9.3+ 已修复
eventCameraWithLandmarks(eventCameraParam, userCallback) {
    const callbackMethodFullName = this._registerCallback("eventCameraWithLandmarks", userCallback,
        CameraResult, eventCameraParam.type, eventCameraParam.cameraPosition);

    this._calliOSFunction("eventCameraWithLandmarks", eventCameraParam, callbackMethodFullName);
}

// android
eventCamera(eventCameraParam, userCallback) {
    // android 中注意 当前版本中 需要把categoryId、stickerId强制设置为undefined 不然调用时会出现卡死闪退的情况
    // 只使用 filterId即可
    // eventCameraWithLandmarks同理
    if(BrowserChecker.isAndroid()) {
        // eventCameraParam.filterId = undefined;
        eventCameraParam.categoryId = undefined;
        eventCameraParam.stickerId = undefined;
    }

    const callbackMethodFullName = this._registerCallback(
        "eventCamera", userCallback, EventCameraResult, eventCameraParam.type, eventCameraParam.cameraPosition);

    native.eventCamera(callbackMethodFullName, eventCameraParam.toString(true));
}
    
```

``` js
// *** 使用案例
import EventCameraParam from "@/common/bridge/param/EventCameraParam";

// 设置参数
const param = new EventCameraParam(
    EventCameraParam.types.imageCamera, // 字符串 imageCamera: 相机  imageAlbum： 相册
    EventCameraParam.cameraPositions.front, // 前置摄像头 0  后置摄像头: 1
    comConfig.filterId, // 滤镜id
    comConfig.categoryId, // 分栏id (贴纸是在分栏里面的 所以app一般找贴纸先找到贴纸所在的分栏)
    comConfig.stickerId, // 贴纸id
    '', // 貌似是 音乐id
    'true' // 是否自动下载此贴纸  鸡肋 以后改为默认自动下载 (如咔叽里此贴纸未下载 则无法选中使用)
);

const galleryParams = new EventCameraParam(EventCameraParam.types.imageAlbum);

$('#cameraBtn, #galleryBtn').off('click') // 每次添加事件 先解除 否则多次添加事件会调用失败、异常
$('#cameraBtn').on('click', function(){
  bridgeFactory.getBridge().eventCamera(param, eventCameraCallback)
   _hmt.push(['_trackEvent', eventCategory+ inState, 'Btn', '相机拍照'])
})
$('#galleryBtn').on('click', function(){
  bridgeFactory.getBridge().eventCamera(galleryParams, eventCameraCallback)
   _hmt.push(['_trackEvent', eventCategory+ inState, 'Btn', '相册选取'])
})
      
```
::: tip 提示
  `eventCameraWithLandmarks()` 为更高级的接口,不仅能返回拍摄、选取的照片,
  如果拍摄、选取的是人物脸部 能够获取此照片的脸部坐标 一起返回给页面
:::

``` js
// 获取脸部坐标的方法
function eventCameraCallback(res, type){
 if (!!res.success == true) {
   const imgSrc = res.base64Image
   const landmark = res.landmarks // 如果有坐标 一起传给人脸融合接口 效果更佳
   const type = type // 此次调用的是 相机还是相册
 }
}

```

##  getCameraImage

在APP内拍照时的一些场景中，会遇到选择贴纸拍照后出现一个`confirmbanner 点击banner` 进入H5页面。那么进入h5页面后，能够获取到拍摄的照片

该方法也区分是否需要人脸坐标

``` js
/**
 * 场景: 用户先在app中使用某贴纸拍照 拍照完出现一个confirmbanner 点击banner 进入H5页面.
 * 那么进入h5页面后 能够获取到拍摄的照片
 * @param userCallback
 */
getCameraImage(userCallback) {
    const callbackMethodFullName = this._registerCallback("getCameraImage", userCallback, CameraResult);
    this._calliOSFunction("getCameraImage", null, callbackMethodFullName);
}

getCameraImageWithLandmarks(userCallback) {
    const callbackMethodFullName = this._registerCallback("getCameraImageWithLandmarks", userCallback, CameraResult);
    this._calliOSFunction("getCameraImageWithLandmarks", null, callbackMethodFullName);
}
```

##  _calliOSFunction

在IOS中的APP内置浏览器调取APP内提供的方法的联调方方法：`_calliOSFunction()`和 `_openCustomURLinIFrame()`

``` js
/**
  * ios 与app联动的原理
  * (app scheme 决定使用的是beta 还是 real app)
  *
  * @param functionName - 与app约定的function name
  * @param args - 传送参数对象 argument object
  * @param sCallback - 在app中传出回调
  * @private
*/
_calliOSFunction(functionName, args, sCallback) {
    let url = ConfigFactory.scheme + "native/";
    const callInfo = {};
    callInfo.functionName = functionName;
    if (sCallback) {
        callInfo.success = sCallback;
    }
    if (args) {
        callInfo.args = args;
    }
    url += JSON.stringify(callInfo);

    this._openCustomURLinIFrame(url);
}

_openCustomURLinIFrame(src) {
    const rootElm = document.documentElement;
    const newFrameElm = document.createElement("IFRAME");

    newFrameElm.setAttribute("src", src);
    rootElm.appendChild(newFrameElm);
    newFrameElm.parentNode.removeChild(newFrameElm);
}
 ```

##  login

APP内登陆账号的方法：`BridgeFactory.getBridge().login()`

仅app版本7.7.5以上支持

beta版测试方法: [在手机web中打开以下链接，点击BETA按钮，即可进行测试](http://qa.b612kaji.com/app-static/kaji/login-test/link.html)

[http://qa.b612kaji.com/app-static/kaji/login-test/link.html](http://qa.b612kaji.com/app-static/kaji/login-test/link.html)

``` js
// 源码
import UserInfo from "./model/UserInfo";
login(userCallback) {
    const callbackMethodFullName = this._registerCallback("login", userCallback, UserInfo);
    this._calliOSFunction("login", null, callbackMethodFullName);
} 
```

1. InAppBrowser 启动时发送cookie

``` js
/**
 *产生token cookie 的条件:
 *  1、 在kaji 内嵌游览器打开
 *  2、 一级域名为 ".snowcam.cn", ".b612kaji.com", ".yiruikecorp.com"
 *  3、在pc端打开 一般的document.cookie 为 Hm_lvt_c78ba600..... ; Hm_lpvt_c78ba60....; 或空
 *  4、在app内 document.cookie 有一个(第一种sessionKey) 为 B6_SES=oOIUgm.....
 */
bridge.login(userInfo => {
  console.log(userInfo.B6_SES);  //  跟第一种sessionKey很像 为登录准备的变体 这是第二种sessionKey
})
```

2. Click按钮 -> 调起 jsBridge.login() function
3. 登录成功后，输出通过callback 发送的session key  (userInfo.B6_SES 第二种sessionKey)
4. session key -> API SERVER -> user 信息查询 (通过userInfo.B6_SES 发送ajax请求获取用户信息)

``` js
var sessionKey = document.cookie.split("=")[1]; 
//var sessionKey = "N9CtB4ZZOfEjGCk9i4le0oO4StKZrGBgW2l+lQQIjBboQmKQmWlYN3BRtLXfrpOCxFC7wQtYXHdIIYOw6+Itwyh25rv2reM93aXWEMGaEdI=";
console.log(sessionKey);
var url = "http://qa-api.b612kaji.com/v2/user/me";
// var url = "http://api.b612kaji.com/v2/user/me"; // real
$.ajax({
  url : url,
  dataType: "text",
  headers: {
    'Authorization': 'Bearer ' + sessionKey // 这里用的是第一种sessionKey
  },
  success : function(response) {
    console.log(response);
    document.write(response);
  }
});

```

## close 

在APP的浏览器h5页面中`触发页面关闭webView`的方法。

``` js
// *** 源码解析
// android中的调用方法:
close() {
    native.close()
}
// ios 中的调用方法
close() {
    this._calliOSFunction("close", null, null);
}
    
 // 页面中调用案例
$('.exit button').click(() => {
    BridgeFactory.getBridge().close()
})
```

## uuid

在APP内部浏览器中请求page时，把URL的 {ad_did}部分转换为uuid的功能，B612咔叽在7.3.0版本以上支持。

::: tip 提示
uuid获取是用页面url的部分参数转换的方式，外部浏览器也可模仿这个参数，会有滥用的问题。
>
建议仅支持在inAppBrowser时使用 （jsBridge的 appInfo 来判断是否为inAppBrowser打开）
:::

``` js
  http://qa.b612kaji.com/test/test_uuid.html?uuid={ad_did}
  <a href="b612cnb://inappBrowser?url=http%3A%2F%2Fqa.b612kaji.com%2Ftest%2Ftest_uuid.html%3Fuuid%3D%7Bad_did%7D">UUID</a>
```

