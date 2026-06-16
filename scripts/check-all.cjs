#!/usr/bin/env node
/* V21-F: Unified frontend quality gate */

var cp = require('child_process');
var path = require('path');

var SCRIPTS = [
  'check-static.cjs',
  'check-routes.cjs',
  'check-storage.cjs',
  'check-forbidden.cjs'
];

var failed = 0;
var results = [];

console.log('========================================');
console.log('Frontend Quality Gate — Full Scan');
console.log('========================================\n');

SCRIPTS.forEach(function(script) {
  var name = script.replace('.cjs', '').replace('check-', '').toUpperCase();
  try {
    var out = cp.execSync('node "' + path.join(__dirname, script) + '"', {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      timeout: 30000
    });
    results.push({ name: name, status: 'PASS' });
    console.log('[' + name + '] PASS');
  } catch (e) {
    results.push({ name: name, status: 'FAIL' });
    failed++;
    console.log('[' + name + '] FAIL');
    if (e.stdout && e.stdout.toString().trim()) {
      console.log(e.stdout.toString().trim());
    }
  }
});

console.log('\n========================================');
console.log('SUMMARY: ' + (SCRIPTS.length - failed) + ' passed / ' + SCRIPTS.length + ' total');
console.log('========================================');
results.forEach(function(r) {
  console.log('  [' + r.status + '] ' + r.name);
});

process.exit(failed > 0 ? 1 : 0);
