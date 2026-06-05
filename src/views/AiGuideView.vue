<template>
  <div class="guide-page">
    <main class="guide-body">
      <section ref="headerRef" class="page-header" style="opacity:0">
        <h2>AI 智能导游</h2>
        <p v-if="routeName">{{ routeName }} · 专属行程顾问</p>
        <p v-else>基于贵州全域旅游知识库，为您提供实时智能导览问答服务</p>
      </section>

      <div class="chat-container" ref="chatRef" style="opacity:0">
        <div class="chat-messages" ref="messagesRef">
          <div
            v-for="(msg, idx) in messages"
            :key="msg.id"
            class="msg-row"
            :class="msg.role"
          >
            <div class="msg-avatar">
              <span v-if="msg.role === 'assistant'" class="avatar-ai">AI</span>
              <span v-else class="avatar-user">U</span>
            </div>
            <div class="msg-bubble" :class="msg.role">
              <div class="msg-text" v-html="renderContent(msg)"></div>
              <div class="msg-time">{{ formatTime(msg.timestamp) }}</div>
            </div>
          </div>

          <div v-if="typing" class="msg-row assistant">
            <div class="msg-avatar">
              <span class="avatar-ai">AI</span>
            </div>
            <div class="msg-bubble assistant typing-bubble">
              <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
          </div>
        </div>

        <div v-if="messages.length === 0 && !typing" class="quick-questions">
          <p class="quick-hint">试试这些问题：</p>
          <div class="quick-grid">
            <button
              v-for="q in quickQuestions"
              :key="q"
              class="quick-btn"
              @click="askQuick(q)"
            >{{ q }}</button>
          </div>
        </div>

        <div class="chat-input-row">
          <el-input
            v-model="inputText"
            placeholder="输入您的问题，AI 导游为您解答…"
            size="large"
            class="chat-input"
            @keyup.enter="sendMessage"
            :disabled="typing"
          />
          <el-button
            type="primary"
            size="large"
            class="send-btn"
            @click="sendMessage"
            :disabled="!inputText.trim() || typing"
          >
            发送
          </el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import gsap from 'gsap'
import { knowledgeBase } from '@shared/mock/knowledge'
import type { ChatMessage } from '@shared/types'

const headerRef = ref<HTMLElement | null>(null)
const chatRef = ref<HTMLElement | null>(null)
const messagesRef = ref<HTMLElement | null>(null)

const messages = ref<ChatMessage[]>([])
const inputText = ref('')
const typing = ref(false)

const routeName = ref('')

const quickQuestions = [
  '黄果树瀑布最佳游览季节是什么时候？',
  '贵州有哪些必吃的特色美食？',
  '贵州旅游景点之间交通方便吗？',
  '西江千户苗寨有哪些独特的民族文化体验？',
]

let msgCounter = 0

