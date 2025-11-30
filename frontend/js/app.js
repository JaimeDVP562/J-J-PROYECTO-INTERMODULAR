// Componentes de las vistas
  
const views = {
  dashboard: () => `
    <header>
      <h1>Bienvenido al Mini ERP Modular</h1>
      <p>SaaS escalable y modular para empresas multi-tenant</p>
    </header>
    <section class="kpi-cards">
      <div class="kpi-card">
        <h2>Facturación</h2>
        <p>€12,500</p>
      </div>
      <div class="kpi-card">
        <h2>Stock</h2>
        <p>320 productos</p>
      </div>
      <div class="kpi-card">
        <h2>Control Horario</h2>
        <p>98% fichajes</p>
      </div>
      <div class="kpi-card">
        <h2>Notificaciones</h2>
        <p>3 nuevas</p>
      </div>
    </section>
    <section class="modules">
      <h2>Módulos Activos</h2>
      <ul>
        <li class="module active">Facturación</li>
        <li class="module active">Stock</li>
        <li class="module active">Control Horario</li>
        <li class="module">Vacaciones</li>
        <li class="module">CRM</li>
      </ul>
    </section>
  `,

  facturacion: () => `
    <header>
      <h1>Facturación</h1>
      <p>Gestión de facturas, presupuestos y cobros.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Funcionalidades</h2>
        <ul>
          <li>Emisión de facturas y presupuestos</li>
          <li>Control de cobros y pagos</li>
          <li>Series de facturación personalizables</li>
          <li>Generación de PDFs automáticos</li>
          <li>Integración con pasarelas de pago</li>
        </ul>
      </div>
      <div style="margin: 24px 0;">
        <button class="btn-primary" onclick="loadProveedores()">Cargar Proveedores</button>
      </div>
      <div id="proveedores-container">
        <div class="module-placeholder">
          <p><em>Haz clic en el botón para cargar los proveedores.</em></p>
        </div>
      </div>
    </section>
  `,

  stock: () => `
    <header>
      <h1>Stock / Inventario</h1>
      <p>Control de productos, existencias y movimientos de inventario.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Acciones principales</h2>
        <ul>
          <li>Alta, baja y modificación de productos</li>
          <li>Control de existencias y alertas de stock mínimo</li>
          <li>Movimientos de entrada/salida</li>
          <li>Códigos de barras y categorías</li>
          <li>Historial de movimientos</li>
        </ul>
      </div>
      <div style="margin: 24px 0; display:flex; justify-content:flex-end; gap:12px;">
        <button class="btn-primary" onclick="showProductForm()">Nuevo producto</button>
      </div>
      <div id="productos-container">
        <div class="module-placeholder">
          <p><em>Cargando productos...</em></p>
        </div>
      </div>
    </section>
  `,

  'control-horario': () => `
    <header>
      <h1>Control Horario</h1>
      <p>Fichaje de empleados, turnos y generación de informes.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Gestión de horarios</h2>
        <ul>
          <li>Fichaje de entrada y salida</li>
          <li>Registro de turnos y horarios</li>
          <li>Informes de asistencia</li>
          <li>Cálculo de horas extras</li>
          <li>Integración con nóminas</li>
      <div style="margin: 24px 0; display:flex; gap:12px; align-items:center;">
        <button class="btn-primary" onclick="loadProveedores()">Cargar Proveedores</button>
        <button id="btn-nuevo-proveedor" class="btn-secondary" onclick="showProveedorForm()" style="background:#fff;color:#0b63d6;border:1px solid #0b63d6;padding:10px 14px;border-radius:8px;box-shadow:none;">Nuevo proveedor</button>
      </div>
        <p><em>Próximamente: Panel de fichajes y calendario de turnos.</em></p>
      </div>
    </section>
  `,

  configuracion: () => `
    <header>
      <h1>Configuración</h1>
      <p>Ajustes generales del sistema y personalización.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Opciones de configuración</h2>
        <ul>
          <li>Datos de la empresa</li>
          <li>Usuarios y permisos</li>
          <li>Parámetros del sistema</li>
          <li>Integraciones externas</li>
          <li>Backup y seguridad</li>
        </ul>
      </div>
      <div class="module-placeholder">
        <p><em>Próximamente: Panel de configuración completo.</em></p>
      </div>
    </section>
  `,

  vacaciones: () => `
    <header>
      <h1>Vacaciones</h1>
      <p>Gestión de solicitudes de vacaciones y ausencias.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Gestión de ausencias</h2>
        <ul>
          <li>Solicitud de vacaciones</li>
          <li>Aprobación/rechazo de solicitudes</li>
          <li>Calendario de disponibilidad</li>
          <li>Saldo de días disponibles</li>
          <li>Historial de ausencias</li>
        </ul>
      </div>
      <div class="module-placeholder">
        <p><em>Próximamente: Calendario de vacaciones y formulario de solicitudes.</em></p>
      </div>
    </section>
  `,

  crm: () => `
    <header>
      <h1>CRM</h1>
      <p>Gestión de clientes, contactos y oportunidades de venta.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Gestión comercial</h2>
        <ul>
          <li>Ficha de clientes y contactos</li>
          <li>Seguimiento de oportunidades</li>
          <li>Pipeline de ventas</li>
          <li>Historial de comunicaciones</li>
          <li>Informes comerciales</li>
        </ul>
      </div>
      <div class="module-placeholder">
        <p><em>Próximamente: Listado de clientes y pipeline de ventas.</em></p>
      </div>
    </section>
  `,

  compras: () => `
    <header>
      <h1>Compras</h1>
      <p>Gestión de proveedores, pedidos y recepciones.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Gestión de compras</h2>
        <ul>
          <li>Alta de proveedores</li>
          <li>Creación de pedidos</li>
          <li>Control de recepciones</li>
          <li>Seguimiento de pagos</li>
          <li>Comparativas de precios</li>
        </ul>
      </div>
      <div class="module-placeholder">
        <p><em>Próximamente: Listado de proveedores y gestión de pedidos.</em></p>
      </div>
    </section>
  `,

  notificaciones: () => `
    <header>
      <h1>Notificaciones</h1>
      <p>Centro de notificaciones y alertas del sistema.</p>
    </header>
    <section>
      <div class="module-description">
        <h2>Alertas del sistema</h2>
        <ul>
          <li>Notificaciones en tiempo real</li>
          <li>Alertas de stock mínimo</li>
          <li>Recordatorios de tareas</li>
          <li>Avisos de facturación</li>
          <li>Eventos del sistema</li>
        </ul>
      </div>
      <div class="module-placeholder">
        <p><em>Próximamente: Panel de notificaciones con filtros.</em></p>
      </div>
    </section>
  `
};

