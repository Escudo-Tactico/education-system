# Contexto del Proyecto — education-system

## Organización y áreas de trabajo
- Este repositorio corresponde al sistema de **Escuela Maestro Feliciano Rodríguez**.
- **Frontend:** (`frontend/css/`, `frontend/js/`, `frontend/pages/`, `frontend/index.html`), trabajando en la rama `sebas-line`.
- **Base de datos:** (diseño, tablas y esquema de datos).
- **Backend:** (servidor en Node.js, rutas/API y lógica de negocio).
- Cada integrante trabaja en su área y rama correspondiente, integrando avances hacia `main` mediante commits claros y Pull Requests para evitar cruces de archivos.

## Modelo de datos y nombres fijos de variables/campos
Respetar estos nombres exactos en formularios, peticiones, objetos y variables para mantener coherencia entre frontend, backend y base de datos:

- **USUARIO:** `id_usuario`, `nombre_completo`, `cedula`, `correo`, `rol`, `validado`
- **ESTUDIANTE:** `id_estudiante`, `nombres`, `apellidos`, `cedula_escolar`, `fecha_nacimiento`
- **REPRESENTANTE_ESTUDIANTE:** `id_vinculo`, `parentesco`, `id_usuario`, `id_estudiante`
- **SECCION:** `id_seccion`, `grado`, `letra_seccion`, `periodo_escolar`, `id_docente`
- **INSCRIPCION:** `id_inscripcion`, `fecha_inscripcion`, `estado`, `id_estudiante`, `id_seccion`
- **CHECKLIST_DOCUMENTO:** `id_checklist`, `partida_nacimiento`, `cedula_representante`, `cedula_estudiante`, `fotos`, `planillas`, `id_inscripcion`
- **CALIFICACION:** `id_nota`, `lapso`, `asignatura`, `nota`, `id_estudiante`
- **Horarios y aulas:** considerar `id_seccion`, `id_docente`, grado/sección, bloque horario y aula asignada sin generar choques entre docentes o salones.

## Estándares para el desarrollo del frontend
- Mantener la paleta sobria en **azul, blanco y gris** definida en `frontend/css/styles.css`.
- Reutilizar variables, clases CSS y funciones existentes antes de crear nombres nuevos.
- Indicar qué archivos se modifican y qué variables o funciones nuevas o cambiadas se introducen antes de aplicar cambios amplios.
- Escribir código claro, modular y con comentarios breves en español.