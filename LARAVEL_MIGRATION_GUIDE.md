# 🚀 Guía Completa de Migración a Laravel API

## 🏗️ ARQUITECTURA DEL PROYECTO

### **Estructura Profesional de Directorios**

```
J-J-PROYECTO-INTERMODULAR/
│
├── backend-api/                    # API REST Laravel (este proyecto)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── tests/
│   ├── docker/
│   ├── .env.example
│   ├── docker-compose.yml
│   └── README.md
│
├── frontend-angular/               # Cliente Angular (futuro)
│   ├── src/
│   ├── angular.json
│   ├── package.json
│   └── README.md
│
├── frontend-react/                 # Cliente React (futuro)
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── infrastructure/                 # IaC Terraform
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── production/
│   ├── modules/
│   │   ├── api/
│   │   ├── database/
│   │   ├── cdn/
│   │   └── monitoring/
│   ├── main.tf
│   └── variables.tf
│
├── docs/                          # Documentación compartida
│   ├── api/
│   │   ├── openapi.yaml
│   │   └── postman/
│   ├── architecture/
│   └── deployment/
│
└── docker-compose.yml            # Orquestación multi-servicio (desarrollo)
```

---

## 📋 ANÁLISIS COMPLETO DE RECURSOS (Del ERP_PROJECT_PLAN.md)

### **FASE 1 - MVP (Prioridad Alta)**

#### 🔐 **Autenticación y Multi-tenant**
- **Companies** (Empresas)
- **Users** (Usuarios)
- **Roles** (Roles)
- **Permissions** (Permisos)
- **RolePermissions** (Pivot)
- **Modules** (Módulos disponibles)
- **CompanyModules** (Módulos activos por empresa)
- **AuditLogs** (Logs de auditoría)

#### 💰 **Facturación / Contabilidad**
- **Clients** (Clientes)
- **Suppliers** (Proveedores - alias de Proveedor)
- **Invoices** (Facturas)
- **InvoiceItems** (Líneas de factura)
- **PaymentMethods** (Métodos de pago)
- **Taxes** (Impuestos)
- **InvoiceStatuses** (Estados: Borrador, Enviada, Pagada, Vencida)

#### 📦 **Stock / Inventario**
- **Products** (Productos)
- **ProductCategories** (Categorías de productos)
- **Warehouses** (Almacenes)
- **StockMovements** (Movimientos de stock)
- **Inventory** (Inventario actual)
- **StockAlerts** (Alertas de stock mínimo)

#### ⏰ **Control Horario**
- **TimeEntries** (Fichajes - entrada/salida)
- **TimeSchedules** (Horarios asignados)
- **TimeReports** (Informes de horas)
- **OvertimeRecords** (Registro de horas extras)

#### 📊 **Dashboard**
- **DashboardWidgets** (Widgets configurables)
- **KpiMetrics** (Métricas KPI)
- **Activities** (Actividad reciente)

---

### **FASE 2 - AMPLIACIÓN**

#### 🏖️ **Vacaciones**
- **VacationRequests** (Solicitudes)
- **VacationBalances** (Saldo de días)
- **VacationPolicies** (Políticas por empresa)
- **VacationTypes** (Tipo: vacaciones, permiso, baja)
- **VacationApprovals** (Historial de aprobaciones)

#### 👥 **CRM**
- **CrmContacts** (Contactos)
- **CrmCompanies** (Empresas cliente)
- **CrmOpportunities** (Oportunidades de venta)
- **CrmActivities** (Interacciones)
- **CrmPipelines** (Pipelines de ventas)
- **CrmStages** (Etapas del pipeline)
- **CrmLeads** (Leads)
- **CrmTasks** (Tareas de seguimiento)

#### 🛒 **Compras**
- **PurchaseOrders** (Órdenes de compra)
- **PurchaseOrderItems** (Líneas de orden)
- **SupplierEvaluations** (Evaluaciones de proveedores)
- **Receptions** (Recepciones de mercancía)
- **SupplierPayments** (Pagos a proveedores)

#### 🔔 **Notificaciones**
- **Notifications** (Notificaciones)
- **NotificationSettings** (Configuración por usuario)
- **EmailTemplates** (Plantillas de email)

---

### **FASE 3 - ESCALABILIDAD**

#### 📋 **Proyectos**
- **Projects** (Proyectos)
- **ProjectTasks** (Tareas)
- **ProjectSubtasks** (Subtareas)
- **ProjectAssignments** (Asignación de recursos)
- **ProjectBudgets** (Presupuestos)
- **ProjectMilestones** (Hitos)
- **ProjectTimeTracking** (Seguimiento de tiempos)
- **ProjectDeliverables** (Entregables)

#### 👨‍💼 **RRHH**
- **Employees** (Expedientes de empleados)
- **EmployeeContracts** (Contratos)
- **EmployeeDocuments** (Documentación)
- **Payrolls** (Nóminas)
- **PerformanceEvaluations** (Evaluaciones de desempeño)
- **Trainings** (Formaciones)
- **EmployeeTrainings** (Asistencias a formación)
- **Absences** (Bajas y ausencias)
- **OrganizationChart** (Organigrama)

#### 📈 **Business Intelligence**
- **Reports** (Informes configurables)
- **ReportSchedules** (Programación de informes)
- **Dashboards** (Dashboards personalizados)
- **Metrics** (Métricas custom)

#### 📞 **Mesa de Ayuda**
- **Tickets** (Tickets de soporte)
- **TicketMessages** (Mensajes del ticket)
- **TicketCategories** (Categorías)
- **TicketPriorities** (Prioridades)
- **TicketSlas** (SLAs)
- **KnowledgeBase** (Base de conocimiento)

---

### **FASE 4 - AVANZADO**

#### 📄 **Gestión Documental**
- **Documents** (Documentos)
- **DocumentVersions** (Versiones)
- **DocumentFolders** (Carpetas)
- **DocumentPermissions** (Permisos por documento)
- **DocumentSignatures** (Firmas electrónicas)

#### 💵 **Tesorería**
- **BankAccounts** (Cuentas bancarias)
- **BankTransactions** (Transacciones)
- **CashFlowProjections** (Proyecciones)
- **BankReconciliations** (Conciliaciones)

#### 🚗 **Gestión de Activos**
- **Assets** (Activos: equipos, vehículos, etc.)
- **AssetMaintenances** (Mantenimientos)
- **AssetAssignments** (Asignaciones a empleados)
- **AssetDepreciations** (Depreciaciones)
- **AssetInsurances** (Seguros y garantías)

#### 🌍 **Multi-empresa**
- **CompanyRelationships** (Relaciones entre empresas)
- **ConsolidatedReports** (Reportes consolidados)

---

## 📊 RESUMEN: TOTAL DE MODELOS

| Fase | Módulo | Modelos | Total |
|------|--------|---------|-------|
| **FASE 1 (MVP)** | Autenticación | 8 | |
| | Facturación | 7 | |
| | Stock | 6 | |
| | Control Horario | 4 | |
| | Dashboard | 3 | **28 modelos** |
| **FASE 2** | Vacaciones | 5 | |
| | CRM | 8 | |
| | Compras | 5 | |
| | Notificaciones | 3 | **21 modelos** |
| **FASE 3** | Proyectos | 8 | |
| | RRHH | 9 | |
| | BI | 4 | |
| | Mesa Ayuda | 6 | **27 modelos** |
| **FASE 4** | Documentos | 5 | |
| | Tesorería | 4 | |
| | Activos | 5 | |
| | Multi-empresa | 2 | **16 modelos** |
| **TOTAL** | | | **92 modelos** |

---

**Tipo de proyecto:** API REST pura (sin vistas Blade)

---

## 🛠️ PASO 1: Crear Proyecto Laravel API

```bash
# Crear proyecto Laravel 11 API-only (sin Blade, optimizado para API)
composer create-project laravel/laravel backend-api

cd backend-api

# Instalar dependencias para API REST
composer require tymon/jwt-auth
composer require spatie/laravel-query-builder  # Filtros, ordenación, includes
composer require spatie/laravel-cors           # CORS avanzado (si lo necesitas)

# Instalar herramientas de desarrollo
composer require --dev laravel/pint            # Code style
composer require --dev barryvdh/laravel-ide-helper  # IDE autocomplete

# Configurar JWT
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret

# Publicar config de CORS
php artisan config:publish cors
```

