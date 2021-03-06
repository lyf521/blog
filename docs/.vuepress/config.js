// 基本配置
module.exports = {
  base: '/docs/',
  title: '华丽转身', // 设置网站标题
  description: '项目规范，书写约束', // 描述
  port: 8060, // 端口
  themeConfig: { // 主题配置
    nav: [ // 导航
      {text: 'Home', link: '/'}, // 导航条
      {
        text: 'Blog', 
        items: [
          {text: 'B612', link: '/blog/b612/default.html'},
          {text: 'Node', link: '/blog/node/'},
          {text: 'JS', link: '/blog/js/'}
        ]
      },
      {text: '', link: ''},
      {text: 'github', link: 'https://github.com/lyf521'},
      {text: 'gitee', link: 'https://gitee.com/lee521'}
    ],
    sidebar: { // 侧边栏
      '/blog/b612/': [
        {
          title: 'B612咔叽',
          collapsable: false,
          children: [
            'default'
          ]
        },
        {
          title: '',
          collapsable: false,
          children: [
            'h5',
            'imgCanvas',
            'question'
          ]
        }
      ],
      '/blog/js/': [
        {
          title:'JS经典',
          collapsable: false,
          children: [
            '',
            'sort'
          ]
        }
      ],
      '/blog/node/': [
        {
          title:'Node',
          collapsable:false,
          children: [
            ''
          ]
        },
        {
          title:'',
          collapsable:false,
          children: [
            'generator'
          ]
        }
      ]
    }
  }
}