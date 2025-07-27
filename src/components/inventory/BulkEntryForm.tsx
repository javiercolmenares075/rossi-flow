import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Package,
  Building2,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  Plus,
  Trash2,
  FileText,
  ShoppingCart,
  Download
} from 'lucide-react';
import { PurchaseOrder, Product, Warehouse, Employee } from '@/types';
import { InventoryService } from '@/lib/inventoryService';

// Mock data for development
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    number: 'OC-2024-001',
    providerId: '1',
    provider: {} as any,
    creationDate: new Date('2024-01-15'),
    estimatedArrivalDate: new Date('2024-01-20'),
    scheduledPaymentDate: new Date('2024-01-25'),
    paymentStatus: 'unpaid',
    items: [
      {
        id: '1',
        productId: '1',
        product: {
          id: '1',
          name: 'Leche Entera',
          code: 'LEC-001',
          type: 'Lácteos',
          unit: 'Litro',
          storageType: 'batch',
          requiresExpiryControl: true,
          minStock: 100,
          description: 'Leche entera pasteurizada',
          status: 'active',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-15')
        },
        quantity: 100,
        unitCost: 5000,
        subtotal: 500000
      },
      {
        id: '2',
        productId: '2',
        product: {
          id: '2',
          name: 'Queso Paraguay',
          code: 'QUE-001',
          type: 'Lácteos',
          unit: 'Kg',
          storageType: 'batch',
          requiresExpiryControl: true,
          minStock: 50,
          description: 'Queso paraguay tradicional',
          status: 'active',
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-12')
        },
        quantity: 50,
        unitCost: 15000,
        subtotal: 750000
      }
    ],
    subtotal: 1250000,
    iva: 187500,
    total: 1437500,
    status: 'issued',
    emailSent: true,
    whatsappSent: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Almacén Principal',
    location: 'Zona Industrial, Luque',
    responsible: 'Juan Pérez',
    capacity: 10000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Almacén Secundario',
    location: 'Centro de Distribución, Asunción',
    responsible: 'María González',
    capacity: 5000,
    status: 'active'
  }
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    position: 'Encargado de Almacén',
    email: 'juan.perez@rossi.com',
    phone: '0981-123-456',
    status: 'active'
  },
  {
    id: '2',
    name: 'María González',
    position: 'Auxiliar de Almacén',
    email: 'maria.gonzalez@rossi.com',
    phone: '0982-234-567',
    status: 'active'
  }
];

// Schema de validación
const bulkEntrySchema = z.object({
  purchaseOrderId: z.string().min(1, 'Debe seleccionar una orden de compra'),
  responsibleId: z.string().min(1, 'Debe seleccionar un responsable'),
  entries: z.array(z.object({
    productId: z.string().min(1, 'Debe seleccionar un producto'),
    quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
    warehouseId: z.string().min(1, 'Debe seleccionar un almacén'),
    expiryDate: z.string().optional(),
    description: z.string().optional()
  })).min(1, 'Debe agregar al menos un producto')
});

type BulkEntryFormData = z.infer<typeof bulkEntrySchema>;

interface BulkEntryFormProps {
  onSuccess?: (result: any) => void;
  onCancel?: () => void;
}

