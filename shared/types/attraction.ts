/** 景点分类 */
export type ScenicCategory =
  | '自然风光'
  | '民族文化'
  | '古镇历史'
  | '户外探险'
  | '美食特产'
  | '避暑康养'

/** 景点实体 */
export interface Attraction {
  id: string
  name: string
  city: string
  category: ScenicCategory
  tags: string[]
  rating: number
  price: number
  duration: string
  description: string
  highlights: string[]
  tips: string
  /** 真实图片URL（后续替换） */
  imageUrl?: string
  /** CSS渐变占位（第一阶段使用） */
  imageGradient?: string
  /** Emoji图标占位 */
  icon?: string
}
