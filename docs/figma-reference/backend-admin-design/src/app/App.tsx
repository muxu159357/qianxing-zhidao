import { useState, ReactNode } from "react"
import {
  LayoutDashboard, MapPin, Navigation, CalendarDays, BookOpen,
  Image as LucideImage, CloudSun, ClipboardList, Bell, Search,
  Plus, Edit2, Eye, Trash2, Upload, RefreshCw, Users, Star,
  ChevronDown, ChevronUp, Grid, List, Wind, Droplets,
  AlertTriangle, Clock, FileText, X, Check, Download,
  ChevronLeft, ChevronRight, Settings, Camera, Video, Map,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

// ─── Types ───────────────────────────────────────────────────
type PageId =
  | "dashboard" | "attractions" | "routes" | "schedule"
  | "knowledge" | "media" | "weather" | "itinerary"

// ─── Reusable UI ─────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active:    "bg-emerald-50 text-emerald-700 border-emerald-200",
    inactive:  "bg-slate-100 text-slate-500 border-slate-200",
    draft:     "bg-amber-50 text-amber-700 border-amber-200",
    published: "bg-teal-50 text-teal-700 border-teal-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    ongoing:   "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending:   "bg-amber-50 text-amber-700 border-amber-200",
    completed: "bg-slate-100 text-slate-500 border-slate-200",
    paid:      "bg-emerald-50 text-emerald-700 border-emerald-200",
    partial:   "bg-orange-50 text-orange-700 border-orange-200",
    unpaid:    "bg-red-50 text-red-600 border-red-200",
  }
  const labels: Record<string, string> = {
    active: "已上架", inactive: "已下架", draft: "草稿", published: "已发布",
    confirmed: "已确认", ongoing: "进行中", pending: "待确认", completed: "已完成",
    paid: "已付款", partial: "部分付款", unpaid: "未付款",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {labels[status] ?? status}
    </span>
  )
}

function DifficultyBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    "容易": "bg-green-50 text-green-700 border-green-200",
    "中等": "bg-yellow-50 text-yellow-700 border-yellow-200",
    "较难": "bg-orange-50 text-orange-700 border-orange-200",
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles[level] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
      {level}
    </span>
  )
}

function WeatherBadge({ condition }: { condition: string }) {
  if (condition.includes("晴")) return <span className="text-amber-500 font-medium text-sm">{condition}</span>
  if (condition.includes("雨")) return <span className="text-blue-500 font-medium text-sm">{condition}</span>
  return <span className="text-slate-600 font-medium text-sm">{condition}</span>
}

