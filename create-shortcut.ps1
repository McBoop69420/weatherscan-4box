$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Launch Weatherscan.lnk")
$Shortcut.TargetPath = "$env:USERPROFILE\Documents\weatherscan\Launch Weatherscan.bat"
$Shortcut.WorkingDirectory = "$env:USERPROFILE\Documents\weatherscan"
$Shortcut.Save()
Write-Host "Shortcut created on desktop!"
