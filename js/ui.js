// ─────────────────────────────────────────────
//  ESCUELA DE PÁDEL — UI helpers compartidos
// ─────────────────────────────────────────────

// ── Navegación ────────────────────────────────

/**
 * Renderiza el menú de navegación en el elemento #nav-container.
 * @param {string} moduloActivo  id del módulo actual (ej: 'alumnos')
 */
function renderNav(moduloActivo) {
  const el = document.getElementById('nav-container');
  if (!el) return;

  // Si el usuario tocó una pestaña manualmente (_navForzado), esa tiene prioridad
  // Si no, usar la carpeta que contiene el módulo activo
  // Si el módulo no está en ninguna carpeta, usar sessionStorage
  let idxAbierto;
  if (typeof _navForzado === 'number') {
    idxAbierto = _navForzado;
    _navForzado = null;
  } else {
    const idxModulo = NAV_CARPETAS.findIndex(c => c.modulos.some(m => m.id === moduloActivo));
    if (idxModulo >= 0) {
      idxAbierto = idxModulo;
      sessionStorage.setItem('nav_carpeta', idxAbierto);
    } else {
      idxAbierto = +(sessionStorage.getItem('nav_carpeta') || 0);
    }
  }

  const COLORES = {
    gris:    { soft:'#f8fafc', borde:'#e2e8f0', color:'#64748b' },
    azul:    { soft:'#eff6ff', borde:'#bfdbfe', color:'#2563eb' },
    verde:   { soft:'#f0fdf4', borde:'#bbf7d0', color:'#16a34a' },
    naranja: { soft:'#fffbeb', borde:'#fde68a', color:'#f59e0b' },
  };

  // Carpeta activa
  const cActiva = NAV_CARPETAS[idxAbierto];
  const colActiva = COLORES[cActiva.color];

  // Panel: grid-columns según num módulos
  const cols = cActiva.modulos.length === 1 ? 1
             : cActiva.modulos.length <= 3  ? cActiva.modulos.length
             : 4;

  // Posición: si es la primera pestaña, esquina sup-izq del panel es plana
  const panelRadius = idxAbierto === 0
    ? '0 12px 12px 12px'
    : idxAbierto === NAV_CARPETAS.length - 1
      ? '12px 0 12px 12px'
      : '12px';

  el.innerHTML = `
    <div class="nav-wrap">
      <div class="nav-tabs-row">
        ${NAV_CARPETAS.map((c, i) => {
          const activa = i === idxAbierto;
          const col = COLORES[c.color];
          return `<button class="nav-tab${activa ? ' nav-tab-active' : ''}"
            style="border-left-color:${col.color};${activa ? `background:${col.soft};border-top-color:${col.borde};border-right-color:${col.borde};` : ''}text-align:left;width:100%;font-family:Nunito,sans-serif;"
            onclick="navSelTab(${i})">
            <div class="nav-tab-title" style="${activa ? `color:${col.color}` : ''}">${c.label}</div>
            ${c.sub ? `<div class="nav-tab-sub">${c.sub}</div>` : ''}
          </button>`;
        }).join('')}
      </div>
      <div class="nav-panel-wrap" style="border-color:${colActiva.borde};background:${colActiva.soft};border-radius:${panelRadius}">
        <div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px">
          ${cActiva.modulos.map(m => `
            <a class="nav-item${m.id === moduloActivo ? ' active' : ''}" href="${m.href}">
              <div class="nav-icon"><img src="${m.icon}" alt="${m.label}"></div>
              <div class="nav-label">${m.label}</div>
            </a>`).join('')}
        </div>
      </div>
    </div>`;

  el._moduloActivo = moduloActivo;
}

let _navForzado = null;
function navSelTab(idx) {
  sessionStorage.setItem('nav_carpeta', idx);
  _navForzado = idx;
  const el = document.getElementById('nav-container');
  if (!el) return;
  renderNav(el._moduloActivo || '');
}


// ── Header ────────────────────────────────────

/**
 * Renderiza el header estándar.
 * @param {object} opts  { titulo, subtitulo, icono, botonDerecho }
 *   botonDerecho: 'menu' | 'config' | 'back' | null
 *   onConfig: función a llamar al pulsar ⚙
 *   onBack: href destino del botón ←
 */
function renderHeader({ titulo = 'Escuela de Pádel', subtitulo = '', icono = 'icons/inicio.png',
                         botonDerecho = 'menu', onConfig = null, onBack = null } = {}) {
  const el = document.getElementById('header-container');
  if (!el) return;
  // Usar logo guardado si existe (desde cualquier módulo)
  const escuelaId = typeof Store !== 'undefined' ? Store.escuelaId : null;
  const logoGuardado = escuelaId ? localStorage.getItem('escuela_logo_' + escuelaId) : null;
  if (logoGuardado) icono = logoGuardado;
  // Usar nombre guardado si no se pasa uno específico
  const nombreGuardado = escuelaId ? localStorage.getItem('escuela_nombre_' + escuelaId) : null;
  if (nombreGuardado && titulo === 'Escuela de Pádel') titulo = nombreGuardado;

  let boton = '';
  if (botonDerecho === 'config') {
    boton = `<button class="btn-icon" onclick="(${onConfig})()" title="Configuración" style="background:#eff6ff;border:2px solid #bfdbfe;color:#2563eb;font-size:18px;width:40px;height:40px;border-radius:12px">⚙</button>`;
  } else if (botonDerecho === 'back') {
    boton = `<a class="btn-icon" href="${onBack}" style="background:#eff6ff;border:2px solid #bfdbfe;color:#2563eb;font-size:20px;font-weight:900;width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;text-decoration:none">←</a>`;
  } else if (botonDerecho === 'menu') {
    boton = `<button class="btn-icon" id="btn-menu-3puntos" onclick="UI.menuUsuario(this)">⋮</button>`;
  }

  el.innerHTML = `
    <div class="header">
      <div class="hlogo"><img src="${icono}" alt="${titulo}"></div>
      <div class="htext">
        <div class="htitle">${titulo}</div>
        ${subtitulo ? `<div class="hsub">${subtitulo}</div>` : ''}
      </div>
      ${boton}
    </div>
    <div class="sep"></div>`;
}

// ── Filtros ───────────────────────────────────

/**
 * Activa el botón de filtro pulsado y desactiva los hermanos.
 * Llama a onChange(valor) con el value del botón.
 */
function initFiltros(containerSelector, onChange) {
  const btns = document.querySelectorAll(`${containerSelector} .fbtn`);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (onChange) onChange(btn.dataset.value || '');
    });
  });
}

