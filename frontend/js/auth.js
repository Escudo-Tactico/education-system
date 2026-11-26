// Gestion de sesion y validacion de roles para el frontend (Escuela Maestro Feliciano Rodriguez)

const AUTH_STORAGE_KEYS = {
  token: 'mf_token',
  usuario: 'mf_usuario'
};

function guardarSesion(token, datosUsuario) {
  localStorage.setItem(AUTH_STORAGE_KEYS.token, token);
  localStorage.setItem(AUTH_STORAGE_KEYS.usuario, JSON.stringify(datosUsuario));
}

function obtenerUsuarioActual() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEYS.usuario);
  return raw ? JSON.parse(raw) : null;
}

function cerrarSesion() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.usuario);
  window.location.href = '../index.html';
}

function obtenerRutaPorRol(rol) {
  switch (rol) {
    case 'secretaria':
      return 'panel-secretaria.html';
    case 'docente':
      return 'panel-docente.html';
    case 'direccion':
      return 'panel-direccion.html';
    case 'representante':
      return 'panel-representante.html';
    default:
      return '../index.html';
  }
}

async function iniciarSesion(correo, password) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`;
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.mensaje || 'No se pudo iniciar sesión');
  }

  guardarSesion(datos.token, datos.usuario);
  window.location.href = obtenerRutaPorRol(datos.usuario.rol);
}