# 黔行智导 · 后端健康检查
param($port = 8080)
$url = "http://localhost:$port/api/health"
Write-Host "检查: $url" -ForegroundColor Cyan
try {
  $r = Invoke-RestMethod -Uri $url -TimeoutSec 10
  if ($r.code -eq 0) { Write-Host "[PASS] 后端健康" -ForegroundColor Green; exit 0 }
  Write-Host "[FAIL] 异常响应" -ForegroundColor Red; exit 1
} catch {
  Write-Host "[FAIL] 无法连接 $port`n确认后端已启动 (mvn spring-boot:run)" -ForegroundColor Red; exit 1
}
