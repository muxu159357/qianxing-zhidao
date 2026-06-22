var api = require('../../utils/api')
Page({
  data: { draft:null, draftId:'', loading:true, errorMsg:'' },
  onLoad(opts){
    var did = opts.draftId
    if(!did){ this.setData({loading:false,errorMsg:'草稿信息不完整'}); return }
    this.setData({draftId:did})
    var self = this
    api.getAiPlanDraft(did).then(function(d){ self.setData({draft:d,loading:false}) }).catch(function(){ self.setData({loading:false,errorMsg:'草稿已失效，请重新生成'}) })
  },
  onConfirmSave(){
    var self = this; self.setData({loading:true})
    api.confirmAiPlanDraft(this.data.draftId).then(function(r){
      self.setData({loading:false}); wx.showToast({title:'已保存到我的行程',icon:'success'})
      setTimeout(function(){ wx.navigateTo({url:'/pages/trip-detail/trip-detail?id='+r.tripId+'&source=remote'}) },1000)
    }).catch(function(){ self.setData({loading:false}); wx.showToast({title:'保存失败，请稍后再试',icon:'none'}) })
  },
  onRegenerate(){ wx.navigateBack() },
  onBack(){ wx.navigateBack() }
})
