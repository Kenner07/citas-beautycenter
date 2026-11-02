const ADMIN_API = `${window.location.protocol === 'file:' ? 'http:' : window.location.protocol}//${window.location.hostname || 'localhost'}:8000/api`;
const statusLabels = { pendiente: 'Pendiente', confirmada: 'Confirmada', completada: 'Completada', cancelada: 'Cancelada', no_asistio: 'No asistió' };
let token = sessionStorage.getItem('adminToken');

const loginView = document.querySelector('#login-view');
const dashboardView = document.querySelector('#dashboard-view');
const loginForm = document.querySelector('#login-form');
const loginError = document.querySelector('#login-error');
const appointmentsList = document.querySelector('#appointments-list');
const dashboardMessage = document.querySelector('#dashboard-message');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[character]));
}

async function request(path, options = {}) {
  const response = await fetch(`${ADMIN_API}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) } });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || 'No se pudo completar la operación.');
  return data;
}

function showDashboard() {
  loginView.hidden = true;
  dashboardView.hidden = false;
  loadAppointments();
}

async function loadAppointments() {
  const date = document.querySelector('#date-filter').value;
  const status = document.querySelector('#status-filter').value;
  const query = new URLSearchParams();
  if (date) query.set('appointment_date', date);
  if (status) query.set('status', status);
  dashboardMessage.textContent = 'Cargando citas...';
  try {
    const appointments = await request(`/admin/appointments?${query}`);
    appointmentsList.innerHTML = appointments.length ? appointments.map((appointment) => `
      <article class="appointment">
        <div><h2>${escapeHtml(appointment.client)}</h2><p>${escapeHtml(appointment.phone)}${appointment.email ? ` · ${escapeHtml(appointment.email)}` : ''}</p><span class="status">${statusLabels[appointment.status] || appointment.status}</span></div>
        <div><time>${escapeHtml(appointment.date)} · ${escapeHtml(appointment.time)}</time><p>${escapeHtml(appointment.service)} (${appointment.duration} min)</p></div>
        <div><strong>${escapeHtml(appointment.professional)}</strong><p>Profesional asignada</p></div>
        <div class="appointment-actions">${appointment.status !== 'cancelada' ? `<button data-id="${appointment.id}" data-status="completada">Completar</button><button data-id="${appointment.id}" data-status="cancelada">Cancelar</button><button data-id="${appointment.id}" data-status="no_asistio">No asistió</button>` : ''}</div>
      </article>`).join('') : '<div class="card empty">No hay citas con estos filtros.</div>';
    dashboardMessage.textContent = `${appointments.length} cita(s) encontrada(s).`;
  } catch (error) { dashboardMessage.textContent = error.message; }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';
  const form = new FormData(loginForm);
  try {
    const result = await fetch(`${ADMIN_API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: form.get('username'), password: form.get('password') }) });
    const data = await result.json();
    if (!result.ok) throw new Error(data.detail || 'No se pudo iniciar sesión.');
    token = data.token;
    sessionStorage.setItem('adminToken', token);
    showDashboard();
  } catch (error) { loginError.textContent = error.message; }
});

appointmentsList.addEventListener('click', async (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button || !confirm(`¿Cambiar el estado de esta cita a "${statusLabels[button.dataset.status]}"?`)) return;
  try { await request(`/admin/appointments/${button.dataset.id}/status`, { method: 'PATCH', body: JSON.stringify({ status: button.dataset.status }) }); await loadAppointments(); } catch (error) { dashboardMessage.textContent = error.message; }
});

document.querySelector('#filter-button').addEventListener('click', loadAppointments);
document.querySelector('#logout-button').addEventListener('click', async () => { try { await request('/auth/logout', { method: 'POST' }); } finally { sessionStorage.removeItem('adminToken'); token = null; dashboardView.hidden = true; loginView.hidden = false; } });
if (token) showDashboard();
