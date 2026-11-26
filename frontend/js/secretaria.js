/**
 * Lógica del Panel de Secretaría — Escuela Maestro Feliciano Rodríguez.
 * Gestiona Estudiantes, Secciones, Horarios/Aulas, Inscripciones y Checklist de Documentos
 * respetando los nombres exactos de variables de PROJECT_CONTEXT.md y con respaldo local seguro.
 */

// Datos de respaldo cuando el backend en Node.js aún no responde
const DATOS_RESPALDO_SECRETARIA = {
  estudiantes: [
    {
      id_estudiante: 1,
      nombres: 'Sofía Valentina',
      apellidos: 'Rojas Mendoza',
      cedula_escolar: '11524680321',
      fecha_nacimiento: '2016-04-12'
    },
    {
      id_estudiante: 2,
      nombres: 'Mateo Alejandro',
      apellidos: 'Silva Torres',
      cedula_escolar: '11719450812',
      fecha_nacimiento: '2017-09-25'
    }
  ],
  secciones: [
    {
      id_seccion: 1,
      grado: '3er Grado',
      letra_seccion: 'A',
      periodo_escolar: '2026-2027',
      id_docente: 10
    },
    {
      id_seccion: 2,
      grado: '2do Grado',
      letra_seccion: 'B',
      periodo_escolar: '2026-2027',
      id_docente: 12
    }
  ],
  horarios: [
    {
      id_seccion: 1,
      id_docente: 10,
      grado: '3er Grado',
      letra_seccion: 'A',
      bloque_horario: 'Lun-Mie 07:30-09:00',
      aula: 'Aula 03'
    },
    {
      id_seccion: 2,
      id_docente: 12,
      grado: '2do Grado',
      letra_seccion: 'B',
      bloque_horario: 'Lun-Mie 09:15-10:45',
      aula: 'Aula 02'
    }
  ],
  inscripciones: [
    {
      id_inscripcion: 1,
      fecha_inscripcion: '2026-09-15',
      estado: 'aprobada',
      id_estudiante: 1,
      id_seccion: 1
    },
    {
      id_inscripcion: 2,
      fecha_inscripcion: '2026-09-18',
      estado: 'pendiente',
      id_estudiante: 2,
      id_seccion: 2
    }
  ],
  checklists: [
    {
      id_checklist: 1,
      partida_nacimiento: true,
      cedula_representante: true,
      cedula_estudiante: true,
      fotos: true,
      planillas: true,
      id_inscripcion: 1
    },
    {
      id_checklist: 2,
      partida_nacimiento: true,
      cedula_representante: true,
      cedula_estudiante: false,
      fotos: false,
      planillas: true,
      id_inscripcion: 2
    }
  ]
};

const estadoSecretaria = {
  estudiantes: [],
  secciones: [],
  horarios: [],
  inscripciones: [],
  checklists: [],
  modoSimulacion: false
};

function clonarDatosRespaldo(lista) {
  return lista.map((item) => ({ ...item }));
}

function crearCeldaTexto(valor) {
  const td = document.createElement('td');
  td.textContent = valor !== undefined && valor !== null && valor !== '' ? String(valor) : '-';
  return td;
}

function mostrarMensajePanel(texto, tipo = 'exito') {
  const contenedor = document.getElementById('mensaje-panel');
  if (!contenedor) return;

  contenedor.textContent = texto;
  contenedor.className = 'mensaje-estado mensaje-estado--visible';
  contenedor.classList.add(tipo === 'error' ? 'mensaje-estado--error' : 'mensaje-estado--exito');
}

function cambiarPestana(nombreTab) {
  const botones = document.querySelectorAll('.panel-tab');
  const secciones = document.querySelectorAll('.panel-seccion');

  botones.forEach((boton) => {
    const activa = boton.dataset.tab === nombreTab;
    boton.classList.toggle('panel-tab--activa', activa);
  });

  secciones.forEach((seccion) => {
    const activa = seccion.id === `seccion-${nombreTab}`;
    seccion.classList.toggle('panel-seccion--activa', activa);
  });
}

