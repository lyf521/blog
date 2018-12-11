# 活动项目中的图片处理

::: tip 提示
处理图片的过程中需要控制图片的大小，以及添加二维码重新合成新的图片

B612咔叽APP中从相机或者相册中获取到的图片都是base64格式
:::

## APP外处理图片

手机浏览器中通过input上传图片，将图片转为六文件，引入`ext.js`文件识别图片信息

```js
import '@/assets/js/util/ext' // 图片处理文件
import appConfig from '@/config/appConfig' // 基础配置

let file = this.files[0]
  let reader = new FileReader()
  reader.onload = function () {
    let binary = this.result
    let binaryData = new BinaryFile(binary) // 转为二进制
    let imgExif = EXIF.readFromBinaryFile(binaryData) // 获取图像信息，包含旋转信息

    let fullScreenImg = new Image()
    fullScreenImg.onload = function () {
      let _this = this

      setTimeout(function () {
        let imageType = _this.src.split(',')[0].split(';')[0].split(':')[1].toLowerCase()
        imageType = (imageType.indexOf('jpg') !== -1) ? 'image/jpeg' : imageType
        if (!appConfig.validationImageSize(_this.width, _this.height)) {
          layer.showLayer({
            type: 'error', 
            msg: '图片尺寸或比例不符合'
          })
          return
        }
        if (!appConfig.validationImageType(imageType)) {
          layer.showLayer({
            type: 'error', 
            msg: '图片格式不符合'
          })
          return
        }
       
        // 图片上传
        upServer(_this.src)
      }, 0)
    }

    let mpImg = new MegaPixImage(file);  // 将传入的图片调整为合理的大小
    mpImg.render(fullScreenImg, {
        maxWidth: 960,
        maxHeight: 960,
        orientation: imgExif.Orientation // 位置信息
    })
  }
  reader.readAsBinaryString(file)
  ```

  ## APP 内处理图片

  APP内上传图片通过`Canvas2Image.convertToJPEG()`方法，重新绘制图片的大小

  ``` js
  let img = new Image()
    img.onload = function () {
      let imageType = this.src.split(',')[0].split(';')[0].split(':')[1].toLowerCase()

      imageType = (imageType.indexOf('jpg') !== -1) ? 'image/jpeg' : imageType

      if (!appConfig.validationImageSize(this.width, this.height)) {
        layer.showLayer({
          type: 'error',
          msg: '图片尺寸或比例不符合'
        })
        return
      }
      if (!appConfig.validationImageType(imageType)) {
        layer.showLayer({
          type: 'error', 
          msg: '图片格式不符合'
        })
        return
      }
      let imgW = document.body.offsetWidth
      let imgH = (imgW / this.width) * this.height
      var canvas = document.createElement("canvas")
      var scale = 1.2//定义任意放大倍数 支持小数
      var context = canvas.getContext('2d')
      context.scale(scale, scale)//获取context,设置scale
      canvas.width = imgW * scale//定义canvas 宽度 * 缩放
      canvas.height = imgH * scale//定义canvas 高度 *缩放
      context.mozImageSmoothingEnabled = false
      context.webkitImageSmoothingEnabled = false
      context.msImageSmoothingEnabled = false
      context.imageSmoothingEnabled = false

      context.drawImage(this, 0, 0, canvas.width, canvas.height)
      var _img = Canvas2Image.convertToJPEG(canvas, canvas.width, canvas.height)
      
      // 处理后的图片上传
      upServer(_img.src)
    }
    img.src = result.base64Image
```

## 保存图片并分享

H5活动中结果页保存并分享的图片需要添加二维码，用canvas进行绘制生成新的图片

或者将HTML元素通过`html2canvas`转化为图片

``` js
// 引入html2canvas，将HTMl元素转为图片
// 手机端不用css背景存放图片，会造成模糊
// html2canvas 在手机端将canvas放大2倍，避免模糊
import html2canvas from 'html2canvas'
try {
  var shareContent = this.$refs.share// 需要截图的包裹的（原生的）DOM 对象
  var width = shareContent.offsetWidth // 获取dom 宽度
  var height = shareContent.offsetHeight // 获取dom 高度
  var canvas = document.createElement('canvas') // 创建一个canvas节点
  var scale = 2 // 定义任意放大倍数 支持小数
  canvas.width = width * scale // 定义canvas 宽度 * 缩放
  canvas.height = height * scale // 定义canvas高度 *缩放
  canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale
  var opts = {
    scale: scale, // 添加的scale 参数
    canvas: canvas, // 自定义 canvas
    logging: false, // 日志开关，便于查看html2canvas的内部执行流程
    width: width, // dom 原始宽度
    height: height,
    useCORS: true // 【重要】开启跨域配置
  }
  html2canvas(shareContent, opts).then(canvas => {
    this.saveImg = canvas.toDataURL() // 图片地址
    if (this.inState === '-outApp') {
      Handle.hideConfirm()
      this.saveShow = true
      // eslint-disable-next-line
    _hmt.push(['_trackEvent', '94face'+ this.inState, 'Btn', '面相结果保存'])
    } else {
      Handle.handleSave(this.saveImg)
      // eslint-disable-next-line
    _hmt.push(['_trackEvent', '94face'+ this.inState, 'Btn', '面相分享'])
    }
  })
} catch (e) {
  Handle.hideConfirm()
  Handle.handleConfirm({type: 'succes', msg: '图片保存失败'})
}
```