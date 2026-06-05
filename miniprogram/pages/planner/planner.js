const mock = require('../../utils/mock')

Page({
  data: {
    interestTags: [],
    selectedTagIds: [],
    days: 3,
    budget: '舒适型',
    companion: '情侣/朋友',
    physicalLevel: '适中',
    pace: '均衡'
  },

  onLoad() {
    mock.getInterestTags().then(tags => this.setData({ interestTags: tags }))
  },

  toggleTag(e) {
    const id = e.currentTarget.dataset.id
    let arr = this.data.selectedTagIds
    const idx = arr.indexOf(id)
    if (idx > -1) arr = arr.filter(t => t !== id)
    else arr = [...arr, id]
    this.setData({ selectedTagIds: arr })
  },

  setDays(e) { this.setData({ days: parseInt(e.currentTarget.dataset.val) }) },
  setBudget(e) { this.setData({ budget: e.currentTarget.dataset.val }) },
  setCompanion(e) { this.setData({ companion: e.currentTarget.dataset.val }) },
  setPhysical(e) { this.setData({ physicalLevel: e.currentTarget.dataset.val }) },
  setPace(e) { this.setData({ pace: e.currentTarget.dataset.val }) },

  handleSubmit() {
    if (this.data.selectedTagIds.length < 2) {
      wx.showToast({ title: '请至少选择2个兴趣标签', icon: 'none' })
      return
    }
    const selection = {
      selectedTagIds: this.data.selectedTagIds,
      days: this.data.days,
      budget: this.data.budget,
      companion: this.data.companion,
      physicalLevel: this.data.physicalLevel,
      pace: this.data.pace
    }
    wx.setStorageSync('qianxing_selection', selection)
    wx.navigateTo({ url: '/pages/profile/profile' })
  }
})
