<template>
  <div class="planner-page">
    <main class="planner-body">
      <section ref="headerRef" class="page-header" style="opacity:0">
        <h2>定制您的贵州之旅</h2>
        <p>选择兴趣偏好与出行需求，AI 将为您生成专属旅游画像与个性化推荐路线</p>
      </section>

      <div class="planner-grid">
        <section ref="formRef" class="form-section">
          <div class="form-card">
            <h3 class="section-title">
              <span class="section-icon">🏷️</span> 兴趣标签
              <span class="required-hint">（至少选择2项）</span>
            </h3>
            <div class="tag-group">
              <button
                v-for="tag in interestTags"
                :key="tag.id"
                class="tag-btn"
                :class="{ active: selectedTagIds.includes(tag.id) }"
                @click="toggleTag(tag.id)"
              >
                <span class="tag-icon">{{ tag.icon }}</span>
                <span class="tag-name">{{ tag.name }}</span>
              </button>
            </div>
          </div>

          <div class="form-card">
            <h3 class="section-title"><span class="section-icon">📅</span> 出行天数</h3>
            <el-radio-group v-model="days" size="large">
              <el-radio-button :value="1">1 天</el-radio-button>
              <el-radio-button :value="2">2 天</el-radio-button>
              <el-radio-button :value="3">3 天</el-radio-button>
              <el-radio-button :value="4">4 天</el-radio-button>
              <el-radio-button :value="5">5 天</el-radio-button>
              <el-radio-button :value="7">7 天</el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-card">
            <h3 class="section-title"><span class="section-icon">💰</span> 预算范围</h3>
            <el-radio-group v-model="budget" size="large">
              <el-radio-button value="经济型">经济型</el-radio-button>
              <el-radio-button value="舒适型">舒适型</el-radio-button>
              <el-radio-button value="品质型">品质型</el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-card">
            <h3 class="section-title"><span class="section-icon">👥</span> 同行人群</h3>
            <el-radio-group v-model="companion" size="large">
              <el-radio-button value="独自出行">独自出行</el-radio-button>
              <el-radio-button value="情侣/朋友">情侣/朋友</el-radio-button>
              <el-radio-button value="亲子家庭">亲子家庭</el-radio-button>
              <el-radio-button value="银发康养">银发康养</el-radio-button>
              <el-radio-button value="研学团队">研学团队</el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-card">
            <h3 class="section-title"><span class="section-icon">💪</span> 体力偏好</h3>
            <el-radio-group v-model="physicalLevel" size="large">
              <el-radio-button value="轻松">
                <span class="radio-label"><span class="radio-icon">🚶</span> 轻松</span>
              </el-radio-button>
              <el-radio-button value="适中">
                <span class="radio-label"><span class="radio-icon">🚶‍♂️</span> 适中</span>
              </el-radio-button>
              <el-radio-button value="挑战">
                <span class="radio-label"><span class="radio-icon">🧗</span> 挑战</span>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="form-card">
            <h3 class="section-title"><span class="section-icon">⏱️</span> 旅游节奏</h3>
            <el-radio-group v-model="pace" size="large">
              <el-radio-button value="慢游">
                <span class="radio-label"><span class="radio-icon">☕</span> 慢游</span>
              </el-radio-button>
              <el-radio-button value="均衡">
                <span class="radio-label"><span class="radio-icon">⚖️</span> 均衡</span>
              </el-radio-button>
              <el-radio-button value="高效">
                <span class="radio-label"><span class="radio-icon">⚡</span> 高效</span>
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="submit-area">
            <el-button
              type="primary"
              size="large"
              class="submit-btn"
              @click="handleSubmit"
            >
              生成个性化路线
            </el-button>
          </div>
        </section>

        <section ref="previewRef" class="preview-section" style="opacity:0">
          <div class="preview-sticky">
            <div class="preview-card">
              <div class="preview-header">
                <span class="preview-title">AI 游客画像预览</span>
                <el-tag size="small" type="success" effect="light">实时生成</el-tag>
              </div>

              <div class="profile-name">{{ profileName }}</div>

              <div class="profile-detail">
                <div class="detail-row">
                  <span class="detail-label">兴趣标签</span>
                  <span v-if="selectedTags.length" class="detail-value">
                    <el-tag
                      v-for="tag in selectedTags"
                      :key="tag.id"
                      size="small"
                      class="profile-tag"
                    >{{ tag.icon }} {{ tag.name }}</el-tag>
                  </span>
                  <span v-else class="detail-empty">请至少选择 2 个兴趣标签</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">出行天数</span>
                  <span class="detail-value">{{ days }} 天</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">预算范围</span>
                  <span class="detail-value">{{ budget }}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">同行人群</span>
                  <span class="detail-value">{{ companion }}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">体力偏好</span>
                  <span class="detail-value">{{ physicalLevel }}</span>
                </div>

                <div class="detail-row">
                  <span class="detail-label">旅游节奏</span>
                  <span class="detail-value">{{ pace }}</span>
                </div>
              </div>

              <div class="profile-summary">
                <div class="summary-label">AI 画像解读</div>
                <p class="summary-text">{{ aiSummary }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import gsap from 'gsap'
import { getInterestTags } from '@shared/mock'
import type { InterestTag, TravelPace, PhysicalPreference, CompanionType } from '@shared/types'

const router = useRouter()

const interestTags = ref<InterestTag[]>([])
const selectedTagIds = ref<string[]>([])
const days = ref<number>(3)
const budget = ref<string>('舒适型')
const companion = ref<CompanionType>('情侣/朋友')
const physicalLevel = ref<PhysicalPreference>('适中')
const pace = ref<TravelPace>('均衡')

const headerRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLElement | null>(null)
const previewRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  interestTags.value = await getInterestTags()

  const tl = gsap.timeline()
  tl.from(headerRef.value, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })
  if (formRef.value) {
    const cards = formRef.value.querySelectorAll('.form-card, .submit-area')
    tl.from(cards, { x: -40, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '-=0.3')
  }
  tl.from(previewRef.value, { x: 40, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
})

function toggleTag(id: string) {
  const idx = selectedTagIds.value.indexOf(id)
  if (idx >= 0) {
    selectedTagIds.value = selectedTagIds.value.filter((t) => t !== id)
  } else {
    selectedTagIds.value = [...selectedTagIds.value, id]
  }
}

const selectedTags = computed(() =>
  interestTags.value.filter((t) => selectedTagIds.value.includes(t.id))
)

const profileName = computed(() => {
  const tagNames = selectedTags.value.map((t) => t.name)
  if (tagNames.length < 2) return '等待选择偏好…'

  const primary = tagNames.slice(0, 2).join('')
  const levelMap: Record<string, string> = { '轻松': '轻松型', '适中': '探索型', '挑战': '深度型' }
  return `${primary}${levelMap[physicalLevel.value]}游客`
})

const aiSummary = computed(() => {
  const tags = selectedTags.value
  if (tags.length < 2) {
    return '请在左侧选择至少 2 个兴趣标签，并完成出行偏好设置。AI 将根据您的选择生成个性化画像解读与路线推荐方案。'
  }

  const tagNames = tags.map((t) => t.name).join('、')
  const paceMap: Record<string, string> = { '慢游': '深度慢行', '均衡': '劳逸结合', '高效': '高效打卡' }
  const companionMap: Record<string, string> = {
    '独自出行': '独自探索',
    '情侣/朋友': '结伴同行',
    '亲子家庭': '亲子互动',
    '银发康养': '康养休闲',
    '研学团队': '研学实践',
  }

  return `基于您在${tagNames}方面的兴趣偏好，结合${days.value}天${paceMap[pace.value]}节奏、${physicalLevel.value}体力需求和${companionMap[companion.value]}的出行方式，AI 为您生成"${profileName.value}"画像。推荐路线将优先匹配贵州${tags[0]?.name ?? ''}和${tags[1]?.name ?? ''}相关的优质景点，并确保行程节奏适合${companion.value}出行。`
})

function handleSubmit() {
  if (selectedTagIds.value.length < 2) {
    ElMessage.warning('请至少选择 2 个兴趣标签，以便 AI 为您精准画像')
    return
  }

  const selection = {
    selectedTagIds: selectedTagIds.value,
    days: days.value,
    budget: budget.value,
    companion: companion.value,
    physicalLevel: physicalLevel.value,
    pace: pace.value,
  }

  localStorage.setItem('qianxing_visitor_selection', JSON.stringify(selection))
  router.push('/profile')
}
</script>

<style scoped>
.planner-page {
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 12% 20%, rgba(82, 183, 136, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45, 108, 223, 0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}

.planner-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 48px 80px;
}

.page-header {
  margin-bottom: 36px;
}

.page-header h2 {
  margin: 0 0 10px;
  font-size: 36px;
  color: #10251d;
  letter-spacing: -0.03em;
}

.page-header p {
  margin: 0;
  font-size: 16px;
  color: #4d5f6f;
  line-height: 1.7;
}

.planner-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: start;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  padding: 24px;
  border: 1px solid rgba(31, 143, 95, 0.1);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.05);
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  color: #10251d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  font-size: 20px;
}

