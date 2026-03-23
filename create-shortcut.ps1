$WshShell = New-Object -ComObject WScript.Shell
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$shortcutPath = Join-Path $env:USERPROFILE 'Desktop\Launch Weatherscan.lnk'
$launcherPath = Join-Path $projectRoot 'Launch Weatherscan Hidden.vbs'
$iconPath = Join-Path $projectRoot 'webroot\favicon.ico'

$Shortcut = $WshShell.CreateShortcut($shortcutPath)
$Shortcut.TargetPath = "$env:SystemRoot\System32\wscript.exe"
$Shortcut.Arguments = "`"$launcherPath`""
$Shortcut.WorkingDirectory = $projectRoot

if (Test-Path $iconPath) {
  $Shortcut.IconLocation = "$iconPath,0"
}

$Shortcut.Save()
Write-Host "Shortcut created on desktop!"
