// Core types for Rossi Inventory and Production System

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive';
  phone?: string;
  createdAt: Date;
  lastActivity?: Date;
}

export type UserRole = 'super_admin' | 'admin' | 'warehouse' | 'production' | 'custom';

export interface Provider {
  id: string;
  type: 'contract' | 'recurrent';
  businessName: string;
  ruc: string;
  address: string;
  email: string;
  phones: string[];
  contacts: Contact[];
  categories: string[];
  associatedProducts: string[];
  // Contract specific fields
  contractFile?: string;
  contractNumber?: string;
  contractStartDate?: Date;
  deliveryFrequency?: 'weekly' | 'biweekly' | 'monthly';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  type: string;
  unit: string;
  storageType: 'bulk' | 'batch';
  requiresExpiryControl: boolean;
  minStock: number;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductType {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface StorageType {
  id: string;
  name: string;
  description?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  responsible: string;
  capacity?: number;
  status: 'active' | 'inactive';
}

export interface WeighingType {
  id: string;
  name: string;
  description?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface State {
  id: string;
  name: string;
  module: 'merchandise' | 'purchase_order' | 'payment' | 'production';
  description?: string;
}

export interface PaymentType {
  id: string;
  name: string;
  description?: string;
}

export interface PurchaseOrder {
  id: string;
  number: string;
  providerId: string;
  provider: Provider;
  creationDate: Date;
  estimatedArrivalDate: Date;
  scheduledPaymentDate?: Date;
  paymentStatus: 'unpaid' | 'paid';
  items: PurchaseOrderItem[];
  subtotal: number;
  iva: number;
  total: number;
  status: PurchaseOrderStatus;
  emailSent: boolean;
  whatsappSent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export type PurchaseOrderStatus = 'pre_order' | 'issued' | 'received' | 'paid';

export interface InventoryMovement {
  id: string;
  date: Date;
  type: 'entry' | 'exit';
  productId: string;
  product: Product;
  quantity: number;
  unit: string;
  warehouseId: string;
  warehouse: Warehouse;
  batchId?: string;
  batch?: Batch;
  expiryDate?: Date;
  description: string;
  responsibleId: string;
  responsible: Employee;
  weighingTypeId?: string;
  weighingType?: WeighingType;
  purchaseOrderId?: string;
  purchaseOrder?: PurchaseOrder;
  createdAt: Date;
}

export interface Batch {
  id: string;
  code: string;
  productId: string;
  product: Product;
  initialQuantity: number;
  currentQuantity: number;
  creationDate: Date;
  expiryDate?: Date;
  warehouseId: string;
  warehouse: Warehouse;
  description?: string;
  qrCode: string;
  status: 'active' | 'expired' | 'depleted';
}

export interface Payment {
  id: string;
  purchaseOrderId: string;
  purchaseOrder: PurchaseOrder;
  paymentDate: Date;
  amount: number;
  description?: string;
  paymentTypeId: string;
  paymentType: PaymentType;
  receiptFile?: string;
  responsibleId: string;
  responsible: Employee;
  createdAt: Date;
}

export interface Notification {
  id: string;
  type: 'low_stock' | 'expiry' | 'payment_due' | 'import' | 'manual';
  title: string;
  message: string;
  status: 'unread' | 'read';
  priority: 'low' | 'medium' | 'high';
  relatedEntity?: {
    type: 'product' | 'batch' | 'purchase_order' | 'payment';
    id: string;
  };
  userId: string;
  createdAt: Date;
  readAt?: Date;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  userId: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface ProductRecipe {
  id: string;
  productId: string;
  product: Product;
  ingredients: RecipeIngredient[];
  version: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  id: string;
  ingredientId: string;
  ingredient: Product;
  quantity: number;
  unit: string;
}

export interface ProductionOrder {
  id: string;
  number: string;
  productId: string;
  product: Product;
  quantity: number;
  plannedCompletionDate: Date;
  responsibleId: string;
  responsible: Employee;
  status: ProductionOrderStatus;
  ingredients: ProductionIngredient[];
  progress: ProductionProgress[];
  finalQuantity?: number;
  finalWarehouseId?: string;
  finalWarehouse?: Warehouse;
  finalNote?: string;
  finalBatchId?: string;
  finalBatch?: Batch;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductionIngredient {
  id: string;
  ingredientId: string;
  ingredient: Product;
  requiredQuantity: number;
  availableQuantity: number;
  consumedQuantity: number;
  unit: string;
  batchId?: string;
  batch?: Batch;
}

export interface ProductionProgress {
  id: string;
  date: Date;
  responsibleId: string;
  responsible: Employee;
  quantityProduced: number;
  ingredientsConsumed: ProductionIngredient[];
  observations?: string;
}

export type ProductionOrderStatus = 'pre_production' | 'in_production' | 'completed';

export interface AuditLog {
  id: string;
  userId: string;
  user: User;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter and search types
export interface FilterOptions {
  search?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  category?: string;
  provider?: string;
  warehouse?: string;
  product?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// Dashboard types
export interface DashboardStats {
  totalProducts: number;
  lowStockProducts: number;
  expiringProducts: number;
  pendingPayments: number;
  activeProductionOrders: number;
  totalValue: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
} 