---

## 🗄️ PASO 2: Crear TODOS los Modelos (92 modelos)

### **FASE 1 - MVP (28 modelos)**

```bash
# ============================================
# AUTENTICACIÓN Y MULTI-TENANT (8 modelos)
# ============================================
php artisan make:model Company -mfs
php artisan make:model Role -mfs
php artisan make:model Permission -mfs
php artisan make:model RolePermission -m
php artisan make:model Module -mfs
php artisan make:model CompanyModule -m
php artisan make:model AuditLog -m
# User ya existe, solo agregar migración y factory

# ============================================
# FACTURACIÓN / CONTABILIDAD (7 modelos)
# ============================================
php artisan make:model Client -mfs
php artisan make:model Supplier -mfs
php artisan make:model Invoice -mfs
php artisan make:model InvoiceItem -mf
php artisan make:model PaymentMethod -mfs
php artisan make:model Tax -mfs
php artisan make:model InvoiceStatus -ms

# ============================================
# STOCK / INVENTARIO (6 modelos)
# ============================================
php artisan make:model Product -mfs
php artisan make:model ProductCategory -mfs
php artisan make:model Warehouse -mfs
php artisan make:model StockMovement -mf
php artisan make:model Inventory -mf
php artisan make:model StockAlert -m

# ============================================
# CONTROL HORARIO (4 modelos)
# ============================================
php artisan make:model TimeEntry -mfs
php artisan make:model TimeSchedule -mfs
php artisan make:model TimeReport -m
php artisan make:model OvertimeRecord -mf

# ============================================
# DASHBOARD (3 modelos)
# ============================================
php artisan make:model DashboardWidget -mf
php artisan make:model KpiMetric -mf
php artisan make:model Activity -mf
```

---

### **FASE 2 - AMPLIACIÓN (21 modelos)**

```bash
# ============================================
# VACACIONES (5 modelos)
# ============================================
php artisan make:model VacationRequest -mfs
php artisan make:model VacationBalance -mf
php artisan make:model VacationPolicy -mfs
php artisan make:model VacationType -mfs
php artisan make:model VacationApproval -mf

# ============================================
# CRM (8 modelos)
# ============================================
php artisan make:model CrmContact -mfs
php artisan make:model CrmCompany -mfs
php artisan make:model CrmOpportunity -mfs
php artisan make:model CrmActivity -mf
php artisan make:model CrmPipeline -mfs
php artisan make:model CrmStage -mfs
php artisan make:model CrmLead -mfs
php artisan make:model CrmTask -mfs

# ============================================
# COMPRAS (5 modelos)
# ============================================
php artisan make:model PurchaseOrder -mfs
php artisan make:model PurchaseOrderItem -mf
php artisan make:model SupplierEvaluation -mf
php artisan make:model Reception -mf
php artisan make:model SupplierPayment -mf

# ============================================
# NOTIFICACIONES (3 modelos)
# ============================================
# Notification ya existe en Laravel, usar tabla notifications
php artisan make:model NotificationSetting -mf
php artisan make:model EmailTemplate -mfs
```

---

### **FASE 3 - ESCALABILIDAD (27 modelos)**

```bash
# ============================================
# PROYECTOS (8 modelos)
# ============================================
php artisan make:model Project -mfs
php artisan make:model ProjectTask -mfs
php artisan make:model ProjectSubtask -mf
php artisan make:model ProjectAssignment -mf
php artisan make:model ProjectBudget -mf
php artisan make:model ProjectMilestone -mfs
php artisan make:model ProjectTimeTracking -mf
php artisan make:model ProjectDeliverable -mf

# ============================================
# RRHH (9 modelos)
# ============================================
php artisan make:model Employee -mfs
php artisan make:model EmployeeContract -mf
php artisan make:model EmployeeDocument -mf
php artisan make:model Payroll -mfs
php artisan make:model PerformanceEvaluation -mfs
php artisan make:model Training -mfs
php artisan make:model EmployeeTraining -mf
php artisan make:model Absence -mf
php artisan make:model OrganizationChart -mf

# ============================================
# BUSINESS INTELLIGENCE (4 modelos)
# ============================================
php artisan make:model Report -mfs
php artisan make:model ReportSchedule -mf
php artisan make:model Dashboard -mfs
php artisan make:model Metric -mf

# ============================================
# MESA DE AYUDA (6 modelos)
# ============================================
php artisan make:model Ticket -mfs
php artisan make:model TicketMessage -mf
php artisan make:model TicketCategory -mfs
php artisan make:model TicketPriority -ms
php artisan make:model TicketSla -mf
php artisan make:model KnowledgeBase -mfs
```

---

### **FASE 4 - AVANZADO (16 modelos)**

```bash
# ============================================
# GESTIÓN DOCUMENTAL (5 modelos)
# ============================================
php artisan make:model Document -mfs
php artisan make:model DocumentVersion -mf
php artisan make:model DocumentFolder -mfs
php artisan make:model DocumentPermission -mf
php artisan make:model DocumentSignature -mf

# ============================================
# TESORERÍA (4 modelos)
# ============================================
php artisan make:model BankAccount -mfs
php artisan make:model BankTransaction -mf
php artisan make:model CashFlowProjection -mf
php artisan make:model BankReconciliation -mf

# ============================================
# GESTIÓN DE ACTIVOS (5 modelos)
# ============================================
php artisan make:model Asset -mfs
php artisan make:model AssetMaintenance -mf
php artisan make:model AssetAssignment -mf
php artisan make:model AssetDepreciation -mf
php artisan make:model AssetInsurance -mf

# ============================================
# MULTI-EMPRESA (2 modelos)
# ============================================
php artisan make:model CompanyRelationship -mf
php artisan make:model ConsolidatedReport -mf
```

---

## 🎨 PASO 3: Crear TODOS los Controladores API

### **FASE 1 - MVP**

```bash
# Autenticación
php artisan make:controller Api/V1/AuthController
php artisan make:controller Api/V1/CompanyController --api --model=Company
php artisan make:controller Api/V1/RoleController --api --model=Role
php artisan make:controller Api/V1/PermissionController --api --model=Permission
php artisan make:controller Api/V1/ModuleController --api --model=Module
php artisan make:controller Api/V1/AuditLogController --api --model=AuditLog

# Facturación
php artisan make:controller Api/V1/ClientController --api --model=Client
php artisan make:controller Api/V1/SupplierController --api --model=Supplier
php artisan make:controller Api/V1/InvoiceController --api --model=Invoice
php artisan make:controller Api/V1/PaymentMethodController --api --model=PaymentMethod
php artisan make:controller Api/V1/TaxController --api --model=Tax

# Stock
php artisan make:controller Api/V1/ProductController --api --model=Product
php artisan make:controller Api/V1/ProductCategoryController --api --model=ProductCategory
php artisan make:controller Api/V1/WarehouseController --api --model=Warehouse
php artisan make:controller Api/V1/StockMovementController --api --model=StockMovement
php artisan make:controller Api/V1/InventoryController --api --model=Inventory

# Control Horario
php artisan make:controller Api/V1/TimeEntryController --api --model=TimeEntry
php artisan make:controller Api/V1/TimeScheduleController --api --model=TimeSchedule
php artisan make:controller Api/V1/OvertimeRecordController --api --model=OvertimeRecord

# Dashboard
php artisan make:controller Api/V1/DashboardController
php artisan make:controller Api/V1/KpiController
php artisan make:controller Api/V1/ActivityController --api --model=Activity
```

---

### **FASE 2 - AMPLIACIÓN**

```bash
# Vacaciones
php artisan make:controller Api/V1/VacationRequestController --api --model=VacationRequest
php artisan make:controller Api/V1/VacationBalanceController --api --model=VacationBalance
php artisan make:controller Api/V1/VacationPolicyController --api --model=VacationPolicy

# CRM
php artisan make:controller Api/V1/CrmContactController --api --model=CrmContact
php artisan make:controller Api/V1/CrmCompanyController --api --model=CrmCompany
php artisan make:controller Api/V1/CrmOpportunityController --api --model=CrmOpportunity
php artisan make:controller Api/V1/CrmActivityController --api --model=CrmActivity
php artisan make:controller Api/V1/CrmPipelineController --api --model=CrmPipeline
php artisan make:controller Api/V1/CrmLeadController --api --model=CrmLead
php artisan make:controller Api/V1/CrmTaskController --api --model=CrmTask

# Compras
php artisan make:controller Api/V1/PurchaseOrderController --api --model=PurchaseOrder
php artisan make:controller Api/V1/SupplierEvaluationController --api --model=SupplierEvaluation
php artisan make:controller Api/V1/ReceptionController --api --model=Reception

# Notificaciones
php artisan make:controller Api/V1/NotificationController
php artisan make:controller Api/V1/EmailTemplateController --api --model=EmailTemplate
```

