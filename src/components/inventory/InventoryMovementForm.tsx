import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package,
  Building2,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Scale,
  FileText
} from 'lucide-react';
import { Product, Warehouse, Employee, WeighingType } from '@/types';
import { InventoryService } from '@/lib/inventoryService';

// Mock data for development
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
  },
  {
    id: '3',
    name: 'Harina de Trigo',
    code: 'HAR-001',
    type: 'Granos',
    unit: 'Kg',
    storageType: 'bulk',
    requiresExpiryControl: false,
    minStock: 200,
    description: 'Harina de trigo para panificación',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
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

const mockWeighingTypes: WeighingType[] = [
  {
    id: '1',
    name: 'Báscula Digital',
    description: 'Báscula digital de precisión'
  },
  {
    id: '2',
    name: 'Báscula Mecánica',
    description: 'Báscula mecánica tradicional'
  },
  {
    id: '3',
    name: 'Medidor de Volumen',
    description: 'Medidor de volumen para líquidos'
  }
];

// Schema de validación
const movementSchema = z.object({
  type: z.enum(['entry', 'exit'], {
    required_error: 'Debe seleccionar el tipo de movimiento'
  }),
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  warehouseId: z.string().min(1, 'Debe seleccionar un almacén'),
  batchId: z.string().optional(),
  expiryDate: z.string().optional(),
  description: z.string().min(1, 'La descripción es obligatoria'),
  responsibleId: z.string().min(1, 'Debe seleccionar un responsable'),
  weighingTypeId: z.string().optional(),
  purchaseOrderId: z.string().optional()
});

type MovementFormData = z.infer<typeof movementSchema>;

interface InventoryMovementFormProps {
  onSuccess?: (movement: any) => void;
  onCancel?: () => void;
  initialData?: Partial<MovementFormData>;
}

export function InventoryMovementForm({ 
  onSuccess, 
  onCancel, 
  initialData 
}: InventoryMovementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [stockValidation, setStockValidation] = useState<any>(null);

  const form = useForm<MovementFormData>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      type: 'entry',
      quantity: 0,
      description: '',
      ...initialData
    }
  });

  const watchedType = form.watch('type');
  const watchedProductId = form.watch('productId');
  const watchedQuantity = form.watch('quantity');
  const watchedWarehouseId = form.watch('warehouseId');

  // Actualizar producto seleccionado
  useEffect(() => {
    if (watchedProductId) {
      const product = mockProducts.find(p => p.id === watchedProductId);
      setSelectedProduct(product || null);
    } else {
      setSelectedProduct(null);
    }
  }, [watchedProductId]);

  // Obtener información de stock
  useEffect(() => {
    if (watchedProductId && watchedWarehouseId) {
      loadStockInfo();
    }
  }, [watchedProductId, watchedWarehouseId]);

  // Validar stock para salidas
  useEffect(() => {
    if (watchedType === 'exit' && watchedProductId && watchedQuantity > 0) {
      validateStock();
    } else {
      setStockValidation(null);
    }
  }, [watchedType, watchedProductId, watchedQuantity]);

  const loadStockInfo = async () => {
    try {
      const stock = await InventoryService.getProductStock(watchedProductId, watchedWarehouseId);
      setStockInfo(stock);
    } catch (error) {
      console.error('Error al cargar información de stock:', error);
    }
  };

  const validateStock = async () => {
    try {
      const validation = await InventoryService.validateStockForExit(
        watchedProductId, 
        watchedQuantity, 
        watchedWarehouseId
      );
      setStockValidation(validation);
    } catch (error) {
      console.error('Error al validar stock:', error);
    }
  };

  const handleSubmit = async (data: MovementFormData) => {
    setIsSubmitting(true);
    try {
      const movement = await InventoryService.createMovement({
        type: data.type,
        productId: data.productId,
        quantity: data.quantity,
        warehouseId: data.warehouseId,
        batchId: data.batchId,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        description: data.description,
        responsibleId: data.responsibleId,
        weighingTypeId: data.weighingTypeId,
        purchaseOrderId: data.purchaseOrderId
      });

      console.log('Movimiento creado:', movement);
      
      if (onSuccess) {
        onSuccess(movement);
      }
      
      alert('Movimiento de inventario creado exitosamente');
      
    } catch (error) {
      console.error('Error al crear movimiento:', error);
      alert('Error al crear movimiento de inventario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatQuantity = (quantity: number) => {
    return `${quantity} ${selectedProduct?.unit || 'unidades'}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {watchedType === 'entry' ? (
            <ArrowUp className="h-5 w-5 text-green-600" />
          ) : (
            <ArrowDown className="h-5 w-5 text-red-600" />
          )}
          {watchedType === 'entry' ? 'Entrada' : 'Salida'} de Inventario
        </CardTitle>
        <CardDescription>
          Registre un nuevo movimiento de inventario
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Tipo de Movimiento */}
          <div>
            <Label>Tipo de Movimiento *</Label>
            <Select onValueChange={(value) => form.setValue('type', value as 'entry' | 'exit')}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">
                  <div className="flex items-center gap-2">
                    <ArrowUp className="h-4 w-4 text-green-600" />
                    Entrada
                  </div>
                </SelectItem>
                <SelectItem value="exit">
                  <div className="flex items-center gap-2">
                    <ArrowDown className="h-4 w-4 text-red-600" />
                    Salida
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>

          {/* Producto */}
          <div>
            <Label>Producto *</Label>
            <Select onValueChange={(value) => form.setValue('productId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un producto" />
              </SelectTrigger>
              <SelectContent>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {product.code} - {product.unit}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.productId && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.productId.message}</p>
            )}
          </div>

          {/* Información del Producto Seleccionado */}
          {selectedProduct && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Código</Label>
                  <p className="text-sm">{selectedProduct.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo de Almacenamiento</Label>
                  <p className="text-sm capitalize">{selectedProduct.storageType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Unidad</Label>
                  <p className="text-sm">{selectedProduct.unit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Control de Vencimiento</Label>
                  <p className="text-sm">{selectedProduct.requiresExpiryControl ? 'Sí' : 'No'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cantidad */}
          <div>
            <Label>Cantidad *</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                step="0.01"
                placeholder="0"
                {...form.register('quantity', { valueAsNumber: true })}
              />
              {selectedProduct && (
                <div className="px-3 py-2 bg-muted rounded text-sm font-medium">
                  {selectedProduct.unit}
                </div>
              )}
            </div>
            {form.formState.errors.quantity && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.quantity.message}</p>
            )}
          </div>

          {/* Almacén */}
          <div>
            <Label>Almacén *</Label>
            <Select onValueChange={(value) => form.setValue('warehouseId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un almacén" />
              </SelectTrigger>
              <SelectContent>
                {mockWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{warehouse.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {warehouse.location}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.warehouseId && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.warehouseId.message}</p>
            )}
          </div>

          {/* Información de Stock */}
          {stockInfo && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Información de Stock</h4>
              <div className="grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Stock Total</Label>
                  <p className="text-sm font-bold">{formatQuantity(stockInfo.total)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">En este Almacén</Label>
                  <p className="text-sm">
                    {stockInfo.byWarehouse.find((w: any) => w.warehouseId === watchedWarehouseId)?.quantity || 0} {selectedProduct?.unit}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validación de Stock para Salidas */}
          {stockValidation && (
            <Alert variant={stockValidation.valid ? "default" : "destructive"}>
              {stockValidation.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {stockValidation.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Fecha de Vencimiento (solo para productos que lo requieren) */}
          {selectedProduct?.requiresExpiryControl && watchedType === 'entry' && (
            <div>
              <Label>Fecha de Vencimiento</Label>
              <Input
                type="date"
                {...form.register('expiryDate')}
              />
              {form.formState.errors.expiryDate && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.expiryDate.message}</p>
              )}
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

          {/* Tipo de Pesaje */}
          <div>
            <Label>Tipo de Pesaje</Label>
            <Select onValueChange={(value) => form.setValue('weighingTypeId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el tipo de pesaje (opcional)" />
              </SelectTrigger>
              <SelectContent>
                {mockWeighingTypes.map((weighingType) => (
                  <SelectItem key={weighingType.id} value={weighingType.id}>
                    {weighingType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descripción */}
          <div>
            <Label>Descripción *</Label>
            <Textarea
              placeholder="Describa el motivo del movimiento..."
              rows={3}
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || (watchedType === 'exit' && stockValidation && !stockValidation.valid)}
            >
              {isSubmitting ? 'Creando...' : 'Crear Movimiento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 