onMounted(() => {
  try {
    const raw = localStorage.getItem('qianxing_selected_route')
    if (raw) {
      const route = JSON.parse(raw)
      routeName.value = route.name ?? ''
    }
  } catch { /* ignore */ }

  const tl = gsap.timeline()
  tl.from(headerRef.value, { y: 24, opacity: 0, duration: 0.5, ease: 'power3.out' })
  tl.from(chatRef.value, { y: 32, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2')

  if (routeName.value) {
    addMessage('assistant', `您好！我是您的"${routeName.value}"专属AI导游。您可以向我咨询关于这条路线沿途景点的详细信息、交通出行建议、美食推荐和民族风情等问题。`)
  } else {
    addMessage('assistant', '您好！我是黔行智导AI导游，基于贵州全域旅游知识库为您提供智能导览服务。您可以向我咨询景点信息、交通出行、美食推荐、民族文化和旅行贴士等问题。')
  }
})

function formatTime(ts: string): string {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function renderContent(msg: ChatMessage): string {
  if (msg.role === 'assistant') {
    return msg.content.replace(/\n/g, '<br>')
  }
  return msg.content
}

function addMessage(role: 'user' | 'assistant', content: string) {
  msgCounter++
  messages.value = [...messages.value, {
    id: `msg-${msgCounter}`,
    role,
    content,
    timestamp: new Date().toISOString(),
  }]
}

async function scrollToBottom() {
  await nextTick()
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

function findAnswer(question: string): string {
  const q = question.toLowerCase()
  const scored = knowledgeBase.map((kb) => {
    const qLower = kb.question.toLowerCase()
    const words = q.split(/\s+/).filter((w) => w.length > 1)
    let score = 0
    for (const w of words) {
      if (qLower.includes(w)) score += 3
    }
    return { kb, score }
  })
  scored.sort((a, b) => b.score - a.score)
  const best = scored[0]
  if (best && best.score >= 2) return best.kb.answer

  return '感谢您的提问！关于这个问题，我建议您参考贵州旅游官方指南或咨询当地旅游服务中心。您也可以尝试用更具体的关键词提问，比如景点名称或旅行话题。'
}

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || typing.value) return

  inputText.value = ''
  addMessage('user', text)
  await scrollToBottom()

  typing.value = true
  await scrollToBottom()

  const delay = 600 + Math.random() * 800
  const answer = await new Promise<string>((resolve) => {
    setTimeout(() => resolve(findAnswer(text)), delay)
  })

  typing.value = false
  addMessage('assistant', answer)
  await scrollToBottom()

  const lastBubble = messagesRef.value?.querySelector('.msg-row.assistant:last-child .msg-bubble')
  if (lastBubble) {
    gsap.from(lastBubble, { y: 12, opacity: 0, scale: 0.96, duration: 0.35, ease: 'power2.out' })
  }
}

function askQuick(question: string) {
  addMessage('user', question)
  scrollToBottom()

  typing.value = true
  scrollToBottom()

  const delay = 500 + Math.random() * 600
  setTimeout(() => {
    typing.value = false
    addMessage('assistant', findAnswer(question))
    scrollToBottom()
  }, delay)
}
</script>

<style scoped>
.guide-page {
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 12% 20%, rgba(82, 183, 136, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45, 108, 223, 0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}

.guide-body { max-width: 800px; margin: 0 auto; padding: 32px 24px 48px; }

.page-header { margin-bottom: 28px; }
.page-header h2 { margin: 0 0 8px; font-size: 32px; color: #10251d; letter-spacing: -0.03em; }
.page-header p { margin: 0; font-size: 15px; color: #4d5f6f; }

.chat-container {
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 24px 64px rgba(34, 73, 61, 0.1);
  backdrop-filter: blur(18px);
  overflow: hidden;
}

.chat-messages {
  height: 440px; overflow-y: auto; padding: 24px 28px 0;
  display: flex; flex-direction: column; gap: 18px; scroll-behavior: smooth;
}

.chat-messages::-webkit-scrollbar { width: 5px; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(31, 143, 95, 0.15); border-radius: 10px; }

.msg-row { display: flex; gap: 12px; align-items: flex-start; }
.msg-row.user { flex-direction: row-reverse; }

.msg-avatar { flex-shrink: 0; }
.avatar-ai {
  width: 36px; height: 36px; border-radius: 12px;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
}
.avatar-user {
  width: 36px; height: 36px; border-radius: 12px;
  background: linear-gradient(135deg, #e67e22, #f0a04b);
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
}

.msg-bubble {
  max-width: 72%; padding: 14px 20px; border-radius: 18px;
  font-size: 15px; line-height: 1.7; color: #10251d;
}
.msg-bubble.assistant {
  background: linear-gradient(135deg, rgba(31, 143, 95, 0.06), rgba(47, 107, 255, 0.04));
  border: 1px solid rgba(31, 143, 95, 0.1);
  border-bottom-left-radius: 6px;
}
.msg-bubble.user {
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  color: #fff; border-bottom-right-radius: 6px;
}

.msg-text { word-break: break-word; }
.msg-time { margin-top: 6px; font-size: 11px; color: #909399; }
.msg-bubble.user .msg-time { color: rgba(255, 255, 255, 0.7); }

.typing-bubble { padding: 16px 24px; }
.typing-dots { display: flex; gap: 5px; align-items: center; }
.typing-dots span {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(31, 143, 95, 0.35);
  animation: dotPulse 1.4s infinite ease-in-out both;
}
.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.quick-questions {
  padding: 24px 28px 16px; border-top: 1px solid rgba(31, 143, 95, 0.06);
}
.quick-hint { margin: 0 0 12px; font-size: 14px; color: #909399; }
.quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.quick-btn {
  text-align: left; padding: 12px 16px; border-radius: 14px;
  border: 1px solid rgba(31, 143, 95, 0.12); background: rgba(255, 255, 255, 0.7);
  font-size: 13px; font-family: inherit; color: #4d5f6f;
  cursor: pointer; line-height: 1.5; transition: all 0.2s;
}
.quick-btn:hover {
  border-color: rgba(31, 143, 95, 0.35); background: rgba(31, 143, 95, 0.05); color: #1f8f5f;
}

.chat-input-row {
  display: flex; gap: 12px; padding: 18px 24px 24px;
  border-top: 1px solid rgba(31, 143, 95, 0.06); background: rgba(255, 255, 255, 0.5);
}

.chat-input { flex: 1; }
.chat-input :deep(.el-input__wrapper) {
  border-radius: 16px; border-color: rgba(31, 143, 95, 0.15); box-shadow: none !important;
}
.chat-input :deep(.el-input__wrapper:hover) { border-color: rgba(31, 143, 95, 0.35); }

.send-btn {
  height: 44px; border-radius: 14px;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  border: none; font-weight: 700; font-size: 15px; padding: 0 28px;
}

@media (max-width: 900px) {
  .guide-body { padding: 24px 16px 40px; }
  .chat-messages { height: 360px; padding: 20px 16px 0; }
  .msg-bubble { max-width: 82%; }
  .quick-grid { grid-template-columns: 1fr; }
  .chat-input-row { padding: 14px 16px 20px; }
  .page-header h2 { font-size: 26px; }
}
</style>
