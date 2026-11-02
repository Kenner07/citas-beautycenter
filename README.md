# Instrucciones de instalación y uso

## Requisitos del equipo servidor

El equipo donde se ejecutan la API y la base de datos necesita:

- Windows 10 o Windows 11.
- XAMPP instalado.
- Apache y MySQL/MariaDB de XAMPP.
- Python 3.10 o superior agregado al PATH.
- Conexión a la red local.
- Un navegador web actualizado.

El equipo servidor puede ser un computador portátil o de escritorio. Debe permanecer encendido mientras otros dispositivos utilicen el sistema.

## Requisitos de los dispositivos usuarios

Los computadores, teléfonos o tabletas que accedan al sistema necesitan únicamente:

- Un navegador actualizado, como Chrome, Edge, Firefox o Safari.
- Estar conectados a la misma red Wi-Fi o red local del equipo servidor.

No es necesario instalar Python, XAMPP ni la API en cada teléfono o computador usuario.

## 1. Preparar la base de datos

1. Abrir el panel de XAMPP.
2. Iniciar **Apache** y **MySQL**.
3. Abrir `http://localhost/phpmyadmin`.
4. Crear una base de datos llamada `citas_flash`.
5. Importar el archivo `database/citas_flash.sql`.

La conexión predeterminada de la API es:

```text
Servidor: 127.0.0.1
Puerto: 3306
Usuario: root
Contraseña: vacía
Base de datos: citas_flash
```

Si el usuario root tiene contraseña, configurar estas variables en PowerShell antes de iniciar la API:

```powershell
$env:DB_HOST = "127.0.0.1"
$env:DB_PORT = "3306"
$env:DB_USER = "root"
$env:DB_PASSWORD = "TU_CONTRASEÑA"
$env:DB_NAME = "citas_flash"
```

## 2. Instalar e iniciar la API

Abrir PowerShell en la carpeta principal del proyecto y ejecutar:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\start.ps1
```

La API quedará disponible en el puerto `8000`. Esta terminal debe permanecer abierta mientras se usa el programa.

Para comprobar que funciona, abrir en el equipo servidor:

`http://localhost:8000/api/health`

La respuesta debe indicar que la API está conectada a la base de datos `citas_flash`.

## 3. Iniciar la página web

Abrir una segunda ventana de PowerShell en la carpeta principal del proyecto y ejecutar:

```powershell
.\start-frontend.ps1
```

Esta terminal también debe permanecer abierta.

En el equipo servidor, abrir:

`http://localhost:5500/Index.html`

No abrir `Index.html` haciendo doble clic. La página debe ejecutarse mediante `start-frontend.ps1` para que pueda comunicarse correctamente con la API.

## 4. Usar el sistema desde otro dispositivo

El equipo servidor y el teléfono, tableta o computador deben estar conectados a la misma red Wi-Fi.

1. En el equipo servidor abrir PowerShell.
2. Ejecutar:

```powershell
ipconfig
```

3. Buscar la dirección **IPv4**, por ejemplo `192.168.1.25`.
4. Desde el otro dispositivo abrir:

`http://192.168.1.25:5500/Index.html`

Se debe reemplazar `192.168.1.25` por la IPv4 real del equipo servidor.

Para acceder al panel administrativo desde otro dispositivo, abrir:

`http://192.168.1.25:5500/admin.html`

Credenciales iniciales del panel:

```text
Usuario: admin
Contraseña: admin123
```

## 5. Configuración del Firewall de Windows

Si otro dispositivo no puede abrir la página:

1. Permitir Python en el Firewall de Windows cuando aparezca la ventana de autorización.
2. Permitir conexiones privadas para Python.
3. Verificar que ambos dispositivos estén en la misma red Wi-Fi.
4. Confirmar que las terminales de la API y del frontend sigan abiertas.
5. Comprobar que se esté utilizando la IPv4 correcta.

Si es necesario, crear reglas para permitir los puertos TCP `5500` y `8000` en redes privadas.

## 6. Acceso desde Internet

Las instrucciones anteriores permiten usar el sistema desde cualquier dispositivo conectado a la misma red local.

Para usarlo desde cualquier lugar a través de Internet se necesita publicar la API, la página web y la base de datos en un servidor de hosting o VPS. También se recomienda configurar un dominio, HTTPS, copias de seguridad y proteger las credenciales de la base de datos. Un archivo ZIP por sí solo no permite que el sistema sea accesible desde Internet.

## 7. Solución de errores frecuentes

### Error de conexión con la API

- Confirmar que la terminal de la API esté abierta.
- Abrir `http://localhost:8000/api/health`.
- Verificar que MySQL esté iniciado en XAMPP.
- Confirmar que la base de datos se llame `citas_flash`.

### No se guardan las citas

- Confirmar que MySQL esté funcionando.
- Confirmar que la API esté conectada a `citas_flash`.
- Revisar que la tabla `citas` exista después de importar el archivo SQL.

### La página no abre desde el teléfono

- Verificar que ambos dispositivos estén en la misma red.
- Usar la IPv4 del equipo servidor, no `localhost`.
- Revisar el Firewall de Windows.
- Mantener abierto el servidor frontend.
