# express框架

::: tip 提示
[菜鸟教程地址](http://www.runoob.com/nodejs/nodejs-express-framework.html)
[Express官网](http://www.expressjs.com.cn/)
:::

## 合适的目录结构

```
|__node_modules
|__routers
        |__main.js
|__views
       |__index.html
       |__about.html
|__package.json
|__app.js
```

## 创建package.json文件

这个文件会包含exress.js应用的全部信息,比如:名称、版本、描述, 最重要的就是`依赖项(dependencies)`

``` js
// 打开终端,运行命令,进行创建
npm init
// 命令中会跳出很多的需要你输入的东西。依次输入，或者对于我们的教程来说直接回车也可以。
// 但是，有一点例外，在出现
entry point:(index.js)
// 的时候把文件名字改为app.js, 和目录对应
```
安装express.js
``` js
npm install express --save
```
安装 ejs 和 mysql
``` js
npm install mysql --save
npm install ejs --save
```

## 请求和响应

``` js
// Express应用使用回调函数的参数:request和response对象来处理请求和响应的数据.
app.get('/',function(req,res){
  // --
})
```
### request 和 response 对象的具体介绍:
  - Request对象 - request对象表示HTTP请求,包含了请求查询字符串,参数,内容,HTTP头部等属性.常见属性有:
    1. req.app: 当callback为外部文件时,用req.app访问express的实例
    2. req.baseUrl: 获取路由当前安装的URL路径
    3. req.body / req.cookies: 获得‘请求体’ / Cookies
    4. req.fresh / req.stale: 判断请求是否还‘新鲜’
    5. req.hostname / req.ip: 获取主机名和IP地址
    6. req.originalUrl: 获取原始请求URL
    7. req.params: 获取路由的parameters
    8. req.path: 获取请求路径
    9. req.protocol: 获取协议类型
    10. req.query: 获取URL的查询参数串
    11. req.route: 获取当前匹配的路由
    12. req.subdomains: 获取子域名
    13. req.accepts(): 检查可接受的请求的文档类型
    14. req.acceptsCharsets / req.acceptsEncodings / req.acceptsLanguages: 返回指定字符集的第一个可接受字符编码
    15. req.get(): 获取指定的HTTP请求头
    16. req.is(): 判断请求头Content-Type的MIME类型
  - Response 对象 - response对象表示HTTP响应,即在接收到请求时向客户端发送的HTTP响应数据.常见属性有:
    1. res.app: 同req.app一样
    2. res.append(): 追加指定HTTP头
    3. res.set(): 在res.append()后将重置之前设置的头
    4. res.cookie(name, value[, option]): 设置Cookie
    5. option: domain / expires / httpOnly / maxAge / path / secure / signed
    6. res.clearCookie(): 清除Cookie
    7. res.download(): 传送指定路径的文件
    8. res.get(): 返回指定的HTTP头
    9. res.json(): 传送JSON响应
    10. res.jsonp(): 传送JSONP响应
    11. res.location(): 只设置响应的Location HTTP头,不设置状态码或者close response
    12. res.redirect(): 设置响应的Location HTTP头,并且设置状态码302
    13. res.render(view,[locals],callback): 渲染一个view,同时向callback传递渲染后的字符串,如果在渲染过程中有错误发生next(err)将会被自动调用.callback将会被传入一个可能发生的错误以及渲染后的页面,这样就不会自动输出了.
    14. res.send(): 传送HTTP响应
    15. res.sendFile(path[,options][,fn]):传送指定路径的文件-会自动根据文件extension设定Content-Type
    16. res.set(): 设置HTTP头,传入object可以一次设置多个头
    17. res.status(): 设置HTTP状态码
    18. res.type(): 设置Content-Type的MIME类型
