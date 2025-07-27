import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Building2,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  FileText,
  Calendar
} from 'lucide-react';
import { Provider } from '@/types';

// Validation schema for provider
const providerSchema = z.object({
  type: z.enum(['contract', 'recurrent']),
  businessName: z.string().min(2, 'La razón social debe tener al menos 2 caracteres'),
  ruc: z.string().min(10, 'El RUC debe tener al menos 10 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  email: z.string().email('Email inválido'),
  phones: z.array(z.string()).min(1, 'Debe agregar al menos un teléfono'),
  categories: z.array(z.string()).optional(),
  associatedProducts: z.array(z.string()).optional(),
  contractNumber: z.string().optional(),
  contractStartDate: z.string().optional(),
  deliveryFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
  status: z.enum(['active', 'inactive']).default('active')
});

type ProviderFormData = z.infer<typeof providerSchema>;

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
    contractFile: 'contrato_lacteos_sur.pdf',
    contractNumber: 'CON-2024-001',
    contractStartDate: new Date('2024-01-15'),
    deliveryFrequency: 'weekly',
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

const providerTypes = [
  { value: 'contract', label: 'Por Contrato' },
  { value: 'recurrent', label: 'Recurrente' }
];

const deliveryFrequencies = [
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' }
];

export function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      type: 'recurrent',
      status: 'active',
      phones: [''],
      categories: [],
      associatedProducts: []
    }
  });

  const editForm = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema)
  });

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.ruc.includes(searchTerm) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || provider.type === filterType;
    const matchesStatus = filterStatus === 'all' || provider.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteProvider = (id: string) => {
    setProviders(providers.filter(provider => provider.id !== id));
  };

  const handleCreateProvider = async (data: ProviderFormData) => {
    setIsSubmitting(true);
    try {
      const newProvider: Provider = {
        id: Date.now().toString(),
        ...data,
        contacts: [],
        contractFile: undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProviders([...providers, newProvider]);
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      console.error('Error creating provider:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProvider = async (data: ProviderFormData) => {
    if (!selectedProvider) return;
    
    setIsSubmitting(true);
    try {
      const updatedProvider: Provider = {
        ...selectedProvider,
        ...data,
        updatedAt: new Date()
      };
      setProviders(providers.map(p => p.id === selectedProvider.id ? updatedProvider : p));
      setIsEditDialogOpen(false);
      setSelectedProvider(null);
      editForm.reset();
    } catch (error) {
      console.error('Error updating provider:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (provider: Provider) => {
    setSelectedProvider(provider);
    editForm.reset({
      type: provider.type,
      businessName: provider.businessName,
      ruc: provider.ruc,
      address: provider.address,
      email: provider.email,
      phones: provider.phones,
      categories: provider.categories,
      associatedProducts: provider.associatedProducts,
      contractNumber: provider.contractNumber,
      contractStartDate: provider.contractStartDate?.toISOString().split('T')[0],
      deliveryFrequency: provider.deliveryFrequency,
      status: provider.status
    });
    setIsEditDialogOpen(true);
  };

  const getTypeBadge = (type: string) => {
    const providerType = providerTypes.find(t => t.value === type);
    return (
      <Badge variant={type === 'contract' ? 'default' : 'secondary'}>
        {providerType?.label || type}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'destructive'}>
        {status === 'active' ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestión de proveedores, contratos y asociaciones de productos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
              <DialogDescription>
                Complete la información del proveedor. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreateProvider)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="type">Tipo de Proveedor *</Label>
                  <Select 
                    value={createForm.watch('type')} 
                    onValueChange={(value) => createForm.setValue('type', value as 'contract' | 'recurrent')}
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
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.type.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select 
                    value={createForm.watch('status')} 
                    onValueChange={(value) => createForm.setValue('status', value as 'active' | 'inactive')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="businessName">Razón Social *</Label>
                  <Input
                    {...createForm.register('businessName')}
                    placeholder="Nombre de la empresa"
                  />
                  {createForm.formState.errors.businessName && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.businessName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ruc">RUC *</Label>
                  <Input
                    {...createForm.register('ruc')}
                    placeholder="80012345-1"
                  />
                  {createForm.formState.errors.ruc && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.ruc.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Textarea
                    {...createForm.register('address')}
                    placeholder="Dirección completa"
                  />
                  {createForm.formState.errors.address && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    {...createForm.register('email')}
                    type="email"
                    placeholder="contacto@empresa.com.py"
                  />
                  {createForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    {...createForm.register('phones.0')}
                    placeholder="021-123-456"
                  />
                  {createForm.formState.errors.phones && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.phones.message}
                    </p>
                  )}
                </div>

                {createForm.watch('type') === 'contract' && (
                  <>
                    <div>
                      <Label htmlFor="contractNumber">Número de Contrato</Label>
                      <Input
                        {...createForm.register('contractNumber')}
                        placeholder="CON-2024-001"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contractStartDate">Fecha de Inicio</Label>
                      <Input
                        {...createForm.register('contractStartDate')}
                        type="date"
                      />
                    </div>

                    <div>
                      <Label htmlFor="deliveryFrequency">Frecuencia de Entrega</Label>
                      <Select 
                        value={createForm.watch('deliveryFrequency')} 
                        onValueChange={(value) => createForm.setValue('deliveryFrequency', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione frecuencia" />
                        </SelectTrigger>
                        <SelectContent>
                          {deliveryFrequencies.map(freq => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear Proveedor'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, RUC o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filterType">Tipo</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="contract">Por Contrato</SelectItem>
                  <SelectItem value="recurrent">Recurrente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterStatus">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Providers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            {filteredProviders.length} proveedores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proveedor</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{provider.businessName}</div>
                      <div className="text-sm text-muted-foreground">{provider.ruc}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(provider.type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{provider.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{provider.phones[0]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {provider.associatedProducts?.slice(0, 2).join(', ')}
                      {provider.associatedProducts && provider.associatedProducts.length > 2 && '...'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(provider.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(provider)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProvider(provider.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>
              Modifique la información del proveedor seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditProvider)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-type">Tipo de Proveedor *</Label>
                <Select 
                  value={editForm.watch('type')} 
                  onValueChange={(value) => editForm.setValue('type', value as 'contract' | 'recurrent')}
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
                {editForm.formState.errors.type && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select 
                  value={editForm.watch('status')} 
                  onValueChange={(value) => editForm.setValue('status', value as 'active' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-businessName">Razón Social *</Label>
                <Input
                  {...editForm.register('businessName')}
                  placeholder="Nombre de la empresa"
                />
                {editForm.formState.errors.businessName && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.businessName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-ruc">RUC *</Label>
                <Input
                  {...editForm.register('ruc')}
                  placeholder="80012345-1"
                />
                {editForm.formState.errors.ruc && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.ruc.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="edit-address">Dirección *</Label>
                <Textarea
                  {...editForm.register('address')}
                  placeholder="Dirección completa"
                />
                {editForm.formState.errors.address && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  {...editForm.register('email')}
                  type="email"
                  placeholder="contacto@empresa.com.py"
                />
                {editForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-phone">Teléfono *</Label>
                <Input
                  {...editForm.register('phones.0')}
                  placeholder="021-123-456"
                />
                {editForm.formState.errors.phones && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.phones.message}
                  </p>
                )}
              </div>

              {editForm.watch('type') === 'contract' && (
                <>
                  <div>
                    <Label htmlFor="edit-contractNumber">Número de Contrato</Label>
                    <Input
                      {...editForm.register('contractNumber')}
                      placeholder="CON-2024-001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-contractStartDate">Fecha de Inicio</Label>
                    <Input
                      {...editForm.register('contractStartDate')}
                      type="date"
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-deliveryFrequency">Frecuencia de Entrega</Label>
                    <Select 
                      value={editForm.watch('deliveryFrequency')} 
                      onValueChange={(value) => editForm.setValue('deliveryFrequency', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {deliveryFrequencies.map(freq => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 