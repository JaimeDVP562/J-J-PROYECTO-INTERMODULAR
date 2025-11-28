// Simple SPA Router
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
  }

  // Registrar una ruta
  register(path, handler) {
    this.routes[path] = handler;
  }

  // Navegar a una ruta
  navigate(path) {
    if (this.routes[path]) {
      this.currentRoute = path;
      window.location.hash = path;
      this.routes[path]();
      this.updateActiveLink(path);
    } else {
      console.warn(`Ruta no encontrada: ${path}`);
    }
  }

  // Actualizar el enlace activo en la navegación
  updateActiveLink(path) {
    const navItems = document.querySelectorAll('.sidebar nav li');
    navItems.forEach(item => {
      const link = item.querySelector('a');
      if (link && link.getAttribute('href') === `#${path}`) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  // Inicializar el router
  init() {
    // Escuchar cambios en el hash
    window.addEventListener('hashchange', () => {
      const path = window.location.hash.slice(1) || 'dashboard';
      this.navigate(path);
    });

    // Cargar la ruta inicial
    const initialPath = window.location.hash.slice(1) || 'dashboard';
    this.navigate(initialPath);
  }
}

// Crear instancia global del router
const router = new Router();
