// 贵州景点 Mock 数据（与 Web 端共享数据保持同步）
const attractions = [
  { id: 'huangguoshu', name: '黄果树瀑布', city: '安顺市', category: '自然风光', tags: ['自然风光','摄影打卡','户外探险'], rating: 4.9, price: 160, duration: '1天', description: '亚洲第一大瀑布，高77.8米、宽101米，水势浩大、气势磅礴。景区包含陡坡塘、天星桥等核心区域。', highlights: ['亚洲最大瀑布群','水帘洞穿行体验','天星桥水上石林'], tips: '建议携带雨衣，瀑布水雾较大；夏季水量充沛观感最佳。', icon: '💧', imageGradient: 'linear-gradient(135deg, #1a8a5c, #2ecc71, #a8e6cf)', imageUrl: '/assets/images/scenic/scenic-huangguoshu.jpg' },
  { id: 'xiaoxikong', name: '荔波小七孔', city: '黔南州荔波县', category: '自然风光', tags: ['自然风光','摄影打卡','避暑康养'], rating: 4.8, price: 130, duration: '1天', description: '世界自然遗产地，以碧绿水域、古桥瀑布和原始森林著称，被誉为"地球腰带上的绿宝石"。', highlights: ['小七孔古桥','68级跌水瀑布','水上森林栈道'], tips: '景区较大建议乘观光车游览；春秋季节水量适中景色最佳。', icon: '🌿', imageGradient: 'linear-gradient(135deg, #0d7a4d, #27ae60, #7dcea0)', imageUrl: '/assets/images/scenic/scenic-xiaoqikong.jpg' },
  { id: 'xijiang', name: '西江千户苗寨', city: '黔东南州雷山县', category: '民族文化', tags: ['民族文化','摄影打卡','美食特产'], rating: 4.7, price: 100, duration: '1-2天', description: '中国最大的苗族聚居村寨，依山而建的吊脚楼群蔚为壮观。苗族银饰、刺绣、芦笙舞等非遗完整保留。', highlights: ['千户吊脚楼全景','苗族歌舞表演','长桌宴美食体验'], tips: '观景台可拍摄苗寨全景；节假日游客较多建议错峰出行。', icon: '🏘️', imageGradient: 'linear-gradient(135deg, #c0392b, #e67e22, #f39c12)', imageUrl: '/assets/images/scenic/scenic-xijiang-miao.jpg' },
  { id: 'fanjingshan', name: '梵净山', city: '铜仁市', category: '自然风光', tags: ['自然风光','户外探险','避暑康养'], rating: 4.8, price: 120, duration: '1-2天', description: '世界自然遗产、国家5A级景区，海拔2572米。红云金顶、蘑菇石等奇特地貌令人称奇。', highlights: ['红云金顶攀登','蘑菇石奇观','高山杜鹃花海'], tips: '登山需较好体力，建议乘坐索道；山顶温差大注意添衣。', icon: '⛰️', imageGradient: 'linear-gradient(135deg, #5d6d7e, #85929e, #d5dbdb)', imageUrl: '/assets/images/scenic/scenic-fanjingshan.jpg' },
  { id: 'qingyan', name: '青岩古镇', city: '贵阳市花溪区', category: '古镇历史', tags: ['古镇历史','美食特产','民族文化'], rating: 4.5, price: 10, duration: '半天-1天', description: '始建于明洪武年间，贵州四大古镇之一。青岩卤猪脚、糕粑稀饭等地方美食闻名遐迩。', highlights: ['明清古建筑群','青岩卤猪脚','古城墙登高望远'], tips: '可从贵阳市区乘坐公交直达；建议品尝当地特色小吃。', icon: '🏛️', imageGradient: 'linear-gradient(135deg, #8b7355, #a0522d, #deb887)', imageUrl: '/assets/images/scenic/scenic-qingyan.jpg' },
  { id: 'zhenyuan', name: '镇远古镇', city: '黔东南州镇远县', category: '古镇历史', tags: ['古镇历史','自然风光','摄影打卡'], rating: 4.6, price: 0, duration: '1-2天', description: '千年古城，舞阳河呈"S"形穿城而过。青龙洞古建筑群依崖而建，集儒释道三教于一体。', highlights: ['舞阳河夜景','青龙洞古建筑群','古城巷弄漫步'], tips: '免费入城，部分景点单独收费；夜景灯光秀不容错过。', icon: '🏯', imageGradient: 'linear-gradient(135deg, #2c3e50, #34495e, #7f8c8d)', imageUrl: '/assets/images/scenic/scenic-zhenyuan.jpg' },
  { id: 'zhaoxing', name: '肇兴侗寨', city: '黔东南州黎平县', category: '民族文化', tags: ['民族文化','古镇历史','美食特产'], rating: 4.6, price: 80, duration: '1-2天', description: '全国最大的侗族村寨之一，以五座鼓楼闻名。侗族大歌被列入世界非物质文化遗产。', highlights: ['侗族大歌表演','五座鼓楼群','堂安梯田徒步'], tips: '建议住一晚体验侗寨夜景；可顺道游览堂安侗寨梯田。', icon: '🎵', imageGradient: 'linear-gradient(135deg, #6c3483, #8e44ad, #d2b4de)', imageUrl: '/assets/images/scenic/scenic-zhaoxing.jpg' },
  { id: 'wanfenglin', name: '万峰林', city: '黔西南州兴义市', category: '自然风光', tags: ['自然风光','摄影打卡','户外探险'], rating: 4.7, price: 80, duration: '半天-1天', description: '中国最美五大峰林之一，数万座锥形山峰延绵数百里。徐霞客曾赞叹"天下山峰何其多，惟有此处峰成林"。', highlights: ['万峰林观景台','纳灰布依村寨','八卦田油菜花海'], tips: '清晨或黄昏光线最佳适合摄影；可租电动车穿行峰林田园。', icon: '🏔️', imageGradient: 'linear-gradient(135deg, #1e8449, #229954, #82e0aa)', imageUrl: '/assets/images/scenic/scenic-wanfenglin.jpg' },
  { id: 'zhijindong', name: '织金洞', city: '毕节市织金县', category: '户外探险', tags: ['户外探险','自然风光','摄影打卡'], rating: 4.7, price: 140, duration: '半天', description: '"黄山归来不看岳，织金洞外无洞天"。洞内遍布石笋、石柱、石幔等喀斯特沉积形态，是中国最美旅游洞穴。', highlights: ['银雨树石笋','霸王盔石柱','地下宫殿大厅'], tips: '洞内恒温14°C左右，建议携带薄外套；游览需步行约3公里。', icon: '🕳️', imageGradient: 'linear-gradient(135deg, #1b2631, #2c3e50, #5d6d7e)', imageUrl: '/assets/images/scenic/scenic-zhijindong.jpg' },
  { id: 'chishui', name: '赤水丹霞', city: '遵义市赤水市', category: '自然风光', tags: ['自然风光','户外探险','避暑康养'], rating: 4.6, price: 90, duration: '1-2天', description: '世界自然遗产"中国丹霞"重要组成部分，赤水大瀑布高76米，被誉为"神州又一瀑布奇观"。', highlights: ['赤水大瀑布','佛光岩丹霞绝壁','桫椤自然保护区'], tips: '景区面积较大建议安排2天游览；夏季竹海漂流体验独特。', icon: '🏜️', imageGradient: 'linear-gradient(135deg, #922b21, #c0392b, #e6b0aa)', imageUrl: '/assets/images/scenic/scenic-chishui-danxia.jpg' }
]