---

### **FASE 3 - ESCALABILIDAD**

```bash
# Proyectos
php artisan make:controller Api/V1/ProjectController --api --model=Project
php artisan make:controller Api/V1/ProjectTaskController --api --model=ProjectTask
php artisan make:controller Api/V1/ProjectBudgetController --api --model=ProjectBudget
php artisan make:controller Api/V1/ProjectMilestoneController --api --model=ProjectMilestone
php artisan make:controller Api/V1/ProjectTimeTrackingController --api --model=ProjectTimeTracking

# RRHH
php artisan make:controller Api/V1/EmployeeController --api --model=Employee
php artisan make:controller Api/V1/EmployeeContractController --api --model=EmployeeContract
php artisan make:controller Api/V1/PayrollController --api --model=Payroll
php artisan make:controller Api/V1/PerformanceEvaluationController --api --model=PerformanceEvaluation
php artisan make:controller Api/V1/TrainingController --api --model=Training
php artisan make:controller Api/V1/AbsenceController --api --model=Absence

# BI
php artisan make:controller Api/V1/ReportController --api --model=Report
php artisan make:controller Api/V1/MetricController --api --model=Metric

# Mesa de Ayuda
php artisan make:controller Api/V1/TicketController --api --model=Ticket
php artisan make:controller Api/V1/KnowledgeBaseController --api --model=KnowledgeBase
```

---

### **FASE 4 - AVANZADO**

```bash
# Documentos
php artisan make:controller Api/V1/DocumentController --api --model=Document
php artisan make:controller Api/V1/DocumentFolderController --api --model=DocumentFolder

# Tesorería
php artisan make:controller Api/V1/BankAccountController --api --model=BankAccount
php artisan make:controller Api/V1/CashFlowController

# Activos
php artisan make:controller Api/V1/AssetController --api --model=Asset
php artisan make:controller Api/V1/AssetMaintenanceController --api --model=AssetMaintenance

# Multi-empresa
php artisan make:controller Api/V1/ConsolidatedReportController
```

---

## 📦 PASO 4: Crear API Resources (Serialización JSON)

### **Recursos Principales (50+ Resources)**

```bash
# ============================================
# FASE 1 - MVP
# ============================================

# Autenticación
php artisan make:resource Api/V1/CompanyResource
php artisan make:resource Api/V1/UserResource
php artisan make:resource Api/V1/RoleResource
php artisan make:resource Api/V1/PermissionResource
php artisan make:resource Api/V1/ModuleResource

# Facturación
php artisan make:resource Api/V1/ClientResource
php artisan make:resource Api/V1/SupplierResource
php artisan make:resource Api/V1/InvoiceResource
php artisan make:resource Api/V1/InvoiceItemResource
php artisan make:resource Api/V1/TaxResource

# Stock
php artisan make:resource Api/V1/ProductResource
php artisan make:resource Api/V1/ProductCategoryResource
php artisan make:resource Api/V1/WarehouseResource
php artisan make:resource Api/V1/StockMovementResource
php artisan make:resource Api/V1/InventoryResource

# Control Horario
php artisan make:resource Api/V1/TimeEntryResource
php artisan make:resource Api/V1/TimeScheduleResource
php artisan make:resource Api/V1/OvertimeRecordResource

# Dashboard
php artisan make:resource Api/V1/KpiResource
php artisan make:resource Api/V1/ActivityResource

# ============================================
# FASE 2 - AMPLIACIÓN
# ============================================

# Vacaciones
php artisan make:resource Api/V1/VacationRequestResource
php artisan make:resource Api/V1/VacationBalanceResource

# CRM
php artisan make:resource Api/V1/CrmContactResource
php artisan make:resource Api/V1/CrmCompanyResource
php artisan make:resource Api/V1/CrmOpportunityResource
php artisan make:resource Api/V1/CrmLeadResource
php artisan make:resource Api/V1/CrmTaskResource

# Compras
php artisan make:resource Api/V1/PurchaseOrderResource
php artisan make:resource Api/V1/ReceptionResource

# ============================================
# FASE 3 - ESCALABILIDAD
# ============================================

# Proyectos
php artisan make:resource Api/V1/ProjectResource
php artisan make:resource Api/V1/ProjectTaskResource
php artisan make:resource Api/V1/ProjectMilestoneResource

# RRHH
php artisan make:resource Api/V1/EmployeeResource
php artisan make:resource Api/V1/PayrollResource
php artisan make:resource Api/V1/TrainingResource

# BI y Tickets
php artisan make:resource Api/V1/ReportResource
php artisan make:resource Api/V1/TicketResource
php artisan make:resource Api/V1/KnowledgeBaseResource

# ============================================
# FASE 4 - AVANZADO
# ============================================

# Documentos y Activos
php artisan make:resource Api/V1/DocumentResource
php artisan make:resource Api/V1/AssetResource
php artisan make:resource Api/V1/BankAccountResource
```

---

## ✅ PASO 5: Crear Form Requests (Validaciones)

### **Request Classes (80+ Requests)**

```bash
# ============================================
# AUTENTICACIÓN
# ============================================
php artisan make:request Api/V1/Auth/LoginRequest
php artisan make:request Api/V1/Auth/RegisterRequest
php artisan make:request Api/V1/Auth/ForgotPasswordRequest
php artisan make:request Api/V1/Auth/ResetPasswordRequest

# ============================================
# FACTURACIÓN
# ============================================
php artisan make:request Api/V1/Client/StoreClientRequest
php artisan make:request Api/V1/Client/UpdateClientRequest
php artisan make:request Api/V1/Supplier/StoreSupplierRequest
php artisan make:request Api/V1/Supplier/UpdateSupplierRequest
php artisan make:request Api/V1/Invoice/StoreInvoiceRequest
php artisan make:request Api/V1/Invoice/UpdateInvoiceRequest

# ============================================
# STOCK
# ============================================
php artisan make:request Api/V1/Product/StoreProductRequest
php artisan make:request Api/V1/Product/UpdateProductRequest
php artisan make:request Api/V1/ProductCategory/StoreCategoryRequest
php artisan make:request Api/V1/ProductCategory/UpdateCategoryRequest
php artisan make:request Api/V1/Warehouse/StoreWarehouseRequest
php artisan make:request Api/V1/Warehouse/UpdateWarehouseRequest

# ============================================
# CONTROL HORARIO
# ============================================
php artisan make:request Api/V1/TimeEntry/StoreTimeEntryRequest
php artisan make:request Api/V1/TimeEntry/UpdateTimeEntryRequest
php artisan make:request Api/V1/TimeSchedule/StoreScheduleRequest
php artisan make:request Api/V1/TimeSchedule/UpdateScheduleRequest

# ============================================
# VACACIONES
# ============================================
php artisan make:request Api/V1/VacationRequest/StoreVacationRequestRequest
php artisan make:request Api/V1/VacationRequest/ApproveVacationRequest
php artisan make:request Api/V1/VacationPolicy/StorePolicyRequest

# ============================================
# CRM
# ============================================
php artisan make:request Api/V1/CrmContact/StoreContactRequest
php artisan make:request Api/V1/CrmContact/UpdateContactRequest
php artisan make:request Api/V1/CrmOpportunity/StoreOpportunityRequest
php artisan make:request Api/V1/CrmOpportunity/UpdateOpportunityRequest
php artisan make:request Api/V1/CrmLead/StoreLeadRequest
php artisan make:request Api/V1/CrmTask/StoreTaskRequest

# ============================================
# COMPRAS
# ============================================
php artisan make:request Api/V1/PurchaseOrder/StorePurchaseOrderRequest
php artisan make:request Api/V1/PurchaseOrder/UpdatePurchaseOrderRequest
php artisan make:request Api/V1/Reception/StoreReceptionRequest

# ============================================
# PROYECTOS
# ============================================
php artisan make:request Api/V1/Project/StoreProjectRequest
php artisan make:request Api/V1/Project/UpdateProjectRequest
php artisan make:request Api/V1/ProjectTask/StoreTaskRequest
php artisan make:request Api/V1/ProjectTask/UpdateTaskRequest

# ============================================
# RRHH
# ============================================
php artisan make:request Api/V1/Employee/StoreEmployeeRequest
php artisan make:request Api/V1/Employee/UpdateEmployeeRequest
php artisan make:request Api/V1/Payroll/StorePayrollRequest
php artisan make:request Api/V1/Training/StoreTrainingRequest

# ============================================
# MESA DE AYUDA
# ============================================
php artisan make:request Api/V1/Ticket/StoreTicketRequest
php artisan make:request Api/V1/Ticket/UpdateTicketRequest
php artisan make:request Api/V1/KnowledgeBase/StoreArticleRequest

# ============================================
# DOCUMENTOS Y ACTIVOS
# ============================================
php artisan make:request Api/V1/Document/StoreDocumentRequest
php artisan make:request Api/V1/Asset/StoreAssetRequest
php artisan make:request Api/V1/Asset/UpdateAssetRequest
php artisan make:request Api/V1/BankAccount/StoreBankAccountRequest
```

