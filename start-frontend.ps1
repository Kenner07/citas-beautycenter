$projectDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectDirectory
python -m http.server 5500 --bind 0.0.0.0