const interestTags = [
  { id: 'nature', name: '自然风光', icon: '🏔️', category: '风景' },
  { id: 'culture', name: '民族文化', icon: '🎭', category: '文化' },
  { id: 'history', name: '古镇历史', icon: '🏛️', category: '文化' },
  { id: 'adventure', name: '户外探险', icon: '🧗', category: '运动' },
  { id: 'food', name: '美食特产', icon: '🍜', category: '生活' },
  { id: 'wellness', name: '避暑康养', icon: '🌿', category: '生活' },
  { id: 'photo', name: '摄影打卡', icon: '📷', category: '兴趣' },
  { id: 'family', name: '亲子研学', icon: '👨‍👩‍👧', category: '人群' }
]

const routes = [
  { id: 'route-1', name: '黔中精华·黄荔西三日游', days: 3, attractionIds: ['huangguoshu','xiaoxikong','xijiang'], suitableFor: ['情侣/朋友','独自出行','亲子家庭'], physicalLevel: '适中', budgetRange: '舒适型', tags: ['自然风光','民族文化','摄影打卡'], description: '三天畅游贵州顶级自然与人文景观，从亚洲第一瀑到地球绿宝石再到千户苗寨。', dailyPlan: [
    { day:1, title:'黄果树瀑布', attractionIds:['huangguoshu'], description:'上午游览陡坡塘瀑布，下午观赏黄果树大瀑布，穿水帘洞体验', meals:'早:自理 午:景区餐厅 晚:安顺特色酸汤鱼', accommodation:'安顺市区四星级酒店' },
    { day:2, title:'荔波小七孔', attractionIds:['xiaoxikong'], description:'全天游览小七孔景区，漫步水上森林，欣赏68级跌水瀑布', meals:'早:酒店 午:景区简餐 晚:荔波牛肉粉', accommodation:'荔波县城精品客栈' },
    { day:3, title:'西江千户苗寨', attractionIds:['xijiang'], description:'上午参观苗寨吊脚楼群，下午体验苗族歌舞和长桌宴', meals:'早:客栈 午:苗家长桌宴 晚:自理', accommodation:'返程' }
  ]},
  { id: 'route-2', name: '黔东秘境·梵净山深度二日', days: 2, attractionIds: ['fanjingshan','zhenyuan'], suitableFor: ['独自出行','情侣/朋友'], physicalLevel: '挑战', budgetRange: '舒适型', tags: ['自然风光','户外探险','古镇历史'], description: '登临武陵之巅梵净山，夜宿镇远古城，感受天地灵气与千年历史交融。', dailyPlan: [
    { day:1, title:'梵净山登顶', attractionIds:['fanjingshan'], description:'清晨乘索道上山，登红云金顶、观蘑菇石，下午下山', meals:'早:自理 午:山顶简餐 晚:铜仁特色菜', accommodation:'镇远古城临河客栈' },
    { day:2, title:'镇远古镇', attractionIds:['zhenyuan'], description:'上午游览青龙洞古建筑群，下午漫步古城巷弄', meals:'早:客栈 午:镇远豆花烤鱼 晚:自理', accommodation:'返程' }
  ]},
  { id: 'route-3', name: '黔南风情·侗苗文化三日', days: 3, attractionIds: ['zhaoxing','xijiang','xiaoxikong'], suitableFor: ['亲子家庭','研学团队','情侣/朋友'], physicalLevel: '轻松', budgetRange: '经济型', tags: ['民族文化','美食特产','自然风光'], description: '深入黔东南苗侗文化腹地，聆听侗族大歌，感受苗族千年传承。', dailyPlan: [
    { day:1, title:'肇兴侗寨', attractionIds:['zhaoxing'], description:'上午抵达侗寨，下午观赏侗族大歌表演，傍晚徒步堂安梯田', meals:'早:自理 午:侗家油茶 晚:侗寨长桌宴', accommodation:'肇兴侗寨精品民宿' },
    { day:2, title:'西江千户苗寨', attractionIds:['xijiang'], description:'上午乘车前往西江，下午游览苗寨全景', meals:'早:民宿 午:苗家酸汤鱼 晚:苗寨小吃', accommodation:'西江苗寨观景客栈' },
    { day:3, title:'荔波小七孔', attractionIds:['xiaoxikong'], description:'全天游览小七孔景区，感受碧水青山', meals:'早:客栈 午:景区简餐 晚:自理', accommodation:'返程' }
  ]},
  { id: 'route-4', name: '黔西胜境·赤水丹霞二日', days: 2, attractionIds: ['chishui','zhijindong'], suitableFor: ['独自出行','情侣/朋友'], physicalLevel: '适中', budgetRange: '舒适型', tags: ['自然风光','户外探险','摄影打卡'], description: '探秘赤水丹霞绝壁和织金洞地下宫殿，感受贵州喀斯特奇观。', dailyPlan: [
    { day:1, title:'赤水丹霞', attractionIds:['chishui'], description:'上午游览赤水大瀑布，下午参观佛光岩丹霞绝壁', meals:'早:自理 午:景区餐厅 晚:赤水竹笋宴', accommodation:'赤水市区酒店' },
    { day:2, title:'织金洞', attractionIds:['zhijindong'], description:'上午游览织金洞地下宫殿，观赏银雨树等奇观', meals:'早:酒店 午:织金竹荪宴 晚:自理', accommodation:'返程' }
  ]},
  { id: 'route-5', name: '黔中人文·古镇美食二日', days: 2, attractionIds: ['qingyan','wanfenglin'], suitableFor: ['银发康养','亲子家庭','情侣/朋友'], physicalLevel: '轻松', budgetRange: '经济型', tags: ['古镇历史','美食特产','自然风光'], description: '漫步青岩古镇品尝地道美食，徜徉万峰林感受田园诗意。', dailyPlan: [
    { day:1, title:'青岩古镇', attractionIds:['qingyan'], description:'全天游览青岩古镇，品尝卤猪脚、糕粑稀饭等美食', meals:'早:自理 午:青岩卤猪脚 晚:花溪牛肉粉', accommodation:'贵阳市区酒店' },
    { day:2, title:'万峰林', attractionIds:['wanfenglin'], description:'上午观景台赏万峰林全景，下午骑行纳灰村寨', meals:'早:酒店 午:布依族八大碗 晚:自理', accommodation:'返程' }
  ]}
]

