import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Download,
  Mail,
  MessageSquare,
  ShoppingCart,
  Calendar,
  DollarSign,
  Building2,
  Package,
  Calculator,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Provider, Product, PurchaseOrder } from '@/types';
import React from 'react'; // Added missing import

// Mock data for development
const mockProviders: Provider[] = [
  {
    id: '1',
    type: 'contract',
    businessName: 'Lácteos del Sur S.A.',
    ruc: '80012345-1',
    address: 'Ruta 2 Km 45, San Lorenzo',
    email: 'contacto@lacteosdelsur.com.py',
    phones: ['021-123-456', '0981-123-456'],
    contacts: [
      {
        name: 'Juan Pérez',
        position: 'Gerente Comercial',
        phone: '0981-123-456',
        email: 'juan.perez@lacteosdelsur.com.py'
      }
    ],
    categories: ['Leche', 'Queso'],
    associatedProducts: ['Leche entera', 'Queso paraguay'],
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'recurrent',
    businessName: 'Granja San Miguel',
    ruc: '80023456-2',
    address: 'Ruta 1 Km 30, Luque',
    email: 'info@granjasanmiguel.com.py',
    phones: ['021-234-567', '0982-234-567'],
    contacts: [
      {
        name: 'María González',
        position: 'Encargada de Ventas',
        phone: '0982-234-567',
        email: 'maria.gonzalez@granjasanmiguel.com.py'
      }
    ],
    categories: ['Huevos', 'Pollo'],
    associatedProducts: ['Huevos frescos', 'Pollo entero'],
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  }
];

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
    name: 'Huevos Frescos',
    code: 'HUE-001',
    type: 'Aves',
    unit: 'Docena',
    storageType: 'batch',
    requiresExpiryControl: true,
    minStock: 20,
    description: 'Huevos frescos de granja',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  }
];

// Schema de validación para el formulario
const purchaseOrderSchema = z.object({
  providerId: z.string().min(1, 'Debe seleccionar un proveedor'),
  creationDate: z.string().min(1, 'La fecha de creación es obligatoria'),
  estimatedArrivalDate: z.string().min(1, 'La fecha estimada de llegada es obligatoria'),
  scheduledPaymentDate: z.string().min(1, 'La fecha programada de pago es obligatoria'),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string().min(1, 'Debe seleccionar un producto'),
    quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
    unitPrice: z.number().min(0.01, 'El precio unitario debe ser mayor a 0'),
    description: z.string().optional()
  })).min(1, 'Debe agregar al menos un producto')
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

