Component({
  data: {
    selected: 0,
    list: [
      {
        pagePath: '/pages/index/index',
        text: '首页',
        icon: '/assets/icons/tabbar/home.png',
        iconActive: '/assets/icons/tabbar/home-active.png'
      },
      {
        pagePath: '/pages/guide/guide',
        text: 'AI助手',
        icon: '/assets/icons/tabbar/ai.png',
        iconActive: '/assets/icons/tabbar/ai-active.png'
      },
      {
        pagePath: '/pages/my-trips/my-trips',
        text: '我的行程',
        icon: '/assets/icons/tabbar/trips.png',
        iconActive: '/assets/icons/tabbar/trips-active.png'
      }
    ]
  },
  methods: {
    switchTab(e) {
      var index = e.currentTarget.dataset.index
      var item = this.data.list[index]
      wx.switchTab({ url: item.pagePath })
    }
  }
})
