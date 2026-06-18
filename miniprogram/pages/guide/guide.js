// pages/guide/guide.js
var api = require('../../utils/api')
var auth = require('../../utils/auth')
var tripRules = require('./guide-trip-rules')
var attractionRules = require('./guide-attraction-rules')

Page({
  data: {
    messages: [],
    inputValue: '',
    isTyping: false,
    scrollTop: 0,
    quickQuestions: [
      '贵州必去景点有哪些？',
      '贵州有什么特色美食？',
      '什么时候去贵州最好？',
      '贵州旅游交通方便吗？'
    ],
    knowledgeBase: [],
    currentTrip: null,
    currentTripId: '',
    currentAttraction: null,
    currentAttractionId: ''
  },

  _msgId: 0,
  _firstShow: true,
  _typewriterTimer: null,
  _defaultQuickQuestions: [
    '贵州必去景点有哪些？',
    '贵州有什么特色美食？',
    '什么时候去贵州最好？',
    '贵州旅游交通方便吗？'
  ],
  _tripQuickQuestions: [
    '总结这条行程',
    '查看每日安排',
    '出行前要准备什么'
  ],
  _completedQuickQuestions: [
    '总结这条行程',
    '查看旅行复盘',
    '下次怎么优化'
  ],
  _attractionQuickQuestions: [
    '这个景点怎么玩',
    '有什么亮点',
    '需要注意什么',
    '适合什么人'
  ],

  onShow() { if (!auth.requireLoginRedirect()) return },

  onLoad() {
    this.loadKnowledgeBase();
    var handledPending = this.checkPendingContext();
    if (!handledPending) {
      this.sendDefaultGreeting();
    }
  },

  onShow() {
    if (this._firstShow) {
      this._firstShow = false
      return
    }
    this.checkPendingContext()
  },

  /* ========== Data Loading ========== */

  loadKnowledgeBase() {
    var kb = [];
    try {
      var mock = require('../../utils/mock');
      kb = mock.knowledgeBase || mock.default && mock.default.knowledgeBase || [];
    } catch (e) {
      /* ignore */
    }
    this.setData({ knowledgeBase: kb });
  },

  sendDefaultGreeting() {
    var self = this
    setTimeout(function () {
      self.addAIMessage('您好！我是您的贵州旅游 AI 伴游，有什么关于贵州旅游的问题都可以问我哦～');
    }, 400);
  },

  /* ========== Pending Context ========== */

  checkPendingContext() {
    var tripCtx = null
    try {
      tripCtx = wx.getStorageSync('qianxing_pending_context')
      if (tripCtx) wx.removeStorageSync('qianxing_pending_context')
    } catch (e) { /* ignore */ }

    if (tripCtx && tripCtx.contextType === 'trip') {
      this.handleTripContext(tripCtx)
      return true
    }

    if (tripCtx && tripCtx.contextType === 'attraction') {
      this.handleAttractionContext(tripCtx)
      return true
    }

    // Check for pending question (from knowledge)
    var question = ''
    try {
      question = wx.getStorageSync('qianxing_pending_question') || ''
      if (question) wx.removeStorageSync('qianxing_pending_question')
    } catch (e) { /* ignore */ }

    if (question) {
      var self = this
      setTimeout(function () {
        self.addUserMessage(question)
        self.setData({ isTyping: true })
        self.scrollToBottom()
        setTimeout(function () {
          var answer = self.matchAnswer(question)
          self.addAIMessage(answer)
          self.setData({ isTyping: false })
          self.scrollToBottom()
        }, 600)
      }, 300)
      return true
    }

    // Check for selected route (from route-detail)
    var routeName = ''
    try {
      var stored = wx.getStorageSync('qianxing_selected_route')
      if (typeof stored === 'string' && stored) {
        routeName = stored
      } else if (stored && typeof stored === 'object') {
        routeName = stored.name || stored.routeName || stored.title || ''
      }
      if (routeName) wx.removeStorageSync('qianxing_selected_route')
    } catch (e) { /* ignore */ }

    if (routeName) {
      var self2 = this
      setTimeout(function () {
        self2.addAIMessage('您好！我看到您选择了「' + routeName + '」路线，真是一个很棒的选择！\n我是您的贵州旅游 AI 伴游，有什么关于贵州旅游的问题都可以问我哦～')
        self2.scrollToBottom()
      }, 400)
      return true
    }

    return false
  },

  handleTripContext(ctx) {
    var tripId = ctx.tripId
    var trip = null
    try {
      var trips = wx.getStorageSync('qianxing_trips') || []
      trip = trips.find(function (t) { return t.id === tripId })
    } catch (e) { /* ignore */ }

    if (!trip) {
      this.setData({
        currentTrip: null,
        currentTripId: '',
        currentAttraction: null,
        currentAttractionId: '',
        quickQuestions: this._defaultQuickQuestions.slice()
      })
      this.sendDefaultGreeting()
      return
    }

    // Normalize trip fields
    trip.dayCount = trip.dayCount || trip.days || 1
    trip.energyLevel = trip.energyLevel || trip.physicalLevel || '适中'
    trip.spotCount = trip.spotCount || (trip.spotNames ? trip.spotNames.length : 0)
    trip.status = trip.status || 'upcoming'

    var quickQs = trip.status === 'completed' ? this._completedQuickQuestions.slice() : this._tripQuickQuestions.slice()

    this.setData({
      currentTrip: trip,
      currentTripId: trip.id,
      currentAttraction: null,
      currentAttractionId: '',
      quickQuestions: quickQs
    })

    var welcome = this.generateTripWelcome(trip, ctx)
    var self = this
    setTimeout(function () {
      self.addAIMessage(welcome)
      self.scrollToBottom()
    }, 400)
  },

  generateTripWelcome(trip, ctx) {
    var name = trip.customName || trip.routeName || '你的行程'
    var dayCount = trip.dayCount || 1
    var spotCount = trip.spotCount || (trip.spotNames ? trip.spotNames.length : 0)
    var energyLevel = trip.energyLevel || '适中'
    var travelDateText = ctx.travelDateText || ''
    var progress = ctx.checklistProgress || { checkedCount: 0, totalCount: 0 }

    var lines = []
    lines.push('您好！我看到您正在查看「' + name + '」。')
    lines.push('这是一条 ' + dayCount + ' 天 ' + spotCount + ' 个景点的行程，体力强度' + energyLevel + '。')

    if (travelDateText) {
      lines.push('出行日期：' + travelDateText + '。')
    }

    if (progress.totalCount > 0) {
      lines.push('出行准备已完成 ' + progress.checkedCount + '/' + progress.totalCount + ' 项。')
    }

    lines.push('')
    lines.push('你可以问我：')
    lines.push('· 总结这条行程')
    lines.push('· 查看每日安排')
    lines.push('· 出行前要准备什么')

    return lines.join('\n')
  },

  /* ========== V13: Attraction Context ========== */

  handleAttractionContext(ctx) {
    var attractionId = ctx.attractionId
    if (!attractionId) {
      this.setData({
        currentAttraction: null,
        currentAttractionId: '',
        currentTrip: null,
        currentTripId: '',
        quickQuestions: this._defaultQuickQuestions.slice()
      })
      this.sendDefaultGreeting()
      return
    }

    var attraction = {
      attractionId: attractionId,
      attractionName: ctx.attractionName || '',
      city: ctx.city || '',
      description: ctx.description || '',
      highlights: ctx.highlights || [],
      tips: ctx.tips || [],
      tags: ctx.tags || [],
      category: ctx.category || '',
      rating: ctx.rating || 0,
      price: ctx.price || '',
      duration: ctx.duration || ''
    }

    this.setData({
      currentAttraction: attraction,
      currentAttractionId: attractionId,
      currentTrip: null,
      currentTripId: '',
      quickQuestions: this._attractionQuickQuestions.slice()
    })

    var welcome = this.generateAttractionWelcome(attraction)
    var self = this
    setTimeout(function () {
      self.addAIMessage(welcome)
      self.scrollToBottom()
    }, 400)
  },

  generateAttractionWelcome(attr) {
    var name = attr.attractionName || '这个景点'
    var lines = []
    lines.push('我看到你正在查看「' + name + '」。')
    if (attr.city) lines.push('它位于贵州' + attr.city + '。')
    lines.push('')
    lines.push('你可以问我：')
    lines.push('· 这个景点怎么玩')
    lines.push('· 有什么亮点')
    lines.push('· 需要注意什么')
    lines.push('· 适合什么人')
    return lines.join('\n')
  },

  /* ========== Message Handling ========== */

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  sendMessage() {
    var content = (this.data.inputValue || '').trim();
    if (!content || this.data.isTyping) return;

    this._stopTypewriter()
    this.addUserMessage(content);
    this.setData({ inputValue: '' });
    this.setData({ isTyping: true });
    this.scrollToBottom();

    var self = this
    api.aiChat(content).then(function (data) {
      self.addAIMessage(data.answer || '智能助手正在为你分析，请稍后再次提问。', data.actions);
      self.setData({ isTyping: false });
      self.scrollToBottom();
    }).catch(function () {
      var answer = self.resolveAnswer(content);
      self.addAIMessage(answer);
      self.setData({ isTyping: false });
      self.scrollToBottom();
    })
  },

  onQuickTap(e) {
    var question = e.currentTarget.dataset.question;
    if (!question || this.data.isTyping) return;

    this._stopTypewriter()
    this.addUserMessage(question);
    this.setData({ isTyping: true });
    this.scrollToBottom();

    var self = this
    api.aiChat(question).then(function (data) {
      self.addAIMessage(data.answer || '智能助手正在为你分析，请稍后再次提问。', data.actions);
      self.setData({ isTyping: false });
      self.scrollToBottom();
    }).catch(function () {
      var answer = self.resolveAnswer(question);
      self.addAIMessage(answer);
      self.setData({ isTyping: false });
      self.scrollToBottom();
    })
  },

  resolveAnswer(userMessage) {
    var trip = this.data.currentTrip
    if (trip) {
      var tripAnswer = tripRules.tripRuleMatch(userMessage, trip)
      if (tripAnswer) return tripAnswer
    }
    var attraction = this.data.currentAttraction
    if (attraction) {
      var attrAnswer = attractionRules.attractionRuleMatch(userMessage, attraction)
      if (attrAnswer) return attrAnswer
    }
    return this.matchAnswer(userMessage)
  },

  /* ========== Helpers ========== */

  _stopTypewriter() {
    if (this._typewriterTimer) {
      clearInterval(this._typewriterTimer)
      this._typewriterTimer = null
    }
  },

  _startTypewriter(msgId, fullText) {
    var self = this
    var index = 0
    self._stopTypewriter()
    self._typewriterTimer = setInterval(function () {
      index++
      if (index > fullText.length) {
        clearInterval(self._typewriterTimer)
        self._typewriterTimer = null
        return
      }
      var partial = fullText.substring(0, index)
      var messages = self.data.messages.slice()
      for (var i = 0; i < messages.length; i++) {
        if (messages[i].id === msgId) { messages[i].content = partial; break }
      }
      self.setData({ messages: messages })
      self.scrollToBottom()
    }, 20)
  },

  addAIMessage(content, actions) {
    var clean = (content || '').replace(/\*\*/g, '').replace(/###?\s/g, '').replace(/```/g, '').replace(/\n{3,}/g, '\n\n').trim()
    if (!clean) clean = '智能助手正在为你分析，请稍后再次提问。'
    var msg = { id: ++this._msgId, type: 'ai', content: '', actions: actions || [] }
    var messages = this.data.messages.slice().concat([msg])
    this.setData({ messages: messages })
    this._startTypewriter(msg.id, clean)
  },

  onActionTap(e) {
    var action = e.currentTarget.dataset.action
    if (!action) return
    if (action.type === 'navigate' && action.page) {
      var tabPages = ['pages/index/index', 'pages/guide/guide', 'pages/my-trips/my-trips']
      var isTab = tabPages.indexOf(action.page.replace(/^\//, '')) !== -1
      var params = action.params || {}
      var query = ''
      Object.keys(params).forEach(function (k) { query += (query ? '&' : '?') + k + '=' + encodeURIComponent(params[k]) })
      if (isTab) wx.switchTab({ url: '/' + action.page.replace(/^\//, '') })
      else wx.navigateTo({ url: '/' + action.page.replace(/^\//, '') + query })
    } else if (action.type === 'create_ai_plan') {
      var p = action.params || {}
      var msg = '请帮我规划一条贵州旅游路线：' + (p.days || 3) + '天，喜欢' + (p.interests ? p.interests.join('、') : '自然风光') + '，节奏' + (p.pace || '轻松')
      this.setData({ inputValue: msg })
      this.sendMessage()
    }
  },

  addUserMessage(content) {
    var msg = { id: ++this._msgId, type: 'user', content: content };
    var messages = this.data.messages.slice().concat([msg]);
    this.setData({ messages: messages });
  },

  scrollToBottom() {
    this.setData({ scrollTop: 99999 });
  },

  matchAnswer(userMessage) {
    var kb = this.data.knowledgeBase;
    if (!kb || kb.length === 0) return this.getFallback();

    var msg = userMessage.trim();
    var bestMatch = null;
    var bestScore = 0;

    for (var i = 0; i < kb.length; i++) {
      var item = kb[i];
      var question = item.question || '';
      var score = 0;

      for (var j = 0; j < msg.length; j++) {
        if (question.indexOf(msg.charAt(j)) !== -1) score += 1;
      }

      if (msg.length >= 2) {
        for (var k = 0; k < msg.length - 1; k++) {
          var bigram = msg.substring(k, k + 2);
          if (question.indexOf(bigram) !== -1) score += 3;
        }
      }

      if (question.indexOf(msg) !== -1 || msg.indexOf(question) !== -1) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && bestScore >= 3) {
      return bestMatch.answer || this.getFallback();
    }

    return this.getFallback();
  },

  getFallback() {
    if (this.data.currentTrip) {
      return '这个问题我暂时无法根据当前行程信息回答。你可以问我关于行程概览、每日安排、安全准备和出行日期的问题。';
    }
    return '抱歉，我暂时还不太了解这个问题的答案～\n不过您可以问我关于贵州的景点、美食、交通、住宿等方面的问题，我会尽力帮您解答！';
  }
})
