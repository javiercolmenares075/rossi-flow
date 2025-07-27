# Inventarios Rossi - Sistema de Inventario y Producción

## 📋 Descripción General

**Inventarios Rossi** es un sistema integral de gestión de inventario y producción diseñado específicamente para la industria láctea. El sistema digitaliza y optimiza todos los procesos clave de la cadena de suministro, desde la compra de insumos hasta la producción y el control de stock.

## 🎯 Objetivos del MVP

- **Digitalización completa** de procesos de inventario y producción
- **Trazabilidad total** de productos desde la compra hasta la venta
- **Control de lotes** con códigos QR para productos lácteos
- **Gestión de proveedores** con contratos y asociaciones de productos
- **Órdenes de compra** automatizadas con envío por email/WhatsApp
- **Control de producción** con recetas y seguimiento de insumos
- **Alertas inteligentes** para stock bajo y vencimientos
- **Reportes en tiempo real** para toma de decisiones

## 🏗️ Arquitectura del Sistema

### Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod
- **State Management**: TanStack Query
- **Icons**: Lucide React
- **Charts**: Recharts

### Estructura del Proyecto

```
src/
├── components/
│   ├── ui/                 # Componentes base de shadcn/ui
│   ├── Layout/            # Layout principal y sidebar
│   ├── Dashboard/         # Componentes del dashboard
│   └── Modules/           # Módulos específicos
├── pages/                 # Páginas de la aplicación
│   ├── catalogs/          # Catálogos básicos
│   ├── purchase-orders/   # Órdenes de compra
│   ├── inventory/         # Gestión de inventario
│   ├── payments/          # Módulo de pagos
│   ├── production/        # Producción
│   ├── notifications/     # Notificaciones y alertas
│   ├── reports/           # Reportes
│   └── admin/             # Administración
├── lib/                   # Utilidades y configuraciones
│   ├── utils.ts           # Funciones utilitarias
│   ├── constants.ts       # Constantes del sistema
│   └── validations.ts     # Esquemas de validación Zod
└── types/                 # Definiciones de tipos TypeScript
```

## 📊 Módulos Principales

### 1. Catálogos y Configuración Básica

#### 1.1 Proveedores
- **Tipo**: Contrato o Recurrente
- **Funcionalidades**:
  - Registro con datos completos (RUC, contacto, dirección)
  - Gestión de contactos múltiples
  - Asociación de productos y categorías
  - Subida de contratos en PDF
  - Búsqueda y filtros avanzados
  - Validación de datos obligatorios

#### 1.2 Productos
- **Atributos**: Código, nombre, tipo, unidad, almacenamiento
- **Tipos de almacenamiento**: A granel / Por lotes
- **Control de vencimiento**: Opcional por producto
- **Stock mínimo**: Para alertas automáticas
- **Asociación**: Con proveedores y categorías

#### 1.3 Catálogos Adicionales
- **Tipos de Producto**: Clasificación para reportes
- **Almacenes**: Ubicaciones físicas con responsables
- **Empleados**: Personal del sistema
- **Estados**: Para diferentes módulos
- **Tipos de Pago**: Modalidades de pago
- **Tipos de Pesaje**: Equipos de medición

### 2. Gestión de Órdenes de Compra

#### 2.1 Creación de Orden
- **Flujo**: Selección de proveedor → Productos → Cálculos → Generación
- **Validaciones**: Datos obligatorios, fechas lógicas, stock disponible
- **Cálculos**: Subtotal, IVA (15%), Total automático
- **Estados**: Pre-orden → Emitida → Recibida → Pagada

#### 2.2 Funcionalidades Avanzadas
- **PDF automático**: Generación con formato estándar
- **Envío automático**: Email y WhatsApp al proveedor
- **Clonación**: Duplicar órdenes existentes
- **Historial**: Auditoría completa de cambios
- **Búsqueda**: Filtros por proveedor, estado, fecha

### 3. Ingreso de Mercancía e Inventario

#### 3.1 Movimientos de Inventario
- **Tipos**: Entrada / Salida
- **Campos**: Producto, cantidad, almacén, lote, responsable
- **Validaciones**: Stock disponible, fechas de vencimiento
- **Trazabilidad**: Historial completo de movimientos

#### 3.2 Control por Lotes y Granel
- **Lotes**: Códigos únicos + QR, fechas de vencimiento
- **Granel**: Stock general por almacén
- **Códigos QR**: Información completa del lote
- **Validaciones**: No exceder stock disponible

#### 3.3 Ingreso Masivo
- **Desde órdenes**: Recepción directa de órdenes de compra
- **Diferencias**: Registrar cantidades reales vs. solicitadas
- **Automatización**: Creación de lotes y actualización de stock
- **Estados**: Cambio automático a "Recibida"

### 4. Módulo de Pagos

#### 4.1 Gestión de Pagos
- **Selección**: Órdenes pendientes de pago
- **Registro**: Fecha, monto, tipo, descripción
- **Comprobantes**: Subida de archivos PDF/imagen
- **Estados**: Actualización automática a "Pagado"

#### 4.2 Funcionalidades
- **Historial**: Todos los pagos por orden
- **Alertas**: Fechas de pago próximas/vencidas
- **Reportes**: Por proveedor, tipo, fecha
- **Auditoría**: Registro de responsables y fechas

### 5. Notificaciones y Alertas

#### 5.1 Tipos de Notificaciones
- **Stock bajo**: Productos bajo el mínimo
- **Vencimientos**: Lotes próximos a vencer
- **Pagos**: Órdenes con pago próximo/vencido
- **Importaciones**: Movimientos especiales
- **Manuales**: Recordatorios personalizados

