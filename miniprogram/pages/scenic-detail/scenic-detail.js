// pages/scenic-detail/scenic-detail.js
const mock = require('../../utils/mock');

Page({
  data: {
    attraction: null
  },

  onLoad(options) {
    const id = options.id;
    if (!id) {
      this.setData({ attraction: null });
      return;
    }

    const attraction = mock.getAttractionById
      ? mock.getAttractionById(id)
      : (mock.attractions || []).find(item => item.id == id || item.id === id);

    if (attraction) {
      this.setData({ attraction });
    } else {
      this.setData({ attraction: null });
    }
  },

  onGoBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack();
    } else {
      wx.switchTab({ url: '/pages/index/index' });
    }
  },

  onAskAI() {
    const { attraction } = this.data;
    if (!attraction) return;

    const question = `请介绍一下${attraction.name}的详细情况，包括怎么玩、有什么注意事项？`;

    wx.navigateTo({
      url: `/pages/guide/guide?question=${encodeURIComponent(question)}&attractionId=${attraction.id}`,
      fail() {
        wx.showToast({ title: 'AI 伴游正在为你准备中', icon: 'none' });
      }
    });
  },

  onShareAppMessage() {
    const { attraction } = this.data;
    if (!attraction) return { title: '景点详情' };

    return {
      title: `${attraction.name} - ${attraction.city}`,
      path: `/pages/scenic-detail/scenic-detail?id=${attraction.id}`
    };
  }
});