---

## 🔐 PASO 6: Crear Policies (Autorización)

### **Policies Principales**

```bash
# FASE 1
php artisan make:policy CompanyPolicy --model=Company
php artisan make:policy ClientPolicy --model=Client
php artisan make:policy SupplierPolicy --model=Supplier
php artisan make:policy InvoicePolicy --model=Invoice
php artisan make:policy ProductPolicy --model=Product
php artisan make:policy WarehousePolicy --model=Warehouse
php artisan make:policy TimeEntryPolicy --model=TimeEntry

# FASE 2
php artisan make:policy VacationRequestPolicy --model=VacationRequest
php artisan make:policy CrmContactPolicy --model=CrmContact
php artisan make:policy CrmOpportunityPolicy --model=CrmOpportunity
php artisan make:policy PurchaseOrderPolicy --model=PurchaseOrder

# FASE 3
php artisan make:policy ProjectPolicy --model=Project
php artisan make:policy EmployeePolicy --model=Employee
php artisan make:policy PayrollPolicy --model=Payroll
php artisan make:policy TicketPolicy --model=Ticket

# FASE 4
php artisan make:policy DocumentPolicy --model=Document
php artisan make:policy AssetPolicy --model=Asset
php artisan make:policy BankAccountPolicy --model=BankAccount
```

---

## 🌱 PASO 7: Crear Seeders

```bash
# Seeder principal (ya existe)
# php artisan make:seeder DatabaseSeeder

# ============================================
# FASE 1 - MVP
# ============================================
php artisan make:seeder CompanySeeder
php artisan make:seeder UserSeeder
php artisan make:seeder RoleSeeder
php artisan make:seeder PermissionSeeder
php artisan make:seeder ModuleSeeder
php artisan make:seeder ClientSeeder
php artisan make:seeder SupplierSeeder
php artisan make:seeder InvoiceSeeder
php artisan make:seeder ProductSeeder
php artisan make:seeder ProductCategorySeeder
php artisan make:seeder WarehouseSeeder
php artisan make:seeder TimeEntrySeeder
php artisan make:seeder TaxSeeder

# ============================================
# FASE 2 - AMPLIACIÓN
# ============================================
php artisan make:seeder VacationPolicySeeder
php artisan make:seeder CrmPipelineSeeder
php artisan make:seeder CrmStageSeeder
php artisan make:seeder EmailTemplateSeeder
php artisan make:seeder TicketPrioritySeeder

# ============================================
# FASE 3+ (Opcionales)
# ============================================
php artisan make:seeder ProjectSeeder
php artisan make:seeder TrainingSeeder
php artisan make:seeder KnowledgeBaseSeeder
```

---

## 🧪 PASO 8: Crear Tests (Recomendado)

### **Tests Feature para API**

```bash
# ============================================
# AUTENTICACIÓN
# ============================================
php artisan make:test Api/V1/Auth/LoginTest
php artisan make:test Api/V1/Auth/RegisterTest
php artisan make:test Api/V1/Auth/LogoutTest

# ============================================
# FACTURACIÓN
# ============================================
php artisan make:test Api/V1/Invoice/CreateInvoiceTest
php artisan make:test Api/V1/Invoice/ListInvoicesTest
php artisan make:test Api/V1/Invoice/UpdateInvoiceTest
php artisan make:test Api/V1/Invoice/DeleteInvoiceTest
php artisan make:test Api/V1/Client/ClientCrudTest

# ============================================
# STOCK
# ============================================
php artisan make:test Api/V1/Product/CreateProductTest
php artisan make:test Api/V1/Product/ListProductsTest
php artisan make:test Api/V1/Product/SearchProductsTest
php artisan make:test Api/V1/Product/StockMovementTest
php artisan make:test Api/V1/Warehouse/WarehouseCrudTest

# ============================================
# CONTROL HORARIO
# ============================================
php artisan make:test Api/V1/TimeEntry/ClockInTest
php artisan make:test Api/V1/TimeEntry/ClockOutTest
php artisan make:test Api/V1/TimeEntry/TimeReportTest

# ============================================
# VACACIONES
# ============================================
php artisan make:test Api/V1/VacationRequest/CreateRequestTest
php artisan make:test Api/V1/VacationRequest/ApproveRequestTest
php artisan make:test Api/V1/VacationRequest/RejectRequestTest

# ============================================
# CRM
# ============================================
php artisan make:test Api/V1/CrmContact/ContactCrudTest
php artisan make:test Api/V1/CrmOpportunity/OpportunityCrudTest
php artisan make:test Api/V1/CrmPipeline/MoveStageTest

# ============================================
# PROYECTOS
# ============================================
php artisan make:test Api/V1/Project/ProjectCrudTest
php artisan make:test Api/V1/ProjectTask/TaskCrudTest
php artisan make:test Api/V1/ProjectTask/AssignTaskTest

# ============================================
# RRHH
# ============================================
php artisan make:test Api/V1/Employee/EmployeeCrudTest
php artisan make:test Api/V1/Payroll/GeneratePayrollTest

# ============================================
# MESA DE AYUDA
# ============================================
php artisan make:test Api/V1/Ticket/CreateTicketTest
php artisan make:test Api/V1/Ticket/AssignTicketTest
php artisan make:test Api/V1/Ticket/CloseTicketTest
```

### **Tests Unit para Modelos**

```bash
php artisan make:test --unit Models/CompanyTest
php artisan make:test --unit Models/InvoiceTest
php artisan make:test --unit Models/ProductTest
php artisan make:test --unit Models/TimeEntryTest
php artisan make:test --unit Models/VacationRequestTest
php artisan make:test --unit Models/ProjectTest
php artisan make:test --unit Models/TicketTest

# Tests para Services
php artisan make:test --unit Services/InvoiceServiceTest
php artisan make:test --unit Services/StockServiceTest
php artisan make:test --unit Services/TimeCalculationServiceTest
```

---

## 🏗️ PASO 9: Ejecutar Migraciones y Seeders

```bash
# Ejecutar migraciones (después de configurar .env con BD)
php artisan migrate

# Ejecutar seeders individuales (si los necesitas por separado)
php artisan db:seed --class=UserSeeder
php artisan db:seed --class=ProveedorSeeder
php artisan db:seed --class=CategoriaSeeder
php artisan db:seed --class=ProductoSeeder

# O ejecutar todos los seeders a la vez
php artisan db:seed

# Resetear BD y ejecutar todo de nuevo (CUIDADO: borra datos)
php artisan migrate:fresh --seed
```

---

## 📝 PASO 10: Middleware Personalizado

```bash
# Middleware esenciales
php artisan make:middleware CheckCompanyStatus
php artisan make:middleware CheckModuleAccess
php artisan make:middleware CheckRole
php artisan make:middleware LogApiRequests
php artisan make:middleware ForceJsonResponse
php artisan make:middleware CheckSubscription
php artisan make:middleware RateLimitByCompany
php artisan make:middleware ValidateTenant
```

---

