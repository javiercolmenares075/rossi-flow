import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useProviders } from '@/hooks/useProviders';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Schema de validación
const providerSchema = z.object({
  business_name: z.string().min(1, 'El nombre de la empresa es requerido'),
  ruc: z.string().optional(),
  type: z.string().min(1, 'El tipo es requerido'),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().optional(),
  payment_terms: z.string().optional(), // Cambiado de number a string
  product_types: z.array(z.string()).min(1, 'Debe seleccionar al menos un tipo de producto'),
  // Campos adicionales para contratos
  contract_number: z.string().optional(),
  contract_start_date: z.string().optional(),
  delivery_frequency: z.string().optional(),
  contract_file_url: z.string().optional(),
  status: z.string().default('active'),
});

type ProviderFormData = z.infer<typeof providerSchema>;

// Tipos de proveedores disponibles (según MVP)
const providerTypes = [
  { value: 'contract', label: 'Contrato' },
  { value: 'recurrent', label: 'Recurrente' },
];

// Frecuencias de entrega para contratos
const deliveryFrequencies = [
  { value: 'weekly', label: 'Semanal' },
  { value: 'biweekly', label: 'Quincenal' },
  { value: 'monthly', label: 'Mensual' },
];

// Tipos de productos disponibles
const availableProductTypes = [
  { id: '1', name: 'Lácteos' },
  { id: '2', name: 'Cárnicos' },
  { id: '3', name: 'Granos' },
  { id: '4', name: 'Verduras' },
  { id: '5', name: 'Frutas' },
  { id: '6', name: 'Condimentos' },
  { id: '7', name: 'Embalajes' },
  { id: '8', name: 'Equipos' },
];

const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'suspended', label: 'Suspendido' },
];

