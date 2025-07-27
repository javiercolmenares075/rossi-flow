import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Warehouse,
  MapPin,
  User,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

// Schema de validación
const warehouseSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  location: z.string().min(5, 'La ubicación debe tener al menos 5 caracteres'),
  responsible: z.string().min(2, 'El responsable es obligatorio'),
  capacity: z.number().min(1, 'La capacidad debe ser mayor a 0'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

interface Warehouse {
  id: string;
  name: string;
  location: string;
  responsible: string;
  capacity: number;
  currentStock: number;
  description?: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Almacén Principal',
    location: 'Zona Industrial, Luque - Paraguay',
    responsible: 'Juan Pérez',
    capacity: 10000,
    currentStock: 7500,
    description: 'Almacén principal para productos terminados',
    status: 'active',
    productCount: 15,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Almacén Refrigerado',
    location: 'Zona Industrial, Luque - Paraguay',
    responsible: 'María González',
    capacity: 5000,
    currentStock: 3200,
    description: 'Almacén refrigerado para productos lácteos',
    status: 'active',
    productCount: 8,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Almacén de Insumos',
    location: 'Zona Industrial, Luque - Paraguay',
    responsible: 'Carlos Rodríguez',
    capacity: 3000,
    currentStock: 1800,
    description: 'Almacén para materias primas e insumos',
    status: 'active',
    productCount: 12,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  }
];

export function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      location: '',
      responsible: '',
      capacity: 0,
      description: '',
      status: 'active'
    }
  });

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warehouse.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || warehouse.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateWarehouse = (data: WarehouseFormData) => {
    const newWarehouse: Warehouse = {
      id: `wh-${Date.now()}`,
      ...data,
      currentStock: 0,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setWarehouses([...warehouses, newWarehouse]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditWarehouse = (data: WarehouseFormData) => {
    if (!selectedWarehouse) return;
    
    const updatedWarehouses = warehouses.map(warehouse => 
      warehouse.id === selectedWarehouse.id 
        ? { ...warehouse, ...data, updatedAt: new Date() }
        : warehouse
    );
    
    setWarehouses(updatedWarehouses);
    setIsEditDialogOpen(false);
    setSelectedWarehouse(null);
    form.reset();
  };

  const handleDeleteWarehouse = (id: string) => {
    const warehouse = warehouses.find(w => w.id === id);
    if (warehouse && warehouse.currentStock > 0) {
      alert('No se puede eliminar un almacén que tiene stock');
      return;
    }
    
    setWarehouses(warehouses.filter(warehouse => warehouse.id !== id));
  };

  const openEditDialog = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    form.reset({
      name: warehouse.name,
      location: warehouse.location,
      responsible: warehouse.responsible,
      capacity: warehouse.capacity,
      description: warehouse.description || '',
      status: warehouse.status
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        <XCircle className="h-3 w-3 mr-1" />
        Inactivo
      </Badge>
    );
  };

  const getCapacityBadge = (warehouse: Warehouse) => {
    const percentage = (warehouse.currentStock / warehouse.capacity) * 100;
    
    if (percentage >= 90) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          {percentage.toFixed(1)}%
        </Badge>
      );
    } else if (percentage >= 70) {
      return (
        <Badge variant="default" className="bg-yellow-100 text-yellow-800">
          {percentage.toFixed(1)}%
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          {percentage.toFixed(1)}%
        </Badge>
      );
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-PY').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Almacenes</h1>
          <p className="text-muted-foreground">
            Gestión de almacenes físicos y virtuales
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Almacén
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Almacén</DialogTitle>
              <DialogDescription>
                Agregue un nuevo almacén al sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateWarehouse)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Ej: Almacén Principal"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="location">Ubicación *</Label>
                <Input
                  id="location"
                  {...form.register('location')}
                  placeholder="Ej: Zona Industrial, Luque"
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="responsible">Responsable *</Label>
                <Input
                  id="responsible"
                  {...form.register('responsible')}
                  placeholder="Ej: Juan Pérez"
                />
                {form.formState.errors.responsible && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.responsible.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="capacity">Capacidad *</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...form.register('capacity', { valueAsNumber: true })}
                  placeholder="Ej: 10000"
                />
                {form.formState.errors.capacity && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.capacity.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Descripción opcional del almacén"
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Almacén</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, ubicación o responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Almacenes ({filteredWarehouses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Capacidad</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWarehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {warehouse.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {warehouse.responsible}
                    </div>
                  </TableCell>
                  <TableCell>{formatNumber(warehouse.capacity)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{formatNumber(warehouse.currentStock)}</span>
                      {getCapacityBadge(warehouse)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Package className="h-3 w-3 mr-1" />
                      {warehouse.productCount}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(warehouse.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(warehouse)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteWarehouse(warehouse.id)}
                        disabled={warehouse.currentStock > 0}
                      >
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

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Almacén</DialogTitle>
            <DialogDescription>
              Modifique los datos del almacén
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleEditWarehouse)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre *</Label>
              <Input
                id="edit-name"
                {...form.register('name')}
                placeholder="Ej: Almacén Principal"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-location">Ubicación *</Label>
              <Input
                id="edit-location"
                {...form.register('location')}
                placeholder="Ej: Zona Industrial, Luque"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-responsible">Responsable *</Label>
              <Input
                id="edit-responsible"
                {...form.register('responsible')}
                placeholder="Ej: Juan Pérez"
              />
              {form.formState.errors.responsible && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.responsible.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-capacity">Capacidad *</Label>
              <Input
                id="edit-capacity"
                type="number"
                {...form.register('capacity', { valueAsNumber: true })}
                placeholder="Ej: 10000"
              />
              {form.formState.errors.capacity && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.capacity.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                {...form.register('description')}
                placeholder="Descripción opcional del almacén"
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-status">Estado</Label>
              <select
                id="edit-status"
                {...form.register('status')}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 