// Estado de paginación simple en memoria
let productosState = { page: 1, limit: 10 };
let proveedoresState = { page: 1, limit: 10 };

// Función para renderizar una vista
function render(viewName) {
  const app = document.getElementById('app');
  if (views[viewName]) {
    app.innerHTML = views[viewName]();
    
    // Si es la vista de stock, cargar productos
    if (viewName === 'stock') {
      productosState = { page: 1, limit: 10 };
      loadProductos(productosState.page, productosState.limit);
    }

    // Si es la vista de facturación, cargar proveedores automáticamente
    if (viewName === 'facturacion') {
      proveedoresState = { page: 1, limit: 10 };
      // carga automática y muestra botón "Nuevo proveedor" en la cabecera
      loadProveedores(proveedoresState.page, proveedoresState.limit);
    }
  } else {
    app.innerHTML = '<p>Vista no encontrada</p>';
  }
}

// Función para cargar productos desde la API con paginación
async function loadProductos(page = 1, limit = 10) {
  const container = document.getElementById('productos-container');
  productosState.page = page;
  productosState.limit = limit;

  try {
    const response = await fetch(`http://localhost:8080/backend/api/productos.php?page=${page}&limit=${limit}`, {
      headers: {
        'Accept': 'application/json; charset=UTF-8'
      }
    });
    const result = await response.json();
    const productos = result.data || result;
    const pagination = result.pagination || { page, limit, total: productos.length, totalPages: 1, offset: 0 };

    const start = pagination.total === 0 ? 0 : (pagination.offset + 1);
    const end = Math.min(pagination.offset + pagination.limit, pagination.total || productos.length);

    let html = `
      <div class="productos-table">
        <div style="display:flex; justify-content: space-between; align-items:center; gap:16px; flex-wrap:wrap;">
          <h2 style="margin:0;">Lista de Productos</h2>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="opacity:0.8;">Mostrando ${start}–${end} de ${pagination.total}</span>
            <label style="display:flex; align-items:center; gap:6px;">
              <span style="opacity:0.8;">Por página</span>
              <select id="productos-limit" style="padding:6px 8px;">
                <option value="10" ${pagination.limit === 10 ? 'selected' : ''}>10</option>
                <option value="20" ${pagination.limit === 20 ? 'selected' : ''}>20</option>
                <option value="50" ${pagination.limit === 50 ? 'selected' : ''}>50</option>
              </select>
            </label>
          </div>
        </div>
        <div style="overflow:auto; margin-top:12px;">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Ubicación</th>
              </tr>
            </thead>
            <tbody>
    `;

    productos.forEach(producto => {
      html += `
        <tr id="prod-row-${producto.id}" data-id="${producto.id}" data-nombre="${escapeHtml(producto.nombre)}" data-stock="${producto.stock ?? 0}" data-precio="${producto.precio ?? 0}" data-ubicacion="${escapeHtml(producto.ubicacionAlmacen || '')}">
          <td>${producto.id}</td>
          <td>${escapeHtml(producto.nombre)}</td>
          <td>${producto.stock}</td>
          <td>€${parseFloat(producto.precio).toFixed(2)}</td>
          <td>${escapeHtml(producto.ubicacionAlmacen || 'N/A')}</td>
          <td style="white-space:nowrap;">
            <button class="btn-sm" data-action="edit" data-id="${producto.id}">Editar</button>
            <button class="btn-sm btn-danger" data-action="delete" data-id="${producto.id}">Borrar</button>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
        <div class="pagination-controls" style="display:flex; align-items:center; justify-content:center; gap:12px; margin-top:12px;">
          <button data-action="prev" ${pagination.page <= 1 ? 'disabled' : ''}>Anterior</button>
          <span>Página ${pagination.page} de ${pagination.totalPages}</span>
          <button data-action="next" ${pagination.page >= pagination.totalPages ? 'disabled' : ''}>Siguiente</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const limitSelect = container.querySelector('#productos-limit');
    if (limitSelect) {
      limitSelect.addEventListener('change', (e) => {
        const newLimit = parseInt(e.target.value, 10);
        loadProductos(1, newLimit);
      });
    }

    const prevBtn = container.querySelector('button[data-action="prev"]');
    const nextBtn = container.querySelector('button[data-action="next"]');
    if (prevBtn) prevBtn.addEventListener('click', () => loadProductos(pagination.page - 1, pagination.limit));
    if (nextBtn) nextBtn.addEventListener('click', () => loadProductos(pagination.page + 1, pagination.limit));
    // Attach edit/delete handlers (inline edit for products)
    container.querySelectorAll('button[data-action="edit"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const row = btn.closest('tr');
        enableInlineEditProduct(row);
      });
    });
    container.querySelectorAll('button[data-action="delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        deleteProduct(id);
      });
    });
  } catch (error) {
    container.innerHTML = `
      <div class="module-placeholder">
        <p style="color: #e74c3c;"><em>Error al cargar productos: ${error.message}</em></p>
      </div>
    `;
  }
}

// Función para cargar proveedores desde la API con paginación
async function loadProveedores(page = 1, limit = 10) {
  const container = document.getElementById('proveedores-container');
  proveedoresState.page = page;
  proveedoresState.limit = limit;
  container.innerHTML = '<div class="module-placeholder"><p><em>Cargando proveedores...</em></p></div>';

  try {
    const response = await fetch(`http://localhost:8080/backend/api/proveedores.php?page=${page}&limit=${limit}`, {
      headers: {
        'Accept': 'application/json; charset=UTF-8'
      }
    });
    const result = await response.json();
    const proveedores = result.data || result;
    const pagination = result.pagination || { page, limit, total: proveedores.length, totalPages: 1, offset: 0 };

    const start = pagination.total === 0 ? 0 : (pagination.offset + 1);
    const end = Math.min(pagination.offset + pagination.limit, pagination.total || proveedores.length);

    let html = `
      <div class="productos-table">
        <div style="display:flex; justify-content: space-between; align-items:center; gap:16px; flex-wrap:wrap;">
          <h2 style="margin:0;">Lista de Proveedores</h2>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="opacity:0.8;">Mostrando ${start}–${end} de ${pagination.total}</span>
            <label style="display:flex; align-items:center; gap:6px;">
              <span style="opacity:0.8;">Por página</span>
              <select id="proveedores-limit" style="padding:6px 8px;">
                <option value="10" ${pagination.limit === 10 ? 'selected' : ''}>10</option>
                <option value="20" ${pagination.limit === 20 ? 'selected' : ''}>20</option>
                <option value="50" ${pagination.limit === 50 ? 'selected' : ''}>50</option>
              </select>
            </label>
          </div>
        </div>
        <div style="overflow:auto; margin-top:12px;">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
    `;

    proveedores.forEach(proveedor => {
      html += `
        <tr id="prov-row-${proveedor.id}" data-id="${proveedor.id}" data-nombre="${escapeHtml(proveedor.nombre)}" data-telefono="${escapeHtml(proveedor.telefono || '')}" data-email="${escapeHtml(proveedor.email || '')}" data-direccion="${escapeHtml(proveedor.direccion || '')}">
          <td>${proveedor.id}</td>
          <td>${escapeHtml(proveedor.nombre)}</td>
          <td>${escapeHtml(proveedor.telefono || 'N/A')}</td>
          <td>${escapeHtml(proveedor.email || 'N/A')}</td>
          <td>${escapeHtml(proveedor.direccion || 'N/A')}</td>
          <td style="white-space:nowrap;">
            <button class="btn-sm" data-action="edit-prov" data-id="${proveedor.id}">Editar</button>
            <button class="btn-sm btn-danger" data-action="delete-prov" data-id="${proveedor.id}">Borrar</button>
          </td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
        </div>
        <div class="pagination-controls" style="display:flex; align-items:center; justify-content:center; gap:12px; margin-top:12px;">
          <button data-action="prev" ${pagination.page <= 1 ? 'disabled' : ''}>Anterior</button>
          <span>Página ${pagination.page} de ${pagination.totalPages}</span>
          <button data-action="next" ${pagination.page >= pagination.totalPages ? 'disabled' : ''}>Siguiente</button>
        </div>
      </div>
    `;

    container.innerHTML = html;

    const limitSelect = container.querySelector('#proveedores-limit');
    if (limitSelect) {
      limitSelect.addEventListener('change', (e) => {
        const newLimit = parseInt(e.target.value, 10);
        loadProveedores(1, newLimit);
      });
    }

    const prevBtn = container.querySelector('button[data-action="prev"]');
    const nextBtn = container.querySelector('button[data-action="next"]');
    if (prevBtn) prevBtn.addEventListener('click', () => loadProveedores(pagination.page - 1, pagination.limit));
    if (nextBtn) nextBtn.addEventListener('click', () => loadProveedores(pagination.page + 1, pagination.limit));
    // Attach edit/delete handlers for providers (inline edit)
    const editBtns = container.querySelectorAll('button[data-action="edit-prov"]');
    editBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        enableInlineEditProveedor(row);
      });
    });
    container.querySelectorAll('button[data-action="delete-prov"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        deleteProveedor(id);
      });
    });
  } catch (error) {
    container.innerHTML = `
      <div class="module-placeholder">
        <p style="color: #e74c3c;"><em>Error al cargar proveedores: ${error.message}</em></p>
      </div>
    `;
  }
}