function validarAccesoSecretaria() {
  const textoUsuario = document.getElementById('usuario-actual');
  let usuario = null;

  try {
    usuario = typeof obtenerUsuarioActual === 'function' ? obtenerUsuarioActual() : null;
  } catch (_) {
    usuario = null;
  }

  if (!usuario) {
    if (textoUsuario) {
      textoUsuario.textContent = 'Sesión no iniciada (modo vista previa / simulación local).';
    }
    return true;
  }

  if (usuario.rol && usuario.rol !== APP_CONFIG.ROLES.SECRETARIA) {
    window.location.href = obtenerRutaPorRol(usuario.rol);
    return false;
  }

  if (textoUsuario) {
    const nombre = usuario.nombre_completo || usuario.correo || 'Secretaría';
    textoUsuario.textContent = `Sesión activa: ${nombre} (rol: ${usuario.rol || 'secretaria'})`;
  }
  return true;
}

/**
 * Realiza peticiones fetch hacia el backend Node.js adjuntando token si existe.
 */
async function solicitarApiSecretaria(ruta, opciones = {}) {
  const token =
    typeof AUTH_STORAGE_KEYS !== 'undefined'
      ? localStorage.getItem(AUTH_STORAGE_KEYS.token)
      : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(opciones.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_CONFIG.baseUrl}${ruta}`, {
    ...opciones,
    headers
  });

  let datos = null;
  try {
    datos = await respuesta.json();
  } catch (_) {
    datos = null;
  }

  if (!respuesta.ok) {
    const detalle = datos && (datos.mensaje || datos.error);
    throw new Error(detalle || `Error HTTP ${respuesta.status}`);
  }

  return datos;
}

function normalizarColeccion(respuesta, claveOpcional) {
  if (Array.isArray(respuesta)) return respuesta;
  if (respuesta && claveOpcional && Array.isArray(respuesta[claveOpcional])) {
    return respuesta[claveOpcional];
  }
  if (respuesta && Array.isArray(respuesta.datos)) return respuesta.datos;
  return null;
}

async function cargarDatosSecretaria() {
  const endpoints = API_CONFIG.endpoints;
  const peticiones = [
    solicitarApiSecretaria(endpoints.estudiantes),
    solicitarApiSecretaria(endpoints.secciones),
    solicitarApiSecretaria(endpoints.inscripciones),
    solicitarApiSecretaria(endpoints.checklist),
    solicitarApiSecretaria(endpoints.horarios)
  ];

  const resultados = await Promise.allSettled(peticiones);
  const fallidos = resultados.filter((res) => res.status === 'rejected').length;

  estadoSecretaria.estudiantes =
    resultados[0].status === 'fulfilled'
      ? normalizarColeccion(resultados[0].value, 'estudiantes') || clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.estudiantes)
      : clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.estudiantes);

  estadoSecretaria.secciones =
    resultados[1].status === 'fulfilled'
      ? normalizarColeccion(resultados[1].value, 'secciones') || clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.secciones)
      : clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.secciones);

  estadoSecretaria.inscripciones =
    resultados[2].status === 'fulfilled'
      ? normalizarColeccion(resultados[2].value, 'inscripciones') || clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.inscripciones)
      : clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.inscripciones);

  estadoSecretaria.checklists =
    resultados[3].status === 'fulfilled'
      ? normalizarColeccion(resultados[3].value, 'checklists') || clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.checklists)
      : clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.checklists);

  estadoSecretaria.horarios =
    resultados[4].status === 'fulfilled'
      ? normalizarColeccion(resultados[4].value, 'horarios') || clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.horarios)
      : clonarDatosRespaldo(DATOS_RESPALDO_SECRETARIA.horarios);

  estadoSecretaria.modoSimulacion = fallidos > 0;

  renderizarTodoSecretaria();

  if (estadoSecretaria.modoSimulacion) {
    mostrarMensajePanel(
      'El servidor backend aún no responde en todas las rutas. Se muestran datos de simulación local en memoria.',
      'exito'
    );
  }
}

/**
 * Detecta choques por mismo bloque_horario con igual id_docente o igual aula.
 */
function detectarChoqueHorario(horarioObjetivo, listaHorarios, indiceIgnorar = -1) {
  const bloque = String(horarioObjetivo.bloque_horario || '').trim().toLowerCase();
  const aula = String(horarioObjetivo.aula || '').trim().toLowerCase();
  const docente = Number(horarioObjetivo.id_docente);

  for (let i = 0; i < listaHorarios.length; i += 1) {
    if (i === indiceIgnorar) continue;
    const actual = listaHorarios[i];
    const mismoBloque = String(actual.bloque_horario || '').trim().toLowerCase() === bloque;
    if (!mismoBloque) continue;

    if (Number(actual.id_docente) === docente) {
      return `Choque de docente (id_docente ${docente}) en el bloque ${horarioObjetivo.bloque_horario}.`;
    }
    if (String(actual.aula || '').trim().toLowerCase() === aula) {
      return `Choque de aula (${horarioObjetivo.aula}) en el bloque ${horarioObjetivo.bloque_horario}.`;
    }
  }
  return null;
}

function renderizarEstudiantes() {
  const tbody = document.getElementById('tabla-estudiantes');
  if (!tbody) return;
  tbody.innerHTML = '';

  estadoSecretaria.estudiantes.forEach((est) => {
    const tr = document.createElement('tr');
    tr.appendChild(crearCeldaTexto(est.id_estudiante));
    tr.appendChild(crearCeldaTexto(est.nombres));
    tr.appendChild(crearCeldaTexto(est.apellidos));
    tr.appendChild(crearCeldaTexto(est.cedula_escolar));
    tr.appendChild(crearCeldaTexto(est.fecha_nacimiento));
    tbody.appendChild(tr);
  });
}

function renderizarSecciones() {
  const tbody = document.getElementById('tabla-secciones');
  if (!tbody) return;
  tbody.innerHTML = '';

  estadoSecretaria.secciones.forEach((sec) => {
    const tr = document.createElement('tr');
    tr.appendChild(crearCeldaTexto(sec.id_seccion));
    tr.appendChild(crearCeldaTexto(sec.grado));
    tr.appendChild(crearCeldaTexto(sec.letra_seccion));
    tr.appendChild(crearCeldaTexto(sec.periodo_escolar));
    tr.appendChild(crearCeldaTexto(sec.id_docente));
    tbody.appendChild(tr);
  });
}

function renderizarHorarios() {
  const tbody = document.getElementById('tabla-horarios');
  if (!tbody) return;
  tbody.innerHTML = '';

  estadoSecretaria.horarios.forEach((hor, idx) => {
    const tr = document.createElement('tr');
    const choque = detectarChoqueHorario(hor, estadoSecretaria.horarios, idx);

    tr.appendChild(crearCeldaTexto(hor.id_seccion));
    tr.appendChild(crearCeldaTexto(`${hor.grado} "${hor.letra_seccion}"`));
    tr.appendChild(crearCeldaTexto(hor.id_docente));
    tr.appendChild(crearCeldaTexto(hor.bloque_horario));
    tr.appendChild(crearCeldaTexto(hor.aula));

    const tdEstado = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = choque
      ? 'badge-estado badge-estado--alerta'
      : 'badge-estado badge-estado--aprobada';
    badge.textContent = choque ? 'Choque detectado' : 'Sin choques';
    if (choque) badge.title = choque;
    tdEstado.appendChild(badge);
    tr.appendChild(tdEstado);

    tbody.appendChild(tr);
  });
}

function renderizarInscripciones() {
  const tbody = document.getElementById('tabla-inscripciones');
  if (!tbody) return;
  tbody.innerHTML = '';

  estadoSecretaria.inscripciones.forEach((ins) => {
    const tr = document.createElement('tr');
    tr.appendChild(crearCeldaTexto(ins.id_inscripcion));
    tr.appendChild(crearCeldaTexto(ins.fecha_inscripcion));

    const tdEstado = document.createElement('td');
    const badge = document.createElement('span');
    const claseEstado =
      ins.estado === APP_CONFIG.ESTADOS_INSCRIPCION.APROBADA
        ? 'badge-estado--aprobada'
        : 'badge-estado--pendiente';
    badge.className = `badge-estado ${claseEstado}`;
    badge.textContent = ins.estado;
    tdEstado.appendChild(badge);
    tr.appendChild(tdEstado);

    tr.appendChild(crearCeldaTexto(ins.id_estudiante));
    tr.appendChild(crearCeldaTexto(ins.id_seccion));
    tbody.appendChild(tr);
  });
}

function crearCeldaBooleana(cumplido) {
  const td = document.createElement('td');
  const badge = document.createElement('span');
  badge.className = cumplido
    ? 'badge-estado badge-estado--aprobada'
    : 'badge-estado badge-estado--pendiente';
  badge.textContent = cumplido ? 'Entregado' : 'Faltante';
  td.appendChild(badge);
  return td;
}

function renderizarChecklist() {
  const tbody = document.getElementById('tabla-checklist');
  if (!tbody) return;
  tbody.innerHTML = '';

  estadoSecretaria.checklists.forEach((chk) => {
    const tr = document.createElement('tr');
    tr.appendChild(crearCeldaTexto(chk.id_checklist));
    tr.appendChild(crearCeldaTexto(chk.id_inscripcion));
    tr.appendChild(crearCeldaBooleana(Boolean(chk.partida_nacimiento)));
    tr.appendChild(crearCeldaBooleana(Boolean(chk.cedula_representante)));
    tr.appendChild(crearCeldaBooleana(Boolean(chk.cedula_estudiante)));
    tr.appendChild(crearCeldaBooleana(Boolean(chk.fotos)));
    tr.appendChild(crearCeldaBooleana(Boolean(chk.planillas)));
    tbody.appendChild(tr);
  });
}

function actualizarSelectoresPanel() {
  const selectEst = document.getElementById('inscripcion_id_estudiante');
  const selectSecIns = document.getElementById('inscripcion_id_seccion');
  const selectSecHor = document.getElementById('horario_id_seccion');
  const selectInsChk = document.getElementById('checklist_id_inscripcion');

  if (selectEst) {
    selectEst.innerHTML = '<option value="">Seleccione estudiante...</option>';
    estadoSecretaria.estudiantes.forEach((est) => {
      const opt = document.createElement('option');
      opt.value = est.id_estudiante;
      opt.textContent = `#${est.id_estudiante} — ${est.nombres} ${est.apellidos} (${est.cedula_escolar})`;
      selectEst.appendChild(opt);
    });
  }

  [selectSecIns, selectSecHor].forEach((select) => {
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione sección...</option>';
    estadoSecretaria.secciones.forEach((sec) => {
      const opt = document.createElement('option');
      opt.value = sec.id_seccion;
      opt.textContent = `#${sec.id_seccion} — ${sec.grado} "${sec.letra_seccion}" (${sec.periodo_escolar})`;
      select.appendChild(opt);
    });
  });

  if (selectInsChk) {
    selectInsChk.innerHTML = '<option value="">Seleccione inscripción...</option>';
    estadoSecretaria.inscripciones.forEach((ins) => {
      const opt = document.createElement('option');
      opt.value = ins.id_inscripcion;
      opt.textContent = `Inscripción #${ins.id_inscripcion} (Est. ${ins.id_estudiante} / Sec. ${ins.id_seccion})`;
      selectInsChk.appendChild(opt);
    });
  }
}

