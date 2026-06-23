<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { adminGetArticles, adminCreateArticle, adminUpdateArticle, adminUpdateArticleStatus, adminDeleteArticle, type AdminKnowledgeArticle, type AdminKnowledgeForm } from '@/api/admin-knowledge'
import { ElMessage, ElMessageBox } from 'element-plus'

const articles = ref<AdminKnowledgeArticle[]>([]); const total = ref(0); const loading = ref(false); const keyword = ref(''); const currentPage = ref(1); const pageSize = ref(10)
async function load() { loading.value = true; try { const p: Record<string,string|number> = { page: currentPage.value, size: pageSize.value }; if (keyword.value.trim()) p.keyword = keyword.value.trim(); const r = await adminGetArticles(p); articles.value = r.records; total.value = r.total } finally { loading.value = false } }
function onSearch() { currentPage.value = 1; load() }
function onPageChange(page: number) { currentPage.value = page; load() }

const dlg = ref(false); const dlgTitle = ref('新增文章'); const dlgLoading = ref(false); const dlgEditId = ref<number|null>(null)
const form = reactive<AdminKnowledgeForm>({ question: '', answer: '', category: '', sortOrder: 0, status: 1 })
const CATS = ['景点知识', '路线攻略', '民族文化', '美食推荐', '交通出行', '安全提醒', '通用问答']

function openNew() { dlgEditId.value = null; dlgTitle.value = '新增文章'; Object.assign(form, { question: '', answer: '', category: '', sortOrder: 0, status: 1 }); dlg.value = true }
function openEdit(a: AdminKnowledgeArticle) { dlgEditId.value = a.id; dlgTitle.value = '编辑文章'; form.question = a.question; form.answer = a.answer; form.category = a.category || ''; form.sortOrder = a.sortOrder??0; form.status = a.status??1; dlg.value = true }
async function onSave() { if (!form.question.trim()) { ElMessage.warning('问题不能为空'); return }; if (!form.answer.trim()) { ElMessage.warning('答案不能为空'); return }; dlgLoading.value = true; try { dlgEditId.value ? await adminUpdateArticle(dlgEditId.value, form) : await adminCreateArticle(form); ElMessage.success(dlgEditId.value?'保存成功':'新增成功'); dlg.value = false; load() } finally { dlgLoading.value = false } }
async function onToggle(a: AdminKnowledgeArticle) { const s = a.status===1?0:1; try{await ElMessageBox.confirm(`确定${s===1?'启用':'停用'}？`,'确认',{type:'warning'})}catch{return}; await adminUpdateArticleStatus(a.id, s); a.status = s; ElMessage.success('操作成功') }
async function onDel(a: AdminKnowledgeArticle) { try{await ElMessageBox.confirm(`确定删除「${a.question}」？`,'确认',{type:'warning'})}catch{return}; await adminDeleteArticle(a.id); ElMessage.success('已删除'); load() }
const sMap: Record<number,{t:''|'success'|'info';tx:string}> = { 1:{t:'success',tx:'启用'}, 0:{t:'info',tx:'停用'} }
onMounted(()=>{ load() })
</script>

<template>
  <div class="ak-page">
    <div class="aph"><div class="aph-l"><h2 class="aph-t">知识库管理</h2><p class="aph-d">管理AI知识库问答词条与分类</p></div><div class="aph-r"><el-input v-model="keyword" placeholder="搜索问题" clearable style="width:240px" @keyup.enter="onSearch"/><el-button type="primary" @click="onSearch">搜索</el-button><el-button @click="load">刷新</el-button><el-button type="success" @click="openNew">新增文章</el-button></div></div>
    <div class="atc">
      <el-table :data="articles" v-loading="loading" stripe><el-table-column prop="id" label="ID" width="60"/><el-table-column prop="question" label="问题" min-width="200"/><el-table-column prop="category" label="分类" width="100"/><el-table-column prop="sortOrder" label="排序" width="70"/><el-table-column label="状态" width="80"><template #default="{ row }"><el-tag :class="row.status===1?'ast-1':'ast-0'" size="small" disable-transitions>{{ sMap[row.status]?.tx||'未知' }}</el-tag></template></el-table-column><el-table-column prop="updatedAt" label="更新时间" width="170"/><el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button text type="primary" size="small" @click="openEdit(row)">编辑</el-button><el-button text size="small" :type="row.status===1?'warning':'success'" @click="onToggle(row)">{{ row.status===1?'停用':'启用' }}</el-button><el-button text type="danger" size="small" @click="onDel(row)">删除</el-button></template></el-table-column></el-table>
      <div v-if="!loading&&articles.length===0" class="aeh">暂无数据</div>
      <div class="atc-pager"><el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="total,prev,pager,next" @current-change="onPageChange"/></div>
    </div>
    <el-dialog v-model="dlg" :title="dlgTitle" width="700px" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="70px"><el-form-item label="问题" required><el-input v-model="form.question" placeholder="如：黄果树瀑布什么时候去最好？"/></el-form-item><el-form-item label="答案" required><el-input v-model="form.answer" type="textarea" :rows="8" placeholder="知识库回答内容"/></el-form-item><el-row :gutter="16"><el-col :span="12"><el-form-item label="分类"><el-select v-model="form.category" style="width:100%" clearable><el-option v-for="c in CATS" :key="c" :label="c" :value="c"/></el-select></el-form-item></el-col><el-col :span="6"><el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="999"/></el-form-item></el-col><el-col :span="6"><el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="停用"/></el-form-item></el-col></el-row></el-form>
      <template #footer><el-button @click="dlg=false">取消</el-button><el-button type="primary" :loading="dlgLoading" @click="onSave">{{ dlgEditId?'保存':'新增' }}</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
