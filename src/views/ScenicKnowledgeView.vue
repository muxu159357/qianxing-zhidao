<template>
  <div class="knowledge-page">
    <main class="knowledge-body">
      <section ref="headerRef" class="page-header" style="opacity:0">
        <h2>景点知识库</h2>
        <p>覆盖贵州全省自然景观、民族文化和历史人文的全域智能知识库，共收录 {{ totalCount }} 条知识问答</p>
      </section>

      <div ref="searchRef" class="search-section" style="opacity:0">
        <el-input
          v-model="searchText"
          placeholder="搜索景点、美食、交通、文化…"
          size="large"
          clearable
          class="search-input"
          @input="onSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div class="category-filters">
          <button
            v-for="cat in categories"
            :key="cat"
            class="cat-btn"
            :class="{ active: activeCategory === cat }"
            @click="selectCategory(cat)"
          >{{ cat }}</button>
        </div>
      </div>

      <div v-if="filteredList.length === 0" ref="emptyRef" class="empty-state" style="opacity:0">
        <p>未找到匹配的知识问答</p>
        <el-button text @click="resetFilters">清除筛选条件</el-button>
      </div>

      <div v-else class="knowledge-grid" ref="gridRef">
        <div
          v-for="(item, idx) in filteredList"
          :key="item.id"
          class="knowledge-card"
          :class="{ expanded: expandedId === item.id }"
          @click="toggleCard(item.id)"
        >
          <div class="card-header">
            <el-tag size="small" type="success" effect="plain">{{ item.category }}</el-tag>
            <span class="card-question">{{ item.question }}</span>
            <el-icon class="expand-icon" :class="{ rotated: expandedId === item.id }">
              <ArrowDown />
            </el-icon>
          </div>
          <div v-if="expandedId === item.id" class="card-answer">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { Search, ArrowDown } from '@element-plus/icons-vue'
import gsap from 'gsap'
import { knowledgeBase } from '@shared/mock/knowledge'

const headerRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

const searchText = ref('')
const activeCategory = ref<string>('全部')
const expandedId = ref<string | null>(null)
const totalCount = knowledgeBase.length

const categories: string[] = ['全部', '景点介绍', '交通出行', '美食推荐', '民族文化', '旅行贴士']

const filteredList = computed(() => {
  let list = knowledgeBase
  if (activeCategory.value !== '全部') {
    list = list.filter((item) => item.category === activeCategory.value)
  }
  const q = searchText.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (item) =>
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q)
    )
  }
  return list
})

onMounted(async () => {
  const tl = gsap.timeline()
  tl.from(headerRef.value, { y: 24, opacity: 0, duration: 0.5, ease: 'power3.out' })
  tl.from(searchRef.value, { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
  await nextTick()
  animateCards()
})

function animateCards() {
  const cards = gridRef.value?.querySelectorAll('.knowledge-card')
  if (cards && cards.length) {
    gsap.from(cards, { y: 28, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' })
  }
}

function toggleCard(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function selectCategory(cat: string) {
  activeCategory.value = cat
  expandedId.value = null
  nextTick(() => animateCards())
}

function onSearch() {
  expandedId.value = null
  nextTick(() => {
    if (filteredList.value.length > 0) animateCards()
  })
}

function resetFilters() {
  searchText.value = ''
  activeCategory.value = '全部'
}
</script>

<style scoped>
.knowledge-page {
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 12% 20%, rgba(82, 183, 136, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45, 108, 223, 0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}

.knowledge-body { max-width: 880px; margin: 0 auto; padding: 32px 24px 60px; }

.page-header { margin-bottom: 28px; }
.page-header h2 { margin: 0 0 8px; font-size: 32px; color: #10251d; letter-spacing: -0.03em; }
.page-header p { margin: 0; font-size: 15px; color: #4d5f6f; }

.search-section { margin-bottom: 28px; }

.search-input :deep(.el-input__wrapper) {
  border-radius: 16px; border-color: rgba(31, 143, 95, 0.15);
  box-shadow: 0 6px 24px rgba(19, 61, 45, 0.04);
}
.search-input :deep(.el-input__wrapper:hover) { border-color: rgba(31, 143, 95, 0.35); }
.search-input :deep(.el-input__prefix) { color: #909399; }

.category-filters { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
.cat-btn {
  padding: 8px 20px; border-radius: 12px;
  border: 1px solid rgba(31, 143, 95, 0.12);
  background: rgba(255, 255, 255, 0.7); color: #4d5f6f;
  font-size: 14px; font-family: inherit; cursor: pointer;
  transition: all 0.2s;
}
.cat-btn:hover { border-color: rgba(31, 143, 95, 0.35); color: #1f8f5f; }
.cat-btn.active {
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  color: #fff; border-color: transparent;
}

.empty-state { text-align: center; padding: 64px 0; color: #909399; font-size: 15px; }

.knowledge-grid { display: flex; flex-direction: column; gap: 12px; }

.knowledge-card {
  border-radius: 18px; padding: 20px 24px; cursor: pointer;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(31, 143, 95, 0.08);
  box-shadow: 0 8px 28px rgba(19, 61, 45, 0.03);
  backdrop-filter: blur(12px);
  transition: all 0.2s;
}
.knowledge-card:hover { border-color: rgba(31, 143, 95, 0.2); box-shadow: 0 14px 40px rgba(34, 73, 61, 0.08); }
.knowledge-card.expanded { border-color: rgba(31, 143, 95, 0.25); }

.card-header { display: flex; align-items: center; gap: 14px; }
.card-question { flex: 1; font-size: 15px; font-weight: 600; color: #10251d; line-height: 1.5; }
.expand-icon { color: #909399; font-size: 14px; transition: transform 0.25s; flex-shrink: 0; }
.expand-icon.rotated { transform: rotate(180deg); }

.card-answer { margin-top: 16px; padding-top: 16px; border-top: 1px solid #eef2f5; }
.card-answer p { margin: 0; font-size: 14px; color: #4d5f6f; line-height: 1.8; }

@media (max-width: 900px) {
  .knowledge-body { padding: 24px 16px 40px; }
  .page-header h2 { font-size: 26px; }
  .knowledge-card { padding: 16px 18px; }
  .card-question { font-size: 14px; }
}
</style>
