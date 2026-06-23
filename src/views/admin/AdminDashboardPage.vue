<script setup lang="ts">
import { adminAuthState } from '@/stores/admin-auth'
</script>

<template>
  <div class="dashboard">
    <div class="stats-row">
      <div class="stat-card" v-for="s in [
        {label:'景区总数',value:'156',sub:'较上月 +8',icon:'Picture',bg:'#f0fdf9',fg:'#0d9488'},
        {label:'路线总数',value:'48',sub:'较上月 +3',icon:'Promotion',bg:'#eff6ff',fg:'#3b82f6'},
        {label:'本月行程数',value:'1,234',sub:'较上月 +12.4%',icon:'List',bg:'#ecfdf5',fg:'#059669'},
        {label:'知识库词条',value:'892',sub:'较上月 +45',icon:'Reading',bg:'#f5f3ff',fg:'#7c3aed'}
      ]" :key="s.label">
        <div class="stat-body">
          <div class="stat-label">{{s.label}}</div>
          <div class="stat-value">{{s.value}}</div>
          <div class="stat-sub">{{s.sub}}</div>
        </div>
        <div class="stat-icon" :style="{background:s.bg,color:s.fg}"><el-icon><component :is="s.icon"/></el-icon></div>
      </div>
    </div>
    <div class="charts-row">
      <div class="chart-card chart-card-wide">
        <div class="chart-header">
          <div><div class="chart-title">访问量趋势</div><div class="chart-sub">近7天用户访问数据</div></div>
          <span class="chart-chip">日访问</span>
        </div>
        <div class="chart-placeholder">
          <div class="chart-bars"><div class="chart-bar" v-for="h in [40,55,48,62,78,68,88]" :style="{height:h*1.6+'px'}"></div></div>
          <div class="chart-labels"><span v-for="d in ['06/17','06/18','06/19','06/20','06/21','06/22','06/23']" :key="d">{{d}}</span></div>
        </div>
      </div>
      <div class="chart-card chart-card-narrow">
        <div class="chart-header"><div><div class="chart-title">系统状态</div><div class="chart-sub">服务运行情况</div></div></div>
        <div class="sys-status">
          <div class="sys-item" v-for="s in [{name:'AI 伴游服务',up:'99.9%'},{name:'知识库检索引擎',up:'99.7%'},{name:'天气数据同步',up:'99.5%'},{name:'媒体 CDN 节点',up:'100%'},{name:'数据库集群',up:'99.99%'}]" :key="s.name">
            <div class="sys-dot"></div><span class="sys-name">{{s.name}}</span><span class="sys-up">{{s.up}}</span><span class="sys-ok">正常</span>
          </div>
        </div>
      </div>
    </div>
    <div class="charts-row">
      <div class="chart-card chart-card-wide">
        <div class="chart-header"><div class="chart-title">快捷入口</div></div>
        <div class="quick-links">
          <div class="quick-link" v-for="q in [
            {title:'景点管理',desc:'维护景区信息与上下架',path:'/admin/scenic',bg:'#f0fdf9',icon:'Picture'},
            {title:'路线管理',desc:'管理旅游路线与日程',path:'/admin/routes',bg:'#eff6ff',icon:'Promotion'},
            {title:'知识库管理',desc:'管理知识词条与分类',path:'/admin/knowledge',bg:'#f5f3ff',icon:'Reading'},
            {title:'行程管理',desc:'查看用户行程数据',path:'/admin/trips',bg:'#fef3c7',icon:'List'}
          ]" :key="q.title" @click="$router.push(q.path)">
            <div class="quick-link-icon" :style="{background:q.bg}"><el-icon><component :is="q.icon"/></el-icon></div>
            <div class="quick-link-text"><div class="quick-link-title">{{q.title}}</div><div class="quick-link-desc">{{q.desc}}</div></div>
          </div>
        </div>
      </div>
      <div class="chart-card chart-card-narrow">
        <div class="chart-header"><div class="chart-title">欢迎</div></div>
        <div class="welcome-card">
          <div class="welcome-avatar">{{(adminAuthState.user?.displayName||'管')[0]}}</div>
          <div class="welcome-name">{{adminAuthState.user?.displayName||'管理员'}}</div>
          <div class="welcome-text">欢迎使用黔行智导后台管理系统</div>
          <div class="welcome-stat">
            <div class="welcome-stat-num">8,472</div>
            <div class="welcome-stat-label">今日 AI 对话量</div>
            <div class="welcome-stat-sub">较昨日 +18.3%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard{display:flex;flex-direction:column;gap:20px}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.stat-card{background:#fff;border-radius:12px;padding:20px;border:1px solid #f1f5f9;box-shadow:0 1px 2px rgba(0,0,0,0.04);display:flex;justify-content:space-between}
.stat-label{font-size:13px;color:#64748b;margin-bottom:6px}
.stat-value{font-size:24px;font-weight:700;color:#0f172a}
.stat-sub{font-size:12px;color:#059669;margin-top:6px;font-weight:500}
.stat-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.charts-row{display:grid;grid-template-columns:3fr 2fr;gap:16px}
.chart-card{background:#fff;border-radius:12px;border:1px solid #f1f5f9;box-shadow:0 1px 2px rgba(0,0,0,0.04);padding:20px}
.chart-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
.chart-title{font-size:14px;font-weight:600;color:#0f172a}
.chart-sub{font-size:12px;color:#94a3b8;margin-top:2px}
.chart-chip{font-size:12px;background:#f0fdf9;color:#0d9488;padding:4px 10px;border-radius:999px;font-weight:500;border:1px solid #ccfbf1}
.chart-placeholder{padding:10px 0}
.chart-bars{display:flex;align-items:flex-end;gap:12px;height:140px;padding:0 4px}
.chart-bar{flex:1;background:linear-gradient(to top,#0d9488,#14b8a6);border-radius:4px 4px 0 0;opacity:0.85;min-width:20px}
.chart-labels{display:flex;gap:12px;margin-top:8px;padding:0 4px}
.chart-labels span{flex:1;font-size:10px;color:#94a3b8;text-align:center}
.sys-status{display:flex;flex-direction:column;gap:14px}
.sys-item{display:flex;align-items:center;gap:8px}
.sys-dot{width:6px;height:6px;background:#34d399;border-radius:50%;flex-shrink:0}
.sys-name{font-size:13px;color:#475569;flex:1}
.sys-up{font-size:12px;color:#94a3b8}
.sys-ok{font-size:12px;color:#059669;font-weight:500}
.quick-links{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.quick-link{display:flex;align-items:center;gap:12px;padding:14px;border-radius:10px;border:1px solid #f1f5f9;cursor:pointer;transition:all 0.15s}
.quick-link:hover{background:#f8fafc;border-color:#e2e8f0}
.quick-link-icon{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.quick-link-title{font-size:13px;font-weight:600;color:#0f172a}
.quick-link-desc{font-size:11px;color:#94a3b8;margin-top:1px}
.welcome-card{display:flex;flex-direction:column;align-items:center;text-align:center}
.welcome-avatar{width:56px;height:56px;background:#ccfbf1;color:#0f766e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;margin-bottom:8px}
.welcome-name{font-size:16px;font-weight:600;color:#0f172a}
.welcome-text{font-size:13px;color:#64748b;margin-top:16px}
.welcome-stat{background:linear-gradient(135deg,#f0fdf9,#ccfbf1);border-radius:12px;padding:16px;margin-top:16px;width:100%;border:1px solid #99f6e4}
.welcome-stat-num{font-size:24px;font-weight:700;color:#0f766e}
.welcome-stat-label{font-size:12px;font-weight:600;color:#0d9488;margin-top:2px}
.welcome-stat-sub{font-size:12px;color:#0d9488;margin-top:2px}
</style>
