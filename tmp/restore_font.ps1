$admissionPath = "c:\Users\Foridi\Desktop\grow-halal\public\admission-form.html"
$appPath = "c:\Users\Foridi\Desktop\grow-halal\public\app.js"

$admissionContent = Get-Content $admissionPath -Raw
if ($admissionContent -match "base64,([^']+)'\) format") {
    $b64 = $Matches[1]
    $appContent = Get-Content $appPath -Raw
    # Target the exact missing data spot I created earlier
    $searchStr = "base64,') format('truetype')"
    $replaceStr = "base64,$b64') format('truetype')"
    
    if ($appContent.Contains($searchStr)) {
        $appContent = $appContent.Replace($searchStr, $replaceStr)
        [System.IO.File]::WriteAllText($appPath, $appContent, [System.Text.Encoding]::UTF8)
        Write-Output "Successfully restored font data in app.js"
    } else {
        Write-Error "Could not find target string in app.js"
    }
} else {
    Write-Error "Could not find base64 font in admission-form.html"
}
