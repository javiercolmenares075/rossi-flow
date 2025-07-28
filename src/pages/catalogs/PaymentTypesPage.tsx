import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, CreditCard, Search } from 'lucide-react';

// Schema para validación
const paymentTypeSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  category: z.enum(['cash', 'card', 'transfer', 'check', 'digital']),
  requiresReference: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

type PaymentTypeFormData = z.infer<typeof paymentTypeSchema>;

// Datos mock
const mockPaymentTypes = [
  {
    id: '1',
    code: 'EFE-001',
    name: 'Efectivo',
    description: 'Pago en efectivo al momento de la compra',
    category: 'cash' as const,
    requiresReference: false,
    isActive: true
  },
  {
    id: '2',
    code: 'TAR-001',
    name: 'Tarjeta de Crédito',
    description: 'Pago con tarjeta de crédito bancaria',
    category: 'card' as const,
    requiresReference: true,
    isActive: true
  },
  {
    id: '3',
    code: 'TAR-002',
    name: 'Tarjeta de Débito',
    description: 'Pago con tarjeta de débito bancaria',
    category: 'card' as const,
    requiresReference: true,
    isActive: true
  },
  {
    id: '4',
    code: 'TRA-001',
    name: 'Transferencia Bancaria',
    description: 'Transferencia electrónica entre cuentas bancarias',
    category: 'transfer' as const,
    requiresReference: true,
    isActive: true
  },
  {
    id: '5',
    code: 'CHE-001',
    name: 'Cheque',
    description: 'Pago mediante cheque bancario',
    category: 'check' as const,
    requiresReference: true,
    isActive: false
  }
];

const categories = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'card', label: 'Tarjeta' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'check', label: 'Cheque' },
  { value: 'digital', label: 'Digital' }
];

export function PaymentTypesPage() {
  const [paymentTypes, setPaymentTypes] = useState(mockPaymentTypes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPaymentType, setEditingPaymentType] = useState<PaymentTypeFormData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<PaymentTypeFormData>({
    resolver: zodResolver(paymentTypeSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      category: 'cash',
      requiresReference: false,
      isActive: true
    }
  });

  const handleCreatePaymentType = (data: PaymentTypeFormData) => {
    const newPaymentType = {
      id: Date.now().toString(),
      ...data
    };
    setPaymentTypes([...paymentTypes, newPaymentType]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditPaymentType = (data: PaymentTypeFormData) => {
    if (editingPaymentType) {
      setPaymentTypes(paymentTypes.map(pt => 
        pt.id === editingPaymentType.id ? { ...pt, ...data } : pt
      ));
    }
    setIsEditDialogOpen(false);
    setEditingPaymentType(null);
    form.reset();
  };

  const handleDeletePaymentType = (id: string) => {
    setPaymentTypes(paymentTypes.filter(pt => pt.id !== id));
  };

  const openEditDialog = (paymentType: any) => {
    setEditingPaymentType(paymentType);
    form.reset(paymentType);
    setIsEditDialogOpen(true);
  };

  const filteredPaymentTypes = paymentTypes.filter(pt =>
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pt.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.value === category)?.label || category;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cash':
        return '💰';
      case 'card':
        return '💳';
      case 'transfer':
        return '🏦';
      case 'check':
        return '📄';
      case 'digital':
        return '📱';
      default:
        return '💳';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Pago</h1>
          <p className="text-muted-foreground">
            Gestión de modalidades de pago aceptadas en el sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Tipo de Pago</DialogTitle>
              <DialogDescription>
                Agrega una nueva modalidad de pago al sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreatePaymentType)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    {...form.register('code')}
                    placeholder="EFE-001"
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Select onValueChange={(value) => form.setValue('category', value as any)} defaultValue={form.getValues('category')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && (
                    <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Efectivo"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Descripción del tipo de pago"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiresReference"
                  {...form.register('requiresReference')}
                  className="rounded"
                />
                <Label htmlFor="requiresReference">Requiere referencia</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tipos de pago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredPaymentTypes.map((paymentType) => (
          <Card key={paymentType.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">{getCategoryIcon(paymentType.category)}</span>
                    {paymentType.name}
                  </CardTitle>
                  <CardDescription>
                    Código: {paymentType.code} • Categoría: {getCategoryLabel(paymentType.category)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={paymentType.isActive ? "default" : "secondary"}>
                    {paymentType.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  {paymentType.requiresReference && (
                    <Badge variant="outline">Requiere Ref.</Badge>
                  )}
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(paymentType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Tipo de Pago</DialogTitle>
                        <DialogDescription>
                          Modifica la información del tipo de pago
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={form.handleSubmit(handleEditPaymentType)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-code">Código</Label>
                            <Input
                              id="edit-code"
                              {...form.register('code')}
                              placeholder="EFE-001"
                            />
                            {form.formState.errors.code && (
                              <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-category">Categoría</Label>
                            <Select onValueChange={(value) => form.setValue('category', value as any)} defaultValue={form.getValues('category')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {form.formState.errors.category && (
                              <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nombre</Label>
                          <Input
                            id="edit-name"
                            {...form.register('name')}
                            placeholder="Efectivo"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Descripción</Label>
                          <Textarea
                            id="edit-description"
                            {...form.register('description')}
                            placeholder="Descripción del tipo de pago"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="edit-requiresReference"
                            {...form.register('requiresReference')}
                            className="rounded"
                          />
                          <Label htmlFor="edit-requiresReference">Requiere referencia</Label>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit">Guardar</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeletePaymentType(paymentType.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paymentType.description && (
                  <p className="text-sm text-muted-foreground">{paymentType.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Categoría: {getCategoryLabel(paymentType.category)}
                  </span>
                  {paymentType.requiresReference && (
                    <span className="text-muted-foreground">
                      • Requiere referencia de pago
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPaymentTypes.length === 0 && (
        <div className="text-center py-8">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">No se encontraron tipos de pago</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando un nuevo tipo de pago.'}
          </p>
        </div>
      )}
    </div>
  );
} 