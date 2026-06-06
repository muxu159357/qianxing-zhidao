// pages/knowledge/knowledge.js
const mock = require('../../utils/mock');

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
    // 从 mock 重新加载，保持数据新鲜
    this.loadKnowledge();
  },

  loadKnowledge() {
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

    wx.navigateTo({
      url: `/pages/guide/guide?question=${encodeURIComponent(item.question)}`,
      fail() {
        wx.showToast({ title: 'AI 伴游正在为你准备中', icon: 'none' });
      }
    });
  }
});