// Registrar todas las rutas
Object.keys(views).forEach(viewName => {
  router.register(viewName, () => render(viewName));
});

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  router.init();
});

/*** Form modal utilities for products and providers ***/
function createModalHtml(title, fieldsHtml, submitText = 'Guardar') {
  return `
    <div class="modal-overlay">
      <div class="modal">
        <header>
          <h3>${title}</h3>
        </header>
        <div class="modal-body">
          ${fieldsHtml}
          <div id="form-errors" style="color:#c0392b; margin-top:8px;"></div>
        </div>
        <footer style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px;">
          <button class="btn-secondary" onclick="hideModal()">Cancelar</button>
          <button class="btn-primary" id="modal-submit">${submitText}</button>
        </footer>
      </div>
    </div>
  `;
}

function showModal(html) {
  hideModal();
  const wrapper = document.createElement('div');
  wrapper.id = 'global-modal-wrapper';
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
}

function hideModal() {
  const existing = document.getElementById('global-modal-wrapper');
  if (existing) existing.remove();
}

/* --- Product form --- */
async function showProductForm(data = null) {
  const isEdit = data !== null;
  const title = isEdit ? `Editar producto #${data.id}` : 'Nuevo producto';
  const fields = `
    <label>Nombre<br/><input id="pf-nombre" type="text" value="${isEdit ? escapeHtml(data.nombre) : ''}"/></label>
    <label>Stock<br/><input id="pf-stock" type="number" min="0" value="${isEdit ? (data.stock ?? 0) : 0}"/></label>
    <label>Precio<br/><input id="pf-precio" type="number" step="0.01" min="0" value="${isEdit ? data.precio : '0.00'}"/></label>
    <label>Proveedor (id)<br/><input id="pf-proveedor" type="number" value="${isEdit && data.proveedor ? data.proveedor : ''}"/></label>
    <label>Ubicación<br/><input id="pf-ubicacion" type="text" value="${isEdit ? (data.ubicacionAlmacen || '') : ''}"/></label>
  `;
  showModal(createModalHtml(title, fields, isEdit ? 'Actualizar' : 'Crear'));

  document.getElementById('modal-submit').addEventListener('click', async () => {
    await submitProductForm(isEdit ? data.id : null);
  });
}

