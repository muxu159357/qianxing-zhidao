// pages/knowledge/knowledge.js
const mock = require('../../utils/mock');
var auth = require('../../utils/auth')
var api = require('../../utils/api');
var adapters = require('../../utils/adapters');

Page({
  data: {
    searchText: '',
    activeCategory: 'all',
    categories: [
      { label: '全部', value: 'all' },
      { label: '景点介绍', value: 'scenic' },
      { label: '交通出行', value: 'transport' },
      { label: '美食推荐', value: 'food' },
      { label: '民族文化', value: 'culture' },
      { label: '旅行贴士', value: 'tips' }
    ],
    knowledgeList: [],
    filteredList: []
  },

  onLoad() {
    this.loadKnowledge();
  },

  onShow() {
    if (!auth.requireLoginRedirect()) return
    this.loadKnowledge();
  },

  loadKnowledge() {
    var self = this
    api.getKnowledgeArticles({ page: 1, size: 30 }).then(function (data) {
      var records = data.records || []
      if (records.length > 0) {
        var list = records.map(function (item) { var k = adapters.articleToKnowledge(item); k.expanded = false; return k })
        self.setData({ knowledgeList: list, filteredList: list })
        return
      }
      throw new Error('empty')
    }).catch(function () { self._loadMockKnowledge() })
  },

  _loadMockKnowledge: function () {
    const list = (mock.knowledgeBase || []).map(item => ({
      ...item,
      expanded: false
    }));
    this.setData({ knowledgeList: list }, () => {
      this.applyFilters();
    });
  },

  onSearchInput(e) {
    const searchText = e.detail.value;
    this.setData({ searchText }, () => {
      this.applyFilters();
    });
  },

  onSearchConfirm() {
    // 搜索确认，已在 onSearchInput 中实时过滤
  },

  onClearSearch() {
    this.setData({ searchText: '' }, () => {
      this.applyFilters();
    });
  },

  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ activeCategory: category }, () => {
      this.applyFilters();
    });
  },

  applyFilters() {
    const { searchText, activeCategory, knowledgeList } = this.data;

    let filtered = knowledgeList;

    // 分类筛选
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }

    // 搜索文本筛选
    if (searchText && searchText.trim()) {
      const keyword = searchText.trim().toLowerCase();
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(keyword) ||
        (item.answer && item.answer.toLowerCase().includes(keyword))
      );
    }

    this.setData({ filteredList: filtered });
  },

  onToggleCard(e) {
    const id = e.currentTarget.dataset.id;
    const { filteredList } = this.data;
    const index = filteredList.findIndex(item => item.id === id);
    if (index === -1) return;

    filteredList[index].expanded = !filteredList[index].expanded;
    this.setData({ filteredList });
  },

  onAskAI(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;

    wx.setStorageSync('qianxing_pending_question', item.question);
    wx.switchTab({ url: '/pages/guide/guide' });
  },

  onViewAttraction(e) {
    var attractionId = e.currentTarget.dataset.attractionId;
    if (!attractionId) return;

    wx.navigateTo({
      url: '/pages/scenic-detail/scenic-detail?id=' + attractionId
    });
  }
});