function sincronizarDatosSeccionHorario() {
  const selectSec = document.getElementById('horario_id_seccion');
  const inputDocente = document.getElementById('horario_id_docente');
  const inputGrado = document.getElementById('horario_grado');
  const inputLetra = document.getElementById('horario_letra_seccion');
  if (!selectSec) return;

  const seccion = estadoSecretaria.secciones.find(
    (s) => Number(s.id_seccion) === Number(selectSec.value)
  );
  if (!seccion) {
    if (inputGrado) inputGrado.value = '';
    if (inputLetra) inputLetra.value = '';
    return;
  }

  if (inputDocente) inputDocente.value = seccion.id_docente;
  if (inputGrado) inputGrado.value = seccion.grado;
  if (inputLetra) inputLetra.value = seccion.letra_seccion;
}

function precargarChecklistExistente() {
  const selectIns = document.getElementById('checklist_id_inscripcion');
  if (!selectIns) return;

  const existente = estadoSecretaria.checklists.find(
    (c) => Number(c.id_inscripcion) === Number(selectIns.value)
  );

  APP_CONFIG.CHECKLIST_DOCUMENTOS.forEach(({ campo }) => {
    const checkbox = document.getElementById(campo);
    if (checkbox) {
      checkbox.checked = existente ? Boolean(existente[campo]) : false;
    }
  });
}

