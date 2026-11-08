$backendDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $backendDirectory

# Carga la configuración local del correo si existe. Este archivo contiene
# credenciales y no debe subirse a repositorios públicos.
$emailSettingsPath = Join-Path $backendDirectory "email-settings.ps1"
if (Test-Path -LiteralPath $emailSettingsPath) {
    . $emailSettingsPath
}

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
