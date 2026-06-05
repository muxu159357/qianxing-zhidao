import type { VisitorSelection, InterestTag } from '../types/index'
import { interestTags } from './interests'

export interface ProfileMatch {
  tagId: string
  score: number
  reason: string
}

export interface GeneratedProfile {
  profileId: string
  profileName: string
  dominantInterests: ProfileMatch[]
  secondaryInterests: ProfileMatch[]
  matchSummary: string
  routeStyle: string
  routeStyleDesc: string
}

function getTagById(id: string): InterestTag | undefined {
  return interestTags.find((t) => t.id === id)
}

export function generateProfile(selection: VisitorSelection): GeneratedProfile {
  const tags = selection.selectedTagIds
    .map((id) => getTagById(id))
    .filter(Boolean) as InterestTag[]

  const dominant = tags.slice(0, 2)
  const secondary = tags.slice(2)

  const dominantMatches: ProfileMatch[] = dominant.map((t) => ({
    tagId: t.id,
    score: 85 + Math.floor(Math.random() * 15),
    reason: `贵州${t.name}资源丰富，高度匹配您的偏好`,
  }))

  const secondaryMatches: ProfileMatch[] = secondary.map((t) => ({
    tagId: t.id,
    score: 60 + Math.floor(Math.random() * 25),
    reason: `${t.name}体验可作为行程补充亮点`,
  }))

  const profileName = buildProfileName(dominant, selection.physicalLevel)

  const routeStyleMap: Record<string, { style: string; desc: string }> = {
    '轻松': { style: '轻松慢行型', desc: '行程节奏舒缓，每站预留充足时间，适合深度体验与休闲放松。' },
    '适中': { style: '均衡探索型', desc: '张弛有度的行程编排，兼顾核心景点与自由探索时间。' },
    '挑战': { style: '深度打卡型', desc: '高效紧凑的行程设计，覆盖更多景点，适合精力充沛的旅行者。' },
  }

  const rs = routeStyleMap[selection.physicalLevel]
  const tagNames = dominant.map((t) => t.name).join('、')

  return {
    profileId: `profile-${Date.now()}`,
    profileName,
    dominantInterests: dominantMatches,
    secondaryInterests: secondaryMatches,
    matchSummary: `基于您对${tagNames}的核心偏好，结合${selection.days}天${rs.style}节奏和${selection.companion}出行特点，AI 为您生成专属贵州旅游画像。行程将优先推荐${tagNames}相关的优质景点，并为您预留充足的自由探索与美食体验时间。`,
    routeStyle: rs.style,
    routeStyleDesc: rs.desc,
  }
}

function buildProfileName(tags: InterestTag[], physicalLevel: string): string {
  const tagPart = tags.map((t) => t.name.slice(0, 2)).join('')
  const levelMap: Record<string, string> = {
    '轻松': '漫游者',
    '适中': '探索家',
    '挑战': '深度客',
  }
  return `${tagPart}${levelMap[physicalLevel] ?? '旅行者'}`
}

export async function generateProfileAsync(selection: VisitorSelection): Promise<GeneratedProfile> {
  const ms = 400 + Math.floor(Math.random() * 400)
  await new Promise((resolve) => setTimeout(resolve, ms))
  return generateProfile(selection)
}