// ── Diálogo: asignar genérico a nivel nuevo ─────
function mostrarDialogoGenerico(nivelNuevo, onConfirm) {
  const existing = document.getElementById('_dialogo-generico');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = '_dialogo-generico';
  div.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,.5);z-index:600;display:flex;align-items:center;justify-content:center;padding:24px';
  const btns = NIVELES_GENERICOS.map(g => {
    const col = _COLOR_GENERICOS[g];
    return `<button onclick="window._cg('${g}')"
      style="padding:11px 14px;border-radius:12px;border:2px solid ${col.tx};background:${col.bg};color:${col.tx};font-size:13px;font-weight:800;cursor:pointer;font-family:inherit;text-align:left;width:100%">
      ${g}</button>`;
  }).join('');
  div.innerHTML = `
    <div style="background:#fff;border-radius:18px;padding:22px 18px;width:100%;max-width:340px;box-shadow:0 12px 40px rgba(0,0,0,.2)">
      <div style="font-size:15px;font-weight:900;color:#1e293b;margin-bottom:6px">Nuevo nivel: <em>${nivelNuevo}</em></div>
      <div style="font-size:12px;font-weight:600;color:#64748b;margin-bottom:16px;line-height:1.5">
        ¿A qué nivel genérico corresponde? Permite agrupar en filtros y estadísticas.</div>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">${btns}</div>
      <button onclick="window._cg('')"
        style="width:100%;padding:10px;border-radius:12px;border:1.5px solid #e2e8f0;background:#f8fafc;color:#64748b;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">
        Sin agrupar</button>
    </div>`;
  document.body.appendChild(div);
  window._cg = (gen) => { div.remove(); delete window._cg; onConfirm(gen); };
}

// ── Bottom Sheets ─────────────────────────────

function openSheet(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // Cerrar cualquier nsel-drop abierto
  document.querySelectorAll('.nsel-drop').forEach(d => {
    d.style.display = 'none';
    const arrow = document.getElementById(d.id.replace('-nsel-drop','-nsel-arrow'));
    if (arrow) arrow.style.transform = '';
  });
  el.classList.add('open');
  document.body.style.overflow = 'hidden';
  history.pushState({ sheet: id }, '');
}

function closeSheet(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  // Restaurar scroll
  const anyOpen = document.querySelector('.overlay.open');
  if (!anyOpen) document.body.style.overflow = '';
}

// Botón atrás del móvil: cerrar sheet en lugar de navegar
window.addEventListener('popstate', e => {
  const open = document.querySelector('.overlay.open');
  if (open) {
    open.classList.remove('open');
    document.body.style.overflow = '';
    // Reanclar para seguir interceptando futuros "atrás"
    history.pushState({ sheet: null }, '');
  } else if (e.state && e.state.page) {
    // Estamos en una página anclada: reanclar para no salir
    history.pushState(e.state, '');
  }
});

// Cerrar sheet al pulsar el overlay
document.addEventListener('click', e => {
  if (e.target.classList.contains('overlay')) {
    e.target.classList.remove('open');
    const anyOpen = document.querySelector('.overlay.open');
    if (!anyOpen) document.body.style.overflow = '';
  }
});

// ── Cards expandibles ─────────────────────────

function toggleCard(id) {
  const exp = document.getElementById('exp-' + id);
  const chev = document.getElementById('chev-' + id);
  const card = document.getElementById('card-' + id);
  if (!exp) return;
  const abierta = exp.classList.toggle('open');
  if (chev) chev.classList.toggle('open', abierta);
  if (card) card.classList.toggle('card-open', abierta);
}

// ── Toast ─────────────────────────────────────

function toast(msg, tipo = 'ok') {
  const t = document.createElement('div');
  t.className = `toast toast-${tipo}`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => {
    t.classList.remove('visible');
    setTimeout(() => t.remove(), 300);
  }, 2800);
}

// ── Loading ───────────────────────────────────

function showLoading(containerId) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
}

function showEmpty(containerId, msg = 'Sin datos aún') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty-state">${msg}</div>`;
}

