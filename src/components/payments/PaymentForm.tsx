import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';
import { paymentSchema, PaymentFormData, paymentTypes, validatePaymentAmount, generatePaymentReference } from '@/lib/paymentUtils';

interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  pendingOrders: any[];
  payments: any[];
  initialData?: Partial<PaymentFormData>;
  isEdit?: boolean;
}

export function PaymentForm({
  onSubmit,
  onCancel,
  isSubmitting,
  pendingOrders,
  payments,
  initialData,
  isEdit = false
}: PaymentFormProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: 'transfer',
      paymentDate: new Date().toISOString().split('T')[0],
      ...initialData
    }
  });

  const selectedOrderId = form.watch('orderId');
  const selectedOrder = pendingOrders.find(o => o.id === selectedOrderId);
  const remainingAmount = selectedOrder ? 
    payments.filter(p => p.orderId === selectedOrderId).reduce((sum, p) => sum + p.amount, 0) : 0;

  const handleAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    form.setValue('amount', amount);
    
    if (selectedOrder) {
      const error = validatePaymentAmount(amount, selectedOrder, payments);
      if (error) {
        form.setError('amount', { message: error });
      } else {
        form.clearErrors('amount');
      }
    }
  };

  const handlePaymentTypeChange = (value: string) => {
    form.setValue('paymentType', value as any);
    if (!form.getValues('reference')) {
      form.setValue('reference', generatePaymentReference(value));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="orderId">Orden de Compra *</Label>
        <Select 
          value={form.watch('orderId')} 
          onValueChange={(value) => form.setValue('orderId', value)}
          disabled={isEdit}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una orden" />
          </SelectTrigger>
          <SelectContent>
            {pendingOrders.filter(order => {
              if (isEdit) return true;
              const orderPayments = payments.filter(p => p.orderId === order.id);
              const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
              return totalPaid < order.total;
            }).map(order => {
              const orderPayments = payments.filter(p => p.orderId === order.id);
              const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
              const remaining = order.total - totalPaid;
              return (
                <SelectItem key={order.id} value={order.id}>
                  {order.orderNumber} - {order.providerName} ({remaining.toLocaleString('es-PY')} ₲)
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {form.formState.errors.orderId && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.orderId.message}
          </p>
        )}
      </div>

      {selectedOrder && (
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Orden:</strong> {selectedOrder.orderNumber}<br />
            <strong>Proveedor:</strong> {selectedOrder.providerName}<br />
            <strong>Total:</strong> {selectedOrder.total.toLocaleString('es-PY')} ₲<br />
            <strong>Pendiente:</strong> {(selectedOrder.total - remainingAmount).toLocaleString('es-PY')} ₲
          </p>
        </div>
      )}

      <div>
        <Label htmlFor="amount">Monto (₲) *</Label>
        <Input
          {...form.register('amount', { valueAsNumber: true })}
          type="number"
          placeholder="0"
          onChange={(e) => handleAmountChange(e.target.value)}
        />
        {form.formState.errors.amount && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.amount.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="paymentDate">Fecha de Pago *</Label>
        <Input
          {...form.register('paymentDate')}
          type="date"
        />
        {form.formState.errors.paymentDate && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.paymentDate.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="paymentType">Tipo de Pago *</Label>
        <Select 
          value={form.watch('paymentType')} 
          onValueChange={handlePaymentTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione el tipo" />
          </SelectTrigger>
          <SelectContent>
            {paymentTypes.map(type => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.paymentType && (
          <p className="text-sm text-destructive mt-1">
            {form.formState.errors.paymentType.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="reference">Referencia</Label>
        <Input
          {...form.register('reference')}
          placeholder="Número de transferencia, cheque, etc."
        />
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          {...form.register('description')}
          placeholder="Descripción opcional del pago"
        />
      </div>

      <div>
        <Label htmlFor="receiptFile">Comprobante</Label>
        <div className="flex items-center gap-2">
          <Input
            {...form.register('receiptFile')}
            placeholder="Nombre del archivo"
          />
          <Button type="button" variant="outline" size="sm">
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : (isEdit ? 'Actualizar Pago' : 'Registrar Pago')}
        </Button>
      </div>
    </form>
  );
} 