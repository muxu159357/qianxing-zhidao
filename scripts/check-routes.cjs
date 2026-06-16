#!/usr/bin/env node
/* V21-B: Jump path verification */

var fs = require('fs');
var path = require('path');

var PAGES_DIR = path.join(__dirname, '..', 'miniprogram', 'pages');
var APP_JSON = path.join(__dirname, '..', 'miniprogram', 'app.json');

var errors = [];
var ok = 0;

console.log('========================================');
console.log('V21-B: Jump Path Verification');
console.log('========================================');

var appJson = JSON.parse(fs.readFileSync(APP_JSON, 'utf8'));
var pageSet = new Set(appJson.pages || []);
var tabSet = new Set();
if (appJson.tabBar && appJson.tabBar.list) {
  appJson.tabBar.list.forEach(function(t) { tabSet.add(t.pagePath); });
}

function ls(dir) {
  var r = [];
  fs.readdirSync(dir).forEach(function(f) {
    var fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) r = r.concat(ls(fp));
    else if (f.endsWith('.js')) r.push(fp);
  });
  return r;
}

var NAV_RE = /wx\.(navigateTo|switchTab|redirectTo|reLaunch)\s*\(\s*\{[^}]*url\s*:\s*['"]([^'"]+)['"]/g;
ls(PAGES_DIR).forEach(function(f) {
  var c = fs.readFileSync(f, 'utf8');
  var rel = path.relative(path.join(__dirname, '..'), f);
  var m;
  while ((m = NAV_RE.exec(c)) !== null) {
    var method = m[1];
    var target = m[2].split('?')[0];
    if (target[0] === '/') target = target.substring(1);
    if (!pageSet.has(target)) {
      errors.push(rel + ': ' + method + ' -> unregistered page "' + target + '"');
    } else if (tabSet.has(target) && method !== 'switchTab') {
      errors.push(rel + ': tabBar "' + target + '" should use switchTab, not ' + method);
    } else if (!tabSet.has(target) && method === 'switchTab') {
      errors.push(rel + ': non-tabBar "' + target + '" should use navigateTo, not switchTab');
    } else if (method === 'reLaunch') {
      errors.push(rel + ': reLaunch to "' + target + '" — convention forbids reLaunch');
    } else {
      ok++;
    }
  }
});

console.log('\nRESULTS: ' + errors.length + ' errors, ' + ok + ' OK');
if (errors.length) { console.log('\nERRORS:'); errors.forEach(function(e) { console.log('  [ERR] ' + e); }); }
process.exit(errors.length ? 1 : 0);