export default function ProvidersPage() {
  const {
    providers,
    loading,
    error,
    createProvider,
    updateProvider,
    deleteProvider,
    searchProviders,
    refresh,
    clearError
  } = useProviders();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const createForm = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      business_name: '',
      ruc: '',
      type: 'supplier',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
      payment_terms: '30',
      product_types: [],
      contract_number: '',
      contract_start_date: '',
      delivery_frequency: '',
      contract_file_url: '',
      status: 'active',
    },
  });

  const editForm = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
  });

  const handleCreateProvider = async (data: ProviderFormData) => {
    try {
      await createProvider({
        business_name: data.business_name,
        ruc: data.ruc,
        type: data.type,
        contact_person: data.contact_person,
        phone: data.phone,
        email: data.email,
        address: data.address,
        payment_terms: data.payment_terms,
        product_types: data.product_types,
        contract_number: data.contract_number,
        contract_start_date: data.contract_start_date,
        delivery_frequency: data.delivery_frequency,
        contract_file_url: data.contract_file_url,
        status: data.status,
      });
      
      toast.success('Proveedor creado exitosamente');
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      toast.error('Error al crear el proveedor');
      console.error('Error creating provider:', error);
    }
  };

  const handleEditProvider = async (data: ProviderFormData) => {
    if (!selectedProvider) return;
    
    try {
      await updateProvider(selectedProvider.id, {
        business_name: data.business_name,
        ruc: data.ruc,
        type: data.type,
        contact_person: data.contact_person,
        phone: data.phone,
        email: data.email,
        address: data.address,
        payment_terms: data.payment_terms,
        product_types: data.product_types,
        contract_number: data.contract_number,
        contract_start_date: data.contract_start_date,
        delivery_frequency: data.delivery_frequency,
        contract_file_url: data.contract_file_url,
        status: data.status,
      });
      
      toast.success('Proveedor actualizado exitosamente');
      setIsEditDialogOpen(false);
      setSelectedProvider(null);
    } catch (error) {
      toast.error('Error al actualizar el proveedor');
      console.error('Error updating provider:', error);
    }
  };

  const handleDeleteProvider = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este proveedor?')) return;
    
    setIsDeleting(true);
    try {
      await deleteProvider(id);
      toast.success('Proveedor eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el proveedor');
      console.error('Error deleting provider:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (provider: any) => {
    setSelectedProvider(provider);
    editForm.reset({
      business_name: provider.business_name,
      ruc: provider.ruc,
      type: provider.type,
      contact_person: provider.contact_person,
      phone: provider.phone,
      email: provider.email,
      address: provider.address,
      payment_terms: provider.payment_terms,
      product_types: provider.product_types,
      contract_number: provider.contract_number,
      contract_start_date: provider.contract_start_date,
      delivery_frequency: provider.delivery_frequency,
      contract_file_url: provider.contract_file_url,
      status: provider.status,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (provider: any) => {
    setSelectedProvider(provider);
    setIsViewDialogOpen(true);
  };

  const getTypeLabel = (type: string) => {
    return providerTypes.find(t => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando proveedores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error al cargar proveedores</p>
          <Button onClick={refresh} variant="outline">Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestiona los proveedores y sus tipos de productos
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proveedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar proveedores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>RUC</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Términos</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers.filter(provider => {
                const searchLower = searchQuery.toLowerCase();
                return (
                  provider.business_name.toLowerCase().includes(searchLower) ||
                  (provider.contact_person && provider.contact_person.toLowerCase().includes(searchLower)) ||
                  (provider.email && provider.email.toLowerCase().includes(searchLower)) ||
                  (provider.ruc && provider.ruc.toLowerCase().includes(searchLower))
                );
              }).map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.business_name}</TableCell>
                  <TableCell>{provider.ruc || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getTypeLabel(provider.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{provider.contact_person || '-'}</TableCell>
                  <TableCell>{provider.email || '-'}</TableCell>
                  <TableCell>{provider.phone || '-'}</TableCell>
                  <TableCell>{provider.payment_terms || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewDialog(provider)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(provider)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProvider(provider.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {providers.filter(provider => {
            const searchLower = searchQuery.toLowerCase();
            return (
              provider.business_name.toLowerCase().includes(searchLower) ||
              (provider.contact_person && provider.contact_person.toLowerCase().includes(searchLower)) ||
              (provider.email && provider.email.toLowerCase().includes(searchLower)) ||
              (provider.ruc && provider.ruc.toLowerCase().includes(searchLower))
            );
          }).length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? 'No se encontraron proveedores' : 'No hay proveedores registrados'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear proveedor */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Proveedor</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateProvider)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_name">Nombre de la Empresa *</Label>
                <Input
                  id="business_name"
                  {...createForm.register('business_name')}
                  className={createForm.formState.errors.business_name ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.business_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.business_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="ruc">RUC</Label>
                <Input
                  id="ruc"
                  {...createForm.register('ruc')}
                  className={createForm.formState.errors.ruc ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.ruc && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.ruc.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Proveedor *</Label>
                <Select 
                  value={createForm.watch('type')} 
                  onValueChange={(value) => createForm.setValue('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {providerTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.type && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.type.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contact_person">Persona de Contacto</Label>
                <Input
                  id="contact_person"
                  {...createForm.register('contact_person')}
                  className={createForm.formState.errors.contact_person ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.contact_person && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.contact_person.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...createForm.register('email')}
                  className={createForm.formState.errors.email ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  {...createForm.register('phone')}
                  className={createForm.formState.errors.phone ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                {...createForm.register('address')}
                className={createForm.formState.errors.address ? 'border-red-500' : ''}
              />
              {createForm.formState.errors.address && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.address.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="payment_terms">Términos de Pago (días)</Label>
              <Input
                id="payment_terms"
                type="number"
                {...createForm.register('payment_terms', { valueAsNumber: true })}
                className={createForm.formState.errors.payment_terms ? 'border-red-500' : ''}
              />
              {createForm.formState.errors.payment_terms && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.payment_terms.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="product_types">Tipos de Productos *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableProductTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`create-${type.id}`}
                      checked={createForm.watch('product_types').includes(type.id)}
                      onCheckedChange={(checked) => {
                        const currentTypes = createForm.watch('product_types');
                        if (checked) {
                          createForm.setValue('product_types', [...currentTypes, type.id]);
                        } else {
                          createForm.setValue('product_types', currentTypes.filter(id => id !== type.id));
                        }
                      }}
                    />
                    <Label htmlFor={`create-${type.id}`} className="text-sm">
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
              {createForm.formState.errors.product_types && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.product_types.message}
                </p>
              )}
            </div>

            {createForm.watch('type') === 'contract' && (
              <>
                <div>
                  <Label htmlFor="contract_number">Número de Contrato</Label>
                  <Input
                    id="contract_number"
                    {...createForm.register('contract_number')}
                    className={createForm.formState.errors.contract_number ? 'border-red-500' : ''}
                  />
                  {createForm.formState.errors.contract_number && (
                    <p className="text-sm text-red-500 mt-1">
                      {createForm.formState.errors.contract_number.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contract_start_date">Fecha de Inicio del Contrato</Label>
                  <Input
                    id="contract_start_date"
                    type="date"
                    {...createForm.register('contract_start_date')}
                    className={createForm.formState.errors.contract_start_date ? 'border-red-500' : ''}
                  />
                  {createForm.formState.errors.contract_start_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {createForm.formState.errors.contract_start_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="delivery_frequency">Frecuencia de Entrega</Label>
                  <Select
                    value={createForm.watch('delivery_frequency')}
                    onValueChange={(value) => createForm.setValue('delivery_frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryFrequencies.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {createForm.formState.errors.delivery_frequency && (
                    <p className="text-sm text-red-500 mt-1">
                      {createForm.formState.errors.delivery_frequency.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contract_file_url">Archivo del Contrato (opcional)</Label>
                  <Input
                    id="contract_file_url"
                    type="url"
                    {...createForm.register('contract_file_url')}
                    className={createForm.formState.errors.contract_file_url ? 'border-red-500' : ''}
                  />
                  {createForm.formState.errors.contract_file_url && (
                    <p className="text-sm text-red-500 mt-1">
                      {createForm.formState.errors.contract_file_url.message}
                    </p>
                  )}
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Crear Proveedor</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar proveedor */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditProvider)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  {...editForm.register('business_name')}
                  className={editForm.formState.errors.business_name ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.business_name && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.business_name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-contact">Contacto</Label>
                <Input
                  id="edit-contact"
                  {...editForm.register('contact_person')}
                  className={editForm.formState.errors.contact_person ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.contact_person && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.contact_person.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  {...editForm.register('email')}
                  className={editForm.formState.errors.email ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  {...editForm.register('phone')}
                  className={editForm.formState.errors.phone ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.phone && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-address">Dirección</Label>
              <Input
                id="edit-address"
                {...editForm.register('address')}
                className={editForm.formState.errors.address ? 'border-red-500' : ''}
              />
              {editForm.formState.errors.address && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.address.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-payment_terms">Términos de Pago (días)</Label>
              <Input
                id="edit-payment_terms"
                type="number"
                {...editForm.register('payment_terms', { valueAsNumber: true })}
                className={editForm.formState.errors.payment_terms ? 'border-red-500' : ''}
              />
              {editForm.formState.errors.payment_terms && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.payment_terms.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-product_types">Tipos de Productos</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableProductTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${type.id}`}
                      checked={editForm.watch('product_types').includes(type.id)}
                      onCheckedChange={(checked) => {
                        const currentTypes = editForm.watch('product_types');
                        if (checked) {
                          editForm.setValue('product_types', [...currentTypes, type.id]);
                        } else {
                          editForm.setValue('product_types', currentTypes.filter(id => id !== type.id));
                        }
                      }}
                    />
                    <Label htmlFor={`edit-${type.id}`} className="text-sm">
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
              {editForm.formState.errors.product_types && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.product_types.message}
                </p>
              )}
            </div>

            {editForm.watch('type') === 'contract' && (
              <>
                <div>
                  <Label htmlFor="edit-contract_number">Número de Contrato</Label>
                  <Input
                    id="edit-contract_number"
                    {...editForm.register('contract_number')}
                    className={editForm.formState.errors.contract_number ? 'border-red-500' : ''}
                  />
                  {editForm.formState.errors.contract_number && (
                    <p className="text-sm text-red-500 mt-1">
                      {editForm.formState.errors.contract_number.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-contract_start_date">Fecha de Inicio del Contrato</Label>
                  <Input
                    id="edit-contract_start_date"
                    type="date"
                    {...editForm.register('contract_start_date')}
                    className={editForm.formState.errors.contract_start_date ? 'border-red-500' : ''}
                  />
                  {editForm.formState.errors.contract_start_date && (
                    <p className="text-sm text-red-500 mt-1">
                      {editForm.formState.errors.contract_start_date.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-delivery_frequency">Frecuencia de Entrega</Label>
                  <Select
                    value={editForm.watch('delivery_frequency')}
                    onValueChange={(value) => editForm.setValue('delivery_frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una frecuencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryFrequencies.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {editForm.formState.errors.delivery_frequency && (
                    <p className="text-sm text-red-500 mt-1">
                      {editForm.formState.errors.delivery_frequency.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="edit-contract_file_url">Archivo del Contrato (opcional)</Label>
                  <Input
                    id="edit-contract_file_url"
                    type="url"
                    {...editForm.register('contract_file_url')}
                    className={editForm.formState.errors.contract_file_url ? 'border-red-500' : ''}
                  />
                  {editForm.formState.errors.contract_file_url && (
                    <p className="text-sm text-red-500 mt-1">
                      {editForm.formState.errors.contract_file_url.message}
                    </p>
                  )}
                </div>
              </>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Actualizar Proveedor</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver proveedor */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Proveedor</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Nombre:</Label>
                <p>{selectedProvider.business_name}</p>
              </div>
              <div>
                <Label className="font-semibold">Contacto:</Label>
                <p>{selectedProvider.contact_person || '-'}</p>
              </div>
              <div>
                <Label className="font-semibold">Email:</Label>
                <p>{selectedProvider.email || '-'}</p>
              </div>
              <div>
                <Label className="font-semibold">Teléfono:</Label>
                <p>{selectedProvider.phone || '-'}</p>
              </div>
              <div>
                <Label className="font-semibold">Dirección:</Label>
                <p>{selectedProvider.address || '-'}</p>
              </div>
              <div>
                <Label className="font-semibold">Tipos de Productos:</Label>
                <p>{selectedProvider.product_types?.map(typeId => availableProductTypes.find(pt => pt.id === typeId)?.name).join(', ') || '-'}</p>
              </div>
              <div>
                <Label className="font-semibold">Estado:</Label>
                <div className="mt-1">
                  <Badge variant={statusOptions.find(opt => opt.value === selectedProvider.status)?.label === 'Activo' ? 'default' : statusOptions.find(opt => opt.value === selectedProvider.status)?.label === 'Inactivo' ? 'secondary' : 'destructive'}>
                    {statusOptions.find(opt => opt.value === selectedProvider.status)?.label || selectedProvider.status}
                  </Badge>
                </div>
              </div>
              {selectedProvider.type === 'contract' && (
                <>
                  <div>
                    <Label className="font-semibold">Número de Contrato:</Label>
                    <p>{selectedProvider.contract_number || '-'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Fecha de Inicio:</Label>
                    <p>{selectedProvider.contract_start_date || '-'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Frecuencia de Entrega:</Label>
                    <p>{selectedProvider.delivery_frequency || '-'}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Archivo del Contrato:</Label>
                    <p>{selectedProvider.contract_file_url ? 'Adjunto' : 'No adjunto'}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 