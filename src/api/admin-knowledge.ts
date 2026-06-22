import { adminRequest } from './admin-request'

export interface AdminKnowledgeArticle { id: number; articleCode?: string; question: string; answer: string; category?: string; sortOrder: number; status: number; updatedAt?: string }
export type AdminKnowledgeForm = Pick<AdminKnowledgeArticle, 'question'|'answer'|'category'|'sortOrder'|'status'>

export function adminGetArticles(params: Record<string,string|number>): Promise<{records:AdminKnowledgeArticle[];total:number;size:number;current:number}> { return adminRequest('/admin/knowledge/articles',{params}) }
export function adminCreateArticle(p: AdminKnowledgeForm): Promise<AdminKnowledgeArticle> { return adminRequest('/admin/knowledge/articles',{method:'POST',data:p}) }
export function adminUpdateArticle(id: number, p: Partial<AdminKnowledgeForm>): Promise<AdminKnowledgeArticle> { return adminRequest(`/admin/knowledge/articles/${id}`,{method:'PUT',data:p}) }
export function adminUpdateArticleStatus(id: number, status: number): Promise<AdminKnowledgeArticle> { return adminRequest(`/admin/knowledge/articles/${id}/status`,{method:'PUT',params:{status}}) }
export function adminDeleteArticle(id: number): Promise<void> { return adminRequest(`/admin/knowledge/articles/${id}`,{method:'DELETE'}) }