function showError(containerId, msg = 'Error al cargar') {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="empty-state error">${msg}</div>`;
}

// ── Avatares ──────────────────────────────────

const COLORES_AV = ['#2563eb','#16a34a','#f59e0b','#e05a5a','#7c3aed','#0891b2','#be185d','#b45309'];

function iniciales(nombre = '') {
  const partes = nombre.trim().split(' ');
  if (partes.length >= 2) return (partes[0][0] + partes[1][0]).toUpperCase();
  return nombre.slice(0, 2).toUpperCase();
}

function colorAvatar(nombre = '') {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  return COLORES_AV[Math.abs(hash) % COLORES_AV.length];
}

function avatarHTML(nombre, claseExtra = '') {
  return `<div class="av ${claseExtra}" style="background:${colorAvatar(nombre)}">${iniciales(nombre)}</div>`;
}

// ── Chips de nivel ────────────────────────────

// ── Paleta de chips ───────────────────────────
// 12 pares fondo/texto — se asignan por posición en lista o hash del string
// ── Mapa de niveles personalizados → genérico ──────────
// { "Iniciación 1": "Principiante", "Perfeccionamiento": "Avanzado", ... }
let _nivelesMapa = {};
const NIVELES_GENERICOS = ['Principiante', 'Intermedio', 'Avanzado'];

function nivelGenerico(nivel) {
  if (!nivel) return '';
  if (NIVELES_GENERICOS.includes(nivel)) return nivel;
  return _nivelesMapa[nivel] || '';
}

// Colores fijos para los 3 genéricos
const _COLOR_GENERICOS = {
  'Principiante': { bg:'#dcfce7', tx:'#15803d' },
  'Intermedio':   { bg:'#dbeafe', tx:'#1e40af' },
  'Avanzado':     { bg:'#f3e8ff', tx:'#7c3aed' },
};

const _CHIP_PALETA = [
  { bg:'#dbeafe', tx:'#1e40af' }, // azul
  { bg:'#dcfce7', tx:'#15803d' }, // verde
  { bg:'#ffedd5', tx:'#c2410c' }, // naranja
  { bg:'#f3e8ff', tx:'#7c3aed' }, // morado
  { bg:'#fce7f3', tx:'#be185d' }, // rosa
  { bg:'#ccfbf1', tx:'#0f766e' }, // teal
  { bg:'#fef9c3', tx:'#92400e' }, // amarillo
  { bg:'#e0e7ff', tx:'#3730a3' }, // índigo
  { bg:'#fee2e2', tx:'#b91c1c' }, // rojo suave
  { bg:'#d1fae5', tx:'#065f46' }, // esmeralda
  { bg:'#fdf4ff', tx:'#86198f' }, // fucsia
  { bg:'#e0f2fe', tx:'#0369a1' }, // celeste
];

// _chipListas: registro de listas conocidas para asignar color por posición
const _chipListas = {};

function chipRegistrarLista(clave, lista) {
  _chipListas[clave] = lista;
}

function chipColor(valor, clave) {
  if (!valor) return _CHIP_PALETA[0];
  // Si hay lista registrada para esta clave, usar posición
  if (clave && _chipListas[clave]) {
    const idx = _chipListas[clave].indexOf(valor);
    if (idx >= 0) return _CHIP_PALETA[idx % _CHIP_PALETA.length];
  }
  // Fallback: hash del string
  let h = 0;
  for (let i = 0; i < valor.length; i++) h = valor.charCodeAt(i) + ((h << 5) - h);
  return _CHIP_PALETA[Math.abs(h) % _CHIP_PALETA.length];
}

// Devuelve el color de borde izquierdo para una card según valor/clave
function cardBorderColor(valor, clave) {
  return chipColor(valor, clave).tx;
}

function chipNivel(nivel) {
  if (!nivel) return '';
  const gen = nivelGenerico(nivel);
  const c = gen ? (_COLOR_GENERICOS[gen] || chipColor(nivel,'niveles')) : chipColor(nivel,'niveles');
  const tooltip = gen && gen !== nivel ? ` title="${gen}"` : '';
  const badge = gen && gen !== nivel
    ? `<span style="font-size:9px;opacity:.75;margin-left:3px">(${gen.slice(0,3).toLowerCase()}.)</span>`
    : '';
  return `<span class="chip" style="background:${c.bg};color:${c.tx}"${tooltip}>${nivel}${badge}</span>`;
}

function chipPista(pista) {
  if (!pista) return '';
  const c = chipColor(pista, 'pistas');
  return `<span class="chip" style="background:${c.bg};color:${c.tx}">${pista}</span>`;
}

function chipMonitor(monitor) {
  if (!monitor) return '';
  const c = chipColor(monitor, 'monitores');
  return `<span class="chip" style="background:${c.bg};color:${c.tx}">👤 ${monitor}</span>`;
}

// ── Formato de fecha ──────────────────────────

function formatFecha(isoStr) {
  if (!isoStr) return '';
  const d = new Date(isoStr);
  const dias = ['dom','lun','mar','mié','jue','vie','sáb'];
  const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  return `${dias[d.getDay()]}, ${d.getDate()} ${meses[d.getMonth()]}`;
}

function formatAnio(isoStr) {
  if (!isoStr) return '';
  return new Date(isoStr).getFullYear();
}

// ── Confirmación ──────────────────────────────

function confirmar(mensaje, onOk) {
  const overlay = document.getElementById('confirm-overlay');
  const texto   = document.getElementById('confirm-texto');
  const btnOk   = document.getElementById('confirm-ok');
  if (!overlay) return;
  texto.textContent = mensaje;
  overlay.classList.add('open');
  btnOk.onclick = () => { overlay.classList.remove('open'); onOk(); };
}

// ── UI namespace (para llamar desde HTML inline) ──
const UI = {
  openSheet,
  closeSheet,
  toggleCard,
  toast,
  confirmar,
  menuUsuario: (btnEl) => {
    // Cerrar si ya está abierto
    const existing = document.getElementById('menu-dropdown');
    if (existing) { existing.remove(); return; }

    // Crear dropdown compacto
    const dd = document.createElement('div');
    dd.id = 'menu-dropdown';

    // Posicionar bajo el botón ⋮
    const rect = btnEl ? btnEl.getBoundingClientRect() : { right: window.innerWidth - 8, top: 48 };
    const rightOffset = window.innerWidth - rect.right;

    dd.innerHTML = `
      <style>
        #menu-dropdown {
          position:fixed; top:${rect.bottom + 6}px; right:${rightOffset}px;
          background:#fff; border-radius:14px; padding:6px;
          box-shadow:0 8px 32px rgba(15,23,42,.18), 0 2px 8px rgba(15,23,42,.08);
          z-index:500; min-width:200px; border:1px solid #e2e8f0;
          animation: ddIn .15s ease;
        }
        @keyframes ddIn { from { opacity:0; transform:translateY(-6px) scale(.97); } to { opacity:1; transform:none; } }
        .dd-item { display:flex;align-items:center;gap:9px;padding:10px 10px;border-radius:9px;cursor:pointer;transition:background .1s; }
        .dd-item:hover { background:#f1f5f9; }
        .dd-ico { width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0; }
        .dd-lbl { font-size:13px;font-weight:800;color:#1e293b; }
        .dd-sep { height:1px;background:#f1f5f9;margin:3px 0; }
        .dd-item.danger .dd-lbl { color:#e05a5a; }
        .dd-item.disabled { opacity:.45;pointer-events:none; }
      </style>
      <div class="dd-item" onclick="UI._abrirAcercaDe()">
        <div class="dd-ico" style="background:#eff6ff">ℹ️</div>
        <div class="dd-lbl">Acerca de</div>
      </div>
      <div class="dd-item" onclick="UI._abrirConfig()">
        <div class="dd-ico" style="background:#eff6ff">⚙️</div>
        <div class="dd-lbl">Configurar escuela</div>
      </div>
      <div class="dd-item" onclick="UI._abrirGenerarCobros()">
        <div class="dd-ico" style="background:#f0fdf4">⚡</div>
        <div class="dd-lbl">Generar cobros del mes</div>
      </div>
      <div class="dd-item dd-item disabled" onclick="">
        <div class="dd-ico" style="background:#f0fdf4">📖</div>
        <div class="dd-lbl" style="color:#94a3b8">Tutorial <span style="font-size:10px;font-weight:700;color:#94a3b8">(próximamente)</span></div>
      </div>
      <div class="dd-sep"></div>
      <div class="dd-item danger" onclick="UI._cerrarSesion()">
        <div class="dd-ico" style="background:#fee2e2">🚪</div>
        <div class="dd-lbl">Cerrar sesión</div>
      </div>`;

    document.body.appendChild(dd);

    // Cerrar al clicar fuera
    setTimeout(() => {
      document.addEventListener('click', function cerrar(e) {
        if (!dd.contains(e.target)) { dd.remove(); document.removeEventListener('click', cerrar); }
      });
    }, 50);
  },

  _abrirConfig: () => {
    const existing = document.getElementById('menu-dropdown');
    if (existing) existing.remove();
    // Crear sheet de configuración
    if (!document.getElementById('cfg-overlay')) {
      const el = document.createElement('div');
      el.id = 'cfg-overlay';
      el.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:400;display:flex;align-items:flex-end';
      el.innerHTML = `
        <style>
          #cfg-sheet { background:#fff;border-radius:20px 20px 0 0;padding:16px 15px 32px;width:100%;max-width:480px;margin:0 auto }
          #cfg-sheet .csh { display:flex;align-items:center;gap:9px;margin-bottom:14px }
          #cfg-sheet .cst { font-size:15px;font-weight:900;color:#1e293b;flex:1 }
          #cfg-sheet .csc { width:28px;height:28px;background:#f1f5f9;border:none;border-radius:7px;font-size:14px;font-weight:900;color:#64748b;cursor:pointer }
          #cfg-logo-wrap { display:flex;flex-direction:column;align-items:center;gap:6px;margin-bottom:16px;cursor:pointer }
          #cfg-logo-preview { width:72px;height:72px;border-radius:16px;object-fit:contain;border:2px solid #e2e8f0;background:#f8fafc }
          #cfg-logo-hint { font-size:11px;color:#94a3b8;font-weight:600 }
          #cfg-logo-input { display:none }
          #cfg-nombre-escuela { width:100%;background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:10px 12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:700;color:#1e3a8a;outline:none;box-sizing:border-box;margin-top:4px }
          #cfg-nombre-escuela:focus { border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1) }
          .btn-guardar-esc { width:100%;padding:11px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:900;cursor:pointer;margin-top:10px;box-shadow:0 4px 12px rgba(37,99,235,.25) }
        </style>
        <div id="cfg-sheet">
          <div class="csh">
            <div class="cst">⚙️ Configurar escuela</div>
            <button class="csc" onclick="document.getElementById('cfg-overlay').remove();document.body.style.overflow=''">✕</button>
          </div>
          <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px">LOGO</div>
          <div id="cfg-logo-wrap" onclick="document.getElementById('cfg-logo-input').click()">
            <img id="cfg-logo-preview" src="icons/inicio.png" alt="Logo">
            <span id="cfg-logo-hint">Toca para cambiar el logo</span>
          </div>
          <input type="file" id="cfg-logo-input" accept="image/*" onchange="UI._onCfgLogoChange(event)">
          <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:3px">NOMBRE DE LA ESCUELA</div>
          <input id="cfg-nombre-escuela" placeholder="Nombre de tu escuela">
          <button class="btn-guardar-esc" onclick="UI._guardarEscuela()">✓ Guardar</button>
        </div>`;
      el.addEventListener('click', e => { if (e.target === el) { el.remove(); document.body.style.overflow=''; } });
      document.body.appendChild(el);
      document.body.style.overflow = 'hidden';
      // Cargar logo y nombre actuales
      const logoActual = Store.escuelaId ? (localStorage.getItem('escuela_logo_' + Store.escuelaId) || 'icons/inicio.png') : 'icons/inicio.png';
      document.getElementById('cfg-logo-preview').src = logoActual;
      UI._cfgLogoBase64 = null;
      (async () => {
        try {
          const { data } = await _sb.from('escuelas').select('nombre').eq('id', Store.escuelaId).single();
          if (data) document.getElementById('cfg-nombre-escuela').value = data.nombre || '';
        } catch(e) {}
      })();
    } else {
      document.getElementById('cfg-overlay').style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  },

  _cfgLogoBase64: null,

  _onCfgLogoChange: (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      UI._cfgLogoBase64 = ev.target.result;
      document.getElementById('cfg-logo-preview').src = UI._cfgLogoBase64;
    };
    reader.readAsDataURL(file);
  },

  _guardarEscuela: async () => {
    const nombre = document.getElementById('cfg-nombre-escuela').value.trim();
    if (!nombre) { toast('Escribe el nombre de la escuela', 'warn'); return; }
    try {
      await _sb.from('escuelas').update({ nombre }).eq('id', Store.escuelaId);
      // Guardar logo si se cambió
      if (UI._cfgLogoBase64 && Store.escuelaId) {
        localStorage.setItem('escuela_logo_' + Store.escuelaId, UI._cfgLogoBase64);
      }
      // Guardar nombre en localStorage para que renderHeader lo use en todos los módulos
      if (Store.escuelaId) localStorage.setItem('escuela_nombre_' + Store.escuelaId, nombre);
      // Cerrar sheet
      const overlay = document.getElementById('cfg-overlay');
      if (overlay) { overlay.remove(); document.body.style.overflow = ''; }
      toast('Escuela guardada ✓', 'ok');
      // Actualizar header en vivo
      const logoSrc = UI._cfgLogoBase64 || (Store.escuelaId ? localStorage.getItem('escuela_logo_' + Store.escuelaId) : null) || 'icons/inicio.png';
      const hlogoImg = document.querySelector('.hlogo img');
      if (hlogoImg) hlogoImg.src = logoSrc;
      const htitle = document.querySelector('.htitle');
      if (htitle) htitle.textContent = nombre;
    } catch(e) { toast('Error al guardar', 'err'); }
  },

  _abrirAcercaDe: () => {
    const existing = document.getElementById('menu-dropdown');
    if (existing) existing.remove();
    const prev = document.getElementById('acercade-overlay');
    if (prev) { prev.style.display = 'flex'; return; }
    const el = document.createElement('div');
    el.id = 'acercade-overlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:600;display:flex;align-items:flex-end;justify-content:center';
    el.innerHTML = `
      <div style="background:#fff;border-radius:20px 20px 0 0;width:100%;max-width:480px;padding:0 0 32px">
        <div style="width:36px;height:4px;background:#e2e8f0;border-radius:2px;margin:12px auto 0"></div>
        <div style="padding:0 16px">
          <div style="text-align:center;padding:20px 0 16px;border-bottom:1px solid #f1f5f9;margin-bottom:16px">
            <div style="font-size:18px;font-weight:900;color:#1e293b">App Escuela de Pádel</div>
            <div style="display:inline-block;margin-top:6px;background:#eff6ff;color:#2563eb;border-radius:8px;padding:2px 12px;font-size:11px;font-weight:900">v1.27 · Abril 2026</div>
          </div>
          <div style="padding:10px 0;border-bottom:1px solid #f8fafc">
            <div style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px">Creado por</div>
            <div style="font-size:13px;font-weight:800;color:#1e293b;margin-top:3px">Chema — Monitor de pádel</div>
            <div style="font-size:11px;font-weight:600;color:#64748b;margin-top:2px">Tomares · Sevilla</div>
          </div>
          <div style="padding:10px 0;border-bottom:1px solid #f8fafc">
            <div style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px">Desarrollo desde</div>
            <div style="font-size:13px;font-weight:800;color:#1e293b;margin-top:3px">Enero 2026 — en constante mejora</div>
          </div>
          <div style="padding:10px 0">
            <div style="font-size:10px;font-weight:900;color:#94a3b8;text-transform:uppercase;letter-spacing:.4px">Stack técnico</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px">
              <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">Vanilla JS</span>
              <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">HTML/CSS</span>
              <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">Supabase</span>
              <span style="background:#f1f5f9;border-radius:7px;padding:3px 9px;font-size:11px;font-weight:800;color:#475569">GitHub Pages</span>
            </div>
          </div>
          <button onclick="document.getElementById('acercade-overlay').style.display='none'" style="width:100%;padding:12px;margin-top:16px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:900;cursor:pointer">Cerrar</button>
        </div>
      </div>`;
    el.addEventListener('click', e => { if (e.target === el) el.style.display = 'none'; });
    document.body.appendChild(el);
  },

  _cerrarSesion: () => {
    const existing = document.getElementById('menu-dropdown');
    if (existing) existing.remove();
    logout();
  },

  _gcCalcular,
  _gcConfirmar,

  _abrirGenerarCobros: () => {
    const existing = document.getElementById('menu-dropdown');
    if (existing) existing.remove();
    const prev = document.getElementById('gencobros-overlay');
    if (prev) {
      prev.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      _gcInicializar();
      return;
    }
    const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const el = document.createElement('div');
    el.id = 'gencobros-overlay';
    el.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:600;display:flex;align-items:flex-end;justify-content:center';
    el.innerHTML = `
      <style>
        #gencobros-sheet { background:#fff;border-radius:20px 20px 0 0;padding:16px 15px 32px;width:100%;max-width:480px;overflow-y:auto;max-height:90vh; }
        .gc-sel-trigger { display:flex;align-items:center;justify-content:space-between;background:#eff6ff;border:2px solid #bfdbfe;border-radius:12px;padding:10px 12px;cursor:pointer;font-size:13px;font-weight:800;color:#1e3a8a;position:relative; }
        .gc-sel-trigger.open { border-color:#2563eb; }
        .gc-sel-drop { display:none;position:absolute;left:0;right:0;top:calc(100% + 4px);background:#fff;border:1.5px solid #bfdbfe;border-radius:12px;box-shadow:0 8px 24px rgba(15,23,42,.12);z-index:50;max-height:200px;overflow-y:auto; }
        .gc-sel-drop.open { display:block; }
        .gc-sel-opt { padding:10px 14px;font-size:13px;font-weight:700;color:#1e293b;cursor:pointer; }
        .gc-sel-opt:hover { background:#eff6ff; }
        .gc-sel-opt.sel { background:#dbeafe;color:#1e40af;font-weight:900; }
        #gc-btn-confirmar:disabled { opacity:.5;cursor:not-allowed; }
      </style>
      <div id="gencobros-sheet">
        <div style="display:flex;align-items:center;margin-bottom:14px">
          <div style="flex:1;font-size:15px;font-weight:900;color:#1e293b">⚡ Generar cobros del mes</div>
          <button onclick="document.getElementById('gencobros-overlay').style.display='none';document.body.style.overflow=''" style="background:#f1f5f9;border:none;border-radius:8px;width:28px;height:28px;font-size:14px;font-weight:900;color:#64748b;cursor:pointer">✕</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px">
          <div style="flex:1">
            <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">MES</div>
            <div style="position:relative">
              <div class="gc-sel-trigger" id="gc-mes-trig" onclick="gcSelToggle('gc-mes')">
                <span id="gc-mes-lbl">—</span><span>▼</span>
              </div>
              <div class="gc-sel-drop" id="gc-mes-drop">
                ${MESES.map(m=>`<div class="gc-sel-opt" data-v="${m}" onclick="gcSelPick('gc-mes','${m}')">${m}</div>`).join('')}
              </div>
            </div>
          </div>
          <div style="flex:1">
            <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px">AÑO</div>
            <div style="position:relative">
              <div class="gc-sel-trigger" id="gc-anio-trig" onclick="gcSelToggle('gc-anio')">
                <span id="gc-anio-lbl">—</span><span>▼</span>
              </div>
              <div class="gc-sel-drop" id="gc-anio-drop"></div>
            </div>
          </div>
        </div>
        <div id="gc-preview-btn">
          <button onclick="_gcCalcular()" style="width:100%;padding:12px;border-radius:12px;background:#2563eb;color:#fff;border:none;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">🔍 Calcular preview</button>
        </div>
        <div id="gc-resultado" style="display:none">
          <div id="gc-preview-box" style="margin-bottom:10px"></div>
          <button id="gc-btn-confirmar" onclick="_gcConfirmar()" style="width:100%;padding:12px;background:#16a34a;color:#fff;border:none;border-radius:12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 4px 12px rgba(22,163,74,.25)">✓ Generar cobros</button>
        </div>
      </div>`;
    el.addEventListener('click', e => { if (e.target === el) { el.style.display = 'none'; document.body.style.overflow = ''; } });
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    _gcInicializar();
  }
};

// ── Gestionar opciones de config (eliminar con ✕) ─────────────────────────
function abrirGestionOpciones(clave, titulo, listaActual, onGuardar) {
  // listaActual: array de strings
  // onGuardar(nuevaLista): callback cuando se confirma
  const existing = document.getElementById('gesopc-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'gesopc-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,.4);z-index:600;display:flex;align-items:flex-end';

  function renderChips(lista) {
    return lista.map((v,i) => `
      <div style="display:inline-flex;align-items:center;gap:5px;background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:20px;padding:5px 10px;font-size:12px;font-weight:800;color:#1e3a8a;margin:3px">
        <span>${v}</span>
        <button onclick="gesopcEliminar(${i})" style="background:none;border:none;color:#e05a5a;font-size:14px;font-weight:900;cursor:pointer;padding:0;line-height:1">×</button>
      </div>`).join('');
  }

  let lista = [...listaActual];

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:20px 20px 0 0;padding:18px 16px 32px;width:100%;max-width:480px;margin:0 auto">
      <div style="display:flex;align-items:center;margin-bottom:14px">
        <div style="flex:1;font-size:15px;font-weight:900;color:#1e293b">Gestionar: ${titulo}</div>
        <button onclick="document.getElementById('gesopc-overlay').remove();document.body.style.overflow=''" style="background:#f1f5f9;border:none;border-radius:8px;width:28px;height:28px;font-size:14px;font-weight:900;color:#64748b;cursor:pointer">✕</button>
      </div>
      <div style="font-size:10px;font-weight:900;color:#2563eb;text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px">Opciones actuales</div>
      <div id="gesopc-chips" style="margin-bottom:12px">${renderChips(lista)}</div>
      <div style="font-size:10px;font-weight:700;color:#94a3b8;margin-bottom:16px">Los registros que usen una opción eliminada conservarán su valor actual.</div>
      <button onclick="gesopcGuardar()" style="width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:12px;font-family:Nunito,sans-serif;font-size:13px;font-weight:900;cursor:pointer;box-shadow:0 4px 12px rgba(37,99,235,.25)">✓ Guardar cambios</button>
    </div>`;

  window._gesopcLista = lista;
  window._gesopcOnGuardar = onGuardar;
  window.gesopcEliminar = (i) => {
    window._gesopcLista.splice(i, 1);
    document.getElementById('gesopc-chips').innerHTML = renderChips(window._gesopcLista);
  };
  window.gesopcGuardar = () => {
    overlay.remove();
    document.body.style.overflow = '';
    onGuardar(window._gesopcLista);
  };

  overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); document.body.style.overflow=''; } });
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}


// ── Generar cobros del mes — lógica global ────
let _gcPreviewData = null;

function _gcInicializar() {
  const anio = new Date().getFullYear();
  const mesNombre = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][new Date().getMonth()];

  // Poblar año
  const drop = document.getElementById('gc-anio-drop');
  if (drop) {
    drop.innerHTML = [anio-1, anio, anio+1].map(a=>`<div class="gc-sel-opt${a===anio?' sel':''}" data-v="${a}" onclick="gcSelPick('gc-anio',${a})">${a}</div>`).join('');
  }
  const lblA = document.getElementById('gc-anio-lbl');
  if (lblA) lblA.textContent = anio;

  // Mes actual
  const lblM = document.getElementById('gc-mes-lbl');
  if (lblM) lblM.textContent = mesNombre;
  const mesOpts = document.querySelectorAll('#gc-mes-drop .gc-sel-opt');
  mesOpts.forEach(o => o.classList.toggle('sel', o.dataset.v === mesNombre));

  document.getElementById('gc-resultado').style.display = 'none';
  document.getElementById('gc-preview-btn').style.display = 'block';
  _gcPreviewData = null;
}

function gcSelToggle(id) {
  const drop = document.getElementById(id + '-drop');
  const trig = document.getElementById(id + '-trig');
  if (!drop) return;
  const open = drop.classList.contains('open');
  // Cerrar todos
  document.querySelectorAll('.gc-sel-drop').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.gc-sel-trigger').forEach(t => t.classList.remove('open'));
  if (!open) {
    drop.classList.add('open'); trig.classList.add('open');
    setTimeout(() => { const s = drop.querySelector('.sel'); if (s) s.scrollIntoView({block:'center'}); }, 20);
  }
}
function gcSelPick(id, val) {
  const lbl = document.getElementById(id + '-lbl');
  const drop = document.getElementById(id + '-drop');
  const trig = document.getElementById(id + '-trig');
  if (lbl) lbl.textContent = val;
  if (drop) { drop.querySelectorAll('.gc-sel-opt').forEach(o => o.classList.toggle('sel', String(o.dataset.v) === String(val))); drop.classList.remove('open'); }
  if (trig) trig.classList.remove('open');
}

async function _gcCalcular() {
  const mes  = document.getElementById('gc-mes-lbl')?.textContent || '';
  const anio = +(document.getElementById('gc-anio-lbl')?.textContent || new Date().getFullYear());
  document.getElementById('gc-preview-btn').innerHTML = '<div style="text-align:center;padding:10px"><div style="width:20px;height:20px;border:2px solid #2563eb;border-top-color:transparent;border-radius:50%;animation:spin .6s linear infinite;display:inline-block"></div></div>';

  try {
    const grupos = await getGruposConImporte();
    if (!grupos.length) {
      document.getElementById('gc-preview-btn').innerHTML =
        '<div style="background:#fef9c3;border:1.5px solid #fde68a;border-radius:12px;padding:12px 14px;font-size:13px;font-weight:700;color:#92400e;margin-bottom:8px">' +
        '⚠️ Ningún grupo tiene importe mensual configurado.<br>' +
        '<span style="font-size:11px;color:#b45309">Ve a <strong>Grupos → Editar</strong> y añade un importe mensual.</span>' +
        '</div>' +
        '<button onclick="UI._gcCalcular()" style="width:100%;padding:12px;border-radius:12px;background:#2563eb;color:#fff;border:none;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">🔍 Calcular preview</button>';
      return;
    }
    const grupoIds = grupos.map(g => g.id);
    // La relación alumno↔grupo es N:M a través de alumno_grupos
    const { data: relaciones } = await _sb
      .from('alumno_grupos')
      .select('alumno_id, grupo_id, alumnos(id, nombre)')
      .in('grupo_id', grupoIds);
    const yaExisten = await getCobrosExistentesSet(mes, anio);

    const aGenerar = [], omitidos = [];
    (relaciones||[]).forEach(r => {
      const alumno = r.alumnos;
      if (!alumno) return;
      const g = grupos.find(x => x.id === r.grupo_id);
      if (!g) return;
      if (yaExisten.has(alumno.id)) omitidos.push({...alumno, grupo: g});
      else aGenerar.push({ alumno_id: alumno.id, nombre: alumno.nombre, grupo: g, importe: g.importe_mensual });
    });
    _gcPreviewData = { aGenerar, mes, anio };

    const totalImporte = aGenerar.reduce((s,r) => s + r.importe, 0);
    document.getElementById('gc-preview-box').innerHTML = `
      <div style="font-size:13px;font-weight:900;color:#1e293b;margin-bottom:8px">📋 ${mes} ${anio}</div>
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:9px;padding:8px 11px;margin-bottom:8px;font-size:12px;font-weight:800;color:#15803d">
        ✓ <strong>${aGenerar.length} cobros</strong> · <strong>${totalImporte.toFixed(2)} €</strong> total
      </div>
      ${aGenerar.map(r=>`
        <div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f1f5f9">
          <div style="flex:1">
            <div style="font-size:12px;font-weight:700;color:#1e293b">${r.nombre}</div>
            <div style="font-size:10px;color:#94a3b8;font-weight:600">${r.grupo.nombre}</div>
          </div>
          <div style="font-size:13px;font-weight:900;color:#16a34a">${r.importe.toFixed(2)}€</div>
        </div>`).join('')}
      ${omitidos.length ? `<div style="margin-top:8px;font-size:10px;font-weight:700;color:#f59e0b">⏭ ${omitidos.length} ya cobrado${omitidos.length!==1?'s':''}: ${omitidos.map(a=>a.nombre).join(', ')}</div>` : ''}`;

    const btn = document.getElementById('gc-btn-confirmar');
    btn.disabled = !aGenerar.length;
    btn.textContent = aGenerar.length ? `✓ Generar ${aGenerar.length} cobros` : 'Sin cobros nuevos';
    document.getElementById('gc-resultado').style.display = 'block';
    document.getElementById('gc-preview-btn').style.display = 'none';
  } catch(e) {
    toast('Error al calcular', 'err'); console.error(e);
    document.getElementById('gc-preview-btn').innerHTML = '<button onclick="UI._gcCalcular()" style="width:100%;padding:12px;border-radius:12px;background:#2563eb;color:#fff;border:none;font-size:13px;font-weight:800;cursor:pointer;font-family:Nunito,sans-serif">🔍 Calcular preview</button>';
  }
}

async function _gcConfirmar() {
  const { aGenerar, mes, anio } = _gcPreviewData || {};
  if (!aGenerar?.length) { toast('Nada que generar', 'warn'); return; }
  const btn = document.getElementById('gc-btn-confirmar');
  btn.disabled = true; btn.textContent = 'Generando…';
  try {
    const hoy = new Date().toISOString().slice(0,10);
    await saveCobrosLote(aGenerar.map(r => ({
      alumno_id: r.alumno_id, tipo: 'Mensual', importe: r.importe,
      fecha: hoy, mes, forma_pago: 'Efectivo',
    })));
    document.getElementById('gencobros-overlay').style.display = 'none';
    toast(`✓ ${aGenerar.length} cobros generados`, 'ok');
  } catch(e) {
    toast('Error al generar', 'err'); console.error(e);
    btn.disabled = false; btn.textContent = `✓ Generar ${aGenerar.length} cobros`;
  }
}

// ── Selector custom con ✕ integrado (csel) ─────
function cselRender(containerId, opciones, seleccionada, noBorrar, onChange, onDelete, onAdd, placeholder) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="csel-trigger" onclick="cselToggle('${containerId}')">
      <div class="csel-trigger-label" id="${containerId}-tlabel">—</div>
      <div class="csel-trigger-arrow" id="${containerId}-arrow">▼</div>
    </div>
    <div class="csel-dropdown" id="${containerId}-drop" style="display:none">
      <div id="${containerId}-lista"></div>
      <div id="${containerId}-add-zone"></div>
    </div>`;
  wrap._cselState = { opciones: [...opciones], seleccionada, noBorrar, onChange, onDelete, onAdd, placeholder, open: false };
  cselRefresh(containerId);
}

function cselToggle(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  const opening = !wrap._cselState.open;

  // Cerrar todos los csel abiertos
  document.querySelectorAll('.csel-wrap').forEach(w => {
    if (w !== wrap && w._cselState?.open) {
      w._cselState.open = false;
      const d = w.querySelector('.csel-dropdown');
      const a = w.querySelector('.csel-trigger-arrow');
      if (d) d.style.display = 'none';
      if (a) a.style.transform = '';
    }
  });
  // Cerrar también nsel abiertos
  document.querySelectorAll('.nsel-drop').forEach(d => {
    if (d.style.display !== 'none') {
      d.style.display = 'none';
      const id = d.id.replace('-nsel-drop','');
      const arr = document.getElementById(id + '-nsel-arrow');
      if (arr) arr.style.transform = '';
    }
  });

  wrap._cselState.open = opening;
  const drop  = document.getElementById(containerId + '-drop');
  const arrow = document.getElementById(containerId + '-arrow');

  if (opening && drop) {
    // Posicionar fixed igual que nsel
    const trigger = wrap.querySelector('.csel-trigger');
    const rect = trigger ? trigger.getBoundingClientRect() : wrap.getBoundingClientRect();
    const margin = 8;
    const maxW = window.innerWidth - margin * 2;
    const spaceBelow = window.innerHeight - rect.bottom - margin;
    const spaceAbove = rect.top - margin;

    drop.style.display = 'block';
    drop.style.left  = margin + 'px';
    drop.style.width = maxW + 'px';

    if (spaceBelow >= 150 || spaceBelow >= spaceAbove) {
      drop.style.top    = (rect.bottom + 4) + 'px';
      drop.style.bottom = 'auto';
      drop.style.maxHeight = Math.max(spaceBelow, 120) + 'px';
    } else {
      drop.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
      drop.style.top    = 'auto';
      drop.style.maxHeight = Math.max(spaceAbove, 120) + 'px';
    }
  } else if (drop) {
    drop.style.display = 'none';
  }
  if (arrow) arrow.style.transform = opening ? 'rotate(180deg)' : '';
}

function cselRefresh(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  const { opciones, seleccionada, noBorrar, onDelete, onAdd, placeholder } = wrap._cselState;
  const tlabel = document.getElementById(containerId + '-tlabel');
  if (tlabel) tlabel.textContent = seleccionada || '—';
  const lista = document.getElementById(containerId + '-lista');
  if (!lista) return;
  lista.innerHTML = opciones.map(op => {
    const sel = seleccionada === op;
    const puedeEliminar = onDelete && op !== noBorrar;
    return `<div class="csel-item${sel ? ' selected' : ''}" onclick="cselSelect('${containerId}','${op.replace(/'/g, "\'")}')">
      <div class="csel-radio"></div>
      <div class="csel-label">${op}</div>
      ${puedeEliminar ? `<button class="csel-del" onclick="event.stopPropagation();cselDelete('${containerId}','${op.replace(/'/g, "\'")}')">✕</button>` : ''}
    </div>`;
  }).join('');

  // Si hay onAdd, renderizar el footer de añadir (input + botón)
  const addZone = document.getElementById(containerId + '-add-zone');
  if (!addZone) return;
  if (onAdd) {
    addZone.innerHTML = `<div class="csel-add">
      <input class="csel-add-inp" id="${containerId}-inp" placeholder="${placeholder || '+ Añadir…'}"
        onkeydown="if(event.key==='Enter'){event.preventDefault();cselAdd('${containerId}');}">
      <button class="csel-add-btn" onclick="cselAdd('${containerId}')">+</button>
    </div>`;
  } else {
    addZone.innerHTML = '';
  }
}

function cselSelect(containerId, val) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  wrap._cselState.seleccionada = val;
  wrap._cselState.open = false;
  document.getElementById(containerId + '-drop').style.display = 'none';
  document.getElementById(containerId + '-arrow').style.transform = '';
  cselRefresh(containerId);
  if (wrap._cselState.onChange) wrap._cselState.onChange(val);
}

function cselDelete(containerId, val) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  const s = wrap._cselState;
  s.opciones = s.opciones.filter(o => o !== val);
  if (s.seleccionada === val) s.seleccionada = s.opciones[0] || '';
  cselRefresh(containerId);
  if (s.onDelete) s.onDelete(val, s.opciones, s.seleccionada);
}

function cselAdd(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  const inp = document.getElementById(containerId + '-inp');
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) { inp.focus(); return; }
  const s = wrap._cselState;
  if (!s.opciones.includes(val)) s.opciones.push(val);
  s.seleccionada = val;
  inp.value = '';
  cselRefresh(containerId);
  if (s.onAdd) s.onAdd(val, s.opciones);
  inp.focus();
}

function cselGetValue(containerId) {
  return document.getElementById(containerId)?._cselState?.seleccionada ?? '';
}

function cselSetValue(containerId, val) {
  const wrap = document.getElementById(containerId);
  if (!wrap?._cselState) return;
  wrap._cselState.seleccionada = val;
  cselRefresh(containerId);
}

// Cerrar todos los csel al pulsar fuera
document.addEventListener('click', e => {
  if (!e.target.closest('.csel-wrap')) {
    document.querySelectorAll('.csel-wrap').forEach(wrap => {
      if (wrap._cselState?.open) {
        wrap._cselState.open = false;
        const drop = wrap.querySelector('.csel-dropdown');
        const arrow = wrap.querySelector('.csel-trigger-arrow');
        if (drop)  drop.style.display = 'none';
        if (arrow) arrow.style.transform = '';
      }
    });
  }
});

// ══════════════════════════════════════════════════════════════
//  NSEL — Select nativo estilado como csel
//  Uso: nselInit('id-del-select')
//  El <select> original queda oculto como fuente de verdad.
//  Cuando el <select> cambia su innerHTML, llamar nselSync('id').
// ══════════════════════════════════════════════════════════════

function nselInit(selId) {
  const sel = document.getElementById(selId);
  if (!sel || sel._nselDone) return;
  sel._nselDone = true;

  // Ocultar el select nativo
  sel.style.display = 'none';

  // Crear el wrapper si no existe ya
  let wrap = document.getElementById(selId + '-nsel');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = selId + '-nsel';
    wrap.className = 'nsel-wrap';
    sel.parentNode.insertBefore(wrap, sel);
  }

  _nselBuild(selId);

  // Observer: cuando el select cambie su options, re-sincronizar
  const obs = new MutationObserver(() => _nselBuild(selId));
  obs.observe(sel, { childList: true, subtree: true, characterData: true });

  // También escuchar cambios de value programáticos
  const origDesc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
  if (origDesc) {
    try {
      Object.defineProperty(sel, 'value', {
        get() { return origDesc.get.call(this); },
        set(v) {
          origDesc.set.call(this, v);
          setTimeout(() => _nselBuild(selId), 0);
        },
        configurable: true
      });
    } catch(e) {}
  }
}

function _nselBuild(selId) {
  const sel  = document.getElementById(selId);
  const wrap = document.getElementById(selId + '-nsel');
  if (!sel || !wrap) return;

  const opts        = Array.from(sel.options);
  const curVal      = sel.value;
  const curTxt      = opts.find(o => o.value === curVal)?.text || opts[0]?.text || '—';
  const isDisabled  = sel.disabled;
  const conBuscador = opts.length > 6;

  wrap.classList.toggle('nsel-disabled', isDisabled);

  const buscadorHtml = conBuscador ? `
    <div style="padding:8px 10px 6px;border-bottom:1px solid #dbeafe;background:#fff">
      <input type="text" placeholder="Buscar…"
        style="width:100%;border:1.5px solid #bfdbfe;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:700;font-family:Nunito,sans-serif;color:#1e3a8a;outline:none;background:#f8fafc;box-sizing:border-box"
        oninput="nselFiltrar('${selId}',this.value)"
        onclick="event.stopPropagation()">
    </div>` : '';

  wrap.innerHTML = `
    <div class="nsel-trigger" onclick="nselToggle('${selId}')" style="${isDisabled ? 'opacity:.5;pointer-events:none' : ''}">
      <div class="nsel-label" id="${selId}-nsel-lbl">${curTxt}</div>
      <div class="nsel-arrow" id="${selId}-nsel-arrow">▼</div>
    </div>
    <div class="nsel-drop" id="${selId}-nsel-drop" style="display:none">
      ${buscadorHtml}
      <div id="${selId}-nsel-items">
        ${opts.map(o => `
          <div class="nsel-item${o.value === curVal ? ' nsel-sel' : ''}"
               data-txt="${o.text.toLowerCase()}"
               onclick="nselPick('${selId}','${o.value.replace(/'/g,"\\'")}',this)">
            <div class="nsel-radio"></div>
            <div class="nsel-lbl">${o.text}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

function nselFiltrar(selId, q) {
  const items = document.getElementById(selId + '-nsel-items');
  if (!items) return;
  const txt = q.toLowerCase().trim();
  items.querySelectorAll('.nsel-item').forEach(item => {
    item.style.display = (!txt || item.dataset.txt.includes(txt)) ? '' : 'none';
  });
}

function nselToggle(selId) {
  const drop    = document.getElementById(selId + '-nsel-drop');
  const arrow   = document.getElementById(selId + '-nsel-arrow');
  const trigger = document.getElementById(selId + '-nsel')?.querySelector('.nsel-trigger');
  if (!drop) return;
  const open = drop.style.display === 'none';
  // Cerrar todos los demás nsel abiertos
  document.querySelectorAll('.nsel-drop').forEach(d => {
    if (d !== drop) {
      d.style.display = 'none';
      const otherId = d.id.replace('-nsel-drop','');
      const otherArrow = document.getElementById(otherId + '-nsel-arrow');
      if (otherArrow) otherArrow.style.transform = '';
    }
  });
  if (open && trigger) {
    const rect = trigger.getBoundingClientRect();
    // Mostrar temporalmente para medir el ancho natural
    drop.style.visibility = 'hidden';
    drop.style.display = 'block';
    drop.style.left = '0px';
    drop.style.top = '-9999px';
    drop.style.width = 'auto';
    const naturalW = Math.min(drop.scrollWidth, window.innerWidth - 24);
    drop.style.visibility = '';
    drop.style.display = 'none';

    // Alinear: intentar a la izquierda del trigger, si se sale → alinear a la derecha del trigger
    let left = rect.left;
    if (left + naturalW > window.innerWidth - 8) {
      left = rect.right - naturalW;
    }
    if (left < 8) left = 8;

    drop.style.left  = left + 'px';
    drop.style.width = naturalW + 'px';

    // Calcular altura disponible abajo y arriba
    const maxH       = 260; // max-height del dropdown
    const spaceBelow = window.innerHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;

    if (spaceBelow >= Math.min(maxH, 120) || spaceBelow >= spaceAbove) {
      // Cabe abajo o hay más espacio abajo: abrir hacia abajo
      drop.style.top    = (rect.bottom + 4) + 'px';
      drop.style.bottom = 'auto';
      drop.style.maxHeight = Math.max(spaceBelow, 120) + 'px';
    } else {
      // Más espacio arriba: abrir hacia arriba
      drop.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
      drop.style.top    = 'auto';
      drop.style.maxHeight = Math.max(spaceAbove, 120) + 'px';
    }
  }
  drop.style.display = open ? 'block' : 'none';
  if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
}

function nselPick(selId, val, itemEl) {
  const sel  = document.getElementById(selId);
  const drop = document.getElementById(selId + '-nsel-drop');
  const lbl  = document.getElementById(selId + '-nsel-lbl');
  const arrow = document.getElementById(selId + '-nsel-arrow');
  if (!sel) return;

  // Update native select value
  sel.value = val;

  // Update label
  const opts = Array.from(sel.options);
  const txt = opts.find(o => o.value === val)?.text || '—';
  if (lbl) lbl.textContent = txt;

  // Update selected state
  drop.querySelectorAll('.nsel-item').forEach(i => i.classList.remove('nsel-sel'));
  if (itemEl) itemEl.classList.add('nsel-sel');

  // Close
  drop.style.display = 'none';
  if (arrow) arrow.style.transform = '';

  // Fire change event so existing onchange handlers work
  sel.dispatchEvent(new Event('change', { bubbles: true }));
}

// Cerrar nsel al pulsar fuera
document.addEventListener('click', e => {
  if (!e.target.closest('.nsel-wrap')) {
    document.querySelectorAll('.nsel-drop').forEach(d => {
      d.style.display = 'none';
      const otherId = d.id.replace('-nsel-drop','');
      const otherArrow = document.getElementById(otherId + '-nsel-arrow');
      if (otherArrow) otherArrow.style.transform = '';
    });
  }
});

// Cerrar nsel al hacer scroll en la página (no en el propio dropdown)
window.addEventListener('scroll', function _nselCerrarTodos(e) {
  if (e.target instanceof Element && e.target.closest('.nsel-drop')) return;
  document.querySelectorAll('.nsel-drop').forEach(d => {
    if (d.style.display === 'none') return;
    d.style.display = 'none';
    const otherId = d.id.replace('-nsel-drop','');
    const otherArrow = document.getElementById(otherId + '-nsel-arrow');
    if (otherArrow) otherArrow.style.transform = '';
  });
}, true);

// nselSync: llamar tras cambiar innerHTML de un select para re-renderizar
function nselSync(selId) {
  setTimeout(() => _nselBuild(selId), 0);
}