function Modal({ open, onClose, title, children, width = "max-w-lg" }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-xl shadow-2xl w-full ${width} mx-4 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inp = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white text-slate-800 placeholder-slate-400 transition-all"
const sel = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white text-slate-700 transition-all"

function Pager({ total, page, perPage, onPage }: { total: number; page: number; perPage: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / perPage))
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">共 <span className="font-medium text-slate-600">{total}</span> 条，第 {page}/{pages} 页</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(Math.max(1, page - 1))} disabled={page === 1}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: Math.min(5, pages) }, (_, i) => i + 1).map((p) => (
          <button key={p} onClick={() => onPage(p)}
            className={`w-8 h-8 text-sm rounded-lg transition-colors ${p === page ? "bg-teal-600 text-white font-semibold" : "text-slate-600 hover:bg-slate-100"}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPage(Math.min(pages, page + 1))} disabled={page === pages}
          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  )
}

// ─── Mock Data ────────────────────────────────────────────────

const visitData = [
  { day: "06/17", visitors: 1240 }, { day: "06/18", visitors: 1580 },
  { day: "06/19", visitors: 1390 }, { day: "06/20", visitors: 1720 },
  { day: "06/21", visitors: 2100 }, { day: "06/22", visitors: 1890 },
  { day: "06/23", visitors: 2340 },
]

const routePopData = [
  { name: "亲子2日", bookings: 512 }, { name: "安顺2日", bookings: 465 },
  { name: "黔南5日", bookings: 342 }, { name: "梵净山3日", bookings: 276 },
  { name: "山地环线", bookings: 218 }, { name: "苗族5日", bookings: 189 },
]

const attractionsData = [
  { id: "A001", name: "黄果树瀑布", region: "安顺市", category: "自然风光", rating: 4.9, visits: 128500, status: "active", date: "2024-01-15" },
  { id: "A002", name: "西江千户苗寨", region: "黔东南州", category: "民俗文化", rating: 4.8, visits: 98600, status: "active", date: "2024-01-18" },
  { id: "A003", name: "梵净山", region: "铜仁市", category: "自然风光", rating: 4.7, visits: 76300, status: "active", date: "2024-02-05" },
  { id: "A004", name: "荔波小七孔", region: "黔南州", category: "自然风光", rating: 4.8, visits: 92400, status: "active", date: "2024-02-12" },
  { id: "A005", name: "青岩古镇", region: "贵阳市", category: "历史古迹", rating: 4.6, visits: 65200, status: "active", date: "2024-03-01" },
  { id: "A006", name: "天星桥景区", region: "安顺市", category: "自然风光", rating: 4.5, visits: 54800, status: "active", date: "2024-03-15" },
  { id: "A007", name: "镇远古镇", region: "黔东南州", category: "历史古迹", rating: 4.7, visits: 43200, status: "inactive", date: "2024-04-02" },
  { id: "A008", name: "织金洞", region: "毕节市", category: "地质奇观", rating: 4.8, visits: 38700, status: "active", date: "2024-04-10" },
]

const routesData = [
  { id: "R001", name: "黔南精华5日游", days: 5, difficulty: "中等", spots: 8, price: 2800, bookings: 342, status: "active", date: "2024-02-01" },
  { id: "R002", name: "贵州山地环线8日", days: 8, difficulty: "较难", spots: 12, price: 4500, bookings: 218, status: "active", date: "2024-02-15" },
  { id: "R003", name: "安顺瀑布2日游", days: 2, difficulty: "容易", spots: 4, price: 1200, bookings: 465, status: "active", date: "2024-03-01" },
  { id: "R004", name: "苗族文化深度5日游", days: 5, difficulty: "中等", spots: 7, price: 3200, bookings: 189, status: "draft", date: "2024-03-20" },
  { id: "R005", name: "梵净山登山专线3日", days: 3, difficulty: "较难", spots: 5, price: 2000, bookings: 276, status: "active", date: "2024-04-05" },
  { id: "R006", name: "贵阳周边亲子2日", days: 2, difficulty: "容易", spots: 6, price: 980, bookings: 512, status: "active", date: "2024-04-18" },
]

const scheduleData = {
  days: [
    {
      day: 1, theme: "出发·贵阳游",
      spots: [
        { id: "s1", time: "09:00", attraction: "青岩古镇", duration: "3小时", type: "参观", note: "含专业导览讲解" },
        { id: "s2", time: "14:00", attraction: "花溪湿地公园", duration: "2小时", type: "休闲", note: "自由活动，可骑行" },
        { id: "s3", time: "19:00", attraction: "南明河夜游", duration: "1.5小时", type: "夜游", note: "含游船票" },
      ],
    },
    {
      day: 2, theme: "黄果树·天星桥",
      spots: [
        { id: "s4", time: "07:30", attraction: "黄果树瀑布", duration: "4小时", type: "参观", note: "核心景点，建议早到避开人流" },
        { id: "s5", time: "14:30", attraction: "天星桥景区", duration: "3小时", type: "参观", note: "步行游览，请备防滑鞋" },
      ],
    },
    {
      day: 3, theme: "荔波·小七孔",
      spots: [
        { id: "s6", time: "08:00", attraction: "小七孔景区", duration: "5小时", type: "参观", note: "含景区电瓶车票" },
        { id: "s7", time: "15:30", attraction: "荔波古镇", duration: "2小时", type: "休闲", note: "自由购物，尝当地特产" },
      ],
    },
    {
      day: 4, theme: "西江千户苗寨",
      spots: [
        { id: "s8", time: "09:00", attraction: "西江千户苗寨", duration: "6小时", type: "民俗体验", note: "含苗族歌舞表演、盛装体验" },
        { id: "s9", time: "18:00", attraction: "苗寨观景台", duration: "1小时", type: "观景", note: "日落最佳观赏点" },
      ],
    },
    {
      day: 5, theme: "返程·自由活动",
      spots: [
        { id: "s10", time: "10:00", attraction: "黔东南博物馆", duration: "2小时", type: "参观", note: "深度了解苗侗民族文化" },
        { id: "s11", time: "14:00", attraction: "凯里南站", duration: "—", type: "交通", note: "G8203次高铁返贵阳" },
      ],
    },
  ],
}

const knowledgeData = [
  { id: "K001", title: "贵州山地气候特征与旅行注意事项", category: "旅行须知", author: "张明华", tags: ["气候", "安全", "装备"], status: "published", date: "2024-05-10" },
  { id: "K002", title: "黄果树瀑布最佳游览季节指南", category: "景点攻略", author: "李文静", tags: ["黄果树", "季节", "攻略"], status: "published", date: "2024-05-15" },
  { id: "K003", title: "苗族非物质文化遗产百科全书", category: "民族文化", author: "王建国", tags: ["苗族", "非遗", "文化"], status: "published", date: "2024-05-20" },
  { id: "K004", title: "贵州特色美食全攻略（含秘方）", category: "美食指南", author: "陈小燕", tags: ["美食", "酸汤鱼", "辣子鸡"], status: "draft", date: "2024-06-01" },
  { id: "K005", title: "梵净山登山安全手册 2024版", category: "安全须知", author: "刘强", tags: ["梵净山", "登山", "安全"], status: "published", date: "2024-06-05" },
  { id: "K006", title: "贵州各地区交通出行详解", category: "交通信息", author: "赵丽", tags: ["交通", "高铁", "大巴"], status: "published", date: "2024-06-10" },
]

const mediaData = [
  { id: "M001", name: "黄果树瀑布全景.jpg", type: "image", size: "4.2 MB", res: "3840×2160", tags: ["黄果树"], status: "active", date: "2024-05-01", pid: "1506905925346-21bda4d32df4" },
  { id: "M002", name: "西江苗寨航拍.mp4", type: "video", size: "256 MB", res: "4K 2:34", tags: ["西江"], status: "active", date: "2024-05-05", pid: "" },
  { id: "M003", name: "梵净山云海晨光.jpg", type: "image", size: "3.8 MB", res: "3840×2160", tags: ["梵净山"], status: "active", date: "2024-05-10", pid: "1552733413-28e25e4c9eb1" },
  { id: "M004", name: "小七孔翠绿水系.jpg", type: "image", size: "2.9 MB", res: "2560×1440", tags: ["小七孔"], status: "active", date: "2024-05-15", pid: "1441974231531-c6227db76b6e" },
  { id: "M005", name: "苗族盛装表演.jpg", type: "image", size: "3.1 MB", res: "2560×1440", tags: ["苗族"], status: "active", date: "2024-05-20", pid: "1518709268805-4e9042af9f23" },
  { id: "M006", name: "贵州美食合集.mp4", type: "video", size: "128 MB", res: "1080p 4:12", tags: ["美食"], status: "active", date: "2024-05-25", pid: "" },
  { id: "M007", name: "织金洞钟乳石群.jpg", type: "image", size: "5.3 MB", res: "4096×2160", tags: ["织金洞"], status: "active", date: "2024-06-01", pid: "1557804506-ef7b63adae6e" },
  { id: "M008", name: "镇远古镇夜景.jpg", type: "image", size: "4.8 MB", res: "3840×2160", tags: ["镇远"], status: "inactive", date: "2024-06-05", pid: "1493976040374-85c8e12f0c0e" },
  { id: "M009", name: "贵州旅游宣传片.mp4", type: "video", size: "512 MB", res: "4K 8:45", tags: ["宣传"], status: "active", date: "2024-06-10", pid: "" },
]

const weatherData = [
  { id: "W001", region: "黄果树景区", date: "2024-06-23", condition: "晴", tempMin: 22, tempMax: 31, humidity: 65, wind: "东南风3级", uv: 8, alert: null },
  { id: "W002", region: "梵净山景区", date: "2024-06-23", condition: "多云转阵雨", tempMin: 18, tempMax: 25, humidity: 82, wind: "北风2级", uv: 3, alert: "雷阵雨预警" },
  { id: "W003", region: "西江苗寨", date: "2024-06-23", condition: "多云", tempMin: 21, tempMax: 29, humidity: 71, wind: "东风2级", uv: 5, alert: null },
  { id: "W004", region: "小七孔景区", date: "2024-06-23", condition: "阵雨", tempMin: 20, tempMax: 26, humidity: 88, wind: "南风3级", uv: 2, alert: "大雨预警" },
  { id: "W005", region: "贵阳市区", date: "2024-06-23", condition: "晴转多云", tempMin: 23, tempMax: 30, humidity: 68, wind: "东北风2级", uv: 6, alert: null },
  { id: "W006", region: "织金洞景区", date: "2024-06-23", condition: "晴", tempMin: 19, tempMax: 27, humidity: 60, wind: "西风1级", uv: 7, alert: null },
]

const itineraryData = [
  { id: "T001", user: "张伟", phone: "**34", route: "黔南精华5日游", pax: 2, start: "2024-06-25", end: "2024-06-29", cost: 5600, guide: "李导", status: "confirmed", pay: "paid" },
  { id: "T002", user: "刘芳", phone: "**67", route: "安顺瀑布2日游", pax: 4, start: "2024-06-24", end: "2024-06-25", cost: 4800, guide: "王导", status: "ongoing", pay: "paid" },
  { id: "T003", user: "陈建国", phone: "**21", route: "梵净山登山专线3日", pax: 3, start: "2024-06-28", end: "2024-06-30", cost: 6000, guide: "赵导", status: "pending", pay: "partial" },
  { id: "T004", user: "赵敏", phone: "**89", route: "苗族文化深度5日游", pax: 6, start: "2024-07-01", end: "2024-07-05", cost: 19200, guide: "张导", status: "confirmed", pay: "paid" },
  { id: "T005", user: "孙强", phone: "**45", route: "贵阳周边亲子2日", pax: 5, start: "2024-06-23", end: "2024-06-24", cost: 4900, guide: "刘导", status: "ongoing", pay: "paid" },
  { id: "T006", user: "周华", phone: "**78", route: "贵州山地环线8日", pax: 2, start: "2024-07-10", end: "2024-07-17", cost: 9000, guide: "陈导", status: "pending", pay: "unpaid" },
  { id: "T007", user: "吴玲", phone: "**56", route: "安顺瀑布2日游", pax: 3, start: "2024-06-20", end: "2024-06-21", cost: 3600, guide: "李导", status: "completed", pay: "paid" },
]

// ─── Sidebar ──────────────────────────────────────────────────

const navItems = [
  { id: "dashboard",  label: "工作台",         icon: LayoutDashboard },
  { id: "attractions",label: "景点管理",        icon: MapPin },
  { id: "routes",     label: "路线管理",        icon: Navigation },
  { id: "schedule",   label: "路线日程管理",    icon: CalendarDays },
  { id: "knowledge",  label: "知识库管理",      icon: BookOpen },
  { id: "media",      label: "媒体管理",        icon: LucideImage },
  { id: "weather",    label: "天气管理",        icon: CloudSun },
  { id: "itinerary",  label: "行程管理",        icon: ClipboardList },
]

function Sidebar({ active, setActive }: { active: PageId; setActive: (p: PageId) => void }) {
  return (
    <aside className="w-[220px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-slate-100 shrink-0">
        <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center shrink-0">
          <Map size={14} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-800 leading-tight">黔行智导</div>
          <div className="text-[10px] text-slate-400 leading-tight tracking-wide">管理后台 v2.4</div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActive(id as PageId)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active === id
                ? "bg-teal-600 text-white font-medium shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            }`}>景点管理<Icon size={15} className={active === id ? "text-white" : "text-slate-400"} />{label}</button>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3 shrink-0">
        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
          <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
            <span className="text-teal-700 text-xs font-bold">管</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-700 truncate">超级管理员</div>
            <div className="text-[11px] text-slate-400 truncate">admin@qxzd.com</div>
          </div>
          <Settings size={13} className="text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  )
}

