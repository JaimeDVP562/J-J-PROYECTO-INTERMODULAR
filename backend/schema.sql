-- Crear base de datos
CREATE DATABASE IF NOT EXISTS JJPROYECT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE JJPROYECT;

-- Eliminar tablas existentes si existen
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS proveedor;

-- Tabla de proveedores
CREATE TABLE IF NOT EXISTS proveedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    proveedor INT,
    ubicacionAlmacen VARCHAR(100),
    FOREIGN KEY (proveedor) REFERENCES proveedor(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_proveedor (proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Datos de ejemplo para proveedores (Negocio: Ferretería)
INSERT INTO proveedor (nombre, telefono, email, direccion) VALUES
('Herramientas Industriales S.L.', '912345678', 'ventas@herramientasindustriales.com', 'Polígono Industrial Las Rozas, Nave 12, Madrid'),
('Tornillería García Hermanos', '923456789', 'info@tornilleriagarcia.com', 'Calle del Metal 45, Barcelona'),
('Distribuciones Eléctricas del Norte', '934567890', 'comercial@electricasnorte.com', 'Avenida de la Industria 78, Bilbao'),
('Pinturas y Barnices Colores S.A.', '945678901', 'pedidos@pinturascolores.com', 'Carretera de Valencia km 23, Valencia'),
('Fontanería Pro Suministros', '956789012', 'contacto@fontaneriapro.com', 'Calle Saneamiento 15, Sevilla');

-- Datos de ejemplo para productos (Negocio: Ferretería)
INSERT INTO productos (nombre, stock, precio, proveedor, ubicacionAlmacen) VALUES
-- Herramientas
('Taladro percutor 850W', 45, 89.99, 1, 'A-01'),
('Martillo de carpintero 500g', 120, 12.50, 1, 'A-02'),
('Destornillador eléctrico', 35, 45.00, 1, 'A-03'),
('Sierra circular 1200W', 25, 135.00, 1, 'A-04'),
('Llave inglesa ajustable 12"', 80, 18.75, 1, 'A-05'),
-- Tornillería
('Tornillos autorroscantes 4x40mm (caja 100 uds)', 200, 5.99, 2, 'B-01'),
('Tuercas hexagonales M8 (bolsa 50 uds)', 150, 3.50, 2, 'B-02'),
('Tirafondos 8x80mm (caja 50 uds)', 100, 8.25, 2, 'B-03'),
('Arandelas planas M10 (bolsa 100 uds)', 175, 4.20, 2, 'B-04'),
('Pernos DIN 933 M12x50 (caja 25 uds)', 90, 12.00, 2, 'B-05'),
-- Material eléctrico
('Cable eléctrico 2x1.5mm (rollo 100m)', 60, 45.00, 3, 'C-01'),
('Interruptor conmutador blanco', 250, 3.75, 3, 'C-02'),
('Enchufe schuko empotrar', 300, 2.50, 3, 'C-03'),
('Caja de registro 100x100mm', 180, 1.85, 3, 'C-04'),
('Lámpara LED 12W luz cálida', 140, 8.90, 3, 'C-05'),
-- Pinturas
('Pintura plástica blanca mate 15L', 75, 38.50, 4, 'D-01'),
('Esmalte sintético azul brillante 750ml', 95, 12.80, 4, 'D-02'),
('Barniz para madera satinado 4L', 50, 28.90, 4, 'D-03'),
('Rodillo recambio antigota 25cm', 220, 4.50, 4, 'D-04'),
('Brocha plana profesional 70mm', 165, 6.75, 4, 'D-05'),
-- Fontanería
('Tubo PVC evacuación Ø110mm (barra 3m)', 85, 15.60, 5, 'E-01'),
('Grifo monomando lavabo cromado', 55, 42.00, 5, 'E-02'),
('Válvula antirretorno 1/2"', 130, 8.40, 5, 'E-03'),
('Sifón botella extensible cromado', 100, 11.25, 5, 'E-04'),
('Cinta teflón fontanería (rollo 12m)', 280, 1.50, 5, 'E-05');

-- Tabla de usuarios para autenticación (opcional para entorno de desarrollo)
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INSERT de ejemplo: usuario de prueba para desarrollo
-- Usuario: `admin`  |  Contraseña: `admin`
-- Para facilitar copiar/pegar en phpMyAdmin en entornos de clase, aquí se inserta
-- la contraseña como MD5 (NO recomendado en producción). El sistema de login
-- aceptará este formato como fallback para entornos locales/educativos.
INSERT INTO users (username, password_hash, role, created_at) VALUES
('admin', '21232f297a57a5a743894a0e4a801fc3', 'admin', NOW());

-- Si prefieres crear usuarios seguros, borra este INSERT y usa
-- `backend/scripts/create_user.php` o genera contraseñas con `password_hash()`.