async function submitProductForm(id = null) {
  const nombre = document.getElementById('pf-nombre').value.trim();
  const stock = parseInt(document.getElementById('pf-stock').value || '0', 10);
  const precio = parseFloat(document.getElementById('pf-precio').value || '0');
  const proveedor = document.getElementById('pf-proveedor').value;
  const ubicacion = document.getElementById('pf-ubicacion').value.trim();

  const payload = {
    nombre,
    stock,
    precio,
    proveedor: proveedor === '' ? null : parseInt(proveedor, 10),
    ubicacionAlmacen: ubicacion === '' ? null : ubicacion
  };

  const errorsEl = document.getElementById('form-errors');
  errorsEl.innerHTML = '';

  try {
    const url = 'http://localhost:8080/backend/api/productos.php' + (id ? `?id=${id}` : '');
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body && body.errors) {
        errorsEl.innerHTML = body.errors.map(e => `<div>${escapeHtml(e)}</div>`).join('');
      } else if (body && body.error) {
        errorsEl.textContent = body.error;
      } else {
        errorsEl.textContent = 'Error desconocido al guardar producto.';
      }
      return;
    }

    hideModal();
    // refresh list
    loadProductos(productosState.page, productosState.limit);
  } catch (err) {
    errorsEl.textContent = err.message;
  }
}

