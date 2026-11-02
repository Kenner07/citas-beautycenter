$backendDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDirectory
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