#### 5.2 Gestión
- **Estados**: No leída / Leída
- **Configuración**: Preferencias por usuario
- **Alertas visuales**: Colores por urgencia
- **Acciones**: Marcar como leída, eliminar

### 6. Proceso de Producción

#### 6.1 Recetas y Fórmulas
- **Definición**: Insumos y cantidades por producto
- **Versiones**: Control de cambios en recetas
- **Cálculos**: Insumos requeridos automáticos

#### 6.2 Órdenes de Producción
- **Creación**: Producto, cantidad, fechas, responsable
- **Validaciones**: Stock suficiente de insumos
- **Estados**: Pre-producción → En producción → Completado

#### 6.3 Seguimiento
- **Avances**: Registro diario de producción
- **Consumo**: Descuento automático de insumos
- **Lotes**: Generación de lotes para productos terminados
- **QR**: Códigos para trazabilidad

### 7. Usuarios y Roles

#### 7.1 Roles Predefinidos
- **Super Administrador**: Acceso total
- **Administrador**: Procesos operativos completos
- **Almacén**: Solo movimientos de inventario
- **Producción**: Órdenes de producción
- **Personalizado**: Permisos específicos

#### 7.2 Gestión de Usuarios
- **Registro**: Datos completos con validaciones
- **Estados**: Activo/Inactivo
- **Auditoría**: Historial de actividades
- **Seguridad**: Políticas de contraseñas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### Instalación

```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd rossi-flow

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME="Inventarios Rossi"
VITE_COMPANY_NAME="Rossi Lácteos"
```

## 📈 Roadmap de Desarrollo

### Fase 1: Catálogos y Configuración (Semana 1)
- [x] Estructura del proyecto
- [x] Tipos y validaciones
- [ ] Proveedores CRUD
- [ ] Productos CRUD
- [ ] Catálogos básicos

### Fase 2: Órdenes de Compra (Semana 2) ✅
- [x] Formulario de creación
- [x] Listado y gestión
- [x] Generación de PDF
- [x] Envío por email/WhatsApp

### Fase 3: Inventario (Semana 3) ✅
- [x] Movimientos de inventario
- [x] Control de lotes
- [x] Ingreso masivo
- [x] Códigos QR

### Fase 4: Producción (Semana 4)
- [ ] Gestión de recetas
- [ ] Órdenes de producción
- [ ] Seguimiento de avances
- [ ] Integración con inventario

### Fase 5: Pagos y Notificaciones (Semana 5)
- [ ] Módulo de pagos
- [ ] Sistema de notificaciones
- [ ] Alertas automáticas
- [ ] Reportes básicos

### Fase 6: Reportes y Admin (Semana 6)
- [ ] Dashboard de reportes
- [ ] Gestión de usuarios
- [ ] Auditoría
- [ ] Configuraciones avanzadas

## 🔧 Configuración de Desarrollo

### Estructura de Datos

El sistema utiliza TypeScript con tipos estrictos definidos en `src/types/index.ts`:

```typescript
// Ejemplo de tipos principales
interface Provider {
  id: string;
  type: 'contract' | 'recurrent';
  businessName: string;
  ruc: string;
  // ... más campos
}

interface Product {
  id: string;
  name: string;
  code: string;
  storageType: 'bulk' | 'batch';
  // ... más campos
}
```

### Validaciones

Todas las validaciones utilizan Zod:

```typescript
// Ejemplo de esquema de validación
export const providerSchema = z.object({
  type: z.enum(['contract', 'recurrent']),
  businessName: z.string().min(2),
  ruc: z.string().min(10),
  email: z.string().email(),
  // ... más validaciones
});
```

### Utilidades

Funciones utilitarias en `src/lib/utils.ts`:

```typescript
// Formateo de moneda
formatCurrency(amount: number): string

// Generación de códigos
generateCode(prefix: string): string

// Validaciones
validateEmail(email: string): boolean
validateRUC(ruc: string): boolean
```

## 📊 Características Técnicas

### Rendimiento
- **Lazy Loading**: Carga bajo demanda de componentes
- **Memoización**: React.memo para optimización
- **Debouncing**: Para búsquedas y filtros
- **Paginación**: Para listas grandes

### Seguridad
- **Validación**: Zod en frontend y backend
- **Sanitización**: Limpieza de datos de entrada
- **Autenticación**: JWT con refresh tokens
- **Autorización**: Roles y permisos granulares

### Escalabilidad
- **Modular**: Componentes reutilizables
- **TypeScript**: Tipos estrictos
- **API REST**: Endpoints bien definidos
- **Base de datos**: Diseño normalizado

## 🤝 Contribución

### Estándares de Código
- **TypeScript**: Tipos estrictos obligatorios
- **ESLint**: Reglas de linting configuradas
- **Prettier**: Formateo automático
- **Commits**: Mensajes descriptivos

### Flujo de Trabajo
1. Crear rama feature: `git checkout -b feature/nombre-feature`
2. Desarrollar funcionalidad
3. Ejecutar tests: `npm test`
4. Commit con mensaje descriptivo
5. Pull Request con descripción detallada

## 📞 Soporte

### Contacto
- **Email**: soporte@rossi.com
- **Teléfono**: +595 21 123 456
- **Horarios**: Lunes a Viernes 8:00 - 18:00

### Documentación
- **API Docs**: `/api/docs`
- **Guía de Usuario**: `/docs/user-guide`
- **Manual Técnico**: `/docs/technical`

## 📄 Licencia

Este proyecto es propiedad de **Rossi Lácteos** y está bajo licencia privada.

---

**Desarrollado con ❤️ para la industria láctea paraguaya**
