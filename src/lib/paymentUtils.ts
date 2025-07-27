import { z } from 'zod';

// Validation schemas
export const paymentSchema = z.object({
  orderId: z.string().min(1, 'Debe seleccionar una orden'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  paymentDate: z.string().min(1, 'La fecha de pago es obligatoria'),
  paymentType: z.enum(['cash', 'transfer', 'check', 'card']),
  reference: z.string().optional(),
  description: z.string().optional(),
  receiptFile: z.string().optional()
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// Payment types
export const paymentTypes = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'check', label: 'Cheque' },
  { value: 'card', label: 'Tarjeta' }
];

// Utility functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG'
  }).format(amount);
};

export const getDaysUntilPayment = (paymentDate: Date): number => {
  const today = new Date();
  const diffTime = paymentDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getPaymentStatus = (order: any, payments: any[]): string => {
  const orderPayments = payments.filter(p => p.orderId === order.id);
  const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = order.total - totalPaid;
  
  if (remaining <= 0) return 'paid';
  if (remaining < order.total) return 'partial';
  return 'pending';
};

export const getPaymentTypeLabel = (type: string): string => {
  const paymentType = paymentTypes.find(t => t.value === type);
  return paymentType?.label || type;
};

export const calculateRemainingAmount = (order: any, payments: any[]): number => {
  const orderPayments = payments.filter(p => p.orderId === order.id);
  const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
  return Math.max(0, order.total - totalPaid);
};

export const getPaymentStatusBadge = (order: any, payments: any[] = []) => {
  const status = getPaymentStatus(order, payments);
  const daysUntil = getDaysUntilPayment(order.paymentDate);
  
  if (status === 'paid') {
    return { variant: 'default' as const, text: 'Pagado' };
  } else if (status === 'partial') {
    return { variant: 'secondary' as const, text: 'Parcial' };
  } else if (daysUntil < 0) {
    return { variant: 'destructive' as const, text: 'Vencido' };
  } else if (daysUntil <= 7) {
    return { variant: 'destructive' as const, text: `Próximo (${daysUntil} días)` };
  } else {
    return { variant: 'outline' as const, text: `Pendiente (${daysUntil} días)` };
  }
};

export const validatePaymentAmount = (amount: number, order: any, payments: any[]): string | null => {
  const remaining = calculateRemainingAmount(order, payments);
  
  if (amount > remaining) {
    return `El monto no puede exceder el saldo pendiente de ${formatCurrency(remaining)}`;
  }
  
  if (amount <= 0) {
    return 'El monto debe ser mayor a 0';
  }
  
  return null;
};

export const generatePaymentReference = (paymentType: string): string => {
  const prefix = paymentType === 'transfer' ? 'TRF' : 
                 paymentType === 'check' ? 'CHK' : 
                 paymentType === 'card' ? 'CRD' : 'CSH';
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${new Date().getFullYear()}-${timestamp}`;
}; 