// Constants for Rossi Inventory and Production System

// Application constants
export const APP_NAME = 'Inventarios Rossi';
export const APP_VERSION = '1.0.0';
export const COMPANY_NAME = 'Rossi Lácteos';

// Default values
export const DEFAULT_IVA_RATE = 0.15; // 15%
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_CURRENCY = 'PYG';
export const DEFAULT_LOCALE = 'es-PY';

// Status options
export const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
] as const;

export const PURCHASE_ORDER_STATUS_OPTIONS = [
  { value: 'pre_order', label: 'Pre-orden' },
  { value: 'issued', label: 'Emitida' },
  { value: 'received', label: 'Recibida' },
  { value: 'paid', label: 'Pagada' },
] as const;

export const PRODUCTION_ORDER_STATUS_OPTIONS = [
  { value: 'pre_production', label: 'Pre-producción' },
  { value: 'in_production', label: 'En producción' },
  { value: 'completed', label: 'Completado' },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'unpaid', label: 'No pagado' },
  { value: 'paid', label: 'Pagado' },
] as const;

export const BATCH_STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'expired', label: 'Vencido' },
  { value: 'depleted', label: 'Agotado' },
] as const;

// Provider types
export const PROVIDER_TYPE_OPTIONS = [
  { value: 'contract', label: 'Por Contrato' },
  { value: 'recurrent', label: 'Recurrente' },
] as const;

// Storage types
export const STORAGE_TYPE_OPTIONS = [
  { value: 'bulk', label: 'A Granel' },
  { value: 'batch', label: 'Por Lotes' },
] as const;

// Delivery frequencies
export const DELIVERY_FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
] as const;

// Movement types
export const MOVEMENT_TYPE_OPTIONS = [
  { value: 'entry', label: 'Entrada' },
  { value: 'exit', label: 'Salida' },
] as const;

// Priority levels
export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
] as const;

// Notification types
export const NOTIFICATION_TYPE_OPTIONS = [
  { value: 'low_stock', label: 'Stock Bajo' },
  { value: 'expiry', label: 'Vencimiento' },
  { value: 'payment_due', label: 'Pago Pendiente' },
  { value: 'import', label: 'Importación' },
  { value: 'manual', label: 'Manual' },
] as const;

// User roles
export const USER_ROLE_OPTIONS = [
  { value: 'super_admin', label: 'Super Administrador' },
  { value: 'admin', label: 'Administrador' },
  { value: 'warehouse', label: 'Almacén' },
  { value: 'production', label: 'Producción' },
  { value: 'custom', label: 'Personalizado' },
] as const;

// Module types for states
export const MODULE_OPTIONS = [
  { value: 'merchandise', label: 'Mercancía' },
  { value: 'purchase_order', label: 'Orden de Compra' },
  { value: 'payment', label: 'Pago' },
  { value: 'production', label: 'Producción' },
] as const;

// Units of measurement
export const UNIT_OPTIONS = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'lt', label: 'Litros (lt)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'unidad', label: 'Unidad' },
  { value: 'caja', label: 'Caja' },
  { value: 'bolsa', label: 'Bolsa' },
  { value: 'botella', label: 'Botella' },
  { value: 'lata', label: 'Lata' },
  { value: 'paquete', label: 'Paquete' },
] as const;

// Product categories (common for dairy industry)
export const PRODUCT_CATEGORIES = [
  'Lácteos',
  'Insumos',
  'Materiales de Empaque',
  'Productos Químicos',
  'Equipos',
  'Servicios',
  'Otros',
] as const;

// Provider categories
export const PROVIDER_CATEGORIES = [
  'Lácteos',
  'Insumos',
  'Materiales',
  'Equipos',
  'Servicios',
  'Transporte',
  'Otros',
] as const;

// File upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Pagination
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
export const DATE_INPUT_FORMAT = 'yyyy-MM-dd';

// Validation rules
export const VALIDATION_RULES = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 5,
  MAX_DESCRIPTION_LENGTH: 500,
  MIN_RUC_LENGTH: 8,
  MAX_RUC_LENGTH: 10,
  MIN_PHONE_LENGTH: 7,
  MAX_PHONE_LENGTH: 15,
  MIN_QUANTITY: 0.01,
  MAX_QUANTITY: 999999.99,
  MIN_COST: 0.01,
  MAX_COST: 999999999.99,
} as const;