// ─── TopBar ───────────────────────────────────────────────────

const pageTitles: Record<PageId, string> = {
  dashboard:   "工作台",
  attractions: "景点管理",
  routes:      "路线管理",
  schedule:    "路线日程与景点关联管理",
  knowledge:   "知识库管理",
  media:       "媒体管理",
  weather:     "天气管理",
  itinerary:   "行程管理",
}

function TopBar({ active }: { active: PageId }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400">控制台</span>
        <span className="text-slate-200">/</span>
        <span className="text-slate-700 font-medium">{pageTitles[active]}</span>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <RefreshCw size={15} />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 ml-1">
          <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center">
            <span className="text-teal-700 text-xs font-bold">管</span>
          </div>
          <span className="text-sm text-slate-700 font-medium">超级管理员</span>
          <ChevronDown size={13} className="text-slate-400" />
        </div>
      </div>
    </header>
  )
}

// ─── Shared table header ──────────────────────────────────────
function TH({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th className={`${right ? "text-right" : "text-left"} px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50`}>
      {children}
    </th>
  )
}

// ─── Page: Dashboard ─────────────────────────────────────────

function DashboardPage() {
  const stats = [
    { label: "景点总数", value: "156", sub: "较上月 +8", icon: MapPin, bg: "bg-teal-50", fg: "text-teal-600" },
    { label: "路线总数", value: "48", sub: "较上月 +3", icon: Navigation, bg: "bg-blue-50", fg: "text-blue-600" },
    { label: "本月行程数", value: "1,234", sub: "较上月 +12.4%", icon: ClipboardList, bg: "bg-emerald-50", fg: "text-emerald-600" },
    { label: "知识库词条", value: "892", sub: "较上月 +45", icon: BookOpen, bg: "bg-violet-50", fg: "text-violet-600" },
  ]

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-500 mb-1.5">{s.label}</div>
                <div className="text-2xl font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-emerald-600 mt-1.5 font-medium">{s.sub}</div>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                <s.icon size={19} className={s.fg} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">访问量趋势</h3>
              <p className="text-xs text-slate-400 mt-0.5">近7天用户访问数据</p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-600 px-2.5 py-1 rounded-full font-medium border border-teal-100">日访问</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={visitData}>
              <defs>
                <linearGradient id="visitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="visitors" stroke="#0d9488" strokeWidth={2} fill="url(#visitAreaGrad)" name="访客数" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="col-span-2 bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-800">路线预订排行</h3>
            <p className="text-xs text-slate-400 mt-0.5">本月各线路预订量</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={routePopData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} width={52} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="bookings" fill="#0d9488" radius={[0, 4, 4, 0]} name="预订量" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="text-sm font-semibold text-slate-800">最新景点</h3>
            <button className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors">查看全部</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50">
                <TH>景点名称</TH>
                <TH>地区</TH>
                <TH>评分</TH>
                <TH right>状态</TH>
              </tr>
            </thead>
            <tbody>
              {attractionsData.slice(0, 5).map((a) => (
                <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-teal-50 rounded-md flex items-center justify-center shrink-0">
                        <MapPin size={11} className="text-teal-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{a.region}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-slate-700">{a.rating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-slate-50 shrink-0">
            <h3 className="text-sm font-semibold text-slate-800">系统状态</h3>
          </div>
          <div className="flex-1 p-5 space-y-3.5">
            {[
              { label: "AI 导览服务", uptime: "99.9%" },
              { label: "知识库检索引擎", uptime: "99.7%" },
              { label: "天气数据同步", uptime: "99.5%" },
              { label: "媒体 CDN 节点", uptime: "100%" },
              { label: "数据库集群", uptime: "99.99%" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-sm text-slate-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{s.uptime}</span>
                  <span className="text-xs text-emerald-600 font-medium">正常</span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5 shrink-0">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 border border-teal-100">
              <div className="text-xs font-semibold text-teal-600 mb-1">今日 AI 对话量</div>
              <div className="text-2xl font-bold text-teal-800">8,472</div>
              <div className="text-xs text-teal-500 mt-0.5">较昨日 +18.3%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Page: Attractions ────────────────────────────────────────

function AttractionsPage() {
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; data: typeof attractionsData[0] | null }>
    ({ open: false, mode: "add", data: null })

  const rows = attractionsData.filter((a) =>
    (!search || a.name.includes(search) || a.region.includes(search)) &&
    (!cat || a.category === cat) &&
    (!status || a.status === status)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">景点管理</h2>
        <button onClick={() => setModal({ open: true, mode: "add", data: null })}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
          <Plus size={15} /> 新增景点
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索景点名称或地区…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部类型</option>
            <option value="自然风光">自然风光</option>
            <option value="民俗文化">民俗文化</option>
            <option value="历史古迹">历史古迹</option>
            <option value="地质奇观">地质奇观</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部状态</option>
            <option value="active">已上架</option>
            <option value="inactive">已下架</option>
          </select>
          <button onClick={() => { setSearch(""); setCat(""); setStatus("") }}
            className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">重置</button>
          <button className="ml-auto flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={14} /> 导出
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr>
            <TH>ID</TH><TH>景点名称</TH><TH>地区</TH><TH>分类</TH>
            <TH>评分</TH><TH right>累计访客</TH><TH>录入日期</TH><TH>状态</TH><TH>操作</TH>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-slate-400">{a.id}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={12} className="text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">{a.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{a.region}</td>
                <td className="px-4 py-3.5">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{a.category}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{a.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right text-sm font-medium text-slate-700">{a.visits.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{a.date}</td>
                <td className="px-4 py-3.5"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-0.5">
                    <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Eye size={14} /></button>
                    <button onClick={() => setModal({ open: true, mode: "edit", data: a })}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button className="px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      {a.status === "active" ? "下架" : "上架"}
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-slate-50">
          <Pager total={rows.length} page={page} perPage={10} onPage={setPage} />
        </div>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ ...modal, open: false })}
        title={modal.mode === "add" ? "新增景点" : "编辑景点"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="景点名称" required>
              <input defaultValue={modal.data?.name} className={inp} placeholder="请输入景点名称" />
            </FormField>
            <FormField label="所在地区" required>
              <select defaultValue={modal.data?.region} className={sel}>
                <option value="">请选择</option>
                {["贵阳市","安顺市","黔东南州","黔南州","铜仁市","毕节市","遵义市","六盘水市"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="景点分类" required>
              <select defaultValue={modal.data?.category} className={sel}>
                <option value="">请选择</option>
                {["自然风光","民俗文化","历史古迹","地质奇观","休闲娱乐"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FormField>
            <FormField label="初始评分">
              <input type="number" min={1} max={5} step={0.1} defaultValue={modal.data?.rating} className={inp} placeholder="1.0 – 5.0" />
            </FormField>
          </div>
          <FormField label="景点简介">
            <textarea className={inp + " resize-none h-20"} placeholder="请输入景点特色描述…" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="门票价格 (元)">
              <input type="number" className={inp} placeholder="0 表示免费" />
            </FormField>
            <FormField label="状态">
              <select defaultValue={modal.data?.status} className={sel}>
                <option value="active">上架</option>
                <option value="inactive">下架</option>
                <option value="draft">草稿</option>
              </select>
            </FormField>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={() => setModal({ ...modal, open: false })}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
            <button className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium">
              {modal.mode === "add" ? "确认新增" : "保存修改"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Page: Routes ─────────────────────────────────────────────

function RoutesPage() {
  const [search, setSearch] = useState("")
  const [diff, setDiff] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; data: typeof routesData[0] | null }>
    ({ open: false, mode: "add", data: null })

  const rows = routesData.filter((r) =>
    (!search || r.name.includes(search)) &&
    (!diff || r.difficulty === diff) &&
    (!status || r.status === status)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">路线管理</h2>
        <button onClick={() => setModal({ open: true, mode: "add", data: null })}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
          <Plus size={15} /> 新增路线
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索路线名称…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400" />
          </div>
          <select value={diff} onChange={(e) => setDiff(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部难度</option>
            <option value="容易">容易</option>
            <option value="中等">中等</option>
            <option value="较难">较难</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部状态</option>
            <option value="active">已上架</option>
            <option value="draft">草稿</option>
          </select>
          <button onClick={() => { setSearch(""); setDiff(""); setStatus("") }}
            className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">重置</button>
          <button className="ml-auto flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download size={14} /> 导出
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr>
            <TH>ID</TH><TH>路线名称</TH><TH>天数</TH><TH>难度</TH>
            <TH>景点数</TH><TH right>参考价</TH><TH right>本月预订</TH><TH>状态</TH><TH>操作</TH>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-slate-400">{r.id}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                      <Navigation size={12} className="text-blue-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-800">{r.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-700">
                  <span className="font-semibold">{r.days}</span><span className="text-slate-400 ml-0.5 text-xs">天</span>
                </td>
                <td className="px-4 py-3.5"><DifficultyBadge level={r.difficulty} /></td>
                <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{r.spots}</td>
                <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-800">¥{r.price.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-right text-sm text-slate-600">{r.bookings}</td>
                <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-0.5">
                    <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Eye size={14} /></button>
                    <button onClick={() => setModal({ open: true, mode: "edit", data: r })}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button className="px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      {r.status === "active" ? "下架" : "上架"}
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-slate-50">
          <Pager total={rows.length} page={page} perPage={10} onPage={setPage} />
        </div>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ ...modal, open: false })}
        title={modal.mode === "add" ? "新增路线" : "编辑路线"}>
        <div className="space-y-4">
          <FormField label="路线名称" required>
            <input defaultValue={modal.data?.name} className={inp} placeholder="请输入路线名称" />
          </FormField>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="行程天数" required>
              <input type="number" defaultValue={modal.data?.days} className={inp} />
            </FormField>
            <FormField label="难度等级">
              <select defaultValue={modal.data?.difficulty} className={sel}>
                <option>容易</option><option>中等</option><option>较难</option>
              </select>
            </FormField>
            <FormField label="参考价格 (元)">
              <input type="number" defaultValue={modal.data?.price} className={inp} />
            </FormField>
          </div>
          <FormField label="路线简介">
            <textarea className={inp + " resize-none h-20"} placeholder="路线特色与亮点…" />
          </FormField>
          <FormField label="适合人群">
            <input className={inp} placeholder="如：家庭亲子、摄影爱好者、户外登山…" />
          </FormField>
          <FormField label="状态">
            <select defaultValue={modal.data?.status} className={sel}>
              <option value="active">上架</option>
              <option value="draft">草稿</option>
              <option value="inactive">下架</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={() => setModal({ ...modal, open: false })}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
            <button className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium">
              {modal.mode === "add" ? "确认新增" : "保存修改"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Page: Schedule ────────────────────────────────────────────

const spotTypeStyle: Record<string, string> = {
  "参观":   "bg-teal-50 text-teal-700 border-teal-200",
  "休闲":   "bg-blue-50 text-blue-700 border-blue-200",
  "夜游":   "bg-violet-50 text-violet-700 border-violet-200",
  "民俗体验":"bg-amber-50 text-amber-700 border-amber-200",
  "观景":   "bg-emerald-50 text-emerald-700 border-emerald-200",
  "交通":   "bg-slate-100 text-slate-600 border-slate-200",
}

function SchedulePage() {
  const [route, setRoute] = useState("R001")
  const [expanded, setExpanded] = useState<Set<number>>(new Set([1, 2]))
  const [addModal, setAddModal] = useState<{ open: boolean; day: number }>({ open: false, day: 0 })

  const toggleDay = (d: number) =>
    setExpanded((prev) => { const n = new Set(prev); n.has(d) ? n.delete(d) : n.add(d); return n })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">路线日程与景点关联管理</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Plus size={14} /> 新增天数
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
            <Check size={15} /> 保存日程
          </button>
        </div>
      </div>

      {/* Route selector */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <Navigation size={15} className="text-teal-600" />
            <span className="text-sm font-medium text-slate-700">当前路线：</span>
          </div>
          <select value={route} onChange={(e) => setRoute(e.target.value)} className={sel + " max-w-xs"}>
            {routesData.map((r) => (
              <option key={r.id} value={r.id}>{r.name}（{r.days}天 / {r.spots}景点）</option>
            ))}
          </select>
          <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-slate-100 text-sm text-slate-500">
            共 <span className="font-bold text-teal-600 mx-0.5">5</span> 天
            <span className="mx-2 text-slate-200">|</span>
            <span className="font-bold text-teal-600">11</span> 个景点节点
          </div>
        </div>
      </div>

      {/* Day cards */}
      <div className="space-y-3">
        {scheduleData.days.map((d) => {
          const open = expanded.has(d.day)
          return (
            <div key={d.day} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Day header — div, not button, to allow nested buttons */}
              <div onClick={() => toggleDay(d.day)}
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors select-none">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white text-sm font-bold">{d.day}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">第 {d.day} 天</span>
                      <span className="text-slate-200">·</span>
                      <span className="text-sm text-slate-600">{d.theme}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{d.spots.length} 个景点节点</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={(e) => { e.stopPropagation(); setAddModal({ open: true, day: d.day }) }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors font-medium border border-teal-100">
                    <Plus size={12} /> 添加景点
                  </button>
                  <button onClick={(e) => e.stopPropagation()}
                    className="p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                  {open ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
                </div>
              </div>

              {/* Spots list */}
              {open && (
                <div className="border-t border-slate-50 px-5 py-3 space-y-2">
                  {d.spots.map((s, idx) => (
                    <div key={s.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100/60 border border-slate-100 group transition-colors">
                      {/* Timeline */}
                      <div className="flex flex-col items-center shrink-0 self-stretch justify-start pt-1">
                        <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0" />
                        {idx < d.spots.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1 min-h-[12px]" />}
                      </div>
                      {/* Time */}
                      <span className="text-sm font-mono font-semibold text-slate-700 w-12 shrink-0">{s.time}</span>
                      {/* Icon + name */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                          <MapPin size={12} className="text-teal-600" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-800 truncate">{s.attraction}</div>
                          <div className="text-xs text-slate-400 truncate">{s.note}</div>
                        </div>
                      </div>
                      {/* Meta */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-md border font-medium ${spotTypeStyle[s.type] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                          {s.type}
                        </span>
                        {s.duration !== "—" && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock size={11} /> {s.duration}
                          </div>
                        )}
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={13} /></button>
                        <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Modal open={addModal.open} onClose={() => setAddModal({ ...addModal, open: false })}
        title={`第 ${addModal.day} 天 — 添加景点节点`}>
        <div className="space-y-4">
          <FormField label="选择景点" required>
            <select className={sel}>
              <option value="">请选择景点</option>
              {attractionsData.map((a) => <option key={a.id} value={a.id}>{a.name}（{a.region}）</option>)}
            </select>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="开始时间" required>
              <input type="time" className={inp} defaultValue="09:00" />
            </FormField>
            <FormField label="游览时长">
              <input className={inp} placeholder="如：2.5小时" />
            </FormField>
          </div>
          <FormField label="活动类型">
            <select className={sel}>
              {["参观","休闲","民俗体验","观景","夜游","交通"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="备注说明">
            <input className={inp} placeholder="如：含门票、需提前预约…" />
          </FormField>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={() => setAddModal({ ...addModal, open: false })}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
            <button className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium">确认添加</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Page: Knowledge ──────────────────────────────────────────

function KnowledgePage() {
  const [search, setSearch] = useState("")
  const [cat, setCat] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; data: typeof knowledgeData[0] | null }>
    ({ open: false, mode: "add", data: null })

  const rows = knowledgeData.filter((k) =>
    (!search || k.title.includes(search) || k.author.includes(search)) &&
    (!cat || k.category === cat) &&
    (!status || k.status === status)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">知识库管理</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Upload size={14} /> 批量导入
          </button>
          <button onClick={() => setModal({ open: true, mode: "add", data: null })}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
            <Plus size={15} /> 新增词条
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索标题或作者…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部分类</option>
            {["旅行须知","景点攻略","民族文化","美食指南","安全须知","交通信息"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
          <button onClick={() => { setSearch(""); setCat(""); setStatus("") }}
            className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">重置</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr>
            <TH>ID</TH><TH>标题</TH><TH>分类</TH><TH>作者</TH><TH>标签</TH><TH>更新日期</TH><TH>状态</TH><TH>操作</TH>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((k) => (
              <tr key={k.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5"><span className="text-xs font-mono text-slate-400">{k.id}</span></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText size={13} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-medium text-slate-800 max-w-[220px] truncate">{k.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{k.category}</span></td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{k.author}</td>
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {k.tags.map((t) => (
                      <span key={t} className="text-xs bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-100">{t}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{k.date}</td>
                <td className="px-4 py-3.5"><StatusBadge status={k.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-0.5">
                    <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Eye size={14} /></button>
                    <button onClick={() => setModal({ open: true, mode: "edit", data: k })}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button className="px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                      {k.status === "published" ? "下架" : "发布"}
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-slate-50">
          <Pager total={rows.length} page={page} perPage={10} onPage={setPage} />
        </div>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ ...modal, open: false })}
        title={modal.mode === "add" ? "新增知识词条" : "编辑词条"} width="max-w-xl">
        <div className="space-y-4">
          <FormField label="词条标题" required>
            <input defaultValue={modal.data?.title} className={inp} placeholder="请输入词条标题" />
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="分类" required>
              <select defaultValue={modal.data?.category} className={sel}>
                {["旅行须知","景点攻略","民族文化","美食指南","安全须知","交通信息"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="作者">
              <input defaultValue={modal.data?.author} className={inp} placeholder="作者姓名" />
            </FormField>
          </div>
          <FormField label="正文内容" required>
            <textarea className={inp + " resize-none h-28"} placeholder="请输入知识词条正文内容…" />
          </FormField>
          <FormField label="标签（逗号分隔）">
            <input defaultValue={modal.data?.tags?.join(", ")} className={inp} placeholder="如：气候, 安全, 装备" />
          </FormField>
          <FormField label="状态">
            <select defaultValue={modal.data?.status} className={sel}>
              <option value="published">发布</option>
              <option value="draft">保存草稿</option>
            </select>
          </FormField>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={() => setModal({ ...modal, open: false })}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
            <button className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium">
              {modal.mode === "add" ? "确认发布" : "保存修改"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Page: Media ──────────────────────────────────────────────

function MediaPage() {
  const [search, setSearch] = useState("")
  const [type, setType] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)

  const rows = mediaData.filter((m) =>
    (!search || m.name.includes(search)) && (!type || m.type === type)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">媒体管理</h2>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
          <Upload size={15} /> 上传媒体
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索文件名称…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部类型</option>
            <option value="image">图片</option>
            <option value="video">视频</option>
          </select>
          <button onClick={() => { setSearch(""); setType("") }}
            className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">重置</button>
          <div className="ml-auto flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            {(["grid", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                className={`p-1.5 rounded-md transition-colors ${view === v ? "bg-white shadow-sm text-teal-600" : "text-slate-400 hover:text-slate-600"}`}>
                {v === "grid" ? <Grid size={15} /> : <List size={15} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-4 gap-4">
          {rows.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-36 bg-slate-100">
                {m.type === "image" && m.pid ? (
                  <img src={`https://images.unsplash.com/photo-${m.pid}?w=400&h=200&fit=crop&auto=format`}
                    alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    {m.type === "video"
                      ? <Video size={28} className="text-slate-300" />
                      : <LucideImage size={28} className="text-slate-300" />}
                    <span className="text-xs text-slate-400">{m.res}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button className="p-2 bg-white rounded-lg text-slate-700 hover:text-teal-600 shadow-sm transition-colors"><Eye size={14} /></button>
                  <button className="p-2 bg-white rounded-lg text-slate-700 hover:text-blue-600 shadow-sm transition-colors"><Download size={14} /></button>
                  <button className="p-2 bg-white rounded-lg text-slate-700 hover:text-red-500 shadow-sm transition-colors"><Trash2 size={14} /></button>
                </div>
                <span className={`absolute top-2 left-2 text-xs px-1.5 py-0.5 rounded font-medium text-white ${m.type === "image" ? "bg-teal-600" : "bg-violet-600"}`}>
                  {m.type === "image" ? "图片" : "视频"}
                </span>
              </div>
              <div className="p-3">
                <div className="text-xs font-medium text-slate-700 truncate mb-1.5">{m.name}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{m.size}</span>
                  <StatusBadge status={m.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead><tr>
              <TH>文件名</TH><TH>类型</TH><TH>分辨率/时长</TH><TH right>大小</TH><TH>上传日期</TH><TH>状态</TH><TH>操作</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-50">
              {rows.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.type === "image" ? "bg-teal-50" : "bg-violet-50"}`}>
                        {m.type === "image"
                          ? <Camera size={14} className="text-teal-600" />
                          : <Video size={14} className="text-violet-600" />}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${m.type === "image" ? "bg-teal-50 text-teal-700" : "bg-violet-50 text-violet-700"}`}>
                      {m.type === "image" ? "图片" : "视频"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">{m.res}</td>
                  <td className="px-4 py-3.5 text-right text-sm text-slate-600">{m.size}</td>
                  <td className="px-4 py-3.5 text-sm text-slate-500">{m.date}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-0.5">
                      <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Download size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-4 border-t border-slate-50">
            <Pager total={rows.length} page={page} perPage={10} onPage={setPage} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page: Weather ────────────────────────────────────────────

function WeatherPage() {
  const [region, setRegion] = useState("")
  const [date, setDate] = useState("")
  const [modal, setModal] = useState<{ open: boolean; data: typeof weatherData[0] | null }>({ open: false, data: null })

  const rows = weatherData.filter((w) =>
    (!region || w.region.includes(region)) && (!date || w.date === date)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">天气管理</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <RefreshCw size={14} /> 同步天气数据
          </button>
          <button onClick={() => setModal({ open: true, data: null })}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
            <Plus size={15} /> 新增预报
          </button>
        </div>
      </div>

      {/* Alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <AlertTriangle size={16} className="text-amber-500 shrink-0" />
        <p className="text-sm text-amber-800">
          <span className="font-semibold">气象预警提示：</span>
          梵净山景区（雷阵雨）、小七孔景区（大雨）今日存在气象预警，请及时通知相关行程客户注意安全。
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="搜索景区或地区名称…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400" />
          </div>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white text-slate-700" />
          <button onClick={() => { setRegion(""); setDate("") }}
            className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">重置</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr>
            <TH>景区/地区</TH><TH>日期</TH><TH>天气状况</TH><TH>温度范围</TH>
            <TH>湿度</TH><TH>风力</TH><TH>紫外线</TH><TH>预警</TH><TH>操作</TH>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((w) => (
              <tr key={w.id} className={`hover:bg-slate-50/60 transition-colors ${w.alert ? "bg-amber-50/20" : ""}`}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <CloudSun size={14} className="text-slate-300 shrink-0" />
                    <span className="text-sm font-medium text-slate-800">{w.region}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-500">{w.date}</td>
                <td className="px-4 py-3.5"><WeatherBadge condition={w.condition} /></td>
                <td className="px-4 py-3.5">
                  <span className="text-sm font-medium text-blue-500">{w.tempMin}°</span>
                  <span className="text-slate-300 mx-1 text-xs">~</span>
                  <span className="text-sm font-medium text-red-400">{w.tempMax}°C</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <Droplets size={12} className="text-blue-400" />
                    <span className="text-sm text-slate-600">{w.humidity}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <Wind size={12} className="text-slate-400" />
                    <span className="text-sm text-slate-600">{w.wind}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-sm font-bold ${w.uv >= 7 ? "text-red-500" : w.uv >= 4 ? "text-amber-500" : "text-emerald-600"}`}>
                    {w.uv}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  {w.alert ? (
                    <span className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-medium w-fit">
                      <AlertTriangle size={10} /> {w.alert}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">无</span>
                  )}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => setModal({ open: true, data: w })}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={14} /></button>
                    <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-slate-50">
          <Pager total={rows.length} page={1} perPage={10} onPage={() => {}} />
        </div>
      </div>

      <Modal open={modal.open} onClose={() => setModal({ ...modal, open: false })}
        title={modal.data ? "编辑天气预报" : "新增天气预报"}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="景区/地区" required>
              <select className={sel}>
                <option value="">请选择</option>
                {weatherData.map((w) => <option key={w.id}>{w.region}</option>)}
              </select>
            </FormField>
            <FormField label="日期" required>
              <input type="date" defaultValue={modal.data?.date} className={inp} />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="天气状况">
              <select className={sel}>
                {["晴","多云","阴","小雨","中雨","大雨","阵雨","多云转阵雨","晴转多云"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
            <FormField label="风力风向">
              <input defaultValue={modal.data?.wind} className={inp} placeholder="如：东南风3级" />
            </FormField>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FormField label="最低温 (°C)">
              <input type="number" defaultValue={modal.data?.tempMin} className={inp} />
            </FormField>
            <FormField label="最高温 (°C)">
              <input type="number" defaultValue={modal.data?.tempMax} className={inp} />
            </FormField>
            <FormField label="湿度 (%)">
              <input type="number" defaultValue={modal.data?.humidity} min={0} max={100} className={inp} />
            </FormField>
          </div>
          <FormField label="气象预警（留空表示无）">
            <input defaultValue={modal.data?.alert ?? ""} className={inp} placeholder="如：雷阵雨预警" />
          </FormField>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button onClick={() => setModal({ ...modal, open: false })}
              className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">取消</button>
            <button className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors font-medium">保存</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// ─── Page: Itinerary (read-only) ──────────────────────────────

function ItineraryPage() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [pay, setPay] = useState("")
  const [page, setPage] = useState(1)

  const rows = itineraryData.filter((t) =>
    (!search || t.user.includes(search) || t.route.includes(search) || t.id.includes(search)) &&
    (!status || t.status === status) &&
    (!pay || t.pay === pay)
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-800">行程管理</h2>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full border border-slate-200">
            <Eye size={11} /> 只读模式
          </span>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Download size={14} /> 导出报表
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="搜索用户、路线或行程号…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white placeholder-slate-400" />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部行程状态</option>
            <option value="pending">待确认</option>
            <option value="confirmed">已确认</option>
            <option value="ongoing">进行中</option>
            <option value="completed">已完成</option>
          </select>
          <select value={pay} onChange={(e) => setPay(e.target.value)} className={sel + " w-auto"}>
            <option value="">全部支付状态</option>
            <option value="paid">已付款</option>
            <option value="partial">部分付款</option>
            <option value="unpaid">未付款</option>
          </select>
          <button onClick={() => { setSearch(""); setStatus(""); setPay("") }}
            className="px-3 py-2 text-sm text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">重置</button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead><tr>
            <TH>行程号</TH><TH>用户</TH><TH>路线</TH><TH>人数</TH>
            <TH>出发日期</TH><TH>结束日期</TH><TH right>总费用</TH>
            <TH>负责导游</TH><TH>行程状态</TH><TH>支付状态</TH><TH>操作</TH>
          </tr></thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="text-xs font-mono font-semibold text-teal-600">{t.id}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xs text-slate-600 font-semibold">{t.user[0]}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-700">{t.user}</div>
                      <div className="text-xs text-slate-400">尾号{t.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600 max-w-[130px] truncate">{t.route}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <Users size={12} className="text-slate-400" />
                    <span className="text-sm text-slate-700 font-medium">{t.pax}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{t.start}</td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{t.end}</td>
                <td className="px-4 py-3.5 text-right text-sm font-semibold text-slate-800">¥{t.cost.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{t.guide}</td>
                <td className="px-4 py-3.5"><StatusBadge status={t.status} /></td>
                <td className="px-4 py-3.5"><StatusBadge status={t.pay} /></td>
                <td className="px-4 py-3.5">
                  <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-teal-600 bg-teal-50 border border-teal-100 rounded-lg hover:bg-teal-100 transition-colors font-medium">
                    <Eye size={12} /> 查看
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-4 border-t border-slate-50">
          <Pager total={rows.length} page={page} perPage={10} onPage={setPage} />
        </div>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState<PageId>("dashboard")

  const pages: Record<PageId, JSX.Element> = {
    dashboard:   <DashboardPage />,
    attractions: <AttractionsPage />,
    routes:      <RoutesPage />,
    schedule:    <SchedulePage />,
    knowledge:   <KnowledgePage />,
    media:       <MediaPage />,
    weather:     <WeatherPage />,
    itinerary:   <ItineraryPage />,
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar active={active} />
        <main className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin", scrollbarColor: "transparent transparent" }}
          onMouseEnter={(e) => { (e.currentTarget.style as any).scrollbarColor = "rgba(148,163,184,0.4) transparent" }}
          onMouseLeave={(e) => { (e.currentTarget.style as any).scrollbarColor = "transparent transparent" }}>
          {pages[active]}
        </main>
      </div>
    </div>
  )
}
