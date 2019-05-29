# webpack打包模块化

::: tip 提示
vue的项目在webpack打包时,将不常用的第三方模块,或者测试用的模块,拆分打包.
js文件引入方式 `var VConsole = r => require.ensure([], () => r(require('vconsole')))`
:::

## 第三方模块引入方式
```js
let env = process.env.NODE_ENV

if (env === 'local' || env === 'dev' || env === 'development' || env === 'beta') {

var VConsole = r => require.ensure([], () => r(require('vconsole')))

// eslint-disable-next-line

var vConsole = new VConsole()

console.info('aa')

}
```
