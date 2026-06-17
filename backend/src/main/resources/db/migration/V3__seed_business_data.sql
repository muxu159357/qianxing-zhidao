-- ============================================================
-- V3: Seed Business Data
-- 黔行智导 · 基础业务数据初始化
-- 使用 INSERT IGNORE + UNIQUE code 防重复
-- ============================================================

-- 1. 景点 (10)
INSERT IGNORE INTO qx_scenic_spot (spot_code, name, city, category, rating, ticket_price, visit_duration, best_season, description, highlights, tips, tags, sort_order, status) VALUES
('huangguoshu', '黄果树瀑布', '安顺市', '自然风光', 4.9, 16000, '1天', '6-10月', '亚洲第一大瀑布，高77.8米、宽101米，水势浩大、气势磅礴。', '["亚洲最大瀑布群","水帘洞穿行体验","天星桥水上石林"]', '["建议携带雨衣，瀑布水雾较大","夏季水量充沛观感最佳"]', '["自然风光","摄影打卡","户外探险"]', 1, 1),
('xiaoxikong', '荔波小七孔', '黔南州荔波县', '自然风光', 4.8, 13000, '1天', '4-10月', '世界自然遗产地，以碧绿水域、古桥瀑布和原始森林著称。', '["小七孔古桥","68级跌水瀑布","水上森林栈道"]', '["景区较大建议乘观光车游览","春秋季节水量适中景色最佳"]', '["自然风光","摄影打卡","避暑康养"]', 2, 1),
('xijiang', '西江千户苗寨', '黔东南州雷山县', '民族文化', 4.7, 10000, '1-2天', '全年', '中国最大的苗族聚居村寨，依山而建的吊脚楼群蔚为壮观。', '["千户吊脚楼全景","苗族歌舞表演","长桌宴美食体验"]', '["观景台可拍摄苗寨全景","节假日游客较多建议错峰出行"]', '["民族文化","摄影打卡","美食特产"]', 3, 1),
('fanjingshan', '梵净山', '铜仁市', '自然风光', 4.8, 12000, '1-2天', '4-10月', '世界自然遗产、国家5A级景区，海拔2572米。', '["红云金顶攀登","蘑菇石奇观","高山杜鹃花海"]', '["登山需较好体力，建议乘坐索道","山顶温差大注意添衣"]', '["自然风光","户外探险","避暑康养"]', 4, 1),
('qingyan', '青岩古镇', '贵阳市花溪区', '古镇历史', 4.5, 1000, '半天-1天', '全年', '始建于明洪武年间，贵州四大古镇之一。', '["明清古建筑群","青岩卤猪脚","古城墙登高望远"]', '["可从贵阳市区乘坐公交直达","建议品尝当地特色小吃"]', '["古镇历史","美食特产","民族文化"]', 5, 1),
('zhenyuan', '镇远古镇', '黔东南州镇远县', '古镇历史', 4.6, 0, '1-2天', '全年', '千年古城，舞阳河呈S形穿城而过。', '["舞阳河夜景","青龙洞古建筑群","古城巷弄漫步"]', '["免费入城，部分景点单独收费","夜景灯光秀不容错过"]', '["古镇历史","自然风光","摄影打卡"]', 6, 1),
('zhaoxing', '肇兴侗寨', '黔东南州黎平县', '民族文化', 4.6, 8000, '1-2天', '全年', '全国最大的侗族村寨之一，以五座鼓楼闻名。', '["侗族大歌表演","五座鼓楼群","堂安梯田徒步"]', '["建议住一晚体验侗寨夜景","可顺道游览堂安侗寨梯田"]', '["民族文化","古镇历史","美食特产"]', 7, 1),
('wanfenglin', '万峰林', '黔西南州兴义市', '自然风光', 4.7, 8000, '半天-1天', '2-4月', '中国最美五大峰林之一，数万座锥形山峰延绵数百里。', '["万峰林观景台","纳灰布依村寨","八卦田油菜花海"]', '["清晨或黄昏光线最佳适合摄影","可租电动车穿行峰林田园"]', '["自然风光","摄影打卡","户外探险"]', 8, 1),
('zhijindong', '织金洞', '毕节市织金县', '户外探险', 4.7, 14000, '半天', '全年', '黄山归来不看岳，织金洞外无洞天。中国最美旅游洞穴。', '["银雨树石笋","霸王盔石柱","地下宫殿大厅"]', '["洞内恒温14°C左右，建议携带薄外套","游览需步行约3公里"]', '["户外探险","自然风光","摄影打卡"]', 9, 1),
('chishui', '赤水丹霞', '遵义市赤水市', '自然风光', 4.6, 9000, '1-2天', '4-10月', '世界自然遗产中国丹霞重要组成部分，赤水大瀑布高76米。', '["赤水大瀑布","佛光岩丹霞绝壁","桫椤自然保护区"]', '["景区面积较大建议安排2天游览","夏季竹海漂流体验独特"]', '["自然风光","户外探险","避暑康养"]', 10, 1);

