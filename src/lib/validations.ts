import { z } from 'zod';

// Provider validation schema
export const providerSchema = z.object({
  type: z.enum(['contract', 'recurrent']),
  businessName: z.string().min(2, 'La razón social debe tener al menos 2 caracteres'),
  ruc: z.string().min(10, 'El RUC debe tener al menos 10 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  email: z.string().email('Email inválido'),
  phones: z.array(z.string().min(1, 'El teléfono no puede estar vacío')).min(1, 'Debe tener al menos un teléfono'),
  contacts: z.array(z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    position: z.string().min(2, 'El cargo debe tener al menos 2 caracteres'),
    phone: z.string().min(1, 'El teléfono no puede estar vacío'),
    email: z.string().email('Email inválido')
  })).min(1, 'Debe tener al menos un contacto'),
  categories: z.array(z.string()),
  associatedProducts: z.array(z.string()),
  contractFile: z.string().optional(),
  contractNumber: z.string().optional(),
  contractStartDate: z.date().optional(),
  deliveryFrequency: z.enum(['weekly', 'biweekly', 'monthly']).optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

// Product validation schema
export const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
  type: z.string().min(1, 'Debe seleccionar un tipo'),
  unit: z.string().min(1, 'Debe seleccionar una unidad'),
  storageType: z.enum(['bulk', 'batch']),
  requiresExpiryControl: z.boolean(),
  minStock: z.number().min(0, 'El stock mínimo no puede ser negativo'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

// Purchase Order validation schema
export const purchaseOrderSchema = z.object({
  providerId: z.string().min(1, 'Debe seleccionar un proveedor'),
  estimatedArrivalDate: z.date(),
  scheduledPaymentDate: z.date().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Debe seleccionar un producto'),
    quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
    unitCost: z.number().min(0, 'El costo unitario no puede ser negativo')
  })).min(1, 'Debe tener al menos un item')
});

// Inventory Movement validation schema
export const inventoryMovementSchema = z.object({
  type: z.enum(['entry', 'exit']),
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  warehouseId: z.string().min(1, 'Debe seleccionar un almacén'),
  batchId: z.string().optional(),
  expiryDate: z.date().optional(),
  description: z.string().min(1, 'Debe ingresar una descripción'),
  responsibleId: z.string().min(1, 'Debe seleccionar un responsable'),
  weighingTypeId: z.string().optional(),
  purchaseOrderId: z.string().optional()
});

// Payment validation schema
export const paymentSchema = z.object({
  purchaseOrderId: z.string().min(1, 'Debe seleccionar una orden de compra'),
  paymentDate: z.date(),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  description: z.string().optional(),
  paymentTypeId: z.string().min(1, 'Debe seleccionar un tipo de pago'),
  receiptFile: z.string().optional(),
  responsibleId: z.string().min(1, 'Debe seleccionar un responsable')
});

// Production Order validation schema
export const productionOrderSchema = z.object({
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  quantity: z.number().min(1, 'La cantidad debe ser mayor a 0'),
  plannedCompletionDate: z.date(),
  responsibleId: z.string().min(1, 'Debe seleccionar un responsable')
});

// User validation schema
export const userSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum(['super_admin', 'admin', 'warehouse', 'production', 'custom']),
  phone: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

// Generic catalog item schema
export const catalogItemSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

// Warehouse validation schema
export const warehouseSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  location: z.string().min(5, 'La ubicación debe tener al menos 5 caracteres'),
  responsible: z.string().min(1, 'Debe seleccionar un responsable'),
  capacity: z.number().optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

// Employee validation schema
export const employeeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  position: z.string().min(2, 'El cargo debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono no puede estar vacío'),
  status: z.enum(['active', 'inactive']).default('active')
});

// Notification validation schema
export const notificationSchema = z.object({
  type: z.enum(['low_stock', 'expiry', 'payment_due', 'import', 'manual']),
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  message: z.string().min(5, 'El mensaje debe tener al menos 5 caracteres'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  relatedEntity: z.object({
    type: z.enum(['product', 'batch', 'purchase_order', 'payment']),
    id: z.string()
  }).optional()
});

// Reminder validation schema
export const reminderSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  dueDate: z.date()
});

// Filter options schema
export const filterOptionsSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  category: z.string().optional(),
  provider: z.string().optional(),
  warehouse: z.string().optional(),
  product: z.string().optional()
});

// Sort options schema
export const sortOptionsSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc'])
}); 