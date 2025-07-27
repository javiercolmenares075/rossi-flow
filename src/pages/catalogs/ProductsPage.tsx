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
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Product } from '@/types';

// Schema de validación
const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  code: z.string().min(3, 'El código debe tener al menos 3 caracteres'),
  type: z.string().min(1, 'Debe seleccionar un tipo'),
  unit: z.string().min(1, 'Debe seleccionar una unidad'),
  storageType: z.enum(['bulk', 'batch'], {
    required_error: 'Debe seleccionar el tipo de almacenamiento'
  }),
  requiresExpiryControl: z.boolean(),
  minStock: z.number().min(0, 'El stock mínimo debe ser 0 o mayor'),
  description: z.string().optional()
});

type ProductFormData = z.infer<typeof productSchema>;

// Mock data for development
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
    name: 'Azúcar Refinada',
    code: 'AZU-001',
    type: 'Insumos',
    unit: 'Kg',
    storageType: 'bulk',
    requiresExpiryControl: false,
    minStock: 200,
    description: 'Azúcar refinada para producción',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  }
];

const productTypes = [
  'Lácteos',
  'Insumos',
  'Envases',
  'Químicos',
  'Aditivos',
  'Otros'
];

const units = [
  'Litro',
  'Kg',
  'Gramo',
  'Unidad',
  'Caja',
  'Botella',
  'Bolsa'
];

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStorageType, setFilterStorageType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      code: '',
      type: '',
      unit: '',
      storageType: 'batch',
      requiresExpiryControl: true,
      minStock: 0,
      description: ''
    }
  });

  const editForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      code: '',
      type: '',
      unit: '',
      storageType: 'batch',
      requiresExpiryControl: true,
      minStock: 0,
      description: ''
    }
  });

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || product.type === filterType;
    const matchesStorageType = filterStorageType === 'all' || product.storageType === filterStorageType;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStorageType && matchesStatus;
  });

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    editForm.reset({
      name: product.name,
      code: product.code,
      type: product.type,
      unit: product.unit,
      storageType: product.storageType,
      requiresExpiryControl: product.requiresExpiryControl,
      minStock: product.minStock,
      description: product.description || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleCreateProduct = async (data: ProductFormData) => {
    setIsSubmitting(true);
    try {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        ...data,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setProducts([...products, newProduct]);
      form.reset();
      setIsCreateDialogOpen(false);
      alert('Producto creado exitosamente');
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return;
    
    setIsSubmitting(true);
    try {
      const updatedProducts = products.map(product => 
        product.id === selectedProduct.id 
          ? { ...product, ...data, updatedAt: new Date() }
          : product
      );
      
      setProducts(updatedProducts);
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Error al actualizar producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStorageTypeBadge = (type: string) => {
    return type === 'batch' ? (
      <Badge variant="default">Por Lotes</Badge>
    ) : (
      <Badge variant="secondary">A Granel</Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default">Activo</Badge>
    ) : (
      <Badge variant="destructive">Inactivo</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestión de productos, códigos y configuraciones de almacenamiento
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Producto</DialogTitle>
              <DialogDescription>
                Complete la información del producto. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateProduct)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    {...form.register('name')}
                    placeholder="Ej: Leche Entera"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    {...form.register('code')}
                    placeholder="Ej: LEC-001"
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Producto *</Label>
                  <Select onValueChange={(value) => form.setValue('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {productTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.type && (
                    <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="unit">Unidad *</Label>
                  <Select onValueChange={(value) => form.setValue('unit', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.unit && (
                    <p className="text-sm text-red-500">{form.formState.errors.unit.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="storageType">Tipo de Almacenamiento *</Label>
                  <Select onValueChange={(value) => form.setValue('storageType', value as 'bulk' | 'batch')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="batch">Por Lotes</SelectItem>
                      <SelectItem value="bulk">A Granel</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.storageType && (
                    <p className="text-sm text-red-500">{form.formState.errors.storageType.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="minStock">Stock Mínimo *</Label>
                  <Input
                    {...form.register('minStock', { valueAsNumber: true })}
                    type="number"
                    placeholder="0"
                  />
                  {form.formState.errors.minStock && (
                    <p className="text-sm text-red-500">{form.formState.errors.minStock.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={form.watch('requiresExpiryControl')}
                      onCheckedChange={(checked) => form.setValue('requiresExpiryControl', checked)}
                    />
                    <Label htmlFor="requiresExpiryControl">Requiere Control de Vencimiento</Label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    {...form.register('description')}
                    placeholder="Descripción del producto..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear Producto'}
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
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, código o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de producto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStorageType} onValueChange={setFilterStorageType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de almacenamiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="batch">Por Lotes</SelectItem>
                <SelectItem value="bulk">A Granel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
          <CardDescription>
            Gestione todos los productos registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Almacenamiento</TableHead>
                  <TableHead>Stock Mínimo</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.code} • {product.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStorageTypeBadge(product.storageType)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {product.minStock} {product.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.requiresExpiryControl ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(product.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifique la información del producto seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditProduct)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Nombre del Producto *</Label>
                <Input
                  {...editForm.register('name')}
                  placeholder="Ej: Leche Entera"
                />
                {editForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-code">Código *</Label>
                <Input
                  {...editForm.register('code')}
                  placeholder="Ej: LEC-001"
                />
                {editForm.formState.errors.code && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.code.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-type">Tipo de Producto *</Label>
                <Select onValueChange={(value) => editForm.setValue('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {productTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editForm.formState.errors.type && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.type.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-unit">Unidad *</Label>
                <Select onValueChange={(value) => editForm.setValue('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editForm.formState.errors.unit && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.unit.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-storageType">Tipo de Almacenamiento *</Label>
                <Select onValueChange={(value) => editForm.setValue('storageType', value as 'bulk' | 'batch')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="batch">Por Lotes</SelectItem>
                    <SelectItem value="bulk">A Granel</SelectItem>
                  </SelectContent>
                </Select>
                {editForm.formState.errors.storageType && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.storageType.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-minStock">Stock Mínimo *</Label>
                <Input
                  {...editForm.register('minStock', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                />
                {editForm.formState.errors.minStock && (
                  <p className="text-sm text-red-500">{editForm.formState.errors.minStock.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editForm.watch('requiresExpiryControl')}
                    onCheckedChange={(checked) => editForm.setValue('requiresExpiryControl', checked)}
                  />
                  <Label htmlFor="edit-requiresExpiryControl">Requiere Control de Vencimiento</Label>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  {...editForm.register('description')}
                  placeholder="Descripción del producto..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Actualizando...' : 'Actualizar Producto'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 