export function NewPurchaseOrderPage() {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      creationDate: new Date().toISOString().split('T')[0],
      estimatedArrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      scheduledPaymentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ productId: '', quantity: 0, unitPrice: 0, description: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  const watchedItems = form.watch('items');
  const watchedProviderId = form.watch('providerId');

  // Calcular totales
  const subtotal = watchedItems.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice);
  }, 0);

  const iva = subtotal * 0.15; // 15% IVA
  const total = subtotal + iva;

  // Actualizar proveedor seleccionado
  React.useEffect(() => {
    if (watchedProviderId) {
      const provider = mockProviders.find(p => p.id === watchedProviderId);
      setSelectedProvider(provider || null);
    } else {
      setSelectedProvider(null);
    }
  }, [watchedProviderId]);

  const handleAddItem = () => {
    append({ productId: '', quantity: 0, unitPrice: 0, description: '' });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleSubmit = async (data: PurchaseOrderFormData) => {
    setIsSubmitting(true);
    try {
      // Simular envío de datos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrder: PurchaseOrder = {
        id: `oc-${Date.now()}`,
        number: `OC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
        providerId: data.providerId,
        provider: selectedProvider!,
        creationDate: new Date(data.creationDate),
        estimatedArrivalDate: new Date(data.estimatedArrivalDate),
        scheduledPaymentDate: new Date(data.scheduledPaymentDate),
        paymentStatus: 'unpaid',
        items: data.items.map(item => ({
          id: `item-${Date.now()}-${Math.random()}`,
          productId: item.productId,
          product: mockProducts.find(p => p.id === item.productId)!,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          description: item.description || ''
        })),
        subtotal,
        iva,
        total,
        status: 'pre_order',
        emailSent: false,
        whatsappSent: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Nueva orden de compra creada:', newOrder);
      
      // Aquí se enviaría al backend
      alert('Orden de compra creada exitosamente');
      
    } catch (error) {
      console.error('Error al crear la orden de compra:', error);
      alert('Error al crear la orden de compra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Simular generación de PDF
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('PDF generado exitosamente');
    } catch (error) {
      console.error('Error al generar PDF:', error);
      alert('Error al generar PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendEmail = async () => {
    if (!selectedProvider) {
      alert('Debe seleccionar un proveedor primero');
      return;
    }

    setIsSendingEmail(true);
    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Email enviado exitosamente a ${selectedProvider.email}`);
    } catch (error) {
      console.error('Error al enviar email:', error);
      alert('Error al enviar email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nueva Orden de Compra</h1>
          <p className="text-muted-foreground">
            Crear una nueva orden de compra con validaciones y cálculos automáticos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGeneratePDF} disabled={isGeneratingPDF}>
            <Download className="h-4 w-4 mr-2" />
            {isGeneratingPDF ? 'Generando...' : 'Generar PDF'}
          </Button>
          <Button variant="outline" onClick={handleSendEmail} disabled={isSendingEmail || !selectedProvider}>
            <Mail className="h-4 w-4 mr-2" />
            {isSendingEmail ? 'Enviando...' : 'Enviar Email'}
          </Button>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Información del Proveedor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Información del Proveedor
            </CardTitle>
            <CardDescription>
              Seleccione el proveedor para esta orden de compra
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="providerId">Proveedor *</Label>
              <Select onValueChange={(value) => form.setValue('providerId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un proveedor" />
                </SelectTrigger>
                <SelectContent>
                  {mockProviders.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.businessName} - {provider.ruc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.providerId && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.providerId.message}</p>
              )}
            </div>

            {selectedProvider && (
              <div className="grid gap-4 md:grid-cols-2 p-4 bg-muted rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Razón Social</Label>
                  <p className="text-sm">{selectedProvider.businessName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">RUC</Label>
                  <p className="text-sm">{selectedProvider.ruc}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedProvider.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teléfono</Label>
                  <p className="text-sm">{selectedProvider.phones[0]}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fechas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Fechas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="creationDate">Fecha de Creación *</Label>
                <Input
                  id="creationDate"
                  type="date"
                  {...form.register('creationDate')}
                />
                {form.formState.errors.creationDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.creationDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="estimatedArrivalDate">Fecha Estimada de Llegada *</Label>
                <Input
                  id="estimatedArrivalDate"
                  type="date"
                  {...form.register('estimatedArrivalDate')}
                />
                {form.formState.errors.estimatedArrivalDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.estimatedArrivalDate.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="scheduledPaymentDate">Fecha Programada de Pago *</Label>
                <Input
                  id="scheduledPaymentDate"
                  type="date"
                  {...form.register('scheduledPaymentDate')}
                />
                {form.formState.errors.scheduledPaymentDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.scheduledPaymentDate.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos
            </CardTitle>
            <CardDescription>
              Agregue los productos que desea comprar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Producto {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <Label>Producto *</Label>
                    <Select onValueChange={(value) => form.setValue(`items.${index}.productId`, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.items?.[index]?.productId && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.items[index]?.productId?.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Cantidad *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                    />
                    {form.formState.errors.items?.[index]?.quantity && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.items[index]?.quantity?.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Precio Unitario (₲) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...form.register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                    />
                    {form.formState.errors.items?.[index]?.unitPrice && (
                      <p className="text-sm text-red-500 mt-1">{form.formState.errors.items[index]?.unitPrice?.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label>Total</Label>
                    <div className="p-2 bg-muted rounded text-sm font-medium">
                      {formatCurrency(watchedItems[index]?.quantity * watchedItems[index]?.unitPrice || 0)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Descripción (opcional)</Label>
                  <Input
                    placeholder="Descripción adicional del producto"
                    {...form.register(`items.${index}.description`)}
                  />
                </div>
              </div>
            ))}
            
            <Button type="button" variant="outline" onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </CardContent>
        </Card>

        {/* Resumen de Costos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Resumen de Costos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA (15%):</span>
                <span className="font-medium">{formatCurrency(iva)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Card>
          <CardHeader>
            <CardTitle>Notas Adicionales</CardTitle>
            <CardDescription>
              Información adicional sobre la orden de compra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Notas, observaciones o instrucciones especiales..."
              rows={3}
              {...form.register('notes')}
            />
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Creando...' : 'Crear Orden de Compra'}
          </Button>
        </div>
      </form>
    </div>
  );
} 