## 🎯 SCRIPT MAESTRO: CREAR TODO DE UNA VEZ

### **setup-erp-complete.sh** (Ejecutar en backend-api/)

```bash
#!/bin/bash
# ============================================
# SCRIPT MAESTRO - CREACIÓN COMPLETA ERP API
# ============================================
# Uso: bash setup-erp-complete.sh [fase]
# Ejemplo: bash setup-erp-complete.sh mvp
# Opciones: mvp, ampliacion, escalabilidad, avanzado, all

FASE=${1:-mvp}

echo "🚀 Iniciando creación del ERP API - Fase: $FASE"

# ============================================
# FUNCIONES AUXILIARES
# ============================================

create_mvp() {
    echo "📦 Creando recursos FASE 1 - MVP..."
    
    # Autenticación (8 modelos)
    php artisan make:model Company -mfs
    php artisan make:model Role -mfs
    php artisan make:model Permission -mfs
    php artisan make:model RolePermission -m
    php artisan make:model Module -mfs
    php artisan make:model CompanyModule -m
    php artisan make:model AuditLog -m
    
    # Facturación (7 modelos)
    php artisan make:model Client -mfs
    php artisan make:model Supplier -mfs
    php artisan make:model Invoice -mfs
    php artisan make:model InvoiceItem -mf
    php artisan make:model PaymentMethod -mfs
    php artisan make:model Tax -mfs
    php artisan make:model InvoiceStatus -ms
    
    # Stock (6 modelos)
    php artisan make:model Product -mfs
    php artisan make:model ProductCategory -mfs
    php artisan make:model Warehouse -mfs
    php artisan make:model StockMovement -mf
    php artisan make:model Inventory -mf
    php artisan make:model StockAlert -m
    
    # Control Horario (4 modelos)
    php artisan make:model TimeEntry -mfs
    php artisan make:model TimeSchedule -mfs
    php artisan make:model TimeReport -m
    php artisan make:model OvertimeRecord -mf
    
    # Dashboard (3 modelos)
    php artisan make:model DashboardWidget -mf
    php artisan make:model KpiMetric -mf
    php artisan make:model Activity -mf
    
    # Controladores MVP
    echo "🎨 Creando controladores MVP..."
    php artisan make:controller Api/V1/AuthController
    php artisan make:controller Api/V1/CompanyController --api --model=Company
    php artisan make:controller Api/V1/ClientController --api --model=Client
    php artisan make:controller Api/V1/SupplierController --api --model=Supplier
    php artisan make:controller Api/V1/InvoiceController --api --model=Invoice
    php artisan make:controller Api/V1/ProductController --api --model=Product
    php artisan make:controller Api/V1/WarehouseController --api --model=Warehouse
    php artisan make:controller Api/V1/TimeEntryController --api --model=TimeEntry
    php artisan make:controller Api/V1/DashboardController
    
    # Resources MVP
    echo "📦 Creando resources MVP..."
    php artisan make:resource Api/V1/CompanyResource
    php artisan make:resource Api/V1/UserResource
    php artisan make:resource Api/V1/ClientResource
    php artisan make:resource Api/V1/InvoiceResource
    php artisan make:resource Api/V1/ProductResource
    php artisan make:resource Api/V1/TimeEntryResource
    
    # Requests MVP
    echo "✅ Creando requests MVP..."
    php artisan make:request Api/V1/Auth/LoginRequest
    php artisan make:request Api/V1/Auth/RegisterRequest
    php artisan make:request Api/V1/Client/StoreClientRequest
    php artisan make:request Api/V1/Invoice/StoreInvoiceRequest
    php artisan make:request Api/V1/Product/StoreProductRequest
    php artisan make:request Api/V1/TimeEntry/StoreTimeEntryRequest
    
    # Policies MVP
    echo "🔐 Creando policies MVP..."
    php artisan make:policy CompanyPolicy --model=Company
    php artisan make:policy InvoicePolicy --model=Invoice
    php artisan make:policy ProductPolicy --model=Product
    
    echo "✅ FASE 1 (MVP) completada - 28 modelos creados"
}

create_ampliacion() {
    echo "📦 Creando recursos FASE 2 - AMPLIACIÓN..."
    
    # Vacaciones (5 modelos)
    php artisan make:model VacationRequest -mfs
    php artisan make:model VacationBalance -mf
    php artisan make:model VacationPolicy -mfs
    php artisan make:model VacationType -mfs
    php artisan make:model VacationApproval -mf
    
    # CRM (8 modelos)
    php artisan make:model CrmContact -mfs
    php artisan make:model CrmCompany -mfs
    php artisan make:model CrmOpportunity -mfs
    php artisan make:model CrmActivity -mf
    php artisan make:model CrmPipeline -mfs
    php artisan make:model CrmStage -mfs
    php artisan make:model CrmLead -mfs
    php artisan make:model CrmTask -mfs
    
    # Compras (5 modelos)
    php artisan make:model PurchaseOrder -mfs
    php artisan make:model PurchaseOrderItem -mf
    php artisan make:model SupplierEvaluation -mf
    php artisan make:model Reception -mf
    php artisan make:model SupplierPayment -mf
    
    # Notificaciones (2 modelos)
    php artisan make:model NotificationSetting -mf
    php artisan make:model EmailTemplate -mfs
    
    # Controladores Ampliación
    php artisan make:controller Api/V1/VacationRequestController --api --model=VacationRequest
    php artisan make:controller Api/V1/CrmContactController --api --model=CrmContact
    php artisan make:controller Api/V1/CrmOpportunityController --api --model=CrmOpportunity
    php artisan make:controller Api/V1/PurchaseOrderController --api --model=PurchaseOrder
    
    echo "✅ FASE 2 (AMPLIACIÓN) completada - 21 modelos creados"
}

create_escalabilidad() {
    echo "📦 Creando recursos FASE 3 - ESCALABILIDAD..."
    
    # Proyectos (8 modelos)
    php artisan make:model Project -mfs
    php artisan make:model ProjectTask -mfs
    php artisan make:model ProjectSubtask -mf
    php artisan make:model ProjectAssignment -mf
    php artisan make:model ProjectBudget -mf
    php artisan make:model ProjectMilestone -mfs
    php artisan make:model ProjectTimeTracking -mf
    php artisan make:model ProjectDeliverable -mf
    
    # RRHH (9 modelos)
    php artisan make:model Employee -mfs
    php artisan make:model EmployeeContract -mf
    php artisan make:model EmployeeDocument -mf
    php artisan make:model Payroll -mfs
    php artisan make:model PerformanceEvaluation -mfs
    php artisan make:model Training -mfs
    php artisan make:model EmployeeTraining -mf
    php artisan make:model Absence -mf
    php artisan make:model OrganizationChart -mf
    
    # BI (4 modelos)
    php artisan make:model Report -mfs
    php artisan make:model ReportSchedule -mf
    php artisan make:model Dashboard -mfs
    php artisan make:model Metric -mf
    
    # Mesa de Ayuda (6 modelos)
    php artisan make:model Ticket -mfs
    php artisan make:model TicketMessage -mf
    php artisan make:model TicketCategory -mfs
    php artisan make:model TicketPriority -ms
    php artisan make:model TicketSla -mf
    php artisan make:model KnowledgeBase -mfs
    
    # Controladores Escalabilidad
    php artisan make:controller Api/V1/ProjectController --api --model=Project
    php artisan make:controller Api/V1/EmployeeController --api --model=Employee
    php artisan make:controller Api/V1/PayrollController --api --model=Payroll
    php artisan make:controller Api/V1/TicketController --api --model=Ticket
    
    echo "✅ FASE 3 (ESCALABILIDAD) completada - 27 modelos creados"
}

create_avanzado() {
    echo "📦 Creando recursos FASE 4 - AVANZADO..."
    
    # Documentos (5 modelos)
    php artisan make:model Document -mfs
    php artisan make:model DocumentVersion -mf
    php artisan make:model DocumentFolder -mfs
    php artisan make:model DocumentPermission -mf
    php artisan make:model DocumentSignature -mf
    
    # Tesorería (4 modelos)
    php artisan make:model BankAccount -mfs
    php artisan make:model BankTransaction -mf
    php artisan make:model CashFlowProjection -mf
    php artisan make:model BankReconciliation -mf
    
    # Activos (5 modelos)
    php artisan make:model Asset -mfs
    php artisan make:model AssetMaintenance -mf
    php artisan make:model AssetAssignment -mf
    php artisan make:model AssetDepreciation -mf
    php artisan make:model AssetInsurance -mf
    
    # Multi-empresa (2 modelos)
    php artisan make:model CompanyRelationship -mf
    php artisan make:model ConsolidatedReport -mf
    
    # Controladores Avanzado
    php artisan make:controller Api/V1/DocumentController --api --model=Document
    php artisan make:controller Api/V1/BankAccountController --api --model=BankAccount
    php artisan make:controller Api/V1/AssetController --api --model=Asset
    
    echo "✅ FASE 4 (AVANZADO) completada - 16 modelos creados"
}

create_middleware() {
    echo "🛡️ Creando middleware..."
    php artisan make:middleware CheckCompanyStatus
    php artisan make:middleware CheckModuleAccess
    php artisan make:middleware CheckRole
    php artisan make:middleware LogApiRequests
    php artisan make:middleware ForceJsonResponse
    php artisan make:middleware CheckSubscription
    php artisan make:middleware RateLimitByCompany
    php artisan make:middleware ValidateTenant
    echo "✅ Middleware creado"
}

# ============================================
# EJECUCIÓN SEGÚN FASE
# ============================================

case $FASE in
    mvp)
        create_mvp
        create_middleware
        ;;
    ampliacion)
        create_ampliacion
        ;;
    escalabilidad)
        create_escalabilidad
        ;;
    avanzado)
        create_avanzado
        ;;
    all)
        echo "🚀 Creando TODOS los recursos del ERP (92 modelos)..."
        create_mvp
        create_ampliacion
        create_escalabilidad
        create_avanzado
        create_middleware
        echo ""
        echo "🎉 ¡COMPLETADO! Todos los recursos creados:"
        echo "   - 92 modelos"
        echo "   - ~80 controladores"
        echo "   - ~50 resources"
        echo "   - ~80 requests"
        echo "   - ~20 policies"
        echo "   - 8 middleware"
        echo ""
        echo "📝 Próximos pasos:"
        echo "   1. Editar migraciones en database/migrations/"
        echo "   2. Editar seeders en database/seeders/"
        echo "   3. Configurar rutas en routes/api.php"
        echo "   4. php artisan migrate"
        echo "   5. php artisan db:seed"
        ;;
    *)
        echo "❌ Fase no válida. Usa: mvp, ampliacion, escalabilidad, avanzado, o all"
        exit 1
        ;;
esac

echo ""
echo "✅ Recursos de la fase '$FASE' creados exitosamente"
echo "📂 Revisa app/Models/, app/Http/Controllers/, database/migrations/"
```

