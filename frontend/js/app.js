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
        </ul>
      </div>
      <div class="module-placeholder">
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
        <tr>
          <td>${producto.id}</td>
          <td>${producto.nombre}</td>
          <td>${producto.stock}</td>
          <td>€${parseFloat(producto.precio).toFixed(2)}</td>
          <td>${producto.ubicacionAlmacen || 'N/A'}</td>
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
        <tr>
          <td>${proveedor.id}</td>
          <td>${proveedor.nombre}</td>
          <td>${proveedor.telefono || 'N/A'}</td>
          <td>${proveedor.email || 'N/A'}</td>
          <td>${proveedor.direccion || 'N/A'}</td>
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