function renderizarTodoSecretaria() {
  renderizarEstudiantes();
  renderizarSecciones();
  renderizarHorarios();
  renderizarInscripciones();
  renderizarChecklist();
  actualizarSelectoresPanel();
}

function obtenerSiguienteId(lista, claveId) {
  return lista.reduce((max, item) => Math.max(max, Number(item[claveId]) || 0), 0) + 1;
}

async function enviarConRespaldoLocal(ruta, metodo, payload, alExitoLocal) {
  try {
    const respuesta = await solicitarApiSecretaria(ruta, {
      method: metodo,
      body: JSON.stringify(payload)
    });
    alExitoLocal(respuesta, false);
  } catch (error) {
    // Si el backend no está disponible, se guarda en el estado de simulación local
    if (error.name === 'TypeError' || estadoSecretaria.modoSimulacion) {
      alExitoLocal(payload, true);
      return;
    }
    throw error;
  }
}

async function registrarEstudiante(evento) {
  evento.preventDefault();
  const payload = {
    nombres: document.getElementById('nombres').value.trim(),
    apellidos: document.getElementById('apellidos').value.trim(),
    cedula_escolar: document.getElementById('cedula_escolar').value.trim(),
    fecha_nacimiento: document.getElementById('fecha_nacimiento').value
  };

  if (!payload.nombres || !payload.apellidos || !payload.cedula_escolar || !payload.fecha_nacimiento) {
    mostrarMensajePanel('Completa todos los campos obligatorios del estudiante.', 'error');
    return;
  }

  try {
    await enviarConRespaldoLocal(API_CONFIG.endpoints.estudiantes, 'POST', payload, (res, simulado) => {
      const nuevo = res && res.id_estudiante
        ? res
        : {
            id_estudiante: obtenerSiguienteId(estadoSecretaria.estudiantes, 'id_estudiante'),
            ...payload
          };
      estadoSecretaria.estudiantes.push(nuevo);
      renderizarTodoSecretaria();
      evento.target.reset();
      mostrarMensajePanel(
        simulado
          ? 'Estudiante registrado en simulación local (pendiente de backend).'
          : 'Estudiante registrado correctamente.',
        'exito'
      );
    });
  } catch (error) {
    mostrarMensajePanel(error.message, 'error');
  }
}

