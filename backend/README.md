# API de Samantha Beauty Center

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

La API queda en `http://localhost:8000` y la documentación en `http://localhost:8000/docs`. La API utiliza la base MySQL local `citas_flash` de XAMPP.

Por defecto se conecta a `127.0.0.1:3306` con el usuario `root` sin contraseña. Puedes cambiar estos valores con `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`.

También puedes iniciarla desde PowerShell ejecutando:

```powershell
.\start.ps1
```

Mantén esa terminal abierta mientras uses `Index.html`.

## Correo de confirmación

Al crear una cita, la API envía al correo del cliente los datos de la reserva y adjunta un archivo `.ics` para agregarla al calendario. Configura estas variables en la misma terminal antes de iniciar la API:

```powershell
$env:SMTP_HOST = "smtp.gmail.com"
$env:SMTP_PORT = "465"
$env:SMTP_USER = "tu-cuenta@gmail.com"
$env:SMTP_PASSWORD = "CONTRASEÑA_DE_APLICACION"
$env:EMAIL_FROM = "tu-cuenta@gmail.com"
```

Para Gmail, `SMTP_PASSWORD` debe ser una contraseña de aplicación, no la contraseña normal de la cuenta. Si no se configuran estas variables, la cita se guarda normalmente pero no se envía el correo.

## Panel administrativo

Abre `http://localhost:5500/admin.html`. El usuario inicial de desarrollo es `admin` y la contraseña es `admin123`; cambia estas credenciales antes de publicar el sistema.

El panel consulta y actualiza las citas desde `citas_flash` y registra los cambios en `auditoria`.
