// config.js — Configuración central del frontend

const APP_CONFIG = Object.freeze({
  INSTITUCION: Object.freeze({
    nombre: 'Escuela Maestro Feliciano Rodríguez',
    subtitulo: 'Portal Institucional y Gestión Escolar'
  }),

  // Ajustar según entorno local o despliegue
  API_BASE_URL: 'http://localhost:3000/api',

  STORAGE_KEYS: Object.freeze({
    TOKEN: 'emfr_token',
    USUARIO: 'emfr_usuario'
  }),

  ROLES: Object.freeze({
    DIRECCION: 'direccion',
    SECRETARIA: 'secretaria',
    DOCENTE: 'docente',
    REPRESENTANTE: 'representante'
  }),

  ESTADOS_INSCRIPCION: Object.freeze({
    PENDIENTE: 'pendiente',
    EN_REVISION: 'en_revision',
    APROBADA: 'aprobada',
    RECHAZADA: 'rechazada'
  }),

  CHECKLIST_DOCUMENTOS: Object.freeze([
    { campo: 'partida_nacimiento', etiqueta: 'Partida de nacimiento' },
    { campo: 'cedula_representante', etiqueta: 'Cédula del representante' },
    { campo: 'cedula_estudiante', etiqueta: 'Cédula o cédula escolar del estudiante' },
    { campo: 'fotos', etiqueta: 'Fotos tipo carnet' },
    { campo: 'planillas', etiqueta: 'Planillas de inscripción' }
  ]),

  // Tablas y columnas exactas de Supabase + entidades pendientes (ver PROJECT_CONTEXT.md)
  CAMPOS_MODELO: Object.freeze({
    Roles: Object.freeze(['Id_Rol', 'Nombre_rol', 'Descripcion']),
    Usuarios: Object.freeze([
      'id_usuario', 'nombre_usuario', 'correo', 'contraseña',
      'id_rol', 'estado', 'fecha_creacion'
    ]),
    Docentes: Object.freeze([
      'id_docente', 'id_usuario', 'cedula', 'nombres', 'apellidos',
      'telefono', 'correo', 'direccion', 'estado'
    ]),
    Representantes: Object.freeze([
      'id_representante', 'id_usuario', 'cedula',
      'Nombres', 'Apellidos', // mayúsculas tal cual en Supabase
      'telefono', 'correo', 'direccion'
    ]),
    Estudiantes: Object.freeze([
      'id_estudiante', 'cedula_escolar', 'nombres', 'apellidos',
      'fecha_nacimiento', 'sexo', 'direccion', 'estado'
    ]),
    Estudiante_representante: Object.freeze([
      'id_representante_estudiante', 'id_estudiante',
      'id_representante', 'parentesco', 'es_principal'
    ]),
    // Pendientes de levantamiento en BD
    Secciones: Object.freeze([
      'id_seccion', 'grado', 'letra_seccion', 'periodo_escolar', 'id_docente'
    ]),
    Inscripciones: Object.freeze([
      'id_inscripcion', 'fecha_inscripcion', 'estado', 'id_estudiante', 'id_seccion'
    ]),
    Checklist_documento: Object.freeze([
      'id_checklist', 'partida_nacimiento', 'cedula_representante',
      'cedula_estudiante', 'fotos', 'planillas', 'id_inscripcion'
    ]),
    Calificaciones: Object.freeze([
      'id_nota', 'lapso', 'asignatura', 'nota', 'id_estudiante'
    ]),
    Horarios_aulas: Object.freeze([
      'id_seccion', 'id_docente', 'grado', 'letra_seccion', 'bloque_horario', 'aula'
    ])
  })
});

const API_CONFIG = Object.freeze({
  baseUrl: APP_CONFIG.API_BASE_URL,
  endpoints: Object.freeze({
    login: '/auth/login',
    usuarios: '/usuarios',
    docentes: '/docentes',
    representantes: '/representantes',
    estudiantes: '/estudiantes',
    secciones: '/secciones',
    inscripciones: '/inscripciones',
    checklist: '/checklist',
    horarios: '/horarios'
  })
});

// Construye URL completa evitando barras duplicadas
function construirUrlApi(ruta = '') {
  const base = APP_CONFIG.API_BASE_URL.replace(/\/+$/, '');
  const segmento = String(ruta).replace(/^\/+/, '');
  return segmento ? `${base}/${segmento}` : base;
}

if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
  window.API_CONFIG = API_CONFIG;
  window.construirUrlApi = construirUrlApi;
}