async function registrarSeccion(evento) {
  evento.preventDefault();
  const payload = {
    grado: document.getElementById('grado').value,
    letra_seccion: document.getElementById('letra_seccion').value.trim().toUpperCase(),
    periodo_escolar: document.getElementById('periodo_escolar').value.trim(),
    id_docente: Number(document.getElementById('id_docente').value)
  };

  if (!payload.grado || !payload.letra_seccion || !payload.periodo_escolar || !payload.id_docente) {
    mostrarMensajePanel('Completa todos los campos de la sección.', 'error');
    return;
  }

  try {
    await enviarConRespaldoLocal(API_CONFIG.endpoints.secciones, 'POST', payload, (res, simulado) => {
      const nueva = res && res.id_seccion
        ? res
        : {
            id_seccion: obtenerSiguienteId(estadoSecretaria.secciones, 'id_seccion'),
            ...payload
          };
      estadoSecretaria.secciones.push(nueva);
      renderizarTodoSecretaria();
      evento.target.reset();
      mostrarMensajePanel(
        simulado
          ? 'Sección creada en simulación local (pendiente de backend).'
          : 'Sección creada correctamente.',
        'exito'
      );
    });
  } catch (error) {
    mostrarMensajePanel(error.message, 'error');
  }
}

async function registrarHorarioAula(evento) {
  evento.preventDefault();
  const payload = {
    id_seccion: Number(document.getElementById('horario_id_seccion').value),
    id_docente: Number(document.getElementById('horario_id_docente').value),
    grado: document.getElementById('horario_grado').value.trim(),
    letra_seccion: document.getElementById('horario_letra_seccion').value.trim().toUpperCase(),
    bloque_horario: document.getElementById('bloque_horario').value.trim(),
    aula: document.getElementById('aula').value.trim()
  };

  if (!payload.id_seccion || !payload.id_docente || !payload.grado || !payload.letra_seccion || !payload.bloque_horario || !payload.aula) {
    mostrarMensajePanel('Completa todos los campos del horario y aula.', 'error');
    return;
  }

  const choque = detectarChoqueHorario(payload, estadoSecretaria.horarios);
  if (choque) {
    mostrarMensajePanel(choque, 'error');
    return;
  }

  try {
    await enviarConRespaldoLocal(API_CONFIG.endpoints.horarios, 'POST', payload, (res, simulado) => {
      const nuevo = res && res.id_seccion ? res : payload;
      estadoSecretaria.horarios.push(nuevo);
      renderizarHorarios();
      evento.target.reset();
      mostrarMensajePanel(
        simulado
          ? 'Horario asignado sin choques en simulación local.'
          : 'Horario y aula asignados correctamente.',
        'exito'
      );
    });
  } catch (error) {
    mostrarMensajePanel(error.message, 'error');
  }
}