async function editProduct(id) {
  try {
    const res = await fetch(`http://localhost:8080/backend/api/productos.php?id=${id}`);
    if (!res.ok) throw new Error('No se pudo obtener producto');
    const data = await res.json();
    showProductForm(data);
  } catch (err) {
    alert('Error al cargar producto: ' + err.message);
  }
}

async function deleteProduct(id) {
  if (!confirm('¿Eliminar producto #' + id + '?')) return;
  try {
    const res = await fetch(`http://localhost:8080/backend/api/productos.php?id=${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      loadProductos(productosState.page, productosState.limit);
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'No se pudo eliminar');
    }
  } catch (err) {
    alert('Error de red: ' + err.message);
  }
}

// Enable inline editing of a product row (Save / Cancel) and submit via PUT
function enableInlineEditProduct(row) {
  if (!row) return;
  const id = row.dataset.id;
  const orig = {
    nombre: row.dataset.nombre || '',
    stock: row.dataset.stock || 0,
    precio: row.dataset.precio || 0,
    ubicacion: row.dataset.ubicacion || ''
  };

  row.innerHTML = `
    <td>${id}</td>
    <td><input class="input-small" id="prod-name-${id}" value="${escapeHtml(orig.nombre)}" /></td>
    <td><input class="input-small" id="prod-stock-${id}" type="number" min="0" value="${escapeHtml(orig.stock)}" /></td>
    <td><input class="input-small" id="prod-precio-${id}" type="number" step="0.01" min="0" value="${escapeHtml(orig.precio)}" /></td>
    <td><input class="input-small" id="prod-ubic-${id}" value="${escapeHtml(orig.ubicacion)}" /></td>
    <td style="white-space:nowrap;">
      <button class="btn-sm" id="prod-save-${id}">Guardar</button>
      <button class="btn-sm btn-secondary" id="prod-cancel-${id}">Cancelar</button>
    </td>
  `;

  const restoreRow = (data) => {
    row.dataset.nombre = data.nombre;
    row.dataset.stock = data.stock;
    row.dataset.precio = data.precio;
    row.dataset.ubicacion = data.ubicacion;
    row.innerHTML = `
      <td>${id}</td>
      <td>${escapeHtml(data.nombre)}</td>
      <td>${data.stock}</td>
      <td>€${parseFloat(data.precio).toFixed(2)}</td>
      <td>${escapeHtml(data.ubicacion || 'N/A')}</td>
      <td style="white-space:nowrap;">
        <button class="btn-sm" data-action="edit" data-id="${id}">Editar</button>
        <button class="btn-sm btn-danger" data-action="delete" data-id="${id}">Borrar</button>
      </td>
    `;
    const editBtn = row.querySelector('button[data-action="edit"]');
    const delBtn = row.querySelector('button[data-action="delete"]');
    if (editBtn) editBtn.addEventListener('click', () => enableInlineEditProduct(row));
    if (delBtn) delBtn.addEventListener('click', () => deleteProduct(parseInt(id, 10)));
  };

  document.getElementById(`prod-cancel-${id}`).addEventListener('click', () => restoreRow(orig));

  document.getElementById(`prod-save-${id}`).addEventListener('click', async () => {
    const payload = {
      nombre: document.getElementById(`prod-name-${id}`).value.trim(),
      stock: parseInt(document.getElementById(`prod-stock-${id}`).value || '0', 10),
      precio: parseFloat(document.getElementById(`prod-precio-${id}`).value || '0'),
      ubicacionAlmacen: document.getElementById(`prod-ubic-${id}`).value.trim()
    };
    try {
      const res = await fetch(`http://localhost:8080/backend/api/productos.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.error || 'Error al guardar producto');
        return;
      }
      // Normalize data for restore
      const restored = { nombre: payload.nombre, stock: payload.stock, precio: payload.precio, ubicacion: payload.ubicacionAlmacen };
      restoreRow(restored);
    } catch (err) {
      alert('Error de red: ' + err.message);
    }
  });
}