-- 2. 路线 (5)
INSERT IGNORE INTO qx_route (route_code, name, description, day_count, energy_level, budget_range, suitable_crowd, tags, theme, sort_order, status) VALUES
('route-1', '黔中精华·黄荔西三日游', '三天畅游贵州顶级自然与人文景观。', 3, '适中', '舒适型', '["情侣/朋友","独自出行","亲子家庭"]', '["自然风光","民族文化","摄影打卡"]', 'waterfall', 1, 1),
('route-2', '黔东秘境·梵净山深度二日', '登临武陵之巅梵净山，夜宿镇远古城。', 2, '挑战', '舒适型', '["独自出行","情侣/朋友"]', '["自然风光","户外探险","古镇历史"]', 'mountain', 2, 1),
('route-3', '黔南风情·侗苗文化三日', '深入黔东南苗侗文化腹地。', 3, '轻松', '经济型', '["亲子家庭","研学团队","情侣/朋友"]', '["民族文化","美食特产","自然风光"]', 'village', 3, 1),
('route-4', '黔西胜境·赤水丹霞二日', '探秘赤水丹霞绝壁和织金洞地下宫殿。', 2, '适中', '舒适型', '["独自出行","情侣/朋友"]', '["自然风光","户外探险","摄影打卡"]', 'cave', 4, 1),
('route-5', '黔中人文·古镇美食二日', '漫步青岩古镇品尝地道美食。', 2, '轻松', '经济型', '["银发康养","亲子家庭","情侣/朋友"]', '["古镇历史","美食特产","自然风光"]', 'ancient-town', 5, 1);

-- 3. 路线每日安排 (use sub-select to get route id)
-- Route 1
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 1, '黄果树瀑布', '上午游览陡坡塘瀑布，下午观赏黄果树大瀑布', '早:自理 午:景区餐厅 晚:安顺酸汤鱼', '安顺市区四星级酒店', 1 FROM qx_route WHERE route_code = 'route-1';
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 2, '荔波小七孔', '全天游览小七孔景区，漫步水上森林', '早:酒店 午:景区简餐 晚:荔波牛肉粉', '荔波县城精品客栈', 2 FROM qx_route WHERE route_code = 'route-1';
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 3, '西江千户苗寨', '上午参观苗寨吊脚楼群，下午体验苗族歌舞', '早:客栈 午:苗家长桌宴 晚:自理', '返程', 3 FROM qx_route WHERE route_code = 'route-1';

-- Route 2
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 1, '梵净山登顶', '清晨乘索道上山，登红云金顶、观蘑菇石', '早:自理 午:山顶简餐 晚:铜仁特色菜', '镇远古城临河客栈', 1 FROM qx_route WHERE route_code = 'route-2';
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 2, '镇远古镇', '上午游览青龙洞古建筑群，下午漫步古城巷弄', '早:客栈 午:镇远豆花烤鱼 晚:自理', '返程', 2 FROM qx_route WHERE route_code = 'route-2';

