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
import { useProducts } from '@/hooks/useProducts';
import { toast } from 'sonner';

// Schema de validación
const productSchema = z.object({
  code: z.string().min(1, 'El código es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  product_type_id: z.string().min(1, 'El tipo de producto es requerido'),
  unit: z.string().min(1, 'La unidad es requerida'),
  storage_type_id: z.string().min(1, 'El tipo de almacenamiento es requerido'),
  status: z.string().min(1, 'El estado es requerido'),
});

type ProductFormData = z.infer<typeof productSchema>;

// Datos mock para los selectores
const productTypes = [
  { id: '1', name: 'Lácteos' },
  { id: '2', name: 'Cárnicos' },
  { id: '3', name: 'Granos' },
  { id: '4', name: 'Verduras' },
  { id: '5', name: 'Frutas' },
  { id: '6', name: 'Condimentos' },
  { id: '7', name: 'Embalajes' },
  { id: '8', name: 'Equipos' },
];

const storageTypes = [
  { id: '1', name: 'Refrigerado' },
  { id: '2', name: 'Congelado' },
  { id: '3', name: 'Seco' },
  { id: '4', name: 'Ambiente' },
];

const statusOptions = [
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'discontinued', label: 'Descontinuado' },
];

export default function ProductsPage() {
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    checkCodeExists,
    refresh,
    clearError
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const createForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      product_type_id: '',
      unit: '',
      storage_type_id: '',
      status: 'active',
    },
  });

  const editForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const handleCreateProduct = async (data: ProductFormData) => {
    try {
      // Verificar si el código ya existe
      const codeExists = await checkCodeExists(data.code);
      if (codeExists) {
        toast.error('El código de producto ya existe');
        return;
      }

      await createProduct({
        code: data.code,
        name: data.name,
        description: data.description || '',
        product_type_id: data.product_type_id,
        unit: data.unit,
        storage_type_id: data.storage_type_id,
        status: data.status,
      });
      
      toast.success('Producto creado exitosamente');
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      toast.error('Error al crear el producto');
      console.error('Error creating product:', error);
    }
  };

  const handleEditProduct = async (data: ProductFormData) => {
    if (!selectedProduct) return;
    
    try {
      // Verificar si el código ya existe (excluyendo el producto actual)
      const codeExists = await checkCodeExists(data.code, selectedProduct.id);
      if (codeExists) {
        toast.error('El código de producto ya existe');
        return;
      }

      await updateProduct(selectedProduct.id, {
        code: data.code,
        name: data.name,
        description: data.description || '',
        product_type_id: data.product_type_id,
        unit: data.unit,
        storage_type_id: data.storage_type_id,
        status: data.status,
      });
      
      toast.success('Producto actualizado exitosamente');
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      toast.error('Error al actualizar el producto');
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;
    
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado exitosamente');
    } catch (error) {
      toast.error('Error al eliminar el producto');
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    editForm.reset({
      code: product.code,
      name: product.name,
      description: product.description || '',
      product_type_id: product.product_type_id,
      unit: product.unit,
      storage_type_id: product.storage_type_id,
      status: product.status,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (product: any) => {
    setSelectedProduct(product);
    setIsViewDialogOpen(true);
  };

  const getStorageTypeBadge = (storageTypeId: string) => {
    const storageType = storageTypes.find(st => st.id === storageTypeId);
    if (!storageType) return <Badge variant="secondary">Desconocido</Badge>;
    
    const variantMap: { [key: string]: "default" | "secondary" | "destructive" } = {
      '1': 'default', // Refrigerado
      '2': 'destructive', // Congelado
      '3': 'secondary', // Seco
      '4': 'secondary', // Ambiente
    };
    
    return <Badge variant={variantMap[storageTypeId] || 'secondary'}>{storageType.name}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { variant: "default" | "secondary" | "destructive", label: string } } = {
      active: { variant: "default", label: "Activo" },
      inactive: { variant: "secondary", label: "Inactivo" },
      discontinued: { variant: "destructive", label: "Descontinuado" },
    };
    
    const statusInfo = statusMap[status] || { variant: "secondary", label: status };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getProductTypeName = (productTypeId: string) => {
    const productType = productTypes.find(pt => pt.id === productTypeId);
    return productType?.name || 'Desconocido';
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error al cargar productos</p>
          <Button onClick={refresh} variant="outline">Reintentar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
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
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Almacenamiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.description || '-'}</TableCell>
                  <TableCell>{getProductTypeName(product.product_type_id)}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{getStorageTypeBadge(product.storage_type_id)}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openViewDialog(product)}
                      >
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
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? 'No se encontraron productos' : 'No hay productos registrados'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear producto */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo Producto</DialogTitle>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(handleCreateProduct)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  {...createForm.register('code')}
                  className={createForm.formState.errors.code ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.code && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.code.message}
                  </p>
                )}
              </div>
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
            </div>
            
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                {...createForm.register('description')}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product_type_id">Tipo de Producto</Label>
                <select
                  id="product_type_id"
                  {...createForm.register('product_type_id')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione un tipo</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {createForm.formState.errors.product_type_id && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.product_type_id.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="unit">Unidad</Label>
                <Input
                  id="unit"
                  {...createForm.register('unit')}
                  className={createForm.formState.errors.unit ? 'border-red-500' : ''}
                />
                {createForm.formState.errors.unit && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.unit.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storage_type_id">Tipo de Almacenamiento</Label>
                <select
                  id="storage_type_id"
                  {...createForm.register('storage_type_id')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione un tipo</option>
                  {storageTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {createForm.formState.errors.storage_type_id && (
                  <p className="text-sm text-red-500 mt-1">
                    {createForm.formState.errors.storage_type_id.message}
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
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Crear Producto</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar producto */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditProduct)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-code">Código</Label>
                <Input
                  id="edit-code"
                  {...editForm.register('code')}
                  className={editForm.formState.errors.code ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.code && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.code.message}
                  </p>
                )}
              </div>
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
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Input
                id="edit-description"
                {...editForm.register('description')}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-product_type_id">Tipo de Producto</Label>
                <select
                  id="edit-product_type_id"
                  {...editForm.register('product_type_id')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione un tipo</option>
                  {productTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {editForm.formState.errors.product_type_id && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.product_type_id.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="edit-unit">Unidad</Label>
                <Input
                  id="edit-unit"
                  {...editForm.register('unit')}
                  className={editForm.formState.errors.unit ? 'border-red-500' : ''}
                />
                {editForm.formState.errors.unit && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.unit.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-storage_type_id">Tipo de Almacenamiento</Label>
                <select
                  id="edit-storage_type_id"
                  {...editForm.register('storage_type_id')}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Seleccione un tipo</option>
                  {storageTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                {editForm.formState.errors.storage_type_id && (
                  <p className="text-sm text-red-500 mt-1">
                    {editForm.formState.errors.storage_type_id.message}
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
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">Actualizar Producto</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver producto */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Código:</Label>
                <p>{selectedProduct.code}</p>
              </div>
              <div>
                <Label className="font-semibold">Nombre:</Label>
                <p>{selectedProduct.name}</p>
              </div>
              <div>
                <Label className="font-semibold">Descripción:</Label>
                <p>{selectedProduct.description || 'Sin descripción'}</p>
              </div>
              <div>
                <Label className="font-semibold">Tipo de Producto:</Label>
                <p>{getProductTypeName(selectedProduct.product_type_id)}</p>
              </div>
              <div>
                <Label className="font-semibold">Unidad:</Label>
                <p>{selectedProduct.unit}</p>
              </div>
              <div>
                <Label className="font-semibold">Tipo de Almacenamiento:</Label>
                <div className="mt-1">{getStorageTypeBadge(selectedProduct.storage_type_id)}</div>
              </div>
              <div>
                <Label className="font-semibold">Estado:</Label>
                <div className="mt-1">{getStatusBadge(selectedProduct.status)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 