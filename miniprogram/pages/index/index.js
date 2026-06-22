var mock = require('../../utils/mock')
var assetResolver = require('../../utils/asset-resolver')
var api = require('../../utils/api')
var adapters = require('../../utils/adapters')
var auth = require('../../utils/auth')

Page({
  data: {
    quickEntries: [
      { key:'guide',icon:'/assets/images/icons/icon-guide.png',title:'AI助手',sub:'景区智能导览问答' },
      { key:'route',icon:'/assets/images/icons/icon-route.png',title:'推荐路线',sub:'精选贵州山地路线' },
      { key:'knowledge',icon:'/assets/images/icons/icon-profile.png',title:'景点知识',sub:'了解贵州景区文化' },
      { key:'trips',icon:'/assets/images/icons/icon-safety.png',title:'我的行程',sub:'管理已保存的行程' }
    ],
    categories:[
      { key:'all',label:'全部' },{ key:'自然风光',label:'山水风光' },
      { key:'民族文化',label:'民族文化' },{ key:'古镇历史',label:'古镇村寨' },
      { key:'户外探险',label:'户外探索' }
    ],
    activeCategory:'all', scenicSpots:[], filteredSpots:[], topRoutes:[]
  },

  onShow(){ auth.requireLoginRedirect() },

  onLoad(){
    var that=this
    api.getScenicSpots({ page:1, size:20 }).then(function(d){
      var spots=adapters.scenicSpotsToAttractions(d.records||[])
      if(spots.length>0){ that.setData({scenicSpots:spots,filteredSpots:spots}) } else { that._loadMockSpots() }
    }).catch(function(){ that._loadMockSpots() })
    api.getRoutes({ page:1, size:3 }).then(function(d){
      var routes=adapters.apiRoutesToRoutes(d.records||[])
      if(routes.length>0){ that.setData({topRoutes:routes.slice(0,3).map(function(r){return{route:r,coverImage:assetResolver.resolveRouteCover(r)}})}) }
      else{ throw new Error('empty') }
    }).catch(function(){ mock.getRoutes().then(function(rs){ that.setData({topRoutes:rs.slice(0,3).map(function(r){return{route:r,coverImage:assetResolver.resolveRouteCover(r)}})}) }) })
  },

  _loadMockSpots(){ var s=this; mock.getAttractions().then(function(spots){ s.setData({scenicSpots:spots.slice(0,8),filteredSpots:spots.slice(0,8)}) }) },

  onCategoryTap(e){ var k=e.currentTarget.dataset.key; this.setData({activeCategory:k}); if(k==='all'){ this.setData({filteredSpots:this.data.scenicSpots}) } else { this.setData({filteredSpots:this.data.scenicSpots.filter(function(s){return s.category===k})}) } },

  goPlanner(){ wx.navigateTo({url:'/pages/planner/planner'}) },
  goKnowledge(){ wx.navigateTo({url:'/pages/knowledge/knowledge'}) },
  goGuide(){ wx.switchTab({url:'/pages/guide/guide'}) },
  goTrips(){ wx.switchTab({url:'/pages/my-trips/my-trips'}) },
  goScenicDetail(e){ var id=e.currentTarget.dataset.id; if(id){ wx.navigateTo({url:'/pages/scenic-detail/scenic-detail?id='+id}) } },
  goRouteDetail(e){ var id=e.currentTarget.dataset.id; if(id){ wx.navigateTo({url:'/pages/route-detail/route-detail?id='+id}) }else{wx.showToast({title:'路线信息加载中',icon:'none'})} },

  onQuickTap(e){
    var k=e.currentTarget.dataset.key
    if(k==='guide'){ wx.switchTab({url:'/pages/guide/guide'}) }
    else if(k==='route'){ var p=wx.getStorageSync('qianxing_profile'); if(p){ wx.navigateTo({url:'/pages/recommend/recommend'}) } else { wx.showToast({title:'请先选择偏好',icon:'none',duration:1500}); setTimeout(function(){wx.navigateTo({url:'/pages/planner/planner'})},1500) } }
    else if(k==='knowledge'){ wx.navigateTo({url:'/pages/knowledge/knowledge'}) }
    else if(k==='trips'){ wx.switchTab({url:'/pages/my-trips/my-trips'}) }
  }
})
