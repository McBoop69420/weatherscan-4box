Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

projectRoot = fso.GetParentFolderName(WScript.ScriptFullName)
nodePath = "C:\Program Files\nodejs\node.exe"
command = "cmd /c cd /d """ & projectRoot & """ && """ & nodePath & """ launcher.js"

shell.Run command, 0, False
