import { adminRequest } from './admin-request'
export interface AdminMediaAsset { id: number; bizType?: string; bizId?: number; assetType?: string; url: string; thumbUrl?: string; source?: string; width?: number; height?: number; sortOrder: number; status: number; updatedAt?: string }
export function adminGetMediaAssets(params: Record<string,string|number>): Promise<{records:AdminMediaAsset[];total:number;size:number;current:number}> { return adminRequest('/admin/media/assets',{params}) }
export function adminUpdateMediaAsset(id: number, p: Partial<AdminMediaAsset>): Promise<AdminMediaAsset> { return adminRequest(`/admin/media/assets/${id}`,{method:'PUT',data:p}) }
export function adminDeleteMediaAsset(id: number): Promise<void> { return adminRequest(`/admin/media/assets/${id}`,{method:'DELETE'}) }
