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
  Tag,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Validation schema for product type
const productTypeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(2, 'El código debe tener al menos 2 caracteres'),
  description: z.string().optional(),
  category: z.enum(['raw_material', 'finished_product', 'packaging', 'other']),
  status: z.enum(['active', 'inactive']).default('active')
});

type ProductTypeFormData = z.infer<typeof productTypeSchema>;

// Mock data for development
const mockProductTypes = [
  {
    id: '1',
    name: 'Materia Prima',
    code: 'MP',
    description: 'Materiales básicos para la producción',
    category: 'raw_material',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Producto Terminado',
    code: 'PT',
    description: 'Productos finales listos para venta',
    category: 'finished_product',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Embalaje',
    code: 'EMB',
    description: 'Materiales de empaque y embalaje',
    category: 'packaging',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  }
];

const categories = [
  { value: 'raw_material', label: 'Materia Prima' },
  { value: 'finished_product', label: 'Producto Terminado' },
  { value: 'packaging', label: 'Embalaje' },
  { value: 'other', label: 'Otros' }
];

export function ProductTypesPage() {
  const [productTypes, setProductTypes] = useState(mockProductTypes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProductType, setSelectedProductType] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<ProductTypeFormData>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      status: 'active',
      category: 'raw_material'
    }
  });

  const editForm = useForm<ProductTypeFormData>({
    resolver: zodResolver(productTypeSchema)
  });

  const filteredProductTypes = productTypes.filter(productType => {
    const matchesSearch = productType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         productType.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || productType.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || productType.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDeleteProductType = (id: string) => {
    setProductTypes(productTypes.filter(productType => productType.id !== id));
  };

  const handleCreateProductType = async (data: ProductTypeFormData) => {
    setIsSubmitting(true);
    try {
      const newProductType = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProductTypes([...productTypes, newProductType]);
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      console.error('Error creating product type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProductType = async (data: ProductTypeFormData) => {
    if (!selectedProductType) return;
    
    setIsSubmitting(true);
    try {
      const updatedProductType = {
        ...selectedProductType,
        ...data,
        updatedAt: new Date()
      };
      setProductTypes(productTypes.map(pt => pt.id === selectedProductType.id ? updatedProductType : pt));
      setIsEditDialogOpen(false);
      setSelectedProductType(null);
      editForm.reset();
    } catch (error) {
      console.error('Error updating product type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (productType: any) => {
    setSelectedProductType(productType);
    editForm.reset({
      name: productType.name,
      code: productType.code,
      description: productType.description,
      category: productType.category,
      status: productType.status
    });
    setIsEditDialogOpen(true);
  };

  const getCategoryBadge = (category: string) => {
    const categoryData = categories.find(c => c.value === category);
    return (
      <Badge variant="outline">
        {categoryData?.label || category}
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
          <h1 className="text-3xl font-bold">Tipos de Producto</h1>
          <p className="text-muted-foreground">
            Gestión de categorías y tipos de productos del sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Tipo de Producto</DialogTitle>
              <DialogDescription>
                Complete la información del tipo de producto. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreateProductType)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  {...createForm.register('name')}
                  placeholder="Ej: Materia Prima"
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
                  placeholder="Ej: MP"
                />
                {createForm.formState.errors.code && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  {...createForm.register('description')}
                  placeholder="Descripción opcional del tipo"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoría *</Label>
                <Select 
                  value={createForm.watch('category')} 
                  onValueChange={(value) => createForm.setValue('category', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.category && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.category.message}
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

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear Tipo'}
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
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
              <Label htmlFor="filterCategory">Categoría</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
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

      {/* Product Types Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tipos de Producto</CardTitle>
          <CardDescription>
            {filteredProductTypes.length} tipos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProductTypes.map((productType) => (
                <TableRow key={productType.id}>
                  <TableCell>
                    <div className="font-medium">{productType.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{productType.code}</Badge>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(productType.category)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground max-w-xs truncate">
                      {productType.description || 'Sin descripción'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(productType.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(productType)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProductType(productType.id)}>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Tipo de Producto</DialogTitle>
            <DialogDescription>
              Modifique la información del tipo de producto seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditProductType)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nombre *</Label>
              <Input
                {...editForm.register('name')}
                placeholder="Ej: Materia Prima"
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
                placeholder="Ej: MP"
              />
              {editForm.formState.errors.code && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.code.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                {...editForm.register('description')}
                placeholder="Descripción opcional del tipo"
              />
            </div>

            <div>
              <Label htmlFor="edit-category">Categoría *</Label>
              <Select 
                value={editForm.watch('category')} 
                onValueChange={(value) => editForm.setValue('category', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione la categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.formState.errors.category && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.category.message}
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