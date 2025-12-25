# Import Grafana Dashboard
$dashboardJson = Get-Content "e:\code_base\GitMilkMan\Monitoring\grafana\dashboards\milkman-dashboard-enhanced.json" -Raw | ConvertFrom-Json

# Remove the id field if it exists (Grafana doesn't accept it on import)
$dashboardJson.PSObject.Properties.Remove('id')

# Create the import payload
$payload = @{
    dashboard = $dashboardJson
    overwrite = $true
    inputs = @()
} | ConvertTo-Json -Depth 100

# Save to temporary file
$payload | Out-File -FilePath "e:\code_base\GitMilkMan\Monitoring\temp-import.json" -Encoding utf8 -NoNewline

# Import using curl
$response = curl.exe -s -X POST `
    -H "Content-Type: application/json" `
    -H "Accept: application/json" `
    -u "admin:admin" `
    -d "@e:\code_base\GitMilkMan\Monitoring\temp-import.json" `
    http://localhost:3000/api/dashboards/db

Write-Host $response

# Clean up
Remove-Item "e:\code_base\GitMilkMan\Monitoring\temp-import.json" -ErrorAction SilentlyContinue
