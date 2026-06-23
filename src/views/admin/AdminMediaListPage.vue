<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminGetMediaAssets, adminUpdateMediaAsset, adminDeleteMediaAsset, type AdminMediaAsset } from '@/api/admin-media'
import { ElMessage, ElMessageBox } from 'element-plus'
const assets = ref<AdminMediaAsset[]>([]); const total = ref(0); const loading = ref(false); const bizType = ref(''); const currentPage = ref(1); const pageSize = ref(20)
async function load() { loading.value = true; try { const p: Record<string,string|number> = { page: currentPage.value, size: pageSize.value }; if (bizType.value.trim()) p.bizType = bizType.value.trim(); const r = await adminGetMediaAssets(p); assets.value = r.records; total.value = r.total } finally { loading.value = false } }
function onSearch() { currentPage.value = 1; load() }
async function onToggle(a: AdminMediaAsset) { const s = a.status===1?0:1; try{await ElMessageBox.confirm(s===1?'确定启用？':'确定停用？','确认',{type:'warning'})}catch{return}; await adminUpdateMediaAsset(a.id, { status: s }); a.status = s; ElMessage.success('操作成功') }
async function onDel(a: AdminMediaAsset) { try{await ElMessageBox.confirm('确定删除？','确认',{type:'warning'})}catch{return}; await adminDeleteMediaAsset(a.id); ElMessage.success('已删除'); load() }
const sMap: Record<number,{t:''|'success'|'info';tx:string}> = { 1:{t:'success',tx:'启用'}, 0:{t:'info',tx:'停用'} }
onMounted(()=>{ load() })
</script>
<template>
  <div class="am-page"><div class="aph"><div class="aph-l"><h2 class="aph-t">媒体管理</h2><p class="aph-d">管理图片与视频等媒体资源文件</p></div><div class="aph-r"><el-select v-model="bizType" placeholder="业务类型" clearable style="width:140px" @change="onSearch"><el-option label="景点" value="scenic"/><el-option label="路线" value="route"/><el-option label="知识库" value="knowledge"/></el-select><el-button type="primary" @click="onSearch">搜索</el-button><el-button @click="load">刷新</el-button><el-button disabled>上传（需配置存储服务）</el-button></div></div>
    <div class="atc"><el-alert title="文件上传需要配置 OSS/S3 等存储服务，当前只支持管理已有媒体记录" type="info" :closable="false" style="margin-bottom:16px"/>
      <el-table :data="assets" v-loading="loading" stripe><el-table-column prop="id" label="ID" width="60"/><el-table-column prop="bizType" label="业务类型" width="90"/><el-table-column prop="bizId" label="关联ID" width="80"/><el-table-column prop="assetType" label="类型" width="80"/><el-table-column prop="url" label="URL" min-width="200"><template #default="{row}"><a :href="row.url" target="_blank" style="color:#2f6bff;font-size:12px">{{ row.url }}</a></template></el-table-column><el-table-column prop="sortOrder" label="排序" width="70"/><el-table-column label="状态" width="80"><template #default="{row}"><el-tag :class="row.status===1?'ast-1':'ast-0'" size="small" disable-transitions>{{ sMap[row.status]?.tx||'未知' }}</el-tag></template></el-table-column><el-table-column label="操作" width="160"><template #default="{row}"><el-button text size="small" :type="row.status===1?'warning':'success'" @click="onToggle(row)">{{ row.status===1?'停用':'启用' }}</el-button><el-button text type="danger" size="small" @click="onDel(row)">删除</el-button></template></el-table-column></el-table>
      <div v-if="!loading&&assets.length===0" class="aeh">暂无数据</div>
      <div class="atc-pager"><el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="total,prev,pager,next" @current-change="(p:number)=>{currentPage=p;load()}"/></div>
    </div>
  </div>
</template>
<style scoped></style>
