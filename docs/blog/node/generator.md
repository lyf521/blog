# Express 应用生成器

::: warning 提示
通过Express应用生成器创建应用只是众多方法中的一种.你可以不使用它,也可以修改它让它符合你的需求.
:::
通过应用生成器工具exoress-generator可以快速创建一个应用的骨架.
``` js
// 全局安装express-generator
npm install express-generator -g
```
-h 参数可以列出所有可用的命令行参数:
``` js
$ express -h

  Usage: express [options] [dir]

  Options:

    -h, --help          输出使用方法
        --version       输出版本号
    -e, --ejs           添加对 ejs 模板引擎的支持
        --hbs           添加对 handlebars 模板引擎的支持
        --pug           添加对 pug 模板引擎的支持
    -H, --hogan         添加对 hogan.js 模板引擎的支持
        --no-view       创建不带视图引擎的项目
    -v, --view <engine> 添加对视图引擎（view） <engine> 的支持 (ejs|hbs|hjs|jade|pug|twig|vash) （默认是 jade 模板引擎）
    -c, --css <engine>  添加样式表引擎 <engine> 的支持 (less|stylus|compass|sass) （默认是普通的 css 文件）
        --git           添加 .gitignore
    -f, --force         强制在非空目录下创建

Pug原名不叫Pug，是大名鼎鼎的jade，后来由于商标的原因，改为Pug，哈巴狗。其实只是换个名字，语法都与jade一样。
```

例如,如下命令创建了一个名称为myapp 的Express应用.此应用将在当前目录下的myapp目录中创建,并且设置为使用 [Pug](https://www.cnblogs.com/xiaohuochai/p/7222227.html#anchor15) 模板引擎（view engine）：

```js
$ express --view=pug myapp

   create : myapp
   create : myapp/package.json
   create : myapp/app.js
   create : myapp/public
   create : myapp/public/javascripts
   create : myapp/public/images
   create : myapp/routes
   create : myapp/routes/index.js
   create : myapp/routes/users.js
   create : myapp/public/stylesheets
   create : myapp/public/stylesheets/style.css
   create : myapp/views
   create : myapp/views/index.pug
   create : myapp/views/layout.pug
   create : myapp/views/error.pug
   create : myapp/bin
   create : myapp/bin/www
```

然后安装所有依赖包:
```js
$ cd myapp
$ npm install
```

在MacOS 或 Linux 中,通过如下命令启动此应用:
```js
$ DEBUG=myapp:* npm start
```

在Windows中,通过如下命令启动此应用:
```js
> set DEBUG=myapp:* & npm start
```

然后在浏览器中打开http://localhost:3000/ 网址就可以看到这个应用了.

通过生成器创建的应用一般都有如下目录结构:
```js
.
├── app.js
├── bin
│   └── www
├── package.json
├── public
│   ├── images
│   ├── javascripts
│   └── stylesheets
│       └── style.css
├── routes
│   ├── index.js
│   └── users.js
└── views
    ├── error.pug
    ├── index.pug
    └── layout.pug

7 directories, 9 files
```