### **Cómo usar el script:**

```bash
# Dar permisos de ejecución
chmod +x setup-erp-complete.sh

# Crear solo MVP (28 modelos)
bash setup-erp-complete.sh mvp

# Crear solo Ampliación (21 modelos)
bash setup-erp-complete.sh ampliacion

# Crear solo Escalabilidad (27 modelos)
bash setup-erp-complete.sh escalabilidad

# Crear solo Avanzado (16 modelos)
bash setup-erp-complete.sh avanzado

# Crear TODO de una vez (92 modelos + controladores + resources + requests)
bash setup-erp-complete.sh all
```

---

## 📊 RESUMEN FINAL DE COMANDOS

### **Total de recursos a crear:**

| Tipo | Cantidad | Descripción |
|------|----------|-------------|
| **Modelos** | 92 | Con migraciones, factories y seeders |
| **Controladores** | ~80 | Controllers API REST |
| **Resources** | ~50 | Serialización JSON |
| **Requests** | ~80 | Validaciones FormRequest |
| **Policies** | ~20 | Autorización |
| **Seeders** | ~30 | Datos de ejemplo |
| **Middleware** | 8 | Middleware personalizados |
| **Tests Feature** | ~40 | Tests de API |
| **Tests Unit** | ~15 | Tests de modelos/services |

**TOTAL: ~415 archivos PHP a crear** 🚀

---

## ⏱️ TIEMPO ESTIMADO

### **Solo creación de archivos (comandos artisan):**
- **MVP (Fase 1):** 15-20 minutos
- **Ampliación (Fase 2):** 10-15 minutos
- **Escalabilidad (Fase 3):** 15-20 minutos
- **Avanzado (Fase 4):** 10 minutos
- **TOTAL:** ~1 hora para crear estructura completa

### **Desarrollo completo (escribir código):**
- **MVP (Fase 1):** 60-80 horas
- **Ampliación (Fase 2):** 40-50 horas
- **Escalabilidad (Fase 3):** 60-70 horas
- **Avanzado (Fase 4):** 30-40 horas
- **TOTAL:** 190-240 horas (~6-8 semanas a tiempo completo)

---

## 🎯 RECOMENDACIÓN FINAL

### **Para empezar YA:**

1. **Ejecuta el script MVP:**
   ```bash
   bash setup-erp-complete.sh mvp
   ```

2. **Configura las migraciones más importantes:**
   - `create_companies_table`
   - `create_users_table` (modificar la existente)
   - `create_roles_table`
   - `create_permissions_table`
   - `create_clients_table`
   - `create_invoices_table`
   - `create_products_table`

3. **Ejecuta migraciones y seeders:**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

4. **Configura rutas básicas en `routes/api.php`**

5. **Prueba con Postman**

### **Fases sugeridas:**

- **Semana 1-2:** MVP funcionando (Auth + Facturación + Stock básico)
- **Semana 3-4:** Control Horario + Dashboard
- **Semana 5-6:** Vacaciones + CRM básico
- **Semana 7-8:** Compras + Notificaciones
- **Semana 9-12:** Proyectos + RRHH + BI
- **Semana 13-16:** Documentos + Tesorería + Activos

---

**¿Quieres que ejecute el script y te ayude con las migraciones?** 🚀

---

## 🎯 RESUMEN DE COMANDOS EN ORDEN

