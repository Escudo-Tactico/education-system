// portal.js — Carrusel principal y carga pública del Equipo Docente

const INTERVALO_CARRUSEL_MS = 5000;

// URLs gestionadas por Dirección / Superadministrador.
// Mientras estén vacías se muestra el respaldo SVG institucional.
// Ejemplo: url: 'https://dominio.com/foto-del-plantel.jpg'
const IMAGENES_CARRUSEL = [
  {
    url: '',
    alt: 'Fotografía institucional 1 — Escuela Maestro Feliciano Rodríguez',
    titulo: 'Formación Integral en Educación Primaria',
    descripcion: 'Espacios organizados para el aprendizaje activo y el acompañamiento cercano de cada estudiante.'
  },
  {
    url: '',
    alt: 'Fotografía institucional 2 — Actividades académicas',
    titulo: 'Excelencia Pedagógica por Grados y Secciones',
    descripcion: 'Planificación continua orientada al desarrollo académico, lector y ciudadano en cada lapso.'
  },
  {
    url: '',
    alt: 'Fotografía institucional 3 — Equipo docente',
    titulo: 'Compromiso de Nuestro Equipo Docente',
    descripcion: 'Maestros dedicados a guiar el progreso escolar junto a madres, padres y representantes.'
  },
  {
    url: '',
    alt: 'Fotografía institucional 4 — Gestión escolar',
    titulo: 'Gestión Escolar Clara y Articulada',
    descripcion: 'Procesos organizados para inscripciones, control de recaudos, horarios y seguimiento académico.'
  },
  {
    url: '',
    alt: 'Fotografía institucional 5 — Comunidad educativa',
    titulo: 'Escuela «Maestro Feliciano Rodríguez»',
    descripcion: 'Comunidad educativa comprometida con el respeto, la responsabilidad y la calidad formativa.'
  }
];

// Respaldo público: solo nombres, apellidos y área (sin datos privados)
const DOCENTES_RESPALDO_PUBLICO = [
  { id_docente: 1, nombres: 'Carmen Elena', apellidos: 'Mendoza Rivas', area: 'Docente de 1er Grado', estado: 'activo' },
  { id_docente: 2, nombres: 'José Gregorio', apellidos: 'Paredes Silva', area: 'Docente de 2do Grado', estado: 'activo' },
  { id_docente: 3, nombres: 'Marisol', apellidos: 'Quintero Rojas', area: 'Docente de 3er Grado', estado: 'activo' },
  { id_docente: 4, nombres: 'Luis Alberto', apellidos: 'Castillo Peña', area: 'Docente de 4to Grado', estado: 'activo' },
  { id_docente: 5, nombres: 'Andreína', apellidos: 'Morales Suárez', area: 'Docente de 5to Grado', estado: 'activo' },
  { id_docente: 6, nombres: 'Rafael Antonio', apellidos: 'Briceño Gil', area: 'Docente de 6to Grado', estado: 'activo' }
];

let indiceActualCarrusel = 0;
let temporizadorCarrusel = null;