const knowledgeBase = [
  { id:'k1', question:'黄果树瀑布最佳游览季节是什么时候？', answer:'黄果树瀑布最佳游览季节是6月至10月。此时正值贵州雨季，瀑布水量充沛、气势磅礴。其中7-8月水量最大，但游客也最多；6月和9-10月水量适中、游客较少，是摄影和深度体验的理想时段。冬季水量减少但瀑布依然壮观，且门票有优惠。', category:'旅行贴士', relatedAttractionIds:['huangguoshu'] },
  { id:'k2', question:'贵州有哪些必吃的特色美食？', answer:'贵州美食以酸辣为特色。推荐：酸汤鱼（凯里苗家名菜）、肠旺面（贵阳早餐标配）、花溪牛肉粉、青岩卤猪脚、遵义羊肉粉、丝娃娃、豆腐圆子、洋芋粑、糯米饭、雷家豆腐圆子。各地还有独特的少数民族美食如苗家酸汤鱼、侗家腌鱼、布依族五色饭等。', category:'美食推荐', relatedAttractionIds:[] },
  { id:'k3', question:'贵州景点之间交通方便吗？', answer:'贵州已实现"县县通高速"，省内交通较为便利。贵阳为交通枢纽，高铁可达凯里（40分钟）、安顺（30分钟）、遵义（50分钟）、铜仁（1.5小时）。景区之间一般有大巴或旅游专线，部分偏远景区建议包车或参加一日游。贵阳龙洞堡机场有往返全国主要城市的航班。', category:'交通出行', relatedAttractionIds:[] },
  { id:'k4', question:'西江千户苗寨有哪些独特的民族文化体验？', answer:'西江千户苗寨拥有丰富的民族文化体验：苗族盛装迎宾仪式（拦门酒）、原生态苗族歌舞表演、苗族长桌宴（高山流水敬酒礼仪）、苗族银饰锻造技艺展示、苗族刺绣体验、夜晚观景台赏万家灯火（苗寨夜景被誉为"天上人间"），还可参观苗族博物馆了解迁徙历史。', category:'民族文化', relatedAttractionIds:['xijiang'] },
  { id:'k5', question:'贵州旅游需要几天比较合适？', answer:'贵州精华游建议5-7天。经典环线：贵阳入→安顺（黄果树1天）→荔波（小七孔1天）→西江苗寨（1天）→镇远古镇（1天）→梵净山（1-2天）→贵阳返。如果时间有限，3天可玩黄果树+荔波+西江的"黄金三角"路线。贵州景点分散建议按区域规划避免往返奔波。', category:'旅行贴士', relatedAttractionIds:[] },
  { id:'k6', question:'梵净山登山需要注意什么？', answer:'梵净山登山注意事项：建议乘坐索道上山节省体力（索道至山顶还需步行约1小时）；山顶海拔2500米左右温差大，需带外套；红云金顶段较陡峭需手脚并用，老人和儿童慎重；旺季（7-8月、国庆）需提前预约门票；山上餐饮有限建议自带干粮和水；雨天山路湿滑注意安全。', category:'旅行贴士', relatedAttractionIds:['fanjingshan'] },
  { id:'k7', question:'织金洞内可以拍照吗？', answer:'织金洞内允许拍照但禁止使用闪光灯和三脚架（部分区域限制使用）。洞内灯光精心设计以呈现钟乳石的最佳观赏效果。全程约3公里，游览时间约1.5-2小时。洞内恒温14°C左右，冬暖夏凉。地面可能湿滑，建议穿着防滑鞋。', category:'旅行贴士', relatedAttractionIds:['zhijindong'] }
]

