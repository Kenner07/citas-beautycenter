from datetime import date, datetime, timedelta
import base64
import hashlib
import hmac
import os
import secrets
import smtplib
import time
from email.message import EmailMessage

import pymysql
from fastapi import FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(title="Samantha Beauty Center API", version="2.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False, allow_methods=["*"], allow_headers=["*"])
ADMIN_SESSIONS: dict[str, dict] = {}


class Database:
    def __init__(self):
        self.connection = pymysql.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "citas_flash"),
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False,
        )
        self.cursor = self.connection.cursor()

    def execute(self, query, params=()):
        self.cursor.execute(query, params)
        return self.cursor

    def __enter__(self):
        return self

    def __exit__(self, exception_type, exception, traceback):
        if exception_type:
            self.connection.rollback()
        else:
            self.connection.commit()
        self.cursor.close()
        self.connection.close()


def connect_db() -> Database:
    return Database()


class AppointmentInput(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=7, max_length=30)
    email: EmailStr | None = None
    service_id: int
    professional_id: int
    appointment_date: date
    appointment_time: str = Field(min_length=5, max_length=5, pattern=r"^([01]\d|2[0-3]):[0-5]\d$")


class LoginInput(BaseModel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=1, max_length=120)


class AppointmentStatusInput(BaseModel):
    status: str = Field(pattern=r"^(pendiente|confirmada|completada|cancelada|no_asistio)$")


def ics_escape(value: str) -> str:
    return str(value).replace("\\", "\\\\").replace("\n", "\\n").replace(",", "\\,").replace(";", "\\;")


def build_ics(appointment_id: int, service_name: str, professional_name: str, client_name: str, appointment_date: date, appointment_time: str, duration: int) -> str:
    start = datetime.combine(appointment_date, datetime.strptime(appointment_time, "%H:%M").time())
    end = start + timedelta(minutes=duration)
    format_ics = lambda value: value.strftime("%Y%m%dT%H%M%S")
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Samantha Beauty Center//Citas//ES",
        "CALSCALE:GREGORIAN",
        "BEGIN:VEVENT",
        f"UID:samantha-appointment-{appointment_id}@samanthabeautycenter",
        f"DTSTART;TZID=America/Bogota:{format_ics(start)}",
        f"DTEND;TZID=America/Bogota:{format_ics(end)}",
        f"SUMMARY:{ics_escape(f'Cita - {service_name}')} ".rstrip(),
        f"DESCRIPTION:{ics_escape(f'Cliente: {client_name}\\nProfesional: {professional_name}\\nServicio: {service_name}')} ",
        "LOCATION:Samantha Beauty Center",
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
    ]
    return "\r\n".join(line.rstrip() for line in lines) + "\r\n"


def send_appointment_email(*, recipient: str, appointment_id: int, client_name: str, service_name: str, professional_name: str, appointment_date: date, appointment_time: str, duration: int) -> bool:
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    if not smtp_user or not smtp_password:
        return False

    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "465"))
    sender = os.getenv("EMAIL_FROM", smtp_user)
    date_text = appointment_date.strftime("%d/%m/%Y")
    ics_content = build_ics(appointment_id, service_name, professional_name, client_name, appointment_date, appointment_time, duration)

    message = EmailMessage()
    message["Subject"] = "Confirmación de tu cita - Samantha Beauty Center"
    message["From"] = sender
    message["To"] = recipient
    message.set_content(
        f"Hola {client_name},\n\n"
        "Tu cita en Samantha Beauty Center fue confirmada:\n\n"
        f"Servicio: {service_name}\n"
        f"Profesional: {professional_name}\n"
        f"Fecha: {date_text}\n"
        f"Hora: {appointment_time}\n"
        f"Duración: {duration} minutos\n\n"
        "Adjuntamos un archivo para agregar la cita a tu calendario.\n\n"
        "Te esperamos.\nSamantha Beauty Center"
    )
    message.add_attachment(ics_content.encode("utf-8"), maintype="text", subtype="calendar", filename="cita-samantha-beauty-center.ics")

    if smtp_port == 465:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=20) as smtp:
            smtp.login(smtp_user, smtp_password)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(smtp_user, smtp_password)
            smtp.send_message(message)
    return True


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, iterations, salt, expected = encoded.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), int(iterations))
        return hmac.compare_digest(base64.b64encode(actual).decode(), expected)
    except (ValueError, TypeError):
        return False


