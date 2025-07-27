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
  MapPin,
  User,
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Validation schema for warehouse
const warehouseSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  description: z.string().optional(),
  type: z.enum(['main', 'secondary', 'cold_storage', 'dry_storage']),
  capacity: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  responsible: z.string().min(2, 'Debe especificar un responsable'),
  status: z.enum(['active', 'inactive']).default('active')
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

// Mock data for development
const mockWarehouses = [
  {
    id: '1',
    name: 'Almacén Principal',
    code: 'ALM-001',
    address: 'Ruta 2 Km 45, San Lorenzo',
    description: 'Almacén principal para productos terminados',
    type: 'main',
    capacity: 1000,
    responsible: 'Juan Pérez',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Cámara Frigorífica',
    code: 'CF-001',
    address: 'Ruta 2 Km 45, San Lorenzo',
    description: 'Almacenamiento de productos refrigerados',
    type: 'cold_storage',
    capacity: 500,
    responsible: 'María González',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Almacén de Materias Primas',
    code: 'MP-001',
    address: 'Ruta 1 Km 30, Luque',
    description: 'Almacenamiento de materias primas',
    type: 'dry_storage',
    capacity: 800,
    responsible: 'Carlos López',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  }
];

const warehouseTypes = [
  { value: 'main', label: 'Principal' },
  { value: 'secondary', label: 'Secundario' },
  { value: 'cold_storage', label: 'Cámara Frigorífica' },
  { value: 'dry_storage', label: 'Almacén Seco' }
];

export function WarehousesPage() {
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      status: 'active',
      type: 'main',
      capacity: 100
    }
  });

  const editForm = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema)
  });

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || warehouse.type === filterType;
    const matchesStatus = filterStatus === 'all' || warehouse.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteWarehouse = (id: string) => {
    setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
  };

  const handleCreateWarehouse = async (data: WarehouseFormData) => {
    setIsSubmitting(true);
    try {
      const newWarehouse = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setWarehouses([...warehouses, newWarehouse]);
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      console.error('Error creating warehouse:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditWarehouse = async (data: WarehouseFormData) => {
    if (!selectedWarehouse) return;
    
    setIsSubmitting(true);
    try {
      const updatedWarehouse = {
        ...selectedWarehouse,
        ...data,
        updatedAt: new Date()
      };
      setWarehouses(warehouses.map(w => w.id === selectedWarehouse.id ? updatedWarehouse : w));
      setIsEditDialogOpen(false);
      setSelectedWarehouse(null);
      editForm.reset();
    } catch (error) {
      console.error('Error updating warehouse:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    editForm.reset({
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      description: warehouse.description,
      type: warehouse.type,
      capacity: warehouse.capacity,
      responsible: warehouse.responsible,
      status: warehouse.status
    });
    setIsEditDialogOpen(true);
  };

  const getTypeBadge = (type: string) => {
    const warehouseType = warehouseTypes.find(t => t.value === type);
    return (
      <Badge variant="outline">
        {warehouseType?.label || type}
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
          <h1 className="text-3xl font-bold">Almacenes</h1>
          <p className="text-muted-foreground">
            Gestión de ubicaciones físicas y responsables de almacenamiento
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Almacén
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Almacén</DialogTitle>
              <DialogDescription>
                Complete la información del almacén. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreateWarehouse)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    {...createForm.register('name')}
                    placeholder="Ej: Almacén Principal"
                  />
                  {createForm.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    {...createForm.register('code')}
                    placeholder="Ej: ALM-001"
                  />
                  {createForm.formState.errors.code && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Textarea
                    {...createForm.register('address')}
                    placeholder="Dirección completa del almacén"
                  />
                  {createForm.formState.errors.address && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Tipo *</Label>
                  <Select 
                    value={createForm.watch('type')} 
                    onValueChange={(value) => createForm.setValue('type', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouseTypes.map(type => (
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
                  <Label htmlFor="capacity">Capacidad (m³) *</Label>
                  <Input
                    {...createForm.register('capacity', { valueAsNumber: true })}
                    type="number"
                    placeholder="1000"
                  />
                  {createForm.formState.errors.capacity && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.capacity.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="responsible">Responsable *</Label>
                  <Input
                    {...createForm.register('responsible')}
                    placeholder="Nombre del responsable"
                  />
                  {createForm.formState.errors.responsible && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.responsible.message}
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

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    {...createForm.register('description')}
                    placeholder="Descripción opcional del almacén"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear Almacén'}
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
                  placeholder="Buscar por nombre, código o responsable..."
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
                  {warehouseTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
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

      {/* Warehouses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Almacenes</CardTitle>
          <CardDescription>
            {filteredWarehouses.length} almacenes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Almacén</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{warehouse.name}</div>
                      <div className="text-sm text-muted-foreground">{warehouse.code}</div>
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {warehouse.address}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(warehouse.type)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{warehouse.responsible}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="text-sm">{warehouse.capacity} m³</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(warehouse.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(warehouse)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteWarehouse(warehouse.id)}>
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
            <DialogTitle>Editar Almacén</DialogTitle>
            <DialogDescription>
              Modifique la información del almacén seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditWarehouse)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  {...editForm.register('name')}
                  placeholder="Ej: Almacén Principal"
                />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-code">Código *</Label>
                <Input
                  {...editForm.register('code')}
                  placeholder="Ej: ALM-001"
                />
                {editForm.formState.errors.code && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="edit-address">Dirección *</Label>
                <Textarea
                  {...editForm.register('address')}
                  placeholder="Dirección completa del almacén"
                />
                {editForm.formState.errors.address && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-type">Tipo *</Label>
                <Select 
                  value={editForm.watch('type')} 
                  onValueChange={(value) => editForm.setValue('type', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouseTypes.map(type => (
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
                <Label htmlFor="edit-capacity">Capacidad (m³) *</Label>
                <Input
                  {...editForm.register('capacity', { valueAsNumber: true })}
                  type="number"
                  placeholder="1000"
                />
                {editForm.formState.errors.capacity && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.capacity.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-responsible">Responsable *</Label>
                <Input
                  {...editForm.register('responsible')}
                  placeholder="Nombre del responsable"
                />
                {editForm.formState.errors.responsible && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.responsible.message}
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

              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  {...editForm.register('description')}
                  placeholder="Descripción opcional del almacén"
                />
              </div>
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