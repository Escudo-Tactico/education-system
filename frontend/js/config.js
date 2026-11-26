const APP_CONFIG = Object.freeze({
  // Datos institucionales mostrados en el portal
  INSTITUCION: Object.freeze({
    nombre: 'Escuela Maestro Feliciano Rodríguez',
    subtitulo: 'Portal Institucional y Gestión Escolar'
  }),

  // URL base del servidor backend (Node.js). Ajustar según entorno local o despliegue.
  API_BASE_URL: 'http://localhost:3000/api',

  // Claves de almacenamiento local del navegador para sesión del frontend
  STORAGE_KEYS: Object.freeze({
    TOKEN: 'emfr_token',
    USUARIO: 'emfr_usuario'
  }),

  // Roles contemplados en el sistema escolar
  ROLES: Object.freeze({
    DIRECCION: 'direccion',
    SECRETARIA: 'secretaria',
    DOCENTE: 'docente',
    REPRESENTANTE: 'representante'
  }),

  // Estados base para el flujo de inscripción (INSCRIPCION.estado)
  ESTADOS_INSCRIPCION: Object.freeze({
    PENDIENTE: 'pendiente',
    EN_REVISION: 'en_revision',
    APROBADA: 'aprobada',
    RECHAZADA: 'rechazada'
  }),

  // Requisitos del checklist de documentos (claves exactas de CHECKLIST_DOCUMENTO)
  CHECKLIST_DOCUMENTOS: Object.freeze([
    { campo: 'partida_nacimiento', etiqueta: 'Partida de nacimiento' },
    { campo: 'cedula_representante', etiqueta: 'Cédula del representante' },
    { campo: 'cedula_estudiante', etiqueta: 'Cédula o cédula escolar del estudiante' },
    { campo: 'fotos', etiqueta: 'Fotos tipo carnet' },
    { campo: 'planillas', etiqueta: 'Planillas de inscripción' }
  ]),

  // Nombres fijos de variables/campos según PROJECT_CONTEXT.md
  CAMPOS_MODELO: Object.freeze({
    USUARIO: Object.freeze([
      'id_usuario',
      'nombre_completo',
      'cedula',
      'correo',
      'rol',
      'validado'
    ]),
    ESTUDIANTE: Object.freeze([
      'id_estudiante',
      'nombres',
      'apellidos',
      'cedula_escolar',
      'fecha_nacimiento'
    ]),
    REPRESENTANTE_ESTUDIANTE: Object.freeze([
      'id_vinculo',
      'parentesco',
      'id_usuario',
      'id_estudiante'
    ]),
    SECCION: Object.freeze([
      'id_seccion',
      'grado',
      'letra_seccion',
      'periodo_escolar',
      'id_docente'
    ]),
    INSCRIPCION: Object.freeze([
      'id_inscripcion',
      'fecha_inscripcion',
      'estado',
      'id_estudiante',
      'id_seccion'
    ]),
    CHECKLIST_DOCUMENTO: Object.freeze([
      'id_checklist',
      'partida_nacimiento',
      'cedula_representante',
      'cedula_estudiante',
      'fotos',
      'planillas',
      'id_inscripcion'
    ]),
    CALIFICACION: Object.freeze([
      'id_nota',
      'lapso',
      'asignatura',
      'nota',
      'id_estudiante'
    ]),
    HORARIO_AULA: Object.freeze([
      'id_seccion',
      'id_docente',
      'grado',
      'letra_seccion',
      'bloque_horario',
      'aula'
    ])
  })
});

// Configuración de endpoints de la API reutilizando la URL base central
const API_CONFIG = Object.freeze({
  baseUrl: APP_CONFIG.API_BASE_URL,
  endpoints: Object.freeze({
    login: '/auth/login',
    usuarios: '/usuarios',
    estudiantes: '/estudiantes',
    secciones: '/secciones',
    inscripciones: '/inscripciones',
    checklist: '/checklist',
    horarios: '/horarios'
  })
});

/**
 * Construye una URL completa hacia el backend evitando barras duplicadas.
 * @param {string} ruta - Ruta relativa del recurso (ej. '/usuarios' o 'usuarios').
 * @returns {string} URL completa para peticiones fetch.
 */
function construirUrlApi(ruta = '') {
  const base = APP_CONFIG.API_BASE_URL.replace(/\/+$/, '');
  const segmento = String(ruta).replace(/^\/+/, '');
  return segmento ? `${base}/${segmento}` : base;
}

// Exposición explícita en el ámbito global para scripts clásicos sin bundler
if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
  window.API_CONFIG = API_CONFIG;
  window.construirUrlApi = construirUrlApi;
}
