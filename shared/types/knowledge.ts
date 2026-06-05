/** 知识库分类 */
export type KnowledgeCategory =
  | '景点介绍'
  | '交通出行'
  | '美食推荐'
  | '民族文化'
  | '旅行贴士'

/** 知识库问答对 */
export interface KnowledgeItem {
  id: string
  question: string
  answer: string
  category: KnowledgeCategory
  relatedAttractionIds: string[]
}

/** AI对话消息 */
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