/* --- Provider form --- */
async function showProveedorForm(data = null) {
  const isEdit = data !== null;
  const title = isEdit ? `Editar proveedor #${data.id}` : 'Nuevo proveedor';
  const fields = `
    <label>Nombre<br/><input id="pfv-nombre" type="text" value="${isEdit ? escapeHtml(data.nombre) : ''}"/></label>
    <label>Teléfono<br/><input id="pfv-telefono" type="text" value="${isEdit ? (data.telefono || '') : ''}"/></label>
    <label>Email<br/><input id="pfv-email" type="email" value="${isEdit ? (data.email || '') : ''}"/></label>
    <label>Dirección<br/><input id="pfv-direccion" type="text" value="${isEdit ? (data.direccion || '') : ''}"/></label>
  `;
  showModal(createModalHtml(title, fields, isEdit ? 'Actualizar' : 'Crear'));

  document.getElementById('modal-submit').addEventListener('click', async () => {
    await submitProveedorForm(isEdit ? data.id : null);
  });
}

async function submitProveedorForm(id = null) {
  const nombre = document.getElementById('pfv-nombre').value.trim();
  const telefono = document.getElementById('pfv-telefono').value.trim();
  const email = document.getElementById('pfv-email').value.trim();
  const direccion = document.getElementById('pfv-direccion').value.trim();

  const payload = { nombre, telefono, email, direccion };
  const errorsEl = document.getElementById('form-errors');
  errorsEl.innerHTML = '';

  try {
    const url = 'http://localhost:8080/backend/api/proveedores.php' + (id ? `?id=${id}` : '');
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body && body.errors) {
        errorsEl.innerHTML = body.errors.map(e => `<div>${escapeHtml(e)}</div>`).join('');
      } else if (body && body.error) {
        errorsEl.textContent = body.error;
      } else {
        errorsEl.textContent = 'Error desconocido al guardar proveedor.';
      }
      return;
    }

    hideModal();
    // refresh providers list
    loadProveedores(proveedoresState.page, proveedoresState.limit);
  } catch (err) {
    errorsEl.textContent = err.message;
  }
}