-- Route 3
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 1, '肇兴侗寨', '上午抵达侗寨，下午观赏侗族大歌表演', '早:自理 午:侗家油茶 晚:侗寨长桌宴', '肇兴侗寨精品民宿', 1 FROM qx_route WHERE route_code = 'route-3';
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 2, '西江千户苗寨', '上午乘车前往西江，下午游览苗寨全景', '早:民宿 午:苗家酸汤鱼 晚:苗寨小吃', '西江苗寨观景客栈', 2 FROM qx_route WHERE route_code = 'route-3';
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 3, '荔波小七孔', '全天游览小七孔景区，感受碧水青山', '早:客栈 午:景区简餐 晚:自理', '返程', 3 FROM qx_route WHERE route_code = 'route-3';

-- Route 4
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 1, '赤水丹霞', '上午游览赤水大瀑布，下午参观佛光岩丹霞绝壁', '早:自理 午:景区餐厅 晚:赤水竹笋宴', '赤水市区酒店', 1 FROM qx_route WHERE route_code = 'route-4';
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 2, '织金洞', '上午游览织金洞地下宫殿，观赏银雨树等奇观', '早:酒店 午:织金竹荪宴 晚:自理', '返程', 2 FROM qx_route WHERE route_code = 'route-4';

-- Route 5
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 1, '青岩古镇', '全天游览青岩古镇，品尝卤猪脚等美食', '早:自理 午:青岩卤猪脚 晚:花溪牛肉粉', '贵阳市区酒店', 1 FROM qx_route WHERE route_code = 'route-5';
INSERT IGNORE INTO qx_route_day (route_id, day_number, title, description, meals, accommodation, sort_order)
SELECT id, 2, '万峰林', '上午观景台赏万峰林全景，下午骑行纳灰村寨', '早:酒店 午:布依族八大碗 晚:自理', '返程', 2 FROM qx_route WHERE route_code = 'route-5';

-- 4. 路线景点关联
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '建议穿水帘洞体验' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='huangguoshu' WHERE r.route_code='route-1' AND d.day_number=1;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '乘观光车游览' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='xiaoxikong' WHERE r.route_code='route-1' AND d.day_number=2;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '观景台拍夜景' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='xijiang' WHERE r.route_code='route-1' AND d.day_number=3;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '建议乘索道上山' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='fanjingshan' WHERE r.route_code='route-2' AND d.day_number=1;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '夜游舞阳河' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='zhenyuan' WHERE r.route_code='route-2' AND d.day_number=2;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '听侗族大歌' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='zhaoxing' WHERE r.route_code='route-3' AND d.day_number=1;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '穿苗族服饰拍照' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='xijiang' WHERE r.route_code='route-3' AND d.day_number=2;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '漫步水上森林' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='xiaoxikong' WHERE r.route_code='route-3' AND d.day_number=3;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '看丹霞绝壁' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='chishui' WHERE r.route_code='route-4' AND d.day_number=1;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '带薄外套' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='zhijindong' WHERE r.route_code='route-4' AND d.day_number=2;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '尝卤猪脚' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='qingyan' WHERE r.route_code='route-5' AND d.day_number=1;
INSERT IGNORE INTO qx_route_spot (route_day_id, route_id, scenic_spot_id, spot_order, visit_tip)
SELECT d.id, r.id, s.id, 1, '租电动车游览' FROM qx_route_day d JOIN qx_route r ON d.route_id=r.id JOIN qx_scenic_spot s ON s.spot_code='wanfenglin' WHERE r.route_code='route-5' AND d.day_number=2;

