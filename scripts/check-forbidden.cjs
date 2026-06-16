#!/usr/bin/env node
/* V21-D: Forbidden word scanner */

var fs = require('fs');
var path = require('path');

var PAGES_DIR = path.join(__dirname, '..', 'miniprogram', 'pages');

var FORBIDDEN = [
  'Demo', 'demo', '测试', '比赛', '参赛', '评委', '路演',
  '演示流程', '占位页', '开发中', '假数据', '临时页面',
  'AI导游', 'AI向导', '实时预警', '实时监测', '实时定位',
  '救援', '当前天气', '实时天气', '实时路况'
];

var hits = [];

function ls(dir) {
  var r = [];
  fs.readdirSync(dir).forEach(function(f) {
    var fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) r = r.concat(ls(fp));
    else r.push(fp);
  });
  return r;
}

console.log('========================================');
console.log('V21-D: Forbidden Word Scanner');
console.log('========================================');

ls(PAGES_DIR).forEach(function(f) {
  var ext = path.extname(f);
  if (ext !== '.wxml' && ext !== '.js' && ext !== '.wxss') return;
  var c = fs.readFileSync(f, 'utf8');
  var rel = path.relative(path.join(__dirname, '..'), f);
  var lines = c.split('\n');

  FORBIDDEN.forEach(function(word) {
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].indexOf(word) === -1) continue;
      // Exemptions
      var trimmed = lines[i].trim();
      if (trimmed.indexOf('//') === 0 || trimmed.indexOf('/*') === 0) continue;
      if (trimmed.indexOf('<!--') !== -1) continue;
      if (word === 'mock' && trimmed.indexOf('require(') !== -1) continue;
      if (word === '临时' && trimmed.indexOf('latest') !== -1) continue;

      hits.push(rel + ':' + (i + 1) + ' — "' + word + '"');
      break;
    }
  });
});

console.log('\nRESULTS: ' + hits.length + ' hits');
if (hits.length) {
  hits.forEach(function(h) { console.log('  [HIT] ' + h); });
  process.exit(1);
} else {
  console.log('  Zero forbidden words in user-visible content');
  process.exit(0);
}
