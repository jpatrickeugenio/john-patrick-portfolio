$path = "css\style.css"

if (-not (Test-Path $path)) {
  Write-Host "Can't find css\style.css. Open the terminal in your portfolio folder." -ForegroundColor Red
  exit
}

# Backup first
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backup = "css\style.backup-$stamp.css"
Copy-Item $path $backup
Write-Host "Backup saved: $backup" -ForegroundColor Cyan

$full = (Resolve-Path $path).Path
$text = [System.IO.File]::ReadAllText($full, [System.Text.Encoding]::UTF8)
$text = $text -replace "`r`n", "`n"
$before = ($text -split "`n").Count

function Cut($text, $start, $end, $replacement) {
  $s = $text.IndexOf($start, [StringComparison]::Ordinal)
  if ($s -lt 0) {
    Write-Host "SKIPPED (start not found): $start" -ForegroundColor Yellow
    return $text
  }
  $e = $text.IndexOf($end, $s + $start.Length, [StringComparison]::Ordinal)
  if ($e -lt 0) {
    Write-Host "SKIPPED (end not found): $end" -ForegroundColor Yellow
    return $text
  }
  Write-Host "OK: $start" -ForegroundColor Green
  return $text.Substring(0, $s) + $replacement + $text.Substring($e)
}

# Step 1: old loading screen + duplicate marquee/pulse
$r1 = @'
.brand span,
.period {
  color: #888888;
}


'@
$text = Cut $text "/* ---------- LOADING SCREEN ---------- */" "/* ---------- MAIN LAYOUT ---------- */" $r1

# Step 2: triple-repeated "stuck loader" rules
$r2 = @'
#loader.loader-hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}

#typingName {
  display: inline-block;
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

'@
$text = Cut $text "/* Prevent the loading screen from getting stuck */" "/* ---------- INTERACTIVE TERMINAL ---------- */" $r2

# Step 3: terminal, journey, old project cards, old welcome loader
$text = Cut $text "/* ---------- INTERACTIVE TERMINAL ---------- */" "/* open the website smoothly */" ""

# Step 4: old GitHub card
$text = Cut $text "/* GitHub Contributions */" "/* ---------- LOADER FIX ---------- */" ""

# Step 5: unused .intro-loader rules inside LOADER FIX
$text = Cut $text "#loader.intro-loader {" "body.site-loading {" ""

$after = ($text -split "`n").Count
[System.IO.File]::WriteAllText($full, $text, (New-Object System.Text.UTF8Encoding($false)))

Write-Host ""
Write-Host "Done. Lines before: $before, after: $after" -ForegroundColor Cyan