// SVG de respaldo con la paleta institucional cuando no hay URL configurada
function crearImagenRespaldoSvg(titulo) {
  const textoSeguro = String(titulo || 'Escuela Maestro Feliciano Rodríguez')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1e3a5f"/>
        <stop offset="100%" stop-color="#2b5b84"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="400" fill="url(#g)"/>
    <rect x="48" y="48" width="1184" height="304" rx="8" fill="none" stroke="#e8f0f8" stroke-opacity="0.35" stroke-width="2"/>
    <text x="640" y="185" fill="#ffffff" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="bold" text-anchor="middle">${textoSeguro}</text>
    <text x="640" y="230" fill="#e8f0f8" font-family="Arial, Helvetica, sans-serif" font-size="20" text-anchor="middle">Escuela Maestro Feliciano Rodríguez</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function mostrarDiapositiva(nuevoIndice) {
  const slides = document.querySelectorAll('.carrusel__slide');
  const puntos = document.querySelectorAll('.carrusel__punto');
  if (!slides.length) return;

  indiceActualCarrusel = (nuevoIndice + slides.length) % slides.length;

  slides.forEach((slide, idx) => {
    const activa = idx === indiceActualCarrusel;
    slide.classList.toggle('carrusel__slide--activa', activa);
    slide.setAttribute('aria-hidden', activa ? 'false' : 'true');
  });

  puntos.forEach((punto, idx) => {
    const activo = idx === indiceActualCarrusel;
    punto.classList.toggle('carrusel__punto--activo', activo);
    punto.setAttribute('aria-current', activo ? 'true' : 'false');
  });
}

function siguienteDiapositiva() {
  mostrarDiapositiva(indiceActualCarrusel + 1);
}

function anteriorDiapositiva() {
  mostrarDiapositiva(indiceActualCarrusel - 1);
}

function detenerTemporizadorCarrusel() {
  if (temporizadorCarrusel) {
    clearInterval(temporizadorCarrusel);
    temporizadorCarrusel = null;
  }
}

function reiniciarTemporizadorCarrusel() {
  detenerTemporizadorCarrusel();
  if (IMAGENES_CARRUSEL.length > 1) {
    temporizadorCarrusel = setInterval(siguienteDiapositiva, INTERVALO_CARRUSEL_MS);
  }
}

function inicializarCarrusel() {
  const contenedor = document.getElementById('carrusel-principal');
  const pistaSlides = document.getElementById('carrusel-slides');
  const indicadores = document.getElementById('carrusel-indicadores');
  const btnPrev = document.getElementById('carrusel-prev');
  const btnNext = document.getElementById('carrusel-next');

  if (!contenedor || !pistaSlides || !indicadores) return;

  pistaSlides.innerHTML = '';
  indicadores.innerHTML = '';

  IMAGENES_CARRUSEL.forEach((item, idx) => {
    const slide = document.createElement('div');
    slide.className = idx === 0 ? 'carrusel__slide carrusel__slide--activa' : 'carrusel__slide';
    slide.setAttribute('aria-hidden', idx === 0 ? 'false' : 'true');

    const img = document.createElement('img');
    img.className = 'carrusel__imagen';
    img.alt = item.alt;
    img.loading = idx === 0 ? 'eager' : 'lazy';
    img.addEventListener('error', () => {
      if (!img.dataset.respaldoAplicado) {
        img.dataset.respaldoAplicado = 'true';
        img.src = crearImagenRespaldoSvg(item.titulo);
      }
    });

    if (item.url && item.url.trim()) {
      img.src = item.url;
    } else {
      img.src = crearImagenRespaldoSvg(item.titulo);
      img.dataset.respaldoAplicado = 'true';
    }

    const pie = document.createElement('div');
    pie.className = 'carrusel__pie';
    const h2 = document.createElement('h2');
    h2.textContent = item.titulo;
    const p = document.createElement('p');
    p.textContent = item.descripcion;
    pie.appendChild(h2);
    pie.appendChild(p);

    slide.appendChild(img);
    slide.appendChild(pie);
    pistaSlides.appendChild(slide);

    const punto = document.createElement('button');
    punto.type = 'button';
    punto.className = idx === 0 ? 'carrusel__punto carrusel__punto--activo' : 'carrusel__punto';
    punto.setAttribute('aria-label', `Ver imagen ${idx + 1}: ${item.titulo}`);
    punto.setAttribute('aria-current', idx === 0 ? 'true' : 'false');
    punto.addEventListener('click', () => {
      mostrarDiapositiva(idx);
      reiniciarTemporizadorCarrusel();
    });
    indicadores.appendChild(punto);
  });

  btnPrev?.addEventListener('click', () => {
    anteriorDiapositiva();
    reiniciarTemporizadorCarrusel();
  });

  btnNext?.addEventListener('click', () => {
    siguienteDiapositiva();
    reiniciarTemporizadorCarrusel();
  });

  contenedor.addEventListener('mouseenter', detenerTemporizadorCarrusel);
  contenedor.addEventListener('mouseleave', reiniciarTemporizadorCarrusel);
  contenedor.addEventListener('focusin', detenerTemporizadorCarrusel);
  contenedor.addEventListener('focusout', reiniciarTemporizadorCarrusel);

  reiniciarTemporizadorCarrusel();
}

// Filtra solo datos públicos: nombres, apellidos y área (sin cedula, telefono, correo, direccion)
function mapearDocentesPublicos(listaCruda) {
  return listaCruda
    .filter((doc) => !doc.estado || String(doc.estado).toLowerCase() === 'activo')
    .map((doc) => ({
      nombres: doc.nombres || '',
      apellidos: doc.apellidos || '',
      area: doc.area || doc.Nombre_rol || 'Personal Docente'
    }))
    .filter((doc) => doc.nombres || doc.apellidos);
}

function renderizarDocentesPublicos(listaDocentes) {
  const contenedor = document.getElementById('lista-docentes');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  const docentesPublicos = mapearDocentesPublicos(listaDocentes);

  if (!docentesPublicos.length) {
    const aviso = document.createElement('p');
    aviso.className = 'bloque-subtitulo';
    aviso.textContent = 'No hay información pública de docentes disponible en este momento.';
    contenedor.appendChild(aviso);
    return;
  }

  docentesPublicos.forEach((docente) => {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'card';

    const rol = document.createElement('p');
    rol.className = 'card__rol';
    rol.textContent = docente.area;

    const nombre = document.createElement('h3');
    nombre.textContent = `${docente.nombres} ${docente.apellidos}`.trim();

    tarjeta.appendChild(rol);
    tarjeta.appendChild(nombre);
    contenedor.appendChild(tarjeta);
  });
}

// Consulta GET /docentes; si falla usa DOCENTES_RESPALDO_PUBLICO
async function cargarEquipoDocentePublico() {
  if (typeof API_CONFIG === 'undefined' || !API_CONFIG.baseUrl) {
    renderizarDocentesPublicos(DOCENTES_RESPALDO_PUBLICO);
    return;
  }

  try {
    const rutaDocentes = (API_CONFIG.endpoints && API_CONFIG.endpoints.docentes) || '/docentes';
    const respuesta = await fetch(`${API_CONFIG.baseUrl}${rutaDocentes}`);
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const cuerpo = await respuesta.json();
    const lista = Array.isArray(cuerpo)
      ? cuerpo
      : (cuerpo && (cuerpo.docentes || cuerpo.datos)) || [];

    renderizarDocentesPublicos(lista.length ? lista : DOCENTES_RESPALDO_PUBLICO);
  } catch (_) {
    renderizarDocentesPublicos(DOCENTES_RESPALDO_PUBLICO);
  }
}

function inicializarPortal() {
  inicializarCarrusel();
  cargarEquipoDocentePublico();
}

document.addEventListener('DOMContentLoaded', inicializarPortal);