async function editProveedor(id) {
  try {
    const res = await fetch(`http://localhost:8080/backend/api/proveedores.php?id=${id}`);
    if (!res.ok) throw new Error('No se pudo obtener proveedor');
    const data = await res.json();
    showProveedorForm(data);
  } catch (err) {
    alert('Error al cargar proveedor: ' + err.message);
  }
}

async function deleteProveedor(id) {
  if (!confirm('¿Eliminar proveedor #' + id + '?')) return;
  try {
    const res = await fetch(`http://localhost:8080/backend/api/proveedores.php?id=${id}`, { method: 'DELETE' });
    if (res.status === 204) {
      loadProveedores(proveedoresState.page, proveedoresState.limit);
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error || 'No se pudo eliminar');
    }
  } catch (err) {
    alert('Error de red: ' + err.message);
  }
}

// Enable inline editing of a provider row (Save / Cancel) and submit via PUT
function enableInlineEditProveedor(row) {
  if (!row) return;
  const id = row.dataset.id;
  const orig = {
    nombre: row.dataset.nombre || '',
    telefono: row.dataset.telefono || '',
    email: row.dataset.email || '',
    direccion: row.dataset.direccion || ''
  };

  row.innerHTML = `
    <td>${id}</td>
    <td><input class="input-small" id="prov-name-${id}" value="${escapeHtml(orig.nombre)}" /></td>
    <td><input class="input-small" id="prov-tel-${id}" value="${escapeHtml(orig.telefono)}" /></td>
    <td><input class="input-small" id="prov-email-${id}" value="${escapeHtml(orig.email)}" /></td>
    <td><input class="input-small" id="prov-dir-${id}" value="${escapeHtml(orig.direccion)}" /></td>
    <td style="white-space:nowrap;">
      <button class="btn-sm" id="prov-save-${id}">Guardar</button>
      <button class="btn-sm btn-secondary" id="prov-cancel-${id}">Cancelar</button>
    </td>
  `;

  const restoreRow = (data) => {
    row.dataset.nombre = data.nombre;
    row.dataset.telefono = data.telefono;
    row.dataset.email = data.email;
    row.dataset.direccion = data.direccion;
    row.innerHTML = `
      <td>${id}</td>
      <td>${escapeHtml(data.nombre)}</td>
      <td>${escapeHtml(data.telefono || 'N/A')}</td>
      <td>${escapeHtml(data.email || 'N/A')}</td>
      <td>${escapeHtml(data.direccion || 'N/A')}</td>
      <td style="white-space:nowrap;">
        <button class="btn-sm" data-action="edit-prov" data-id="${id}">Editar</button>
        <button class="btn-sm btn-danger" data-action="delete-prov" data-id="${id}">Borrar</button>
      </td>
    `;
    const editBtn = row.querySelector('button[data-action="edit-prov"]');
    const delBtn = row.querySelector('button[data-action="delete-prov"]');
    if (editBtn) editBtn.addEventListener('click', () => enableInlineEditProveedor(row));
    if (delBtn) delBtn.addEventListener('click', () => deleteProveedor(parseInt(id, 10)));
  };

  document.getElementById(`prov-cancel-${id}`).addEventListener('click', () => restoreRow(orig));

  document.getElementById(`prov-save-${id}`).addEventListener('click', async () => {
    const payload = {
      nombre: document.getElementById(`prov-name-${id}`).value.trim(),
      telefono: document.getElementById(`prov-tel-${id}`).value.trim(),
      email: document.getElementById(`prov-email-${id}`).value.trim(),
      direccion: document.getElementById(`prov-dir-${id}`).value.trim()
    };
    try {
      const res = await fetch(`http://localhost:8080/backend/api/proveedores.php?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        alert(body.error || 'Error al guardar proveedor');
        return;
      }
      restoreRow(payload);
    } catch (err) {
      alert('Error de red: ' + err.message);
    }
  });
}



// small helper to avoid XSS when inserting values
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[s];
  });
}