-- 5. 知识库 (7)
INSERT IGNORE INTO qx_knowledge_article (article_code, question, answer, category, sort_order, status) VALUES
('k1', '黄果树瀑布最佳游览季节是什么时候？', '黄果树瀑布最佳游览季节是6月至10月。此时正值贵州雨季，瀑布水量充沛、气势磅礴。其中7-8月水量最大，但游客也最多；6月和9-10月水量适中、游客较少，是摄影和深度体验的理想时段。', '旅行贴士', 1, 1),
('k2', '贵州有哪些必吃的特色美食？', '贵州美食以酸辣为特色。推荐：酸汤鱼（凯里苗家名菜）、肠旺面（贵阳早餐标配）、花溪牛肉粉、青岩卤猪脚、遵义羊肉粉、丝娃娃等。各地还有独特的少数民族美食如苗家酸汤鱼、侗家腌鱼、布依族五色饭等。', '美食推荐', 2, 1),
('k3', '贵州景点之间交通方便吗？', '贵州已实现县县通高速，省内交通较为便利。贵阳为交通枢纽，高铁可达凯里（40分钟）、安顺（30分钟）、遵义（50分钟）。景区之间有大巴或旅游专线，部分偏远景区建议包车。', '交通出行', 3, 1),
('k4', '西江千户苗寨有哪些独特的民族文化体验？', '西江千户苗寨拥有丰富的民族文化体验：苗族盛装迎宾仪式（拦门酒）、原生态苗族歌舞表演、苗族长桌宴（高山流水敬酒礼仪）、苗族银饰锻造技艺展示、苗族刺绣体验、夜晚观景台赏万家灯火。', '民族文化', 4, 1),
('k5', '贵州旅游需要几天比较合适？', '贵州精华游建议5-7天。经典环线：贵阳入→安顺（黄果树1天）→荔波（小七孔1天）→西江苗寨（1天）→镇远古镇（1天）→梵净山（1-2天）→贵阳返。3天可玩黄果树+荔波+西江。', '旅行贴士', 5, 1),
('k6', '梵净山登山需要注意什么？', '梵净山登山注意事项：建议乘坐索道上山节省体力；山顶海拔2500米左右温差大，需带外套；红云金顶段较陡峭需手脚并用；旺季（7-8月、国庆）需提前预约门票；山上餐饮有限建议自带干粮和水。', '旅行贴士', 6, 1),
('k7', '织金洞内可以拍照吗？', '织金洞内允许拍照但禁止使用闪光灯和三脚架。洞内灯光精心设计以呈现钟乳石的最佳观赏效果。全程约3公里，游览时间约1.5-2小时。洞内恒温14°C左右。地面可能湿滑，建议穿着防滑鞋。', '旅行贴士', 7, 1);

-- 6. 知识库关联
INSERT IGNORE INTO qx_knowledge_relation (article_id, rel_type, rel_id)
SELECT a.id, 'scenic_spot', s.id FROM qx_knowledge_article a JOIN qx_scenic_spot s ON s.spot_code='huangguoshu' WHERE a.article_code='k1';
INSERT IGNORE INTO qx_knowledge_relation (article_id, rel_type, rel_id)
SELECT a.id, 'scenic_spot', s.id FROM qx_knowledge_article a JOIN qx_scenic_spot s ON s.spot_code='xijiang' WHERE a.article_code='k4';
INSERT IGNORE INTO qx_knowledge_relation (article_id, rel_type, rel_id)
SELECT a.id, 'scenic_spot', s.id FROM qx_knowledge_article a JOIN qx_scenic_spot s ON s.spot_code='fanjingshan' WHERE a.article_code='k6';
INSERT IGNORE INTO qx_knowledge_relation (article_id, rel_type, rel_id)
SELECT a.id, 'scenic_spot', s.id FROM qx_knowledge_article a JOIN qx_scenic_spot s ON s.spot_code='zhijindong' WHERE a.article_code='k7';

-- 7. 媒体资产 (10 scenic + 5 route covers)
INSERT IGNORE INTO qx_media_asset (biz_type, biz_id, asset_type, url, sort_order, status)
SELECT 'scenic', id, 'cover', CONCAT('/assets/images/scenic/scenic-', spot_code, '.jpg'), 1, 1 FROM qx_scenic_spot;
INSERT IGNORE INTO qx_media_asset (biz_type, biz_id, asset_type, url, sort_order, status)
SELECT 'route', id, 'cover', NULL, 1, 1 FROM qx_route;