### Setup Inicial
```bash
composer create-project laravel/laravel erp-backend
cd erp-backend
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

### Modelos
```bash
php artisan make:model Proveedor -mfs
php artisan make:model Categoria -mfs
php artisan make:model Producto -mfs
```

### Controladores
```bash
php artisan make:controller Api/AuthController
php artisan make:controller Api/ProveedorController --api --model=Proveedor
php artisan make:controller Api/CategoriaController --api --model=Categoria
php artisan make:controller Api/ProductoController --api --model=Producto
php artisan make:controller Api/ProveedorProductoController
```

### Resources
```bash
php artisan make:resource ProveedorResource
php artisan make:resource ProveedorCollection
php artisan make:resource CategoriaResource
php artisan make:resource CategoriaCollection
php artisan make:resource ProductoResource
php artisan make:resource ProductoCollection
php artisan make:resource UserResource
```

### Validaciones
```bash
php artisan make:request StoreProveedorRequest
php artisan make:request UpdateProveedorRequest
php artisan make:request StoreCategoriaRequest
php artisan make:request UpdateCategoriaRequest
php artisan make:request StoreProductoRequest
php artisan make:request UpdateProductoRequest
php artisan make:request LoginRequest
php artisan make:request RegisterRequest
```

### Policies
```bash
php artisan make:policy ProveedorPolicy --model=Proveedor
php artisan make:policy CategoriaPolicy --model=Categoria
php artisan make:policy ProductoPolicy --model=Producto
```

### Migraciones y Datos
```bash
# Editar migraciones en database/migrations/
# Editar seeders en database/seeders/
php artisan migrate
php artisan db:seed
# O todo junto:
php artisan migrate:fresh --seed
```

---

## 📂 Estructura Profesional del Backend API

```
backend-api/
├── app/
│   ├── Domain/                           # Domain-Driven Design (Opcional)
│   │   ├── Producto/
│   │   │   ├── Models/
│   │   │   ├── Repositories/
│   │   │   ├── Services/
│   │   │   └── Events/
│   │   ├── Proveedor/
│   │   └── Categoria/
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── V1/                   # Versionado de API
│   │   │           ├── AuthController.php
│   │   │           ├── ProveedorController.php
│   │   │           ├── CategoriaController.php
│   │   │           ├── ProductoController.php
│   │   │           └── ProveedorProductoController.php
│   │   │
│   │   ├── Requests/
│   │   │   └── Api/
│   │   │       └── V1/
│   │   │           ├── Auth/
│   │   │           │   ├── LoginRequest.php
│   │   │           │   └── RegisterRequest.php
│   │   │           ├── Proveedor/
│   │   │           │   ├── StoreProveedorRequest.php
│   │   │           │   └── UpdateProveedorRequest.php
│   │   │           ├── Categoria/
│   │   │           └── Producto/
│   │   │
│   │   ├── Resources/
│   │   │   └── Api/
│   │   │       └── V1/
│   │   │           ├── ProveedorResource.php
│   │   │           ├── ProveedorCollection.php
│   │   │           ├── CategoriaResource.php
│   │   │           ├── ProductoResource.php
│   │   │           └── UserResource.php
│   │   │
│   │   ├── Middleware/
│   │   │   ├── CheckRole.php
│   │   │   ├── LogApiRequests.php
│   │   │   ├── ForceJsonResponse.php
│   │   │   └── ApiVersion.php
│   │   │
│   │   └── Kernel.php
│   │
│   ├── Models/
│   │   ├── User.php
│   │   ├── Proveedor.php
│   │   ├── Categoria.php
│   │   └── Producto.php
│   │
│   ├── Services/                         # Lógica de negocio
│   │   ├── AuthService.php
│   │   ├── ProductoService.php
│   │   └── ExportService.php
│   │
│   ├── Repositories/                     # Abstracción de datos
│   │   ├── Contracts/
│   │   │   ├── ProductoRepositoryInterface.php
│   │   │   └── ProveedorRepositoryInterface.php
│   │   └── Eloquent/
│   │       ├── ProductoRepository.php
│   │       └── ProveedorRepository.php
│   │
│   ├── Exceptions/                       # Excepciones personalizadas
│   │   ├── Handler.php
│   │   ├── ApiException.php
│   │   └── BusinessException.php
│   │
│   ├── Traits/                           # Código reutilizable
│   │   ├── HasUuid.php
│   │   ├── Searchable.php
│   │   └── ApiResponses.php
│   │
│   └── Policies/
│       ├── ProveedorPolicy.php
│       ├── CategoriaPolicy.php
│       └── ProductoPolicy.php
│
├── bootstrap/
├── config/
│   ├── app.php
│   ├── cors.php
│   ├── jwt.php
│   └── services.php
│
├── database/
│   ├── factories/
│   │   ├── ProveedorFactory.php
│   │   ├── CategoriaFactory.php
│   │   └── ProductoFactory.php
│   │
│   ├── migrations/
│   │   ├── 2024_01_01_000000_create_users_table.php
│   │   ├── 2024_01_02_000000_create_proveedores_table.php
│   │   ├── 2024_01_03_000000_create_categorias_table.php
│   │   └── 2024_01_04_000000_create_productos_table.php
│   │
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       ├── ProveedorSeeder.php
│       ├── CategoriaSeeder.php
│       └── ProductoSeeder.php
│
├── docker/
│   ├── Dockerfile
│   ├── php/
│   │   ├── local.ini
│   │   └── xdebug.ini
│   └── mysql/
│       └── init.sql
│
├── routes/
│   ├── api.php                          # Rutas API v1
│   └── console.php
│
├── storage/
│   ├── app/
│   ├── framework/
│   └── logs/
│
├── tests/
│   ├── Feature/
│   │   └── Api/
│   │       └── V1/
│   │           ├── Auth/
│   │           │   └── LoginTest.php
│   │           ├── Proveedor/
│   │           │   ├── ListProveedoresTest.php
│   │           │   ├── CreateProveedorTest.php
│   │           │   └── DeleteProveedorTest.php
│   │           ├── Categoria/
│   │           └── Producto/
│   │
│   ├── Unit/
│   │   ├── Models/
│   │   ├── Services/
│   │   └── Repositories/
│   │
│   ├── TestCase.php
│   └── CreatesApplication.php
│
├── .env.example
├── .env.testing
├── .gitignore
├── .editorconfig
├── artisan
├── composer.json
├── docker-compose.yml
├── phpunit.xml
├── pint.json                            # Laravel Pint config
└── README.md
      context: .
      dockerfile: docker/Dockerfile
      target: development
    container_name: erp-api
    ports:
      - "8000:8000"
    volumes:
      - .:/var/www/html
      - ./docker/php/local.ini:/usr/local/etc/php/conf.d/local.ini
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
      - DB_HOST=db
    depends_on:
---

## 🏛️ ARQUITECTURA Y BUENAS PRÁCTICAS

### **1. Versionado de API**

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    
    Route::middleware('auth:api')->group(function () {
        Route::apiResource('productos', ProductoController::class);
        Route::apiResource('proveedores', ProveedorController::class);
        Route::get('proveedores/{proveedor}/productos', [ProveedorProductoController::class, 'index']);
    });
});

// URL final: http://api.erp.com/api/v1/productos
```

### **2. API Responses Estandarizadas**

```php
// app/Traits/ApiResponses.php
trait ApiResponses {
    protected function success($data, $message = null, $code = 200) {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], $code);
    }
    
    protected function error($message, $code = 400) {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], $code);
    }
}
```

### **3. Repository Pattern (Opcional pero profesional)**

```php
// app/Repositories/Contracts/ProductoRepositoryInterface.php
interface ProductoRepositoryInterface {
    public function all();
    public function find($id);
    public function create(array $data);
    public function update($id, array $data);
    public function delete($id);
}

// Registrar en AppServiceProvider
$this->app->bind(
    ProductoRepositoryInterface::class,
    EloquentProductoRepository::class
);
```

### **4. Configuración para múltiples frontends**

```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => [
    'http://localhost:4200',  // Angular dev
    'http://localhost:3000',  // React dev
    env('FRONTEND_URL', '*')
],
'allowed_headers' => ['*'],
'exposed_headers' => ['Authorization'],
'max_age' => 86400,
'supports_credentials' => true,
```

### **5. Health Check Endpoint**

```php
// routes/api.php
Route::get('health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'service' => 'ERP API',
        'version' => '1.0.0',
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected'
    ]);
});
```

---

## 🚀 PREPARACIÓN PARA TERRAFORM

### **Variables de entorno por ambiente**

```bash
backend-api/
├── .env.example          # Template
├── .env.local           # Desarrollo local
├── .env.testing         # Tests
├── .env.staging         # Staging (Terraform)
└── .env.production      # Producción (Terraform)
```

### **Dockerfile optimizado para producción**

```dockerfile
# backend-api/docker/Dockerfile.prod
FROM php:8.3-fpm-alpine as base

RUN apk add --no-cache \
    mysql-client \
    postgresql-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --optimize-autoloader

COPY . .

RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

RUN chown -R www-data:www-data /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
```

### **Script de deploy para Terraform**

```bash
# backend-api/deploy.sh
#!/bin/bash
set -e

echo "🚀 Deploying API..."

# Build image
docker build -f docker/Dockerfile.prod -t erp-api:${VERSION} .

# Push to registry (ECR, Docker Hub, etc)
docker tag erp-api:${VERSION} ${REGISTRY}/erp-api:${VERSION}
docker push ${REGISTRY}/erp-api:${VERSION}

# Run migrations
php artisan migrate --force

