# Diagrama Entidad-Relación — J-J ERP

> Base de datos MySQL 8.0. Todas las tablas incluyen `created_at` y `updated_at` gestionados por Eloquent.

---

## Diagrama (notación crow's foot simplificada)

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│   users     │        │    empleados     │        │ departamentos│
│─────────────│        │──────────────────│        │──────────────│
│ id (PK)     │        │ id (PK)          │        │ id (PK)      │
│ name        │        │ nombre           │        │ nombre       │
│ email       │        │ apellido         │        └──────────────┘
│ password    │        │ email            │
│ role        │        │ telefono         │
│ api_token   │        │ fecha_contratacion│
│ photo       │        │ salario          │
└──────┬──────┘        │ puesto           │
       │ 1             └──────────────────┘
       │
       ├──────────────────────────────────────┐
       │ 1                                    │ 1
       ▼ N                                    ▼ N
┌─────────────┐                      ┌─────────────────┐
│  jornadas   │                      │     ventas      │
│─────────────│                      │─────────────────│
│ id (PK)     │                      │ id (PK)         │
│ user_id(FK) │                      │ user_id (FK)    │
│ inicio      │                      │ cliente_id (FK) │
│ fin         │                      │ total           │
└─────────────┘                      │ fecha_venta     │
                                     │ metodo_pago     │
                                     │ notas           │
                                     │ devuelta        │
                                     │ tipo            │
                                     │ concepto        │
                                     └────────┬────────┘
                                              │ 1
                                              │
                                              ▼ N
                                     ┌─────────────────────┐
                                     │   detalle_ventas    │
                                     │─────────────────────│
                                     │ id (PK)             │
                                     │ venta_id (FK)       │
                                     │ producto_id (FK)    │
                                     │ cantidad            │
                                     │ precio_unitario     │
                                     └─────────────────────┘

┌──────────────┐   1      N  ┌──────────────────┐
│  categorias  │─────────────│    productos     │
│──────────────│             │──────────────────│
│ id (PK)      │             │ id (PK)          │
│ nombre       │             │ nombre           │
└──────────────┘             │ sku              │
                             │ descripcion      │
┌──────────────┐   1      N  │ precio           │
│  proveedores │─────────────│ stock_quantity   │
│──────────────│             │ categoria_id(FK) │
│ id (PK)      │             │ proveedor_id(FK) │
│ nombre       │             └────────┬─────────┘
│ contact_email│                      │ 1
│ phone        │                      │
│ address      │                      ▼ 1
└──────────────┘             ┌──────────────────┐
                             │   inventarios    │
                             │──────────────────│
                             │ id (PK)          │
                             │ producto_id (FK) │
                             │ cantidad_disponible│
                             │ cantidad_minima  │
                             │ ubicacion        │
                             └──────────────────┘

┌──────────────┐   1      N  ┌──────────────────┐   1      N  ┌───────────────────┐
│   clientes   │─────────────│    facturas      │─────────────│ detalle_facturas  │
│──────────────│             │──────────────────│             │───────────────────│
│ id (PK)      │             │ id (PK)          │             │ id (PK)           │
│ nombre       │             │ cliente_id (FK)  │             │ factura_id (FK)   │
│ email        │             │ user_id (FK)     │             │ producto_id (FK)  │
│ phone        │             │ proveedor_id(FK) │             │ descripcion       │
│ address      │             │ series           │             │ cantidad          │
└──────────────┘             │ number           │             │ precio_unitario   │
                             │ invoice_id       │             │ iva_porcentaje    │
┌──────────────┐   1      N  │ issue_date       │             │ subtotal          │
│   users      │─────────────│ total_amount     │             └───────────────────┘
└──────────────┘             │ gross_amount     │
                             │ tax_amount       │
                             │ status           │
                             │ payment_method   │
                             └──────────────────┘

┌──────────────────────┐
│    cierre_cajas      │
│──────────────────────│
│ id (PK)              │
│ user_id (FK→users)   │
│ fecha                │
│ total_ventas         │
│ efectivo             │
│ tarjeta              │
│ otros                │
│ notas                │
└──────────────────────┘

┌──────────────────────┐
│    devoluciones      │
│──────────────────────│
│ id (PK)              │
│ venta_id (FK→ventas) │
│ user_id (FK→users)   │
│ motivo               │
│ fecha                │
└──────────────────────┘
```

---

## Relaciones resumidas

| Tabla origen      | Cardinalidad | Tabla destino     | FK en tabla origen      |
|-------------------|:------------:|-------------------|-------------------------|
| ventas            | N → 1        | users             | `user_id`               |
| ventas            | N → 1        | clientes          | `cliente_id`            |
| detalle_ventas    | N → 1        | ventas            | `venta_id`              |
| detalle_ventas    | N → 1        | productos         | `producto_id`           |
| facturas          | N → 1        | clientes          | `cliente_id`            |
| facturas          | N → 1        | users             | `user_id`               |
| facturas          | N → 1        | proveedores       | `proveedor_id`          |
| detalle_facturas  | N → 1        | facturas          | `factura_id`            |
| detalle_facturas  | N → 1        | productos         | `producto_id`           |
| productos         | N → 1        | categorias        | `categoria_id`          |
| productos         | N → 1        | proveedores       | `proveedor_id`          |
| inventarios       | 1 → 1        | productos         | `producto_id`           |
| jornadas          | N → 1        | users             | `user_id`               |
| cierre_cajas      | N → 1        | users             | `user_id`               |
| devoluciones      | 1 → 1        | ventas            | `venta_id`              |
| devoluciones      | N → 1        | users             | `user_id`               |
