# Contexto del Proyecto — education-system

## Organización y áreas de trabajo
- Este repositorio corresponde al sistema de **Escuela Maestro Feliciano Rodríguez**.
- **Frontend:** (`frontend/index.html`, `frontend/css/`, `frontend/js/`, `frontend/pages/`), trabajando en la rama `sebas-line`.
  - `frontend/index.html` es la única página de inicio pública del portal institucional.
- **Base de datos:** Supabase (esquema `public`, diseño, tablas y esquema de datos).
- **Backend:** servidor en Node.js (rutas/API, autenticación y lógica de negocio).
- Cada integrante trabaja en su área y rama correspondiente, integrando avances hacia `main` mediante commits claros y Pull Requests para evitar cruces de archivos.

## Modelo de datos en Supabase (esquema `public`)
Respetar exactamente los nombres y mayúsculas/minúsculas de las tablas y columnas en formularios, peticiones, objetos y variables para mantener coherencia entre frontend, backend y base de datos:

- **Roles:** `Id_Rol`, `Nombre_rol`, `Descripcion`
- **Usuarios:** `id_usuario`, `nombre_usuario`, `correo`, `contraseña`, `id_rol`, `estado`, `fecha_creacion`
- **Docentes:** `id_docente`, `id_usuario`, `cedula`, `nombres`, `apellidos`, `telefono`, `correo`, `direccion`, `estado`
- **Representantes:** `id_representante`, `id_usuario`, `cedula`, `Nombres`, `Apellidos`, `telefono`, `correo`, `direccion`
- **Estudiantes:** `id_estudiante`, `cedula_escolar`, `nombres`, `apellidos`, `fecha_nacimiento`, `sexo`, `direccion`, `estado`
- **Estudiante_representante:** `id_representante_estudiante`, `id_estudiante`, `id_representante`, `parentesco`, `es_principal`

## Entidades pendientes del levantamiento
Mantener preparados los módulos y nombres de campos acordados para su integración en base de datos y backend:

- **Secciones:** `id_seccion`, `grado`, `letra_seccion`, `periodo_escolar`, `id_docente`
- **Inscripciones:** `id_inscripcion`, `fecha_inscripcion`, `estado`, `id_estudiante`, `id_seccion`
- **Checklist_documento:** `id_checklist`, `partida_nacimiento`, `cedula_representante`, `cedula_estudiante`, `fotos`, `planillas`, `id_inscripcion`
- **Calificaciones:** `id_nota`, `lapso`, `asignatura`, `nota`, `id_estudiante`
- **Horarios y aulas:** considerar `id_seccion`, `id_docente`, `grado`, `letra_seccion`, `bloque_horario` y `aula` sin generar choques entre docentes o salones.

## Estándares de seguridad y desarrollo del frontend
- **Seguridad:** nunca incluir `service_role` keys, contraseñas de BD ni credenciales privadas en `frontend/`; en vistas públicas como `Equipo Docente`, exponer solo nombres, apellidos y área/rol institucional (sin cédulas, teléfonos, correos ni direcciones).
- Mantener la paleta sobria en **azul, blanco y gris** definida en `frontend/css/styles.css`.
- Reutilizar variables, clases CSS y funciones existentes antes de crear nombres nuevos.
- Indicar qué archivos se modifican y qué variables o funciones nuevas o cambiadas se introducen antes de aplicar cambios amplios.
- Escribir código claro, modular y con comentarios breves en español.
