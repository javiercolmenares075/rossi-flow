import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@zodjs/resolver';
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

// Schema de validación
const providerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  contact: z.string().min(1, 'El contacto es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'El teléfono es requerido'),
  address: z.string().min(1, 'La dirección es requerida'),
  productTypes: z.array(z.string()).min(1, 'Debe seleccionar al menos un tipo de producto'),
  status: z.string().min(1, 'El estado es requerido'),
});

type ProviderFormData = z.infer<typeof providerSchema>;

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
      name: '',
      contact: '',
      email: '',
      phone: '',
      address: '',
      productTypes: [],
      status: 'active',
    },
  });

  const editForm = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
  });

  const handleCreateProvider = async (data: ProviderFormData) => {
    try {
      await createProvider({
        name: data.name,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
        address: data.address,
        product_types: data.productTypes,
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
        name: data.name,
        contact: data.contact,
        email: data.email,
        phone: data.phone,
        address: data.address,
        product_types: data.productTypes,
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
      name: provider.name,
      contact: provider.contact,
      email: provider.email,
      phone: provider.phone,
      address: provider.address,
      productTypes: provider.product_types || [],
      status: provider.status,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (provider: any) => {
    setSelectedProvider(provider);
    setIsViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: "default" | "secondary" | "destructive", label: string } } = {
      active: { variant: "default", label: "Activo" },
      inactive: { variant: "secondary", label: "Inactivo" },
      suspended: { variant: "destructive", label: "Suspendido" },
    };
    
    const statusInfo = statusMap[status] || { variant: "secondary", label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getProductTypesNames = (productTypes: string[]) => {
    return productTypes
      .map(typeId => availableProductTypes.find(pt => pt.id === typeId)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <TableHead>Nombre</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Tipos de Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>{provider.contact}</TableCell>
                  <TableCell>{provider.email}</TableCell>
                  <TableCell>{provider.phone}</TableCell>
                  <TableCell>
                    {getProductTypesNames(provider.product_types || [])}
                  </TableCell>
                  <TableCell>{getStatusBadge(provider.status)}</TableCell>
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
          
          {filteredProviders.length === 0 && (
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
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...createForm.register('name')}
                  className={createForm.formState.errors.name ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contact">Contacto</Label>
                <Input
                  id="contact"
                  {...createForm.register('contact')}
                  className={createForm.formState.errors.contact ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.contact && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.contact.message}
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
              <Label>Tipos de Productos</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableProductTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`create-${type.id}`}
                      checked={createForm.watch('productTypes').includes(type.id)}
                      onCheckedChange={(checked) => {
                        const currentTypes = createForm.watch('productTypes');
                        if (checked) {
                          createForm.setValue('productTypes', [...currentTypes, type.id]);
                        } else {
                          createForm.setValue('productTypes', currentTypes.filter(id => id !== type.id));
                        }
                      }}
                    />
                    <Label htmlFor={`create-${type.id}`} className="text-sm">
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
              {createForm.formState.errors.productTypes && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.productTypes.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                {...createForm.register('status')}
                className="w-full p-2 border rounded-md"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {createForm.formState.errors.status && (
                <p className="text-sm text-red-500 mt-1">
                  {createForm.formState.errors.status.message}
                </p>
              )}
            </div>
            
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
                  {...editForm.register('name')}
                  className={editForm.formState.errors.name ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-contact">Contacto</Label>
                <Input
                  id="edit-contact"
                  {...editForm.register('contact')}
                  className={editForm.formState.errors.contact ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.contact && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.contact.message}
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
              <Label>Tipos de Productos</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableProductTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${type.id}`}
                      checked={editForm.watch('productTypes').includes(type.id)}
                      onCheckedChange={(checked) => {
                        const currentTypes = editForm.watch('productTypes');
                        if (checked) {
                          editForm.setValue('productTypes', [...currentTypes, type.id]);
                        } else {
                          editForm.setValue('productTypes', currentTypes.filter(id => id !== type.id));
                        }
                      }}
                    />
                    <Label htmlFor={`edit-${type.id}`} className="text-sm">
                      {type.name}
                    </Label>
                  </div>
                ))}
              </div>
              {editForm.formState.errors.productTypes && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.productTypes.message}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-status">Estado</Label>
              <select
                id="edit-status"
                {...editForm.register('status')}
                className="w-full p-2 border rounded-md"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {editForm.formState.errors.status && (
                <p className="text-sm text-red-500 mt-1">
                  {editForm.formState.errors.status.message}
                </p>
              )}
            </div>
            
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
                <p>{selectedProvider.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Contacto:</Label>
                <p>{selectedProvider.contact}</p>
              </div>
              <div>
                <Label className="font-semibold">Email:</Label>
                <p>{selectedProvider.email}</p>
              </div>
              <div>
                <Label className="font-semibold">Teléfono:</Label>
                <p>{selectedProvider.phone}</p>
              </div>
              <div>
                <Label className="font-semibold">Dirección:</Label>
                <p>{selectedProvider.address}</p>
              </div>
              <div>
                <Label className="font-semibold">Tipos de Productos:</Label>
                <p>{getProductTypesNames(selectedProvider.product_types || [])}</p>
              </div>
              <div>
                <Label className="font-semibold">Estado:</Label>
                <div className="mt-1">{getStatusBadge(selectedProvider.status)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 