// Notification settings
export const NOTIFICATION_SETTINGS = {
  LOW_STOCK_THRESHOLD: 0.1, // 10% of min stock
  EXPIRY_WARNING_DAYS: [30, 15, 7, 1], // Days before expiry to warn
  PAYMENT_DUE_WARNING_DAYS: [7, 3, 1], // Days before payment due to warn
  AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
} as const;

// Chart colors
export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#64748b',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  light: '#f1f5f9',
  dark: '#1e293b',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'rossi_user_preferences',
  THEME: 'rossi_theme',
  LANGUAGE: 'rossi_language',
  SIDEBAR_COLLAPSED: 'rossi_sidebar_collapsed',
  TABLE_PREFERENCES: 'rossi_table_preferences',
  FILTERS: 'rossi_filters',
} as const;

// API endpoints (for future backend integration)
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  REFRESH: '/api/auth/refresh',
  
  // Users
  USERS: '/api/users',
  USERS_ME: '/api/users/me',
  
  // Providers
  PROVIDERS: '/api/providers',
  
  // Products
  PRODUCTS: '/api/products',
  PRODUCT_TYPES: '/api/product-types',
  
  // Warehouses
  WAREHOUSES: '/api/warehouses',
  
  // Employees
  EMPLOYEES: '/api/employees',
  
  // Purchase Orders
  PURCHASE_ORDERS: '/api/purchase-orders',
  
  // Inventory
  INVENTORY_MOVEMENTS: '/api/inventory-movements',
  BATCHES: '/api/batches',
  STOCK: '/api/stock',
  
  // Payments
  PAYMENTS: '/api/payments',
  
  // Production
  PRODUCTION_ORDERS: '/api/production-orders',
  RECIPES: '/api/recipes',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  REMINDERS: '/api/reminders',
  
  // Reports
  REPORTS: '/api/reports',
  
  // Audit
  AUDIT_LOGS: '/api/audit-logs',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Email inválido',
  INVALID_RUC: 'RUC inválido',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_DATE: 'Fecha inválida',
  INVALID_NUMBER: 'Número inválido',
  MIN_LENGTH: (min: number) => `Mínimo ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo ${max} caracteres`,
  MIN_VALUE: (min: number) => `Valor mínimo: ${min}`,
  MAX_VALUE: (max: number) => `Valor máximo: ${max}`,
  FILE_TOO_LARGE: `Archivo demasiado grande. Máximo ${formatFileSize(MAX_FILE_SIZE)}`,
  INVALID_FILE_TYPE: 'Tipo de archivo no permitido',
  NETWORK_ERROR: 'Error de conexión. Intente nuevamente.',
  UNAUTHORIZED: 'No autorizado',
  FORBIDDEN: 'Acceso denegado',
  NOT_FOUND: 'Recurso no encontrado',
  SERVER_ERROR: 'Error del servidor',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Registro creado exitosamente',
  UPDATED: 'Registro actualizado exitosamente',
  DELETED: 'Registro eliminado exitosamente',
  SAVED: 'Cambios guardados exitosamente',
  SENT: 'Enviado exitosamente',
  PROCESSED: 'Procesado exitosamente',
  UPLOADED: 'Archivo subido exitosamente',
  EXPORTED: 'Datos exportados exitosamente',
} as const;

// Warning messages
export const WARNING_MESSAGES = {
  UNSAVED_CHANGES: 'Tiene cambios sin guardar. ¿Desea continuar?',
  DELETE_CONFIRMATION: '¿Está seguro de que desea eliminar este registro?',
  BULK_DELETE_CONFIRMATION: (count: number) => `¿Está seguro de que desea eliminar ${count} registros?`,
  LOW_STOCK: 'Stock bajo detectado',
  EXPIRY_WARNING: 'Producto próximo a vencer',
  PAYMENT_DUE: 'Pago próximo a vencer',
} as const;

// Info messages
export const INFO_MESSAGES = {
  NO_DATA: 'No hay datos disponibles',
  NO_RESULTS: 'No se encontraron resultados',
  LOADING: 'Cargando...',
  PROCESSING: 'Procesando...',
  SAVING: 'Guardando...',
  UPLOADING: 'Subiendo archivo...',
  EXPORTING: 'Exportando datos...',
} as const;

// Helper function for file size formatting
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 