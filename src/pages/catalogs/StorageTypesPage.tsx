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
  Package,
  Database,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

// Schema de validación
const storageTypeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  requiresExpiryControl: z.boolean(),
  requiresBatchControl: z.boolean(),
  status: z.enum(['active', 'inactive'])
});

type StorageTypeFormData = z.infer<typeof storageTypeSchema>;

interface StorageType {
  id: string;
  name: string;
  code: string;
  description?: string;
  requiresExpiryControl: boolean;
  requiresBatchControl: boolean;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockStorageTypes: StorageType[] = [
  {
    id: '1',
    name: 'A Granel',
    code: 'GRANEL',
    description: 'Productos almacenados a granel sin control de lotes',
    requiresExpiryControl: false,
    requiresBatchControl: false,
    status: 'active',
    productCount: 5,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Por Lotes',
    code: 'LOTES',
    description: 'Productos con control de lotes y fechas de vencimiento',
    requiresExpiryControl: true,
    requiresBatchControl: true,
    status: 'active',
    productCount: 12,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Refrigerado',
    code: 'REFRI',
    description: 'Productos que requieren refrigeración especial',
    requiresExpiryControl: true,
    requiresBatchControl: true,
    status: 'active',
    productCount: 8,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  }
];

export function StorageTypesPage() {
  const [storageTypes, setStorageTypes] = useState<StorageType[]>(mockStorageTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStorageType, setSelectedStorageType] = useState<StorageType | null>(null);

  const form = useForm<StorageTypeFormData>({
    resolver: zodResolver(storageTypeSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      requiresExpiryControl: false,
      requiresBatchControl: false,
      status: 'active'
    }
  });

  const filteredStorageTypes = storageTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || type.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateStorageType = (data: StorageTypeFormData) => {
    const newStorageType: StorageType = {
      id: `st-${Date.now()}`,
      ...data,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setStorageTypes([...storageTypes, newStorageType]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditStorageType = (data: StorageTypeFormData) => {
    if (!selectedStorageType) return;
    
    const updatedStorageTypes = storageTypes.map(type => 
      type.id === selectedStorageType.id 
        ? { ...type, ...data, updatedAt: new Date() }
        : type
    );
    
    setStorageTypes(updatedStorageTypes);
    setIsEditDialogOpen(false);
    setSelectedStorageType(null);
    form.reset();
  };

  const handleDeleteStorageType = (id: string) => {
    const storageType = storageTypes.find(st => st.id === id);
    if (storageType && storageType.productCount > 0) {
      alert('No se puede eliminar un tipo de almacenamiento que tiene productos asociados');
      return;
    }
    
    setStorageTypes(storageTypes.filter(type => type.id !== id));
  };

  const openEditDialog = (storageType: StorageType) => {
    setSelectedStorageType(storageType);
    form.reset({
      name: storageType.name,
      code: storageType.code,
      description: storageType.description || '',
      requiresExpiryControl: storageType.requiresExpiryControl,
      requiresBatchControl: storageType.requiresBatchControl,
      status: storageType.status
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

  const getControlBadge = (requiresControl: boolean, type: string) => {
    return requiresControl ? (
      <Badge variant="default" className="bg-blue-100 text-blue-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        {type}
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-gray-100 text-gray-600">
        <XCircle className="h-3 w-3 mr-1" />
        No {type}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Almacenamiento</h1>
          <p className="text-muted-foreground">
            Definición de métodos de almacenamiento (granel y lotes)
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Tipo de Almacenamiento</DialogTitle>
              <DialogDescription>
                Agregue un nuevo tipo de almacenamiento al sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateStorageType)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Ej: Por Lotes"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="code">Código *</Label>
                <Input
                  id="code"
                  {...form.register('code')}
                  placeholder="Ej: LOTES"
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.code.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Descripción del tipo de almacenamiento"
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <Label>Controles Requeridos</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresExpiryControl"
                    {...form.register('requiresExpiryControl')}
                    className="rounded"
                  />
                  <Label htmlFor="requiresExpiryControl">Control de Vencimiento</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresBatchControl"
                    {...form.register('requiresBatchControl')}
                    className="rounded"
                  />
                  <Label htmlFor="requiresBatchControl">Control de Lotes</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Tipo</Button>
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
                  placeholder="Buscar por nombre o código..."
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
            <Database className="h-5 w-5" />
            Tipos de Almacenamiento ({filteredStorageTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Control Vencimiento</TableHead>
                <TableHead>Control Lotes</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStorageTypes.map((storageType) => (
                <TableRow key={storageType.id}>
                  <TableCell className="font-medium">{storageType.code}</TableCell>
                  <TableCell>{storageType.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {storageType.description || '-'}
                  </TableCell>
                  <TableCell>
                    {getControlBadge(storageType.requiresExpiryControl, 'Vencimiento')}
                  </TableCell>
                  <TableCell>
                    {getControlBadge(storageType.requiresBatchControl, 'Lotes')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Package className="h-3 w-3 mr-1" />
                      {storageType.productCount}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(storageType.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(storageType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStorageType(storageType.id)}
                        disabled={storageType.productCount > 0}
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
            <DialogTitle>Editar Tipo de Almacenamiento</DialogTitle>
            <DialogDescription>
              Modifique los datos del tipo de almacenamiento
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleEditStorageType)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre *</Label>
              <Input
                id="edit-name"
                {...form.register('name')}
                placeholder="Ej: Por Lotes"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-code">Código *</Label>
              <Input
                id="edit-code"
                {...form.register('code')}
                placeholder="Ej: LOTES"
              />
              {form.formState.errors.code && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.code.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                {...form.register('description')}
                placeholder="Descripción del tipo de almacenamiento"
                rows={3}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Controles Requeridos</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-requiresExpiryControl"
                  {...form.register('requiresExpiryControl')}
                  className="rounded"
                />
                <Label htmlFor="edit-requiresExpiryControl">Control de Vencimiento</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-requiresBatchControl"
                  {...form.register('requiresBatchControl')}
                  className="rounded"
                />
                <Label htmlFor="edit-requiresBatchControl">Control de Lotes</Label>
              </div>
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