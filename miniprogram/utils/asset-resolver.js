/* asset-resolver.js — image resolution utility */

var ROUTE_BASE = '/assets/images/routes/';

var KEYWORDS = {
  waterfall:  ['瀑布', '水', '黄果树', '荔波', '小七孔'],
  mountain:   ['山', '梵净山', '徒步', '登山', '云雾', '峰', '万峰林'],
  village:    ['苗寨', '西江', '侗寨', '肇兴', '村寨', '民族', '千户'],
  cave:       ['洞', '织金洞', '溶洞', '丹霞', '赤水'],
  'ancient-town': ['古镇', '青岩', '镇远', '历史', '古城'],
  forest:     ['森林', '自然', '生态', '绿'],
  culture:    ['文化', '非遗', '侗', '苗', '民俗', '鼓楼', '银饰', '刺绣']
};

function inferTheme(route) {
  if (!route) return 'default';
  var text = '';
  if (route.tags && Array.isArray(route.tags)) text += route.tags.join(' ');
  text += ' ' + (route.name || '') + ' ' + (route.description || '');
  for (var theme in KEYWORDS) {
    if (!KEYWORDS.hasOwnProperty(theme)) continue;
    var kw = KEYWORDS[theme];
    for (var i = 0; i < kw.length; i++) {
      if (text.indexOf(kw[i]) !== -1) return theme;
    }
  }
  return 'default';
}

function resolveRouteCover(route) {
  if (!route) return ROUTE_BASE + 'route-default.png';
  if (route.coverImage) return route.coverImage;
  return resolveRouteTheme(route);
}

function resolveRouteTheme(route) {
  if (!route) return ROUTE_BASE + 'route-default.png';
  return ROUTE_BASE + 'route-' + inferTheme(route) + '.png';
}

function resolveFallbackImage(type) {
  if (type === 'scenic') return '/assets/images/fallback/scenic-default.png';
  return ROUTE_BASE + 'route-default.png';
}

module.exports = {
  resolveRouteCover: resolveRouteCover,
  resolveRouteTheme: resolveRouteTheme,
  resolveFallbackImage: resolveFallbackImage,
  inferTheme: inferTheme
};