def require_admin(authorization: str | None) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Debes iniciar sesión como administradora.")
    session = ADMIN_SESSIONS.get(authorization[7:])
    if not session or session["expires"] < time.time():
        raise HTTPException(401, "La sesión expiró. Inicia sesión nuevamente.")
    return session


def to_minutes(value) -> int:
    if hasattr(value, "total_seconds"):
        return int(value.total_seconds() // 60)
    if hasattr(value, "hour"):
        return value.hour * 60 + value.minute
    hours, minutes = (int(part) for part in str(value)[:5].split(":", 1))
    return hours * 60 + minutes


def to_time(value: int) -> str:
    return f"{value // 60:02d}:{value % 60:02d}"


@app.get("/api/health")
def health() -> dict:
    with connect_db() as db:
        db.execute("SELECT 1")
    return {"status": "ok", "database": os.getenv("DB_NAME", "citas_flash"), "engine": "mysql"}


@app.post("/api/auth/login")
def admin_login(payload: LoginInput) -> dict:
    with connect_db() as db:
        user = db.execute("SELECT id_usuario, nombre_usuario, hash_contrasena, rol FROM usuarios WHERE nombre_usuario = %s AND activo = 1", (payload.username,)).fetchone()
    if not user or user["rol"] != "administradora" or not verify_password(payload.password, user["hash_contrasena"]):
        raise HTTPException(401, "Usuario o contraseña incorrectos.")
    token = secrets.token_urlsafe(32)
    ADMIN_SESSIONS[token] = {"user_id": user["id_usuario"], "username": user["nombre_usuario"], "expires": time.time() + 8 * 60 * 60}
    return {"token": token, "username": user["nombre_usuario"], "role": user["rol"]}


@app.post("/api/auth/logout")
def admin_logout(authorization: str | None = Header(default=None)) -> dict:
    if authorization and authorization.startswith("Bearer "):
        ADMIN_SESSIONS.pop(authorization[7:], None)
    return {"status": "ok"}


@app.get("/api/business-hours")
def business_hours() -> list[dict]:
    names = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
    with connect_db() as db:
        rows = db.execute("SELECT dia_semana, MIN(hora_inicio) AS opens_at, MAX(hora_fin) AS closes_at FROM horarios_empleadas WHERE activo = 1 GROUP BY dia_semana ORDER BY dia_semana").fetchall()
    known = {row["dia_semana"]: row for row in rows}
    return [{"day_of_week": day, "day_name": names[day - 1], "opens_at": str(known[day]["opens_at"])[:5] if day in known else None, "closes_at": str(known[day]["closes_at"])[:5] if day in known else None, "is_open": int(day in known)} for day in range(1, 8)]


@app.get("/api/services")
def list_services() -> list[dict]:
    with connect_db() as db:
        rows = db.execute("SELECT id_servicio AS id, nombre AS name, categoria AS category, duracion_minutos AS duration FROM servicios WHERE activo = 1 ORDER BY id_servicio").fetchall()
    return rows


@app.get("/api/professionals")
def list_professionals(service_id: int | None = Query(default=None)) -> list[dict]:
    query = "SELECT DISTINCT e.id_empleada AS id, CONCAT(e.nombre, IFNULL(CONCAT(' ', e.apellido), '')) AS name, e.especialidad AS specialty FROM empleadas e"
    params = ()
    if service_id is not None:
        query += " INNER JOIN empleadas_servicios es ON es.id_empleada = e.id_empleada WHERE es.id_servicio = %s AND es.activo = 1 AND e.activo = 1"
        params = (service_id,)
    else:
        query += " WHERE e.activo = 1"
    query += " ORDER BY e.id_empleada"
    with connect_db() as db:
        return [row | {"serviceIds": []} for row in db.execute(query, params).fetchall()]


@app.get("/api/availability")
def availability(professional_id: int, service_id: int) -> dict:
    today = date.today()
    with connect_db() as db:
        service = db.execute("SELECT duracion_minutos AS duration FROM servicios WHERE id_servicio = %s AND activo = 1", (service_id,)).fetchone()
        schedules = db.execute("SELECT dia_semana, hora_inicio, hora_fin FROM horarios_empleadas WHERE id_empleada = %s AND activo = 1", (professional_id,)).fetchall()
        booked = db.execute("SELECT fecha, hora_inicio, duracion_minutos AS duration FROM citas WHERE id_empleada = %s AND fecha >= %s AND estado NOT IN ('cancelada', 'no_asistio') AND eliminado_en IS NULL", (professional_id, today)).fetchall()
    if not service:
        raise HTTPException(404, "El servicio no existe.")
    schedule_by_day = {row["dia_semana"]: row for row in schedules}
    dates = []
    for offset in range(1, 15):
        current = today + timedelta(days=offset)
        schedule = schedule_by_day.get(current.weekday() + 1)
        slots = []
        if schedule:
            opening, closing = to_minutes(schedule["hora_inicio"]), to_minutes(schedule["hora_fin"])
            for start in range(opening, closing - service["duration"] + 1, 30):
                end = start + service["duration"]
                blocked = any(row["fecha"] == current and to_minutes(row["hora_inicio"]) < end and to_minutes(row["hora_inicio"]) + row["duration"] > start for row in booked)
                if not blocked:
                    slots.append(to_time(start))
        dates.append({"date": current.isoformat(), "slots": slots})
    return {"professionalId": professional_id, "serviceId": service_id, "dates": dates}


@app.post("/api/appointments", status_code=201)
def create_appointment(payload: AppointmentInput) -> dict:
    with connect_db() as db:
        service = db.execute("SELECT id_servicio, nombre AS name, duracion_minutos AS duration FROM servicios WHERE id_servicio = %s AND activo = 1", (payload.service_id,)).fetchone()
        professional = db.execute("SELECT e.id_empleada, CONCAT(e.nombre, IFNULL(CONCAT(' ', e.apellido), '')) AS name FROM empleadas e INNER JOIN empleadas_servicios es ON es.id_empleada = e.id_empleada WHERE e.id_empleada = %s AND es.id_servicio = %s AND es.activo = 1 AND e.activo = 1", (payload.professional_id, payload.service_id)).fetchone()
        schedule = db.execute("SELECT hora_inicio, hora_fin FROM horarios_empleadas WHERE id_empleada = %s AND dia_semana = %s AND activo = 1", (payload.professional_id, payload.appointment_date.weekday() + 1)).fetchone()
        if not service or not professional:
            raise HTTPException(400, "El servicio o profesional no está disponible.")
        if payload.appointment_date <= date.today() or not schedule:
            raise HTTPException(400, "La fecha está fuera del horario de atención.")
        start, end = to_minutes(payload.appointment_time), to_minutes(payload.appointment_time) + service["duration"]
        if start < to_minutes(schedule["hora_inicio"]) or end > to_minutes(schedule["hora_fin"]) or start % 30:
            raise HTTPException(400, "La hora está fuera del horario de atención.")
        booked = db.execute("SELECT hora_inicio, duracion_minutos AS duration FROM citas WHERE id_empleada = %s AND fecha = %s AND estado NOT IN ('cancelada', 'no_asistio') AND eliminado_en IS NULL FOR UPDATE", (payload.professional_id, payload.appointment_date)).fetchall()
        if any(to_minutes(row["hora_inicio"]) < end and to_minutes(row["hora_inicio"]) + row["duration"] > start for row in booked):
            raise HTTPException(409, "Ese horario ya fue reservado. Elige otro.")
        client = db.execute("SELECT id_cliente FROM clientes WHERE telefono = %s LIMIT 1 FOR UPDATE", (payload.phone,)).fetchone()
        if client:
            client_id = client["id_cliente"]
            db.execute("UPDATE clientes SET nombre = %s, correo = %s, actualizado_en = CURRENT_TIMESTAMP WHERE id_cliente = %s", (payload.name, payload.email, client_id))
        else:
            client_id = db.execute("INSERT INTO clientes (nombre, telefono, correo, activo) VALUES (%s, %s, %s, 1)", (payload.name, payload.phone, payload.email)).lastrowid
        appointment_id = db.execute("INSERT INTO citas (id_cliente, id_empleada, id_servicio, fecha, hora_inicio, duracion_minutos, estado, estado_sincronizacion) VALUES (%s, %s, %s, %s, %s, %s, 'confirmada', 'pendiente')", (client_id, payload.professional_id, payload.service_id, payload.appointment_date, payload.appointment_time, service["duration"])).lastrowid
        db.execute("INSERT INTO auditoria (entidad, id_registro, accion, detalle) VALUES ('cita', %s, 'crear', 'Reserva creada desde el portal público')", (str(appointment_id),))
    email_sent = False
    if payload.email:
        try:
            email_sent = send_appointment_email(
                recipient=payload.email,
                appointment_id=appointment_id,
                client_name=payload.name,
                service_name=service["name"],
                professional_name=professional["name"],
                appointment_date=payload.appointment_date,
                appointment_time=payload.appointment_time,
                duration=service["duration"],
            )
        except (OSError, smtplib.SMTPException) as error:
            print(f"No se pudo enviar el correo de la cita {appointment_id}: {error}")
    return {"id": appointment_id, "userId": client_id, "status": "confirmed", "emailSent": email_sent, **payload.model_dump(mode="json")}


@app.get("/api/appointments")
def list_appointments(phone: str | None = Query(default=None)) -> list[dict]:
    query = "SELECT c.id_cita AS id, c.fecha AS date, c.hora_inicio AS time, c.duracion_minutos AS duration, c.estado AS status, s.nombre AS service, CONCAT(e.nombre, IFNULL(CONCAT(' ', e.apellido), '')) AS professional, cl.nombre AS user, cl.telefono AS phone FROM citas c INNER JOIN servicios s ON s.id_servicio = c.id_servicio INNER JOIN empleadas e ON e.id_empleada = c.id_empleada INNER JOIN clientes cl ON cl.id_cliente = c.id_cliente WHERE c.eliminado_en IS NULL"
    params = ()
    if phone:
        query += " AND cl.telefono = %s"
        params = (phone,)
    query += " ORDER BY c.fecha, c.hora_inicio"
    with connect_db() as db:
        return db.execute(query, params).fetchall()


@app.get("/api/admin/appointments")
def admin_appointments(
    appointment_date: date | None = Query(default=None),
    status: str | None = Query(default=None),
    professional_id: int | None = Query(default=None),
    authorization: str | None = Header(default=None),
) -> list[dict]:
    session = require_admin(authorization)
    query = "SELECT c.id_cita AS id, c.fecha AS date, TIME_FORMAT(c.hora_inicio, '%%H:%%i') AS time, c.duracion_minutos AS duration, c.estado AS status, s.nombre AS service, CONCAT(e.nombre, IFNULL(CONCAT(' ', e.apellido), '')) AS professional, cl.nombre AS client, cl.telefono AS phone, cl.correo AS email FROM citas c INNER JOIN servicios s ON s.id_servicio = c.id_servicio INNER JOIN empleadas e ON e.id_empleada = c.id_empleada INNER JOIN clientes cl ON cl.id_cliente = c.id_cliente WHERE c.eliminado_en IS NULL"
    params = []
    if appointment_date:
        query += " AND c.fecha = %s"
        params.append(appointment_date)
    if status:
        query += " AND c.estado = %s"
        params.append(status)
    if professional_id:
        query += " AND c.id_empleada = %s"
        params.append(professional_id)
    query += " ORDER BY c.fecha, c.hora_inicio"
    with connect_db() as db:
        return db.execute(query, tuple(params)).fetchall()


@app.patch("/api/admin/appointments/{appointment_id}/status")
def update_appointment_status(appointment_id: int, payload: AppointmentStatusInput, authorization: str | None = Header(default=None)) -> dict:
    session = require_admin(authorization)
    with connect_db() as db:
        appointment = db.execute("SELECT id_cita, estado FROM citas WHERE id_cita = %s AND eliminado_en IS NULL FOR UPDATE", (appointment_id,)).fetchone()
        if not appointment:
            raise HTTPException(404, "La cita no existe.")
        db.execute("UPDATE citas SET estado = %s, eliminado_en = CASE WHEN %s = 'cancelada' THEN CURRENT_TIMESTAMP ELSE NULL END WHERE id_cita = %s", (payload.status, payload.status, appointment_id))
        db.execute("INSERT INTO auditoria (id_usuario, entidad, id_registro, accion, detalle) VALUES (%s, 'cita', %s, %s, %s)", (session["user_id"], str(appointment_id), "cancelar" if payload.status == "cancelada" else "actualizar", f"Estado cambiado de {appointment['estado']} a {payload.status}"))
    return {"id": appointment_id, "status": payload.status}
