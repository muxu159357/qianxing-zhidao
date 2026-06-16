#!/usr/bin/env node
/* V21-A: Mini program static file check */

var fs = require('fs');
var path = require('path');

var PAGES_DIR = path.join(__dirname, '..', 'miniprogram', 'pages');
var APP_JSON = path.join(__dirname, '..', 'miniprogram', 'app.json');

var errors = [];
var warnings = [];
var ok = 0;

function logResult(label, pass) {
  if (pass) { ok++; console.log('  PASS  ' + label); }
  else { console.log('  FAIL  ' + label); }
}

function walkDir(dir, ext) {
  var results = [];
  var items = fs.readdirSync(dir);
  for (var i = 0; i < items.length; i++) {
    var fp = path.join(dir, items[i]);
    if (fs.statSync(fp).isDirectory()) {
      results = results.concat(walkDir(fp, ext));
    } else if (fp.endsWith(ext)) {
      results.push(fp);
    }
  }
  return results;
}

console.log('========================================');
console.log('V21-A: Mini Program Static File Check');
console.log('========================================');

// 1. Check page file completeness
console.log('\n--- Page file completeness ---');
try {
  var appJson = JSON.parse(fs.readFileSync(APP_JSON, 'utf8'));
  var pages = appJson.pages || [];
  for (var pi = 0; pi < pages.length; pi++) {
    var base = path.join(__dirname, '..', 'miniprogram', pages[pi]);
    var exts = ['.js', '.wxml', '.wxss', '.json'];
    var missing = [];
    for (var ei = 0; ei < exts.length; ei++) {
      if (!fs.existsSync(base + exts[ei])) missing.push(exts[ei]);
    }
    if (missing.length) {
      errors.push(pages[pi] + ' missing: ' + missing.join(', '));
      logResult(pages[pi], false);
    } else {
      logResult(pages[pi], true);
    }
  }
} catch (e) {
  errors.push('app.json: ' + e.message);
  logResult('app.json', false);
}

// 2. Check WXSS compatibility
console.log('\n--- WXSS compatibility scan ---');
var wxssFiles = walkDir(PAGES_DIR, '.wxss');
var appWxss = path.join(__dirname, '..', 'miniprogram', 'app.wxss');
if (fs.existsSync(appWxss)) wxssFiles.push(appWxss);

for (var wi = 0; wi < wxssFiles.length; wi++) {
  var f = wxssFiles[wi];
  var content = fs.readFileSync(f, 'utf8');
  var rel = path.relative(path.join(__dirname, '..'), f);
  var issues = [];

  if (content.indexOf('var(') !== -1) issues.push('var()');
  if (/[a-z-]+\s*>\s*\./.test(content)) issues.push('> child selector');
  if (/\.[a-zA-Z0-9_-]*[一-鿿]/.test(content)) issues.push('Chinese class');

  if (issues.length) {
    warnings.push(rel + ': ' + issues.join(', '));
    logResult(rel, false);
  } else {
    logResult(rel, true);
  }
}

// 3. Check JS bracket balance
console.log('\n--- JS syntax check ---');
var jsFiles = walkDir(PAGES_DIR, '.js');
for (var ji = 0; ji < jsFiles.length; ji++) {
  var jf = jsFiles[ji];
  var rel = path.relative(path.join(__dirname, '..'), jf);
  try {
    var c = fs.readFileSync(jf, 'utf8');
    var openB = (c.match(/\{/g) || []).length;
    var closeB = (c.match(/\}/g) || []).length;
    var openP = (c.match(/\(/g) || []).length;
    var closeP = (c.match(/\)/g) || []).length;
    if (openB !== closeB) {
      warnings.push(rel + ': unbalanced braces (' + (openB - closeB) + ')');
      logResult(rel, false);
    } else if (openP !== closeP) {
      warnings.push(rel + ': unbalanced parentheses (' + (openP - closeP) + ')');
      logResult(rel, false);
    } else {
      logResult(rel, true);
    }
  } catch (e) {
    warnings.push(rel + ': ' + e.message);
    logResult(rel, false);
  }
}

console.log('\n========================================');
console.log('RESULTS: ' + errors.length + ' errors, ' + warnings.length + ' warnings, ' + ok + ' OK');
console.log('========================================');

if (errors.length) {
  console.log('\nERRORS:');
  errors.forEach(function(e) { console.log('  [ERR] ' + e); });
}
if (warnings.length) {
  console.log('\nWARNINGS:');
  warnings.forEach(function(w) { console.log('  [WARN] ' + w); });
}

process.exit(errors.length ? 1 : 0);
