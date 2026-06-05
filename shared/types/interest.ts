/** 兴趣标签 */
export interface InterestTag {
  id: string
  name: string
  icon: string
  category: string
}

/** 同伴类型 */
export type CompanionType = '独自出行' | '情侣/朋友' | '亲子家庭' | '银发康养' | '研学团队'

/** 旅游节奏 */
export type TravelPace = '慢游' | '均衡' | '高效'

/** 体力偏好 */
export type PhysicalPreference = '轻松' | '适中' | '挑战'

/** 游客兴趣选择输入 */
export interface VisitorSelection {
  selectedTagIds: string[]
  days: number
  budget: string
  companion: CompanionType
  physicalLevel: PhysicalPreference
  pace: TravelPace
}

/** 游客画像结果 */
export interface VisitorProfile {
  profileId: string
  dominantInterests: InterestTag[]
  secondaryInterests: InterestTag[]
  selection: VisitorSelection
  profileSummary: string
  generatedAt: string
}
