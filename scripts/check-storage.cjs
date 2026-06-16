#!/usr/bin/env node
/* V21-C: Storage key audit */

var fs = require('fs');
var path = require('path');

var PAGES_DIR = path.join(__dirname, '..', 'miniprogram', 'pages');
var UTILS_DIR = path.join(__dirname, '..', 'miniprogram', 'utils');

var BASELINE = [
  { key: 'qianxing_profile', maxWriters: 1 },
  { key: 'qianxing_selection', maxWriters: 1 },
  { key: 'qianxing_trips', maxWriters: 1 },
  { key: 'qianxing_pending_context', maxWriters: 2 },
  { key: 'qianxing_pending_question', maxWriters: 1 },
  { key: 'qianxing_selected_route', maxWriters: 2 }
];

var errors = [];
var found = {};

function ls(dir) {
  var r = [];
  if (!fs.existsSync(dir)) return r;
  fs.readdirSync(dir).forEach(function(f) {
    var fp = path.join(dir, f);
    if (fs.statSync(fp).isDirectory()) r = r.concat(ls(fp));
    else if (f.endsWith('.js')) r.push(fp);
  });
  return r;
}

console.log('========================================');
console.log('V21-C: Storage Key Audit');
console.log('========================================');

var files = ls(PAGES_DIR).concat(ls(UTILS_DIR));
var SYNCS = /(getStorageSync|setStorageSync|removeStorageSync)\s*\(\s*['"]([^'"]+)['"]/g;

files.forEach(function(f) {
  var c = fs.readFileSync(f, 'utf8');
  var rel = path.relative(path.join(__dirname, '..'), f);
  var m;
  while ((m = SYNCS.exec(c)) !== null) {
    var op = m[1];
    var key = m[2];
    if (!found[key]) found[key] = { writers: new Set() };
    if (op === 'setStorageSync') found[key].writers.add(rel);
  }
});

var knownKeys = BASELINE.map(function(b) { return b.key; });
BASELINE.forEach(function(b) {
  if (!found[b.key]) {
    errors.push('"' + b.key + '" not found in any file');
    return;
  }
  if (found[b.key].writers.size > b.maxWriters) {
    errors.push('"' + b.key + '": ' + found[b.key].writers.size + ' writers (max ' + b.maxWriters + ')');
  }
});

Object.keys(found).forEach(function(k) {
  if (knownKeys.indexOf(k) === -1) errors.push('UNKNOWN key "' + k + '"');
});

console.log('\nKeys found: ' + Object.keys(found).length);
Object.keys(found).forEach(function(k) {
  console.log('  ' + k + ' — ' + found[k].writers.size + ' writers');
});

console.log('\nRESULTS: ' + errors.length + ' errors');
if (errors.length) { errors.forEach(function(e) { console.log('  [ERR] ' + e); }); }
process.exit(errors.length ? 1 : 0);
