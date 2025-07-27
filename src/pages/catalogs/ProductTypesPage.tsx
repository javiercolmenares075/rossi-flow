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
  Eye, 
  Package,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Schema de validación
const productTypeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type ProductTypeFormData = z.infer<typeof productTypeSchema>;

interface ProductType {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Mock data
const mockProductTypes: ProductType[] = [
  {
    id: '1',
    name: 'Lácteos',
    code: 'LAC',
    description: 'Productos derivados de la leche',
    status: 'active',
    productCount: 5,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Aves',
    code: 'AVE',
    description: 'Productos avícolas',
    status: 'active',
    productCount: 3,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Insumos',
    code: 'INS',
    description: 'Materias primas para producción',
    status: 'active',
    productCount: 8,
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  }
];

export function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState<ProductType[]>(mockProductTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<ProductType | null>(null);

  const form = useForm<ProductTypeFormData>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      status: 'active'
    }
  });

  const filteredProductTypes = productTypes.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || type.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateProductType = (data: ProductTypeFormData) => {
    const newProductType: ProductType = {
      id: `pt-${Date.now()}`,
      ...data,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProductTypes([...productTypes, newProductType]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditProductType = (data: ProductTypeFormData) => {
    if (!selectedProductType) return;
    
    const updatedProductTypes = productTypes.map(type => 
      type.id === selectedProductType.id 
        ? { ...type, ...data, updatedAt: new Date() }
        : type
    );
    
    setProductTypes(updatedProductTypes);
    setIsEditDialogOpen(false);
    setSelectedProductType(null);
    form.reset();
  };

  const handleDeleteProductType = (id: string) => {
    const productType = productTypes.find(pt => pt.id === id);
    if (productType && productType.productCount > 0) {
      alert('No se puede eliminar un tipo de producto que tiene productos asociados');
      return;
    }
    
    setProductTypes(productTypes.filter(type => type.id !== id));
  };

  const openEditDialog = (productType: ProductType) => {
    setSelectedProductType(productType);
    form.reset({
      name: productType.name,
      code: productType.code,
      description: productType.description || '',
      status: productType.status
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Producto</h1>
          <p className="text-muted-foreground">
            Clasificación de productos para facilitar búsquedas y reportes
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
              <DialogTitle>Crear Tipo de Producto</DialogTitle>
              <DialogDescription>
                Agregue un nuevo tipo de producto al sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateProductType)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Ej: Lácteos"
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
                  placeholder="Ej: LAC"
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
                  placeholder="Descripción opcional del tipo de producto"
                  rows={3}
                />
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
            <Package className="h-5 w-5" />
            Tipos de Producto ({filteredProductTypes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductTypes.map((productType) => (
                <TableRow key={productType.id}>
                  <TableCell className="font-medium">{productType.code}</TableCell>
                  <TableCell>{productType.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {productType.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{productType.productCount}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(productType.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {productType.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(productType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProductType(productType.id)}
                        disabled={productType.productCount > 0}
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
            <DialogTitle>Editar Tipo de Producto</DialogTitle>
            <DialogDescription>
              Modifique los datos del tipo de producto
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleEditProductType)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre *</Label>
              <Input
                id="edit-name"
                {...form.register('name')}
                placeholder="Ej: Lácteos"
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
                placeholder="Ej: LAC"
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
                placeholder="Descripción opcional del tipo de producto"
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