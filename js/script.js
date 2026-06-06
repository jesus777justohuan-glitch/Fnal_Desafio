/* =============================================
   PROYECTO: SimCrisis — JavaScript Vanilla
   Materia: Programación Web I · UMSA
   Tecnología: JavaScript ES6+ · DOM API puro
   Sin librerías externas
   Autor: [Nombre del Estudiante]
   =============================================

   ÍNDICE:
   1. Utilidades generales (formato, DOM)
   2. Sistema de validación de formularios
   3. Módulo A — Simulador de Carburantes
   4. Módulo B — Simulador de Precios (Alimentos)
   5. Módulo C — Simulador de Transporte
   6. Navegación móvil (menú hamburguesa)
   7. Inicialización
   ============================================= */


/* ─────────────────────────────────────────────
   1. UTILIDADES GENERALES
   ───────────────────────────────────────────── */

/**
 * Formatea un número como moneda boliviana.
 * @param {number} n - Número a formatear.
 * @param {number} [dec=2] - Decimales.
 * @returns {string} "Bs 1.234,56"
 */
function fmtBs(n, dec = 2) {
  return 'Bs\u00A0' + Number(n).toLocaleString('es-BO', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

/**
 * Formatea un número con separadores de miles.
 * @param {number} n - Número a formatear.
 * @param {number} [dec=0] - Decimales.
 * @returns {string}
 */
function fmt(n, dec = 0) {
  return Number(n).toLocaleString('es-BO', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

/**
 * Obtiene el elemento por ID (lanza error si no existe).
 * @param {string} id
 * @returns {HTMLElement}
 */
function $id(id) {
  const el = document.getElementById(id);
  if (!el) console.warn('[SimCrisis] Elemento no encontrado:', id);
  return el;
}

/**
 * Actualiza el año en el footer.
 */
function actualizarAnioFooter() {
  const el = $id('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}


/* ─────────────────────────────────────────────
   2. SISTEMA DE VALIDACIÓN
   ───────────────────────────────────────────── */

/**
 * Muestra un error visual en un campo del formulario.
 * @param {string} inputId - ID del input.
 * @param {string} mensaje - Texto del error.
 */
function mostrarError(inputId, mensaje) {
  const input = $id(inputId);
  const errEl = $id(inputId + '-err');
  if (input) input.classList.add('is-error');
  if (errEl) {
    errEl.textContent = mensaje;
    errEl.classList.add('is-visible');
  }
}

/**
 * Limpia el error visual de un campo.
 * @param {string} inputId
 */
function limpiarError(inputId) {
  const input = $id(inputId);
  const errEl = $id(inputId + '-err');
  if (input) input.classList.remove('is-error');
  if (errEl) {
    errEl.textContent = '';
    errEl.classList.remove('is-visible');
  }
}

/**
 * Valida que un input numérico tenga valor mayor que 0.
 * @param {string} inputId
 * @param {string} etiqueta - Nombre amigable del campo para mensajes.
 * @param {boolean} [permitirCero=false]
 * @returns {number|false} El valor numérico, o false si es inválido.
 */
function validarPositivo(inputId, etiqueta, permitirCero = false) {
  limpiarError(inputId);
  const el = $id(inputId);
  if (!el) return false;

  const raw = el.value.trim();
  if (raw === '' || raw === null) {
    mostrarError(inputId, `"${etiqueta}" es un campo requerido.`);
    return false;
  }

  const val = parseFloat(raw);
  if (isNaN(val)) {
    mostrarError(inputId, `"${etiqueta}" debe ser un número válido.`);
    return false;
  }
  if (!permitirCero && val <= 0) {
    mostrarError(inputId, `"${etiqueta}" debe ser mayor que 0.`);
    return false;
  }
  if (permitirCero && val < 0) {
    mostrarError(inputId, `"${etiqueta}" no puede ser negativo.`);
    return false;
  }
  return val;
}

/**
 * Valida un campo de texto (no vacío).
 * @param {string} inputId
 * @param {string} etiqueta
 * @returns {string|false}
 */
function validarTexto(inputId, etiqueta) {
  limpiarError(inputId);
  const el = $id(inputId);
  if (!el) return false;
  const val = el.value.trim();
  if (!val) {
    mostrarError(inputId, `"${etiqueta}" es un campo requerido.`);
    return false;
  }
  return val;
}

/**
 * Limpia todos los errores de un formulario.
 * @param {string} formId
 */
function limpiarErroresFormulario(formId) {
  const form = $id(formId);
  if (!form) return;
  form.querySelectorAll('.is-error').forEach(el => el.classList.remove('is-error'));
  form.querySelectorAll('.field-err').forEach(el => {
    el.textContent = '';
    el.classList.remove('is-visible');
  });
}

/**
 * Resetea los valores de un formulario y limpia errores.
 * @param {string} formId
 */
function resetearFormulario(formId) {
  const form = $id(formId);
  if (!form) return;
  form.reset();
  limpiarErroresFormulario(formId);
}


/* ─────────────────────────────────────────────
   CONSTRUCTORES DE HTML REUTILIZABLES
   ───────────────────────────────────────────── */

/**
 * Crea una caja de métrica HTML.
 * @param {string} valor
 * @param {string} etiqueta
 * @returns {string}
 */
function htmlMetrica(valor, etiqueta) {
  return `<div class="metric-box">
    <span class="m-val">${valor}</span>
    <span class="m-lbl">${etiqueta}</span>
  </div>`;
}

/**
 * Crea una alerta de estado.
 * @param {'is-ok'|'is-warning'|'is-danger'|'is-info'} tipo
 * @param {string} icono
 * @param {string} mensaje
 * @returns {string}
 */
function htmlAlerta(tipo, icono, mensaje) {
  return `<div class="status-alert ${tipo}" role="status" aria-live="polite">
    <span class="s-icon" aria-hidden="true">${icono}</span>
    <span>${mensaje}</span>
  </div>`;
}

/**
 * Crea una barra de progreso.
 * @param {number} porcentaje - 0..100
 * @param {string} clase - 'is-ok' | 'is-warning' | 'is-danger'
 * @param {string} etiquetaIzq
 * @returns {string}
 */
function htmlProgreso(porcentaje, clase, etiquetaIzq) {
  const pct = Math.min(100, Math.max(0, porcentaje));
  return `<div class="progress-wrap">
    <div class="progress-label">
      <span>${etiquetaIzq}</span>
      <span>${fmt(pct, 1)}%</span>
    </div>
    <div class="progress-bar" role="progressbar"
         aria-valuenow="${fmt(pct,1)}" aria-valuemin="0" aria-valuemax="100"
         aria-label="${etiquetaIzq}: ${fmt(pct,1)}%">
      <div class="progress-fill ${clase}" style="width:${pct}%"></div>
    </div>
  </div>`;
}

/**
 * Badge de estado.
 * @param {'ok'|'warning'|'danger'} tipo
 * @param {string} texto
 * @returns {string}
 */
function htmlBadge(tipo, texto) {
  return `<span class="badge-estado ${tipo}">${texto}</span>`;
}

/**
 * Título de sección dentro del panel de resultados.
 */
function htmlSeccion(texto) {
  return `<p class="results-section-title">${texto}</p>`;
}


/* ─────────────────────────────────────────────
   3. MÓDULO A — SIMULADOR DE CARBURANTES
   ───────────────────────────────────────────── */

/**
 * Calcula la evolución diaria de la reserva de carburante.
 * Retorna un array de objetos {dia, reserva, estado}.
 */
function calcularReservaCarburante(reservaInicial, consumoDiario, reabastDiario, nivelCritico) {
  const dias = [];
  let reserva = reservaInicial;
  const deficitDiario = consumoDiario - reabastDiario;

  // Días máximos a simular (evita loops infinitos)
  const maxDias = 60;

  for (let dia = 1; dia <= maxDias; dia++) {
    reserva = reserva - consumoDiario + reabastDiario;
    if (reserva < 0) reserva = 0;

    let estado;
    if (reserva <= 0)           estado = 'agotado';
    else if (reserva <= nivelCritico) estado = 'critico';
    else if (reserva <= nivelCritico * 2) estado = 'alerta';
    else                         estado = 'normal';

    dias.push({ dia, reserva, estado });

    if (reserva <= 0) break;
  }
  return { dias, deficitDiario };
}

/**
 * Determina el día en que la reserva llega al nivel crítico.
 */
function calcularDiaCritico(reservaInicial, nivelCritico, deficitDiario) {
  if (deficitDiario <= 0) return null; // Sostenible, nunca llega al crítico
  const diaCritico = (reservaInicial - nivelCritico) / deficitDiario;
  return diaCritico > 0 ? diaCritico : 0;
}

/**
 * Renderiza los resultados del simulador A en el DOM.
 */
function renderizarResultadosA(reservaInicial, consumoDiario, reabastDiario, nivelCritico) {
  const { dias, deficitDiario } = calcularReservaCarburante(
    reservaInicial, consumoDiario, reabastDiario, nivelCritico
  );
  const diaCriticoExacto = calcularDiaCritico(reservaInicial, nivelCritico, deficitDiario);
  const esSostenible = deficitDiario <= 0;
  const porcentajeUsado = ((reservaInicial - (dias[dias.length - 1]?.reserva || 0)) / reservaInicial) * 100;

  // ── Determinar estado global ──
  let estadoGlobal, iconoGlobal, mensajeGlobal, claseGlobal;
  if (esSostenible) {
    estadoGlobal = 'is-ok';
    iconoGlobal = '✅';
    mensajeGlobal = `Sistema sostenible: el reabastecimiento (${fmt(reabastDiario)} L/día) iguala o supera el consumo (${fmt(consumoDiario)} L/día). La reserva se mantiene estable.`;
    claseGlobal = 'ok';
  } else if (diaCriticoExacto !== null && diaCriticoExacto < 3) {
    estadoGlobal = 'is-danger';
    iconoGlobal = '🚨';
    mensajeGlobal = `¡ALERTA CRÍTICA! La reserva llegará al nivel crítico en aproximadamente ${fmt(diaCriticoExacto, 1)} días. Requiere acción inmediata.`;
    claseGlobal = 'danger';
  } else if (diaCriticoExacto !== null && diaCriticoExacto < 7) {
    estadoGlobal = 'is-warning';
    iconoGlobal = '⚠️';
    mensajeGlobal = `Reserva en riesgo: llegará al nivel crítico en aproximadamente ${fmt(diaCriticoExacto, 1)} días. Se recomienda gestionar reabastecimiento urgente.`;
    claseGlobal = 'warning';
  } else {
    estadoGlobal = 'is-info';
    iconoGlobal = 'ℹ️';
    mensajeGlobal = diaCriticoExacto !== null
      ? `La reserva alcanzará el nivel crítico en aproximadamente ${fmt(diaCriticoExacto, 1)} días. Planificar reabastecimiento.`
      : 'Sistema sostenible.';
    claseGlobal = 'ok';
  }

  // ── Construir HTML ──
  let html = '';

  // Alerta principal
  html += htmlAlerta(estadoGlobal, iconoGlobal, mensajeGlobal);

  // Métricas clave
  html += htmlSeccion('Indicadores clave');
  html += '<div class="metrics-grid">';
  html += htmlMetrica(fmt(reservaInicial) + ' L', 'Reserva inicial');
  html += htmlMetrica(fmt(deficitDiario) + ' L/día', esSostenible ? 'Superávit diario' : 'Déficit diario');
  if (diaCriticoExacto !== null && !esSostenible) {
    html += htmlMetrica(fmt(diaCriticoExacto, 1) + ' días', 'Días hasta nivel crítico');
  } else {
    html += htmlMetrica('Sostenible', 'Estado del sistema');
  }
  const diasHastaAgot = dias[dias.length - 1]?.reserva === 0 ? dias.length : null;
  html += htmlMetrica(diasHastaAgot ? diasHastaAgot + ' días' : '> ' + dias.length + ' días', 'Días hasta agotamiento');
  html += '</div>';

  // Barra de consumo
  const pctConsumo = esSostenible ? 0 : Math.min(100, (deficitDiario / reservaInicial) * 100 * 10);
  html += htmlSeccion('Proporción consumo vs. reabastecimiento');
  html += htmlProgreso(
    (consumoDiario / (consumoDiario + reabastDiario)) * 100,
    consumoDiario > reabastDiario ? 'is-danger' : 'is-ok',
    'Consumo sobre flujo total'
  );

  // Tabla de evolución (primeros días relevantes)
  html += htmlSeccion('Evolución diaria de la reserva');
  html += '<div class="result-table-wrap">';
  html += `<table class="result-table" aria-label="Evolución diaria de la reserva de carburante">
    <caption>Evolución de la reserva — Primeros ${Math.min(15, dias.length)} días</caption>
    <thead>
      <tr>
        <th scope="col">Día</th>
        <th scope="col">Reserva (L)</th>
        <th scope="col">% del inicial</th>
        <th scope="col">Estado</th>
      </tr>
    </thead>
    <tbody>`;

  const diasMostrar = dias.slice(0, 15);
  diasMostrar.forEach(({ dia, reserva, estado }) => {
    const pct = ((reserva / reservaInicial) * 100).toFixed(1);
    let claseFilaCSS = '';
    let textoEstado = '';
    let badgeTipo = 'ok';

    if (estado === 'agotado')  { claseFilaCSS = 'row-danger';  textoEstado = 'AGOTADO';  badgeTipo = 'danger'; }
    else if (estado === 'critico') { claseFilaCSS = 'row-danger'; textoEstado = 'Crítico'; badgeTipo = 'danger'; }
    else if (estado === 'alerta')  { claseFilaCSS = 'row-warning'; textoEstado = 'Alerta'; badgeTipo = 'warning'; }
    else                           { claseFilaCSS = 'row-ok'; textoEstado = 'Normal'; badgeTipo = 'ok'; }

    html += `<tr class="${claseFilaCSS}">
      <td class="mono">${dia}</td>
      <td class="mono">${fmt(reserva)} L</td>
      <td class="mono">${pct}%</td>
      <td>${htmlBadge(badgeTipo, textoEstado)}</td>
    </tr>`;
  });

  if (dias.length > 15) {
    html += `<tr><td colspan="4" style="text-align:center;color:var(--text-dim);font-size:0.8rem;font-style:italic;">
      … y ${dias.length - 15} días más hasta el agotamiento</td></tr>`;
  }
  html += '</tbody></table></div>';

  // Mostrar en el DOM
  const panel = $id('resultados-a');
  if (panel) panel.innerHTML = html;
}

/**
 * Maneja el submit del formulario A con event.preventDefault().
 */
function manejarFormularioA(e) {
  e.preventDefault(); // Evita recarga de página

  // Validar todos los campos
  const reserva = validarPositivo('a-reserva',  'Reserva inicial');
  const consumo = validarPositivo('a-consumo',  'Consumo diario');
  const reabast = validarPositivo('a-reabast',  'Reabastecimiento diario', true); // permite 0
  const critico  = validarPositivo('a-critico',  'Nivel crítico', true);

  if (reserva === false || consumo === false || reabast === false || critico === false) return;

  if (critico >= reserva) {
    mostrarError('a-critico', 'El nivel crítico debe ser menor a la reserva inicial.');
    return;
  }

  renderizarResultadosA(reserva, consumo, reabast, critico);
}

/**
 * Carga los datos del caso de estudio del PDF para el Módulo A.
 */
function cargarCasoA() {
  $id('a-reserva').value = '10000';
  $id('a-consumo').value = '1200';
  $id('a-reabast').value = '300';
  $id('a-critico').value = '2000';
  limpiarErroresFormulario('form-a');
  // Auto-calcular tras cargar
  renderizarResultadosA(10000, 1200, 300, 2000);
}

/**
 * Inicializa los event listeners del Módulo A.
 */
function initModuloA() {
  const form = $id('form-a');
  if (form) form.addEventListener('submit', manejarFormularioA);

  const btnReset = $id('btn-reset-a');
  if (btnReset) btnReset.addEventListener('click', function() {
    resetearFormulario('form-a');
    const panel = $id('resultados-a');
    if (panel) panel.innerHTML = `<div class="results-placeholder">
      <span aria-hidden="true">📈</span>
      <p>Los resultados del cálculo aparecerán aquí.</p>
    </div>`;
  });

  const btnCaso = $id('btn-caso-a');
  if (btnCaso) btnCaso.addEventListener('click', cargarCasoA);
}


/* ─────────────────────────────────────────────
   4. MÓDULO B — SIMULADOR DE PRECIOS (ALIMENTOS)
   ───────────────────────────────────────────── */

// Array interno de productos añadidos por el usuario
let listaProductos = [];

/**
 * Calcula los datos inflacionarios de un producto.
 */
function calcularProducto(nombre, precioAnt, precioAct, cantidad) {
  const incremento    = precioAct - precioAnt;
  const porcentaje    = ((incremento / precioAnt) * 100);
  const gastoAnt      = precioAnt * cantidad;
  const gastoAct      = precioAct * cantidad;
  const gastoDif      = gastoAct - gastoAnt;
  return { nombre, precioAnt, precioAct, cantidad, incremento, porcentaje, gastoAnt, gastoAct, gastoDif };
}

/**
 * Renderiza la tabla comparativa y el resumen del Módulo B.
 */
function renderizarResultadosB() {
  const panel = $id('resultados-b');
  if (!panel) return;

  if (listaProductos.length === 0) {
    panel.innerHTML = `<div class="results-placeholder">
      <span aria-hidden="true">🛒</span>
      <p>Agregue productos para ver el análisis de impacto inflacionario.</p>
    </div>`;
    return;
  }

  // Totales
  const totalGastoAnt = listaProductos.reduce((s, p) => s + p.gastoAnt, 0);
  const totalGastoAct = listaProductos.reduce((s, p) => s + p.gastoAct, 0);
  const totalDif      = totalGastoAct - totalGastoAnt;
  const pctTotalAlza  = (totalDif / totalGastoAnt) * 100;

  // Estado global
  let estadoGlobal, iconoGlobal, mensajeGlobal;
  if (pctTotalAlza < 10) {
    estadoGlobal = 'is-ok';    iconoGlobal = '✅';
    mensajeGlobal = `Impacto inflacionario bajo (${fmt(pctTotalAlza, 1)}%). La canasta aumentó ${fmtBs(totalDif)}/mes.`;
  } else if (pctTotalAlza < 30) {
    estadoGlobal = 'is-warning'; iconoGlobal = '⚠️';
    mensajeGlobal = `Impacto inflacionario moderado (${fmt(pctTotalAlza, 1)}%). Gasto adicional: ${fmtBs(totalDif)}/mes.`;
  } else {
    estadoGlobal = 'is-danger'; iconoGlobal = '🚨';
    mensajeGlobal = `Impacto inflacionario severo (${fmt(pctTotalAlza, 1)}%). La familia gasta ${fmtBs(totalDif)} más por mes por los mismos productos.`;
  }

  let html = '';
  html += htmlAlerta(estadoGlobal, iconoGlobal, mensajeGlobal);

  // Métricas resumen
  html += htmlSeccion('Resumen del impacto mensual');
  html += '<div class="metrics-grid">';
  html += htmlMetrica(fmtBs(totalGastoAnt), 'Gasto anterior/mes');
  html += htmlMetrica(fmtBs(totalGastoAct), 'Gasto actual/mes');
  html += htmlMetrica(fmtBs(totalDif),      'Gasto adicional/mes');
  html += htmlMetrica(fmt(pctTotalAlza, 1) + '%', 'Aumento total %');
  html += '</div>';

  // Barra del impacto total
  html += htmlSeccion('Peso del alza sobre el gasto total');
  html += htmlProgreso(
    (totalDif / totalGastoAct) * 100,
    pctTotalAlza < 10 ? 'is-ok' : pctTotalAlza < 30 ? 'is-warning' : 'is-danger',
    'Porción de sobrecosto en gasto actual'
  );

  // Tabla detallada por producto
  html += htmlSeccion(`Detalle por producto (${listaProductos.length} producto${listaProductos.length !== 1 ? 's' : ''})`);
  html += '<div class="result-table-wrap">';
  html += `<table class="result-table" aria-label="Análisis inflacionario por producto">
    <caption>Comparativa de precios y gasto mensual por producto</caption>
    <thead>
      <tr>
        <th scope="col">Producto</th>
        <th scope="col">P. anterior</th>
        <th scope="col">P. actual</th>
        <th scope="col">Alza %</th>
        <th scope="col">Cant.</th>
        <th scope="col">Gasto ant.</th>
        <th scope="col">Gasto act.</th>
        <th scope="col">Diferencia</th>
      </tr>
    </thead>
    <tbody>`;

  listaProductos.forEach((p, idx) => {
    const badgePct = p.porcentaje < 10 ? 'ok' : p.porcentaje < 30 ? 'warning' : 'danger';
    const claseFila = p.porcentaje < 10 ? 'row-ok' : p.porcentaje < 30 ? 'row-warning' : 'row-danger';
    html += `<tr class="${claseFila}">
      <td>${escapeHtml(p.nombre)}</td>
      <td class="mono">${fmtBs(p.precioAnt)}</td>
      <td class="mono">${fmtBs(p.precioAct)}</td>
      <td class="mono">${htmlBadge(badgePct, '+' + fmt(p.porcentaje, 1) + '%')}</td>
      <td class="mono">${fmt(p.cantidad)}</td>
      <td class="mono">${fmtBs(p.gastoAnt)}</td>
      <td class="mono">${fmtBs(p.gastoAct)}</td>
      <td class="mono" style="color:var(--danger);font-weight:600;">+${fmtBs(p.gastoDif)}</td>
    </tr>`;
  });

  // Fila de totales
  html += `<tr class="row-total">
    <td colspan="5"><strong>TOTALES MENSUALES</strong></td>
    <td class="mono"><strong>${fmtBs(totalGastoAnt)}</strong></td>
    <td class="mono"><strong>${fmtBs(totalGastoAct)}</strong></td>
    <td class="mono" style="color:var(--danger);"><strong>+${fmtBs(totalDif)}</strong></td>
  </tr>`;
  html += '</tbody></table></div>';

  panel.innerHTML = html;
}

/**
 * Escapa caracteres HTML para evitar XSS.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Maneja el submit del formulario B (agregar producto).
 */
function manejarFormularioB(e) {
  e.preventDefault();

  const nombre    = validarTexto('b-producto',    'Nombre del producto');
  const precioAnt = validarPositivo('b-precio-ant', 'Precio anterior');
  const precioAct = validarPositivo('b-precio-act', 'Precio actual');
  const cantidad  = validarPositivo('b-cantidad',   'Cantidad mensual');

  if (nombre === false || precioAnt === false || precioAct === false || cantidad === false) return;

  if (precioAct < precioAnt) {
    // Permitir, pero avisar (puede haber deflación)
    // No es error, se muestra como positivo
  }

  const producto = calcularProducto(nombre, precioAnt, precioAct, cantidad);
  listaProductos.push(producto);

  // Limpiar el formulario para el siguiente producto
  resetearFormulario('form-b');

  // Actualizar resultados
  renderizarResultadosB();
}

/**
 * Carga los datos del caso de estudio del PDF para el Módulo B.
 */
function cargarCasoB() {
  // Limpiar lista existente
  listaProductos = [];

  // Agregar los 3 productos del PDF directamente
  listaProductos.push(calcularProducto('Arroz', 8, 11, 10));
  listaProductos.push(calcularProducto('Papa', 7, 10, 8));
  listaProductos.push(calcularProducto('Aceite', 12, 18, 4));

  limpiarErroresFormulario('form-b');
  renderizarResultadosB();
}

/**
 * Inicializa los event listeners del Módulo B.
 */
function initModuloB() {
  const form = $id('form-b');
  if (form) form.addEventListener('submit', manejarFormularioB);

  const btnReset = $id('btn-reset-b');
  if (btnReset) btnReset.addEventListener('click', function() {
    listaProductos = [];
    resetearFormulario('form-b');
    renderizarResultadosB();
  });

  const btnCaso = $id('btn-caso-b');
  if (btnCaso) btnCaso.addEventListener('click', cargarCasoB);
}


/* ─────────────────────────────────────────────
   5. MÓDULO C — SIMULADOR DE TRANSPORTE
   ───────────────────────────────────────────── */

/**
 * Calcula los costos de transporte normales y con desvío.
 */
function calcularTransporte(distNormal, distDesvio, costoKm, viajesSemana) {
  const costoNormalViaje   = distNormal  * costoKm;
  const costoDesvioViaje   = distDesvio  * costoKm;
  const costoNormalSemanal = costoNormalViaje  * viajesSemana;
  const costoDesvioSemanal = costoDesvioViaje  * viajesSemana;
  const costoAdicSemanal   = costoDesvioSemanal - costoNormalSemanal;
  const SEMANAS_MES        = 4.33;
  const costoNormalMensual = costoNormalSemanal * SEMANAS_MES;
  const costoDesvioMensual = costoDesvioSemanal * SEMANAS_MES;
  const costoAdicMensual   = costoAdicSemanal   * SEMANAS_MES;
  const costoAdicAnual     = costoAdicSemanal   * 52;
  const pctIncremento      = ((distDesvio - distNormal) / distNormal) * 100;
  const kmExtra            = distDesvio - distNormal;

  return {
    costoNormalViaje, costoDesvioViaje,
    costoNormalSemanal, costoDesvioSemanal, costoAdicSemanal,
    costoNormalMensual, costoDesvioMensual, costoAdicMensual,
    costoAdicAnual, pctIncremento, kmExtra,
    SEMANAS_MES
  };
}

/**
 * Renderiza los resultados del Módulo C en el DOM.
 */
function renderizarResultadosC(distNormal, distDesvio, costoKm, viajesSemana) {
  const r = calcularTransporte(distNormal, distDesvio, costoKm, viajesSemana);
  const panel = $id('resultados-c');
  if (!panel) return;

  // Estado global
  let estadoGlobal, iconoGlobal, mensajeGlobal;
  if (r.pctIncremento === 0) {
    estadoGlobal = 'is-ok'; iconoGlobal = '✅';
    mensajeGlobal = 'No hay desvío: la ruta con desvío es igual a la normal. Gasto adicional: Bs 0.';
  } else if (r.pctIncremento <= 20) {
    estadoGlobal = 'is-ok'; iconoGlobal = '✅';
    mensajeGlobal = `Desvío leve (${fmt(r.pctIncremento, 1)}% de aumento). Gasto semanal adicional: ${fmtBs(r.costoAdicSemanal)}.`;
  } else if (r.pctIncremento <= 50) {
    estadoGlobal = 'is-warning'; iconoGlobal = '⚠️';
    mensajeGlobal = `Desvío moderado (${fmt(r.pctIncremento, 1)}% más de distancia). Gasto mensual adicional: ${fmtBs(r.costoAdicMensual)}.`;
  } else {
    estadoGlobal = 'is-danger'; iconoGlobal = '🚨';
    mensajeGlobal = `Desvío severo (${fmt(r.pctIncremento, 1)}% más de distancia). Gasto anual adicional: ${fmtBs(r.costoAdicAnual)}.`;
  }

  let html = '';
  html += htmlAlerta(estadoGlobal, iconoGlobal, mensajeGlobal);

  // Métricas clave
  html += htmlSeccion('Indicadores de costo');
  html += '<div class="metrics-grid">';
  html += htmlMetrica(fmt(r.kmExtra, 1) + ' km', 'Kilómetros extra/viaje');
  html += htmlMetrica('+' + fmt(r.pctIncremento, 1) + '%', 'Aumento en distancia');
  html += htmlMetrica(fmtBs(r.costoAdicSemanal), 'Gasto adicional/semana');
  html += htmlMetrica(fmtBs(r.costoAdicMensual), 'Gasto adicional/mes');
  html += '</div>';

  // Barra comparativa
  html += htmlSeccion('Proporción del sobrecoste sobre el total');
  html += htmlProgreso(
    (r.costoAdicSemanal / r.costoDesvioSemanal) * 100,
    r.pctIncremento <= 20 ? 'is-ok' : r.pctIncremento <= 50 ? 'is-warning' : 'is-danger',
    'Sobrecoste como % del gasto total con desvío'
  );

  // Tabla comparativa
  html += htmlSeccion('Comparativa de costos');
  html += '<div class="result-table-wrap">';
  html += `<table class="result-table" aria-label="Comparativa de costos de transporte normal vs. con desvío">
    <caption>Costo de transporte: ruta normal vs. ruta con desvío</caption>
    <thead>
      <tr>
        <th scope="col">Concepto</th>
        <th scope="col">Ruta normal</th>
        <th scope="col">Con desvío</th>
        <th scope="col">Diferencia</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Distancia</td>
        <td class="mono">${fmt(distNormal, 1)} km</td>
        <td class="mono">${fmt(distDesvio, 1)} km</td>
        <td class="mono" style="color:var(--danger);">+${fmt(r.kmExtra, 1)} km</td>
      </tr>
      <tr>
        <td>Costo por viaje</td>
        <td class="mono">${fmtBs(r.costoNormalViaje)}</td>
        <td class="mono">${fmtBs(r.costoDesvioViaje)}</td>
        <td class="mono" style="color:var(--danger);">+${fmtBs(r.costoDesvioViaje - r.costoNormalViaje)}</td>
      </tr>
      <tr>
        <td>Costo semanal (${fmt(viajesSemana)} viajes)</td>
        <td class="mono">${fmtBs(r.costoNormalSemanal)}</td>
        <td class="mono">${fmtBs(r.costoDesvioSemanal)}</td>
        <td class="mono" style="color:var(--danger);">+${fmtBs(r.costoAdicSemanal)}</td>
      </tr>
      <tr class="row-warning">
        <td>Costo mensual (×${r.SEMANAS_MES} sem.)</td>
        <td class="mono">${fmtBs(r.costoNormalMensual)}</td>
        <td class="mono">${fmtBs(r.costoDesvioMensual)}</td>
        <td class="mono" style="color:var(--danger);">+${fmtBs(r.costoAdicMensual)}</td>
      </tr>
      <tr class="row-danger">
        <td><strong>Costo anual (×52 sem.)</strong></td>
        <td class="mono"><strong>${fmtBs(r.costoNormalSemanal * 52)}</strong></td>
        <td class="mono"><strong>${fmtBs(r.costoDesvioSemanal * 52)}</strong></td>
        <td class="mono" style="color:var(--danger);font-weight:700;">+${fmtBs(r.costoAdicAnual)}</td>
      </tr>
    </tbody>
  </table></div>`;

  panel.innerHTML = html;
}

/**
 * Maneja el submit del formulario C con event.preventDefault().
 */
function manejarFormularioC(e) {
  e.preventDefault();

  const distNormal  = validarPositivo('c-dist-normal',  'Distancia normal');
  const distDesvio  = validarPositivo('c-dist-desvio',  'Distancia con desvío');
  const costoKm     = validarPositivo('c-costo-km',     'Costo por kilómetro');
  const viajesSem   = validarPositivo('c-viajes',       'Viajes por semana');

  if (distNormal === false || distDesvio === false || costoKm === false || viajesSem === false) return;

  if (distDesvio < distNormal) {
    mostrarError('c-dist-desvio', 'La distancia con desvío debe ser mayor o igual a la distancia normal.');
    return;
  }

  renderizarResultadosC(distNormal, distDesvio, costoKm, viajesSem);
}

/**
 * Carga los datos del caso de estudio del PDF para el Módulo C.
 */
function cargarCasoC() {
  $id('c-dist-normal').value  = '10';
  $id('c-dist-desvio').value  = '16';
  $id('c-costo-km').value     = '2';
  $id('c-viajes').value       = '5';
  limpiarErroresFormulario('form-c');
  renderizarResultadosC(10, 16, 2, 5);
}

/**
 * Inicializa los event listeners del Módulo C.
 */
function initModuloC() {
  const form = $id('form-c');
  if (form) form.addEventListener('submit', manejarFormularioC);

  const btnReset = $id('btn-reset-c');
  if (btnReset) btnReset.addEventListener('click', function() {
    resetearFormulario('form-c');
    const panel = $id('resultados-c');
    if (panel) panel.innerHTML = `<div class="results-placeholder">
      <span aria-hidden="true">🚌</span>
      <p>Los resultados del análisis de transporte aparecerán aquí.</p>
    </div>`;
  });

  const btnCaso = $id('btn-caso-c');
  if (btnCaso) btnCaso.addEventListener('click', cargarCasoC);
}


/* ─────────────────────────────────────────────
   6. NAVEGACIÓN MÓVIL (MENÚ HAMBURGUESA)
   ───────────────────────────────────────────── */

/**
 * Inicializa el menú hamburguesa para móvil.
 */
function initNavegacion() {
  const toggle = $id('menuToggle');
  const nav    = $id('mainNav');

  if (!toggle || !nav) return;

  toggle.addEventListener('click', function() {
    const isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Cerrar el menú al hacer click en un enlace (mobile UX)
  nav.querySelectorAll('a').forEach(function(enlace) {
    enlace.addEventListener('click', function() {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Cerrar el menú al hacer click fuera
  document.addEventListener('click', function(e) {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Resaltar enlace activo de navegación al hacer scroll.
 */
function initNavActiva() {
  const secciones = document.querySelectorAll('[id]');
  const enlaces   = document.querySelectorAll('#mainNav a');

  if (!secciones.length || !enlaces.length) return;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        enlaces.forEach(function(a) {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--accent)' : '';
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  secciones.forEach(function(s) { observer.observe(s); });
}


/* ─────────────────────────────────────────────
   7. INICIALIZACIÓN
   ───────────────────────────────────────────── */

/**
 * Punto de entrada principal.
 * Se ejecuta cuando el DOM está completamente cargado.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Actualizar año del footer
  actualizarAnioFooter();

  // Inicializar módulos de simuladores
  initModuloA();
  initModuloB();
  initModuloC();

  // Inicializar navegación
  initNavegacion();
  initNavActiva();

  console.log('[SimCrisis] Aplicación iniciada correctamente ✅');
});