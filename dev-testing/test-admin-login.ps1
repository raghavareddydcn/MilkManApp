# TEST ADMIN LOGIN - Step by Step

Write-Host "🧪 MilkMan Admin Login Test" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Test 1: Check if containers are running
Write-Host "✓ Step 1: Checking Docker containers..." -ForegroundColor Yellow
docker-compose ps

# Test 2: Check database for admin users
Write-Host "`n✓ Step 2: Checking admin users in database..." -ForegroundColor Yellow
docker exec milkman-postgres psql -U postgres -d milkman -c "SELECT customerid, firstname, lastname, pphone, role FROM milkman.customers WHERE role = 'ADMIN';"

Write-Host "`n📝 Admin credentials found above. Note the phone number!" -ForegroundColor Green

# Test 3: Test API directly
Write-Host "`n✓ Step 3: Testing authentication API..." -ForegroundColor Yellow
$body = @{
    emailIdOrPhone = "9566085621"
    authPin = "admin"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8081/milkman/customer/authenticate" -Method Post -Body $body -ContentType "application/json"
    Write-Host "`n🎉 API Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 3
    
    if ($response.role) {
        Write-Host "`n✅ ROLE FIELD EXISTS: $($response.role)" -ForegroundColor Green
    } else {
        Write-Host "`n❌ ROLE FIELD MISSING!" -ForegroundColor Red
    }
} catch {
    Write-Host "`n❌ API Error: $_" -ForegroundColor Red
}

# Test 4: Rebuild web app
Write-Host "`n✓ Step 4: Would you like to rebuild the web app? (Y/N)" -ForegroundColor Yellow
$rebuild = Read-Host
if ($rebuild -eq "Y" -or $rebuild -eq "y") {
    Write-Host "`nRebuilding web app..." -ForegroundColor Yellow
    docker-compose restart milkman-web
    Write-Host "Web app restarted. Wait 30 seconds, then test at http://localhost:3001" -ForegroundColor Green
}

Write-Host "`n✅ Test complete!" -ForegroundColor Green
Write-Host "`n📋 Quick Test Guide:" -ForegroundColor Cyan
Write-Host "1. Open: http://localhost:3001/login" -ForegroundColor White
Write-Host "2. Phone: 9566085621" -ForegroundColor White
Write-Host "3. PIN: admin (NOT 1234!)" -ForegroundColor Yellow
Write-Host "4. Open Browser Console (F12) to see debug logs" -ForegroundColor White
Write-Host "5. After login, run: JSON.parse(localStorage.getItem('user'))" -ForegroundColor White
Write-Host "`nExpected: {customerId: 'CUST008', customerName: 'System Admin', role: 'ADMIN'}`n" -ForegroundColor Green
