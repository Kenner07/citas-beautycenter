# Samantha Beauty Center

Sistema de reservas para Samantha Beauty Center. Incluye un frontend web, una API desarrollada con FastAPI, un panel administrativo y conexión a la base de datos MySQL `citas_flash`.

## Requisitos

- Windows.
- XAMPP con Apache y MySQL.
- Python 3.10 o superior.
- Un navegador web.

## 1. Preparar la base de datos

1. Abre el panel de XAMPP.
2. Inicia los servicios **Apache** y **MySQL**.
3. Entra a `http://localhost/phpmyadmin`.
4. Crea una base de datos llamada `citas_flash`.
5. Importa el archivo `database/citas_flash.sql` si está incluido en la entrega.

La API utiliza por defecto estos datos de conexión:

```text
Servidor: 127.0.0.1
Puerto: 3306
Usuario: root
Contraseña: vacía
Base de datos: citas_flash
```

Si MySQL tiene otra contraseña, configura estas variables antes de iniciar la API:

```powershell
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = "TU_CONTRASEÑA"
$env:DB_NAME = "citas_flash"
```

## 2. Iniciar la API

Abre una terminal en la carpeta principal del proyecto y ejecuta:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\start.ps1
```

También puedes iniciar la API directamente con:

```powershell
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

La API debe permanecer ejecutándose mientras se realizan reservas o se utiliza el panel administrativo.

Documentación de la API: `http://localhost:8000/docs`  
Comprobación de conexión: `http://localhost:8000/api/health`

## 3. Iniciar el frontend

Abre una segunda terminal en la carpeta principal y ejecuta:

```powershell
.\start-frontend.ps1
```

Después abre `http://127.0.0.1:5500/Index.html`.

No se recomienda abrir `Index.html` haciendo doble clic, porque el navegador puede bloquear las peticiones de la API. El frontend debe abrirse mediante el servidor local.

## 4. Panel administrativo

El panel está disponible en `http://127.0.0.1:5500/admin.html`.

Credenciales iniciales para la demostración:

```text
Usuario: admin
Contraseña: admin123
```

Desde el panel se pueden consultar las citas y cambiar su estado a confirmada, completada, cancelada o no asistió.

## 5. Abrir el sistema desde un teléfono

El computador y el teléfono deben estar conectados a la misma red Wi-Fi.

1. Inicia la API con `backend\\start.ps1`.
2. Inicia el frontend con `start-frontend.ps1`.
3. En PowerShell ejecuta `ipconfig`.
4. Busca la dirección IPv4 del computador, por ejemplo `192.168.1.25`.
5. En el teléfono abre `http://192.168.1.25:5500/Index.html`.

Si no carga, permite Python en el Firewall de Windows y verifica que ambos dispositivos estén en la misma red.

## 6. Entrega del proyecto en un archivo ZIP

El archivo ZIP debe incluir el código fuente, la API, los scripts de inicio, el logo y el respaldo SQL de la base de datos:

```text
Samantha Beauty Center/
├── Index.html
├── admin.html
├── app.js
├── admin.js
├── style.css
├── admin.css
├── logo-samantha.png
├── start-frontend.ps1
├── README.md
├── database/
│   └── citas_flash.sql
└── backend/
    ├── main.py
    ├── requirements.txt
    ├── start.ps1
    └── migrations/
```

No es necesario incluir:

- La carpeta `.venv`.
- La carpeta de datos interna de XAMPP.
- Archivos temporales.
- La base SQLite antigua `backend/samantha_beauty.db`.

Para evaluar el proyecto, el profesor debe instalar XAMPP y Python, importar `citas_flash.sql`, iniciar la API y después iniciar el frontend siguiendo los pasos anteriores.

## Tecnologías

- HTML, CSS y JavaScript con React mediante CDN.
- Python y FastAPI.
- MySQL/MariaDB mediante PyMySQL.
- XAMPP para el entorno local de base de datos.