export function BulkEntryForm({ onSuccess, onCancel }: BulkEntryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  const form = useForm<BulkEntryFormData>({
    resolver: zodResolver(bulkEntrySchema),
    defaultValues: {
      entries: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'entries'
  });

  const watchedOrderId = form.watch('purchaseOrderId');

  // Actualizar orden seleccionada
  useEffect(() => {
    if (watchedOrderId) {
      const order = mockPurchaseOrders.find(o => o.id === watchedOrderId);
      setSelectedOrder(order || null);
      
      // Pre-llenar entradas con los productos de la orden
      if (order) {
        const entries = order.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          warehouseId: '',
          expiryDate: '',
          description: `Ingreso desde ${order.number}`
        }));
        
        form.setValue('entries', entries);
      }
    } else {
      setSelectedOrder(null);
      form.setValue('entries', []);
    }
  }, [watchedOrderId, form]);

  const handleSubmit = async (data: BulkEntryFormData) => {
    setIsSubmitting(true);
    setProcessingStatus('Procesando ingreso masivo...');
    
    try {
      const result = await InventoryService.bulkEntryFromPurchaseOrder(
        data.purchaseOrderId,
        data.entries
      );
      
      if (result.success) {
        setProcessingStatus('Ingreso masivo completado exitosamente');
        
        if (onSuccess) {
          onSuccess(result);
        }
        
        alert(result.message);
      } else {
        setProcessingStatus('Error en el ingreso masivo');
        alert('Error al procesar ingreso masivo');
      }
      
    } catch (error) {
      console.error('Error en ingreso masivo:', error);
      setProcessingStatus('Error en el procesamiento');
      alert('Error al procesar ingreso masivo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEntry = () => {
    append({
      productId: '',
      quantity: 0,
      warehouseId: '',
      expiryDate: '',
      description: ''
    });
  };

  const handleRemoveEntry = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUp className="h-5 w-5 text-green-600" />
          Ingreso Masivo desde Orden de Compra
        </CardTitle>
        <CardDescription>
          Registre el ingreso masivo de productos desde una orden de compra
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Orden de Compra */}
          <div>
            <Label>Orden de Compra *</Label>
            <Select onValueChange={(value) => form.setValue('purchaseOrderId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una orden de compra" />
              </SelectTrigger>
              <SelectContent>
                {mockPurchaseOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.number}</span>
                      <span className="text-sm text-muted-foreground">
                        {order.provider.businessName} - {formatCurrency(order.total)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.purchaseOrderId && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.purchaseOrderId.message}</p>
            )}
          </div>

          {/* Información de la Orden Seleccionada */}
          {selectedOrder && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Información de la Orden</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Proveedor</Label>
                  <p className="text-sm">{selectedOrder.provider.businessName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total</Label>
                  <p className="text-sm font-bold">{formatCurrency(selectedOrder.total)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha Estimada</Label>
                  <p className="text-sm">{selectedOrder.estimatedArrivalDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Productos</Label>
                  <p className="text-sm">{selectedOrder.items.length} productos</p>
                </div>
              </div>
            </div>
          )}

          {/* Responsable */}
          <div>
            <Label>Responsable *</Label>
            <Select onValueChange={(value) => form.setValue('responsibleId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un responsable" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{employee.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {employee.position}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.responsibleId && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.responsibleId.message}</p>
            )}
          </div>

          {/* Productos a Ingresar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Productos a Ingresar</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddEntry}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Producto {index + 1}</h5>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEntry(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Producto (solo lectura si viene de orden) */}
                    <div>
                      <Label>Producto</Label>
                      {selectedOrder ? (
                        <div className="p-2 bg-muted rounded text-sm">
                          {selectedOrder.items[index]?.product.name} ({selectedOrder.items[index]?.product.code})
                        </div>
                      ) : (
                        <Select onValueChange={(value) => form.setValue(`entries.${index}.productId`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts?.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} ({product.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    {/* Cantidad */}
                    <div>
                      <Label>Cantidad</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          {...form.register(`entries.${index}.quantity`, { valueAsNumber: true })}
                        />
                        {selectedOrder && (
                          <div className="px-3 py-2 bg-muted rounded text-sm font-medium">
                            {selectedOrder.items[index]?.product.unit}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Almacén */}
                    <div>
                      <Label>Almacén *</Label>
                      <Select onValueChange={(value) => form.setValue(`entries.${index}.warehouseId`, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un almacén" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockWarehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fecha de Vencimiento */}
                    <div>
                      <Label>Fecha de Vencimiento</Label>
                      <Input
                        type="date"
                        {...form.register(`entries.${index}.expiryDate`)}
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="mt-4">
                    <Label>Descripción (opcional)</Label>
                    <Textarea
                      placeholder="Descripción adicional..."
                      rows={2}
                      {...form.register(`entries.${index}.description`)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estado de Procesamiento */}
          {processingStatus && (
            <Alert>
              <div className="flex items-center gap-2">
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertDescription>{processingStatus}</AlertDescription>
              </div>
            </Alert>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Procesando...' : 'Procesar Ingreso Masivo'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Mock data para productos (se usaría en producción)
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Leche Entera',
    code: 'LEC-001',
    type: 'Lácteos',
    unit: 'Litro',
    storageType: 'batch',
    requiresExpiryControl: true,
    minStock: 100,
    description: 'Leche entera pasteurizada',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Queso Paraguay',
    code: 'QUE-001',
    type: 'Lácteos',
    unit: 'Kg',
    storageType: 'batch',
    requiresExpiryControl: true,
    minStock: 50,
    description: 'Queso paraguay tradicional',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  }
]; 