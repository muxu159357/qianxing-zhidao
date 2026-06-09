// pages/guide/guide.js
Page({
  data: {
    messages: [],           // { id, type: 'ai'|'user', content }
    inputValue: '',         // current input text
    isTyping: false,        // AI typing indicator
    scrollTop: 0,           // scroll-view position
    quickQuestions: [
      '贵州必去景点有哪些？',
      '贵州有什么特色美食？',
      '什么时候去贵州最好？',
      '贵州旅游交通方便吗？'
    ],
    knowledgeBase: []       // loaded from mock
  },

  _msgId: 0,  // internal counter for message IDs
  _firstShow: true,

  onLoad() {
    this.loadKnowledgeBase();
    this.checkRouteAndGreet();
  },

  onShow() {
    if (this._firstShow) {
      this._firstShow = false
      return
    }
    this.checkPendingContext()
  },

  /* ========== Data Loading ========== */

  /** Load knowledgeBase from utils/mock.js */
  loadKnowledgeBase() {
    let kb = [];
    try {
      const mock = require('../../utils/mock');
      // Support both direct export and { knowledgeBase } export
      kb = mock.knowledgeBase || mock.default?.knowledgeBase || [];
    } catch (e) {
      console.warn('[guide] Failed to load knowledgeBase from mock:', e);
    }
    this.setData({ knowledgeBase: kb });
  },

  /** Check if a route was selected on previous page, greet accordingly */
  checkRouteAndGreet() {
    let routeName = '';
    try {
      const stored = wx.getStorageSync('qianxing_selected_route');
      if (typeof stored === 'string' && stored) {
        routeName = stored;
      } else if (stored && typeof stored === 'object') {
        routeName = stored.name || stored.routeName || stored.title || '';
      }
    } catch (e) {
      /* ignore */
    }

    let greeting;
    if (routeName) {
      greeting = `您好！我看到您选择了「${routeName}」路线，真是一个很棒的选择！\n我是您的贵州旅游 AI 伴游，有什么关于贵州旅游的问题都可以问我哦～`;
      try { wx.removeStorageSync('qianxing_selected_route'); } catch (e) { /* ignore */ }
    } else {
      greeting = '您好！我是您的贵州旅游 AI 伴游，有什么关于贵州旅游的问题都可以问我哦～';
    }

    // Slight delay so the greeting feels natural
    setTimeout(() => {
      this.addAIMessage(greeting);
    }, 400);
  },

  /** Check for pending context passed via storage from other pages */
  checkPendingContext() {
    // 1. Check for pending question (from scenic-detail / knowledge)
    let question = ''
    try {
      question = wx.getStorageSync('qianxing_pending_question') || ''
      if (question) wx.removeStorageSync('qianxing_pending_question')
    } catch (e) { /* ignore */ }

    if (question) {
      setTimeout(() => {
        this.addUserMessage(question)
        this.setData({ isTyping: true })
        this.scrollToBottom()
        setTimeout(() => {
          const answer = this.matchAnswer(question)
          this.addAIMessage(answer)
          this.setData({ isTyping: false })
          this.scrollToBottom()
        }, 600)
      }, 300)
      return
    }

    // 2. Check for selected route (from route-detail)
    let routeName = ''
    try {
      const stored = wx.getStorageSync('qianxing_selected_route')
      if (typeof stored === 'string' && stored) {
        routeName = stored
      } else if (stored && typeof stored === 'object') {
        routeName = stored.name || stored.routeName || stored.title || ''
      }
      if (routeName) wx.removeStorageSync('qianxing_selected_route')
    } catch (e) { /* ignore */ }

    if (routeName) {
      setTimeout(() => {
        this.addAIMessage(`您好！我看到您选择了「${routeName}」路线，真是一个很棒的选择！\n我是您的贵州旅游 AI 伴游，有什么关于贵州旅游的问题都可以问我哦～`)
        this.scrollToBottom()
      }, 400)
    }
  },

  /* ========== Message Handling ========== */

  /** Called on input field change */
  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  /** Send the current input message */
  sendMessage() {
    const content = (this.data.inputValue || '').trim();
    if (!content || this.data.isTyping) return;

    // 1. Add user message
    this.addUserMessage(content);
    this.setData({ inputValue: '' });

    // 2. Show typing indicator
    this.setData({ isTyping: true });
    this.scrollToBottom();

    // 3. Simulate AI thinking delay (500–1000ms)
    const delay = 500 + Math.floor(Math.random() * 500);
    setTimeout(() => {
      const answer = this.matchAnswer(content);
      this.addAIMessage(answer);
      this.setData({ isTyping: false });
      this.scrollToBottom();
    }, delay);
  },

  /** Handle quick question tap */
  onQuickTap(e) {
    const question = e.currentTarget.dataset.question;
    if (!question || this.data.isTyping) return;

    // Same flow as sending a regular message
    this.addUserMessage(question);

    this.setData({ isTyping: true });
    this.scrollToBottom();

    const delay = 500 + Math.floor(Math.random() * 500);
    setTimeout(() => {
      const answer = this.matchAnswer(question);
      this.addAIMessage(answer);
      this.setData({ isTyping: false });
      this.scrollToBottom();
    }, delay);
  },

  /* ========== Helpers ========== */

  /** Append an AI message to the chat */
  addAIMessage(content) {
    const msg = {
      id: ++this._msgId,
      type: 'ai',
      content
    };
    const messages = [...this.data.messages, msg];
    this.setData({ messages });
    this.scrollToBottom();
  },

  /** Append a user message to the chat */
  addUserMessage(content) {
    const msg = {
      id: ++this._msgId,
      type: 'user',
      content
    };
    const messages = [...this.data.messages, msg];
    this.setData({ messages });
  },

  /** Scroll the chat to the bottom */
  scrollToBottom() {
    // Using a large scrollTop value triggers scroll-view to its max position
    this.setData({ scrollTop: 99999 });
  },

  /**
   * Simple keyword-matching against the knowledgeBase.
   * Returns the best matching answer, or a friendly fallback.
   */
  matchAnswer(userMessage) {
    const kb = this.data.knowledgeBase;
    if (!kb || kb.length === 0) {
      return this.getFallback();
    }

    const msg = userMessage.trim();
    let bestMatch = null;
    let bestScore = 0;

    for (const item of kb) {
      const question = item.question || '';
      let score = 0;

      // 1. Character-level overlap (works well for Chinese)
      for (const char of msg) {
        if (question.includes(char)) score += 1;
      }

      // 2. Bigram overlap bonus (stronger signal for Chinese phrases)
      if (msg.length >= 2) {
        for (let i = 0; i < msg.length - 1; i++) {
          const bigram = msg.substring(i, i + 2);
          if (question.includes(bigram)) score += 3;
        }
      }

      // 3. Contains-check bonus
      if (question.includes(msg) || msg.includes(question)) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = item;
      }
    }

    // Threshold: require at least some overlap
    if (bestMatch && bestScore >= 3) {
      return bestMatch.answer || this.getFallback();
    }

    return this.getFallback();
  },

  /** Fallback message when no knowledgeBase match is found */
  getFallback() {
    return '抱歉，我暂时还不太了解这个问题的答案～\n不过您可以问我关于贵州的景点、美食、交通、住宿等方面的问题，我会尽力帮您解答！';
  }
});
