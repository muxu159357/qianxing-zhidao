Component({
  data: {
    selected: 0,
    list: [
      { pagePath: '/pages/index/index', text: '首页', icon: 'home' },
      { pagePath: '/pages/guide/guide', text: 'AI助手', icon: 'smart_toy' },
      { pagePath: '/pages/my-trips/my-trips', text: '我的行程', icon: 'explore' }
    ]
  },
  methods: {
    switchTab(e) {
      var index = e.currentTarget.dataset.index
      var item = this.data.list[index]
      var url = item.pagePath
      wx.switchTab({ url: url })
    }
  }
})