.required-hint {
  font-size: 13px;
  color: #e67e22;
  font-weight: 400;
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: 2px solid rgba(31, 143, 95, 0.15);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  font-size: 15px;
  font-family: inherit;
  color: #4d5f6f;
  transition: all 0.2s ease;
}

.tag-btn:hover {
  border-color: rgba(31, 143, 95, 0.4);
  background: rgba(31, 143, 95, 0.06);
}

.tag-btn.active {
  border-color: #1f8f5f;
  background: rgba(31, 143, 95, 0.1);
  color: #1f8f5f;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(31, 143, 95, 0.15);
}

.tag-icon {
  font-size: 18px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 4px;
}

.radio-icon {
  font-size: 14px;
}

.submit-area {
  margin-top: 8px;
}

.submit-btn {
  width: 100%;
  height: 52px;
  font-size: 17px;
  font-weight: 700;
  border-radius: 16px;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  border: none;
}

.submit-btn:hover {
  opacity: 0.92;
}

.preview-sticky {
  position: sticky;
  top: 40px;
}

.preview-card {
  padding: 32px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 30px 80px rgba(34, 73, 61, 0.14);
  backdrop-filter: blur(20px);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.preview-title {
  font-size: 18px;
  font-weight: 700;
  color: #10251d;
}

.profile-name {
  padding: 16px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(31, 143, 95, 0.08), rgba(47, 107, 255, 0.06));
  border: 1px solid rgba(31, 143, 95, 0.12);
  font-size: 22px;
  font-weight: 700;
  color: #123524;
  text-align: center;
  margin-bottom: 24px;
}

.profile-detail {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef2f5;
}

.detail-label {
  font-size: 14px;
  color: #5d6b7a;
  flex-shrink: 0;
}

.detail-value {
  font-size: 14px;
  color: #10251d;
  font-weight: 600;
  text-align: right;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
}

.detail-empty {
  font-size: 13px;
  color: #c0c4cc;
  font-style: italic;
}

.profile-tag {
  margin: 0;
}

.profile-summary {
  padding: 20px;
  border-radius: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid rgba(47, 107, 255, 0.08);
}

.summary-label {
  font-size: 13px;
  font-weight: 700;
  color: #2f6bff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 10px;
}

.summary-text {
  margin: 0;
  font-size: 14px;
  color: #4d5f6f;
  line-height: 1.8;
}

@media (max-width: 900px) {
  .planner-body {
    padding: 32px 22px 60px;
  }

  .planner-grid {
    grid-template-columns: 1fr;
  }

  .page-header h2 {
    font-size: 28px;
  }

  .preview-sticky {
    position: static;
  }
}
</style>
