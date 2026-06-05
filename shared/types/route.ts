import type { Attraction } from './attraction'

/** 体力等级 */
export type PhysicalLevel = '轻松' | '适中' | '挑战'

/** 单日行程计划 */
export interface DailyPlan {
  day: number
  title: string
  attractionIds: string[]
  description: string
  meals: string
  accommodation: string
}

/** 旅游路线 */
export interface TourRoute {
  id: string
  name: string
  days: number
  attractionIds: string[]
  suitableFor: string[]
  physicalLevel: PhysicalLevel
  budgetRange: string
  tags: string[]
  description: string
  dailyPlan: DailyPlan[]
}

/** 路线推荐结果（含匹配度） */
export interface RouteRecommendation {
  route: TourRoute
  attractions: Attraction[]
  matchScore: number
  matchReasons: string[]
}
