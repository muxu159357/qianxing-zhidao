# 黔行智导 · 小程序文件完整性检查
$root = Split-Path -Parent $PSScriptRoot; $mp = Join-Path $root "miniprogram"; $fail = 0
function ck($p,$d) { if (Test-Path $p) { Write-Host "[OK] $d" -ForegroundColor Green } else { Write-Host "[FAIL] $d ($p)" -ForegroundColor Red; $script:fail++ } }
Write-Host "=== 小程序文件检查 ===" -ForegroundColor Cyan
ck (Join-Path $root "project.config.json") "根级 project.config.json"
ck (Join-Path $mp "project.config.json") "miniprogram/project.config.json"
ck (Join-Path $mp "app.json") "miniprogram/app.json"
ck (Join-Path $mp "pages/index/index.js") "首页 JS"
ck (Join-Path $mp "pages/guide/guide.js") "AI助手 JS"
ck (Join-Path $mp "pages/my-trips/my-trips.js") "我的行程 JS"
ck (Join-Path $mp "pages/ai-plan-preview/ai-plan-preview.js") "AI草稿预览 JS"
ck (Join-Path $mp "pages/ai-plan-preview/ai-plan-preview.wxml") "AI草稿预览 WXML"
$g = Join-Path $mp "pages/guide/guide.js"
if (Test-Path $g) { $c = Get-Content $g -Raw; if ($c -match '\)\s*else\s*\w+\s*\(') { Write-Host "[WARN] guide.js 仍有单行 if/else 风险" -ForegroundColor Yellow } else { Write-Host "[OK] guide.js 无单行 if/else" -ForegroundColor Green } }
$iw = Join-Path $mp "pages/index/index.wxml"
if (Test-Path $iw) { $c = Get-Content $iw -Raw; if ($c -match 'wx:key="\w+\.\w+"') { Write-Host "[WARN] index.wxml wx:key 点路径" -ForegroundColor Yellow } else { Write-Host "[OK] index.wxml wx:key 合规" -ForegroundColor Green } }
Write-Host "`n完成: 失败 $fail" -ForegroundColor $(if($fail){'Red'}else{'Green'})