async function registrarInscripcion(evento) {
  evento.preventDefault();
  const payload = {
    id_estudiante: Number(document.getElementById('inscripcion_id_estudiante').value),
    id_seccion: Number(document.getElementById('inscripcion_id_seccion').value),
    fecha_inscripcion: document.getElementById('fecha_inscripcion').value,
    estado: document.getElementById('estado').value
  };

  if (!payload.id_estudiante || !payload.id_seccion || !payload.fecha_inscripcion || !payload.estado) {
    mostrarMensajePanel('Selecciona estudiante, sección, fecha y estado de inscripción.', 'error');
    return;
  }

  try {
    await enviarConRespaldoLocal(API_CONFIG.endpoints.inscripciones, 'POST', payload, (res, simulado) => {
      const nueva = res && res.id_inscripcion
        ? res
        : {
            id_inscripcion: obtenerSiguienteId(estadoSecretaria.inscripciones, 'id_inscripcion'),
            ...payload
          };
      estadoSecretaria.inscripciones.push(nueva);
      renderizarTodoSecretaria();
      evento.target.reset();
      mostrarMensajePanel(
        simulado
          ? 'Inscripción registrada en simulación local (pendiente de backend).'
          : 'Inscripción registrada correctamente.',
        'exito'
      );
    });
  } catch (error) {
    mostrarMensajePanel(error.message, 'error');
  }
}

async function guardarChecklistDocumento(evento) {
  evento.preventDefault();
  const idInscripcion = Number(document.getElementById('checklist_id_inscripcion').value);
  if (!idInscripcion) {
    mostrarMensajePanel('Selecciona una inscripción para actualizar su checklist.', 'error');
    return;
  }

  const payload = {
    id_inscripcion: idInscripcion,
    partida_nacimiento: document.getElementById('partida_nacimiento').checked,
    cedula_representante: document.getElementById('cedula_representante').checked,
    cedula_estudiante: document.getElementById('cedula_estudiante').checked,
    fotos: document.getElementById('fotos').checked,
    planillas: document.getElementById('planillas').checked
  };

  const existente = estadoSecretaria.checklists.find((c) => Number(c.id_inscripcion) === idInscripcion);
  const metodo = existente ? 'PUT' : 'POST';
  const ruta = existente
    ? `${API_CONFIG.endpoints.checklist}/${existente.id_checklist}`
    : API_CONFIG.endpoints.checklist;

  try {
    await enviarConRespaldoLocal(ruta, metodo, payload, (res, simulado) => {
      if (existente) {
        Object.assign(existente, payload, res && res.id_checklist ? { id_checklist: res.id_checklist } : {});
      } else {
        estadoSecretaria.checklists.push({
          id_checklist:
            (res && res.id_checklist) ||
            obtenerSiguienteId(estadoSecretaria.checklists, 'id_checklist'),
          ...payload
        });
      }
      renderizarChecklist();
      mostrarMensajePanel(
        simulado
          ? 'Checklist actualizado en simulación local (pendiente de backend).'
          : 'Checklist de documentos guardado correctamente.',
        'exito'
      );
    });
  } catch (error) {
    mostrarMensajePanel(error.message, 'error');
  }
}

function inicializarPanelSecretaria() {
  if (!validarAccesoSecretaria()) return;

  document.querySelectorAll('.panel-tab').forEach((boton) => {
    boton.addEventListener('click', () => cambiarPestana(boton.dataset.tab));
  });

  const btnCerrar = document.getElementById('btn-cerrar-sesion');
  if (btnCerrar && typeof cerrarSesion === 'function') {
    btnCerrar.addEventListener('click', cerrarSesion);
  }

  const btnRecargar = document.getElementById('btn-recargar-datos');
  if (btnRecargar) {
    btnRecargar.addEventListener('click', cargarDatosSecretaria);
  }

  document.getElementById('form-estudiante')?.addEventListener('submit', registrarEstudiante);
  document.getElementById('form-seccion')?.addEventListener('submit', registrarSeccion);
  document.getElementById('form-horario')?.addEventListener('submit', registrarHorarioAula);
  document.getElementById('form-inscripcion')?.addEventListener('submit', registrarInscripcion);
  document.getElementById('form-checklist')?.addEventListener('submit', guardarChecklistDocumento);

  document
    .getElementById('horario_id_seccion')
    ?.addEventListener('change', sincronizarDatosSeccionHorario);
  document
    .getElementById('checklist_id_inscripcion')
    ?.addEventListener('change', precargarChecklistExistente);

  const inputFecha = document.getElementById('fecha_inscripcion');
  if (inputFecha && !inputFecha.value) {
    inputFecha.value = new Date().toISOString().slice(0, 10);
  }

  cargarDatosSecretaria();
}

document.addEventListener('DOMContentLoaded', inicializarPanelSecretaria);
