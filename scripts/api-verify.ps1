# 黔行智导 API 验证脚本 | 后端启动后运行
$B="http://localhost:8080"; $p=0;$f=0
function t($n,$m,$u,$e=200){try{$r=Invoke-WebRequest "$B$u" -Method $m -UseBasicParsing -TimeoutSec 3 -Body '{}' -ContentType 'application/json' -EA Stop;if($r.StatusCode -eq $e){$p++;Write-Host "[PASS] $n" -F Green}else{$f++;Write-Host "[FAIL] $n" -F Red}}catch{$s=$_.Exception.Response.StatusCode.value__;if($s -eq $e){$p++;Write-Host "[PASS] $n" -F Green}else{$f++;Write-Host "[FAIL] $n" -F Red}}}
t "health" "GET" "/api/health"; t "config" "GET" "/api/health/config"; t "scenic" "GET" "/api/app/scenic/spots?size=2"; t "routes" "GET" "/api/app/routes?size=2"; t "knowledge" "GET" "/api/app/knowledge/articles?size=2"
t "user/me 401" "GET" "/api/app/user/me" 401; t "trips 401" "GET" "/api/app/trips" 401; t "ai/chat 401" "GET" "/api/app/ai/chat" 401
Write-Host "`n$p PASS / $f FAIL"
