/**
 * Mock 数据层统一导出
 * 所有函数使用 Promise 包装，模拟真实 API 调用（延迟 200-500ms）
 */
import type { Attraction, TourRoute, InterestTag, KnowledgeItem, VisitorSelection } from '../types/index'
import { attractions } from './attractions'
import { routes } from './routes'
import { interestTags } from './interests'
import { knowledgeBase } from './knowledge'
import { generateProfileAsync, type GeneratedProfile } from './profiles'

function randomDelay(): Promise<void> {
  const ms = 200 + Math.floor(Math.random() * 300)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 路线排序结果 */
export interface RankedRoute {
  route: TourRoute
  score: number
  reasons: string[]
  attractions: Attraction[]
}

/** 获取全部景点 */
export async function getAttractions(): Promise<Attraction[]> {
  await randomDelay()
  return [...attractions]
}

/** 根据ID获取单个景点 */
export async function getAttractionById(id: string): Promise<Attraction | null> {
  await randomDelay()
  return attractions.find((a) => a.id === id) ?? null
}

/** 获取全部路线 */
export async function getRoutes(): Promise<TourRoute[]> {
  await randomDelay()
  return [...routes]
}

/** 根据ID获取单条路线 */
export async function getRouteById(id: string): Promise<TourRoute | null> {
  await randomDelay()
  return routes.find((r) => r.id === id) ?? null
}

/** 获取全部兴趣标签 */
export async function getInterestTags(): Promise<InterestTag[]> {
  await randomDelay()
  return [...interestTags]
}

/** 获取全部知识库 */
export async function getKnowledgeBase(): Promise<KnowledgeItem[]> {
  await randomDelay()
  return [...knowledgeBase]
}

/** 搜索知识库（简单关键词匹配） */
export async function searchKnowledge(query: string): Promise<KnowledgeItem[]> {
  await randomDelay()
  const keyword = query.toLowerCase()
  return knowledgeBase.filter(
    (item) =>
      item.question.toLowerCase().includes(keyword) ||
      item.answer.toLowerCase().includes(keyword)
  )
}

/** 根据多个景点ID获取景点列表 */
export async function getAttractionsByIds(ids: string[]): Promise<Attraction[]> {
  await randomDelay()
  return ids
    .map((id) => attractions.find((a) => a.id === id))
    .filter(Boolean) as Attraction[]
}

/** 根据游客选择生成画像 */
export async function generateProfile(selection: VisitorSelection): Promise<GeneratedProfile> {
  return generateProfileAsync(selection)
}

/** 根据游客选择对所有路线打分排序 */
export async function getRankedRoutes(selection: VisitorSelection): Promise<RankedRoute[]> {
  await randomDelay()

  const results = await Promise.all(
    routes.map(async (route) => {
      const reasons: string[] = []
      let score = 0

      // 标签匹配（满分60）
      let tagScore = 0
      const dominantIds = selection.selectedTagIds.slice(0, 2)
      const secondaryIds = selection.selectedTagIds.slice(2)

      for (const tag of route.tags) {
        if (dominantIds.includes(tag)) {
          tagScore += 30
          reasons.push(`核心偏好"${tag}"高度吻合`)
        } else if (secondaryIds.includes(tag)) {
          tagScore += 15
          reasons.push(`补充兴趣"${tag}"可兼顾`)
        } else if (selection.selectedTagIds.includes(tag)) {
          tagScore += 8
        }
      }
      score += Math.min(tagScore, 60)

      // 体力匹配（满分15）
      if (route.physicalLevel === selection.physicalLevel) {
        score += 15
        reasons.push(`体力等级"${route.physicalLevel}"与您一致`)
      } else {
        score += 5
      }

      // 人群匹配（满分15）
      if (route.suitableFor.includes(selection.companion)) {
        score += 15
        reasons.push(`适合"${selection.companion}"出行`)
      } else {
        score += 5
      }

      // 天数匹配（满分10）
      const dayDiff = Math.abs(route.days - selection.days)
      if (dayDiff === 0) {
        score += 10
        reasons.push(`${route.days}天行程完美匹配您的计划`)
      } else if (dayDiff === 1) {
        score += 8
      } else if (dayDiff === 2) {
        score += 5
      } else {
        score += 3
      }

      // 获取关联景点
      const routeAttractions = await getAttractionsByIds(route.attractionIds)

      return { route, score, reasons: reasons.slice(0, 3), attractions: routeAttractions }
    })
  )

  return results.sort((a, b) => b.score - a.score)
}

export type { GeneratedProfile, ProfileMatch } from './profiles'
