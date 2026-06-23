# 黔行智导 · 管理员登录就绪检查 (不打印密码/密钥)

function check($label, $val, $req=$true) {
  if ($val) {
    Write-Host "[OK] $label" -ForegroundColor Green
    if ($label -match "SECRET|PASSWORD") {
      if ($val.Length -lt 32) { Write-Host "  WARN: 不足32字节($($val.Length))" -ForegroundColor Yellow }
    }
  } else {
    if ($req) { Write-Host "[MISS] $label" -ForegroundColor Red }
    else { Write-Host "[INFO] $label 未设置(可选)" -ForegroundColor DarkGray }
  }
}

Write-Host "=== 管理员登录就绪检查 ===" -ForegroundColor Cyan
check "JWT_SECRET" $env:JWT_SECRET
check "ADMIN_BOOTSTRAP_ENABLED" $env:ADMIN_BOOTSTRAP_ENABLED $false
check "ADMIN_BOOTSTRAP_USERNAME" $env:ADMIN_BOOTSTRAP_USERNAME $false
check "ADMIN_BOOTSTRAP_PASSWORD" $env:ADMIN_BOOTSTRAP_PASSWORD $false
Write-Host "完成 — 未打印任何密码/密钥值" -ForegroundColor Cyan