echo "✅ Deploy complete"
```

---

## 📊 MONITOREO Y LOGGING (Preparación)

### **Instalar Laravel Telescope (Desarrollo)**

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

### **Instalar Sentry (Producción)**

```bash
composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=https://your-dsn@sentry.io/project
```

### **Configurar logs estructurados**

```php
// config/logging.php
'channels' => [
    'api' => [
        'driver' => 'daily',
        'path' => storage_path('logs/api.log'),
        'level' => 'info',
        'days' => 14,
    ],
],
```

---

## ✅ CHECKLIST COMPLETO

### **Fase 1: Setup Inicial** (1-2 horas)
- [ ] Crear proyecto Laravel API
- [ ] Configurar Docker multi-stage
- [ ] Instalar JWT y dependencias
- [ ] Configurar CORS para múltiples frontends
- [ ] Configurar versionado API (v1)

### **Fase 2: Modelos y Migraciones** (2-3 horas)
- [ ] Crear modelos (Proveedor, Categoria, Producto)
- [ ] Escribir migraciones desde schema.sql actual
- [ ] Crear factories para datos fake
- [ ] Crear seeders con datos de ejemplo
- [ ] Ejecutar migrate:fresh --seed

### **Fase 3: API REST** (3-4 horas)
- [ ] Crear controladores API v1
- [ ] Crear FormRequests (validaciones)
- [ ] Crear API Resources (serialización)
- [ ] Configurar rutas en api.php
- [ ] Implementar endpoint anidado

### **Fase 4: Autenticación y Autorización** (2-3 horas)
- [ ] Configurar JWT en User model
- [ ] Crear AuthController (login, logout, refresh)
- [ ] Crear policies (admin/user roles)
- [ ] Middleware CheckRole
- [ ] Probar autenticación con Postman

### **Fase 5: Testing** (2-3 horas)
- [ ] Configurar PHPUnit
- [ ] Tests Feature para cada endpoint
- [ ] Tests Unit para modelos
- [ ] Tests de autenticación
- [ ] Tests de autorización

### **Fase 6: Documentación** (1-2 horas)
- [ ] Actualizar OpenAPI/Swagger
- [ ] Exportar colecciones Postman
- [ ] Documentar en README.md
- [ ] Crear .env.example completo

### **Fase 7: DevOps** (2-3 horas)
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Dockerfile producción
- [ ] Health check endpoint
- [ ] Logs estructurados
- [ ] Preparar para Terraform

---

## 🎯 SCRIPT DE INICIO RÁPIDO

```bash
#!/bin/bash
# setup-api.sh - Ejecutar en backend-api/

echo "🚀 Creando proyecto Laravel API..."

# 1. Setup inicial
composer create-project laravel/laravel .
composer require tymon/jwt-auth spatie/laravel-query-builder
composer require --dev laravel/pint barryvdh/laravel-ide-helper

php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
php artisan config:publish cors

# 2. Crear estructura de directorios
mkdir -p app/Http/Controllers/Api/V1
mkdir -p app/Http/Requests/Api/V1/{Auth,Proveedor,Categoria,Producto}
mkdir -p app/Http/Resources/Api/V1
mkdir -p app/Services
mkdir -p app/Repositories/{Contracts,Eloquent}
mkdir -p app/Traits
mkdir -p tests/Feature/Api/V1
mkdir -p docker/{php,mysql}

# 3. Modelos
php artisan make:model Proveedor -mfs
php artisan make:model Categoria -mfs
php artisan make:model Producto -mfs

# 4. Controladores
php artisan make:controller Api/V1/AuthController
php artisan make:controller Api/V1/ProveedorController --api --model=Proveedor
php artisan make:controller Api/V1/CategoriaController --api --model=Categoria
php artisan make:controller Api/V1/ProductoController --api --model=Producto

# 5. Resources
php artisan make:resource Api/V1/ProveedorResource
php artisan make:resource Api/V1/CategoriaResource
php artisan make:resource Api/V1/ProductoResource

# 6. Requests
php artisan make:request Api/V1/Auth/LoginRequest
php artisan make:request Api/V1/Proveedor/StoreProveedorRequest
php artisan make:request Api/V1/Categoria/StoreCategoriaRequest
php artisan make:request Api/V1/Producto/StoreProductoRequest

# 7. Policies
php artisan make:policy ProveedorPolicy --model=Proveedor
php artisan make:policy CategoriaPolicy --model=Categoria
php artisan make:policy ProductoPolicy --model=Producto

echo "✅ Estructura creada. Ahora configura .env y ejecuta: docker-compose up -d"
```

---

## 📞 SIGUIENTES PASOS

### **Opción A: Automatizado**
Te creo el script completo listo para ejecutar

### **Opción B: Paso a paso**
Te ayudo a crear cada archivo (migraciones, controladores, etc.)

### **Opción C: Terraform first**
Primero diseñamos la infraestructura y luego el código

**¿Qué prefieres?**db
    restart: unless-stopped
    environment:
      MARIADB_ROOT_PASSWORD: root
      MARIADB_DATABASE: JJPROYECT
      MARIADB_USER: app
      MARIADB_PASSWORD: app
    volumes:
      - db_data:/var/lib/mysql
      - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3307:3306"
    networks:
      - erp-network

  redis:
    image: redis:alpine
    container_name: erp-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - erp-network

  mailhog:
    image: mailhog/mailhog
    container_name: erp-mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - erp-network

volumes:
  db_data:
    driver: local

networks:
  erp-network:
    driver: bridge
```

### **backend-api/docker/Dockerfile** (Multi-stage)

```dockerfile
# Stage 1: Base
FROM php:8.3-fpm as base

RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    default-mysql-client

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Stage 2: Development
FROM base as development
RUN pecl install xdebug && docker-php-ext-enable xdebug
COPY docker/php/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Stage 3: Production
FROM base as production
COPY . .
RUN composer install --no-dev --optimize-autoloader
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache
RUN chown -R www-data:www-data /var/www/html
```

### **docker-compose.yml** (Raíz - Orquestación completa)

```yaml
version: '3.8'

services:
  # API Backend
  api:
    build: ./backend-api
    ports:
      - "8000:8000"
    networks:
      - erp-network

  # Frontend Angular (cuando esté listo)
  frontend-angular:
    build: ./frontend-angular
    ports:
      - "4200:80"
    depends_on:
      - api
    networks:
      - erp-network

  # Frontend React (cuando esté listo)
  frontend-react:
    build: ./frontend-react
    ports:
      - "3000:80"
    depends_on:
      - api
    networks:
      - erp-network

  # Base de datos compartida
  db:
    image: mariadb:11
    environment:
      MARIADB_ROOT_PASSWORD: root
      MARIADB_DATABASE: JJPROYECT
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - erp-network

  # Nginx como API Gateway (opcional)
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infrastructure/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./infrastructure/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
    networks:
      - erp-network

volumes:
  db_data:

networks:
  erp-network:
    driver: bridge
## ⚙️ Configuración Adicional

### 1. Configurar `.env`
```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=JJPROYECT
DB_USERNAME=root
DB_PASSWORD=root

JWT_SECRET=(se genera automáticamente con php artisan jwt:secret)
```

### 2. Habilitar CORS (config/cors.php)
```php
'paths' => ['api/*'],
'allowed_origins' => ['*'], // Cambiar en producción
```

### 3. Configurar routes/api.php
```php
// Rutas públicas
Route::post('login', [AuthController::class, 'login']);

// Rutas protegidas con JWT
Route::middleware('auth:api')->group(function () {
    Route::apiResource('productos', ProductoController::class);
    Route::apiResource('proveedores', ProveedorController::class);
    Route::apiResource('categorias', CategoriaController::class);
    
    // Endpoint anidado
    Route::get('proveedores/{proveedor}/productos', [ProveedorProductoController::class, 'index']);
});
```

---

## 🐳 Docker Compose (Actualizado para Laravel)

```yaml
version: '3.8'

services:
  app:
    build:
      context: ./erp-backend
      dockerfile: Dockerfile
    ports:
      - "8080:8000"
    volumes:
      - ./erp-backend:/var/www/html
    depends_on:
      - db

  db:
    image: mariadb:11
    environment:
      MARIADB_ROOT_PASSWORD: root
      MARIADB_DATABASE: JJPROYECT
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3307:3306"

volumes:
  db_data: {}
```

---

## ✅ Checklist de Migración

- [ ] Crear proyecto Laravel
- [ ] Instalar JWT Auth
- [ ] Crear modelos con migraciones
- [ ] Escribir código de migraciones (schema)
- [ ] Crear controladores API
- [ ] Crear API Resources
- [ ] Crear FormRequests (validaciones)
- [ ] Crear seeders con datos de ejemplo
- [ ] Configurar rutas en api.php
- [ ] Configurar JWT en User model
- [ ] Configurar políticas de autorización
- [ ] Ejecutar migrate:fresh --seed
- [ ] Probar endpoints con Postman
- [ ] Actualizar documentación Swagger
- [ ] Crear tests automatizados

---

## 📞 Siguiente Paso

¿Quieres que te ayude a:
1. **Crear el script bash** con todos los comandos listos para ejecutar?
2. **Configurar Docker** para Laravel?
3. **Escribir las migraciones** con tu schema actual?
4. **Empezar paso a paso** creando cada recurso?

Dime por dónde empezamos 🚀