function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

module.exports = {
  attractions,
  interestTags,
  routes,
  knowledgeBase,
  delay,

  async getAttractions() { await delay(200); return [...attractions] },
  async getAttractionById(id) { await delay(200); return attractions.find(a => a.id === id) || null },
  async getRoutes() { await delay(200); return [...routes] },
  async getRouteById(id) { await delay(200); return routes.find(r => r.id === id) || null },
  async getInterestTags() { await delay(200); return [...interestTags] },
  async getKnowledgeBase() { await delay(200); return [...knowledgeBase] },
  async searchKnowledge(query) { await delay(200); const q = query.toLowerCase(); return knowledgeBase.filter(k => k.question.includes(q) || k.answer.includes(q)) },
  async getAttractionsByIds(ids) { await delay(200); return ids.map(id => attractions.find(a => a.id === id)).filter(Boolean) },

  async generateProfile(selection) {
    await delay(400)
    const tags = interestTags.filter(t => selection.selectedTagIds.includes(t.id))
    const dominant = tags.slice(0, 2)
    const secondary = tags.slice(2)
    const styleMap = { '轻松':'休闲漫游型','适中':'探索发现型','挑战':'深度挑战型' }
    const profileName = dominant.map(t => t.name).join('') + styleMap[selection.physicalLevel]
    return {
      profileName,
      dominantInterests: dominant.map(t => ({ tagId: t.id, score: 85 + Math.floor(Math.random()*15), reason: `您对${t.name}有浓厚兴趣` })),
      secondaryInterests: secondary.map(t => ({ tagId: t.id, score: 40 + Math.floor(Math.random()*40), reason: `补充偏好` })),
      matchSummary: `基于您在${dominant.map(t=>t.name).join('、')}方面的兴趣偏好，结合${selection.days}天行程和${selection.physicalLevel}体力需求，AI生成本画像。`,
      routeStyle: styleMap[selection.physicalLevel] || '探索发现型',
      routeStyleDesc: `行程安排将优先匹配${dominant[0]?.name || '自然风光'}类景点，兼顾${secondary[0]?.name || '文化体验'}类目的地。`
    }
  }
}
