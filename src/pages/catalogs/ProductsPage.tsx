import { useState } from 'react';
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

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStorageType, setFilterStorageType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    setIsEditDialogOpen(true);
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
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    placeholder="Ej: Leche Entera"
                  />
                </div>

                <div>
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    placeholder="Ej: LEC-001"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Producto *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lácteos">Lácteos</SelectItem>
                      <SelectItem value="Insumos">Insumos</SelectItem>
                      <SelectItem value="Embalajes">Embalajes</SelectItem>
                      <SelectItem value="Otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="unit">Unidad de Medida *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Litro">Litro</SelectItem>
                      <SelectItem value="Kg">Kilogramo</SelectItem>
                      <SelectItem value="Unidad">Unidad</SelectItem>
                      <SelectItem value="Caja">Caja</SelectItem>
                      <SelectItem value="Botella">Botella</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="storageType">Tipo de Almacenamiento *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bulk">A Granel</SelectItem>
                      <SelectItem value="batch">Por Lotes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="minStock">Stock Mínimo *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    placeholder="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Descripción del producto"
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch id="expiryControl" />
                    <Label htmlFor="expiryControl">Requiere Control de Vencimiento</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear Producto</Button>
            </DialogFooter>
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
          <div className="grid gap-4 md:grid-cols-5">
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
                <SelectItem value="Lácteos">Lácteos</SelectItem>
                <SelectItem value="Insumos">Insumos</SelectItem>
                <SelectItem value="Embalajes">Embalajes</SelectItem>
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStorageType} onValueChange={setFilterStorageType}>
              <SelectTrigger>
                <SelectValue placeholder="Almacenamiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="bulk">A Granel</SelectItem>
                <SelectItem value="batch">Por Lotes</SelectItem>
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
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredProducts.length} productos
              </Badge>
            </div>
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
                  <TableHead>Control Vencimiento</TableHead>
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
                          Código: {product.code}
                        </div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{product.type}</Badge>
                        <div className="text-sm text-muted-foreground mt-1">
                          {product.unit}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.storageType === 'batch' ? 'default' : 'secondary'}>
                        {product.storageType === 'batch' ? 'Por Lotes' : 'A Granel'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {product.minStock} {product.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.requiresExpiryControl ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm">Sí</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm">No</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? 'default' : 'destructive'}>
                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
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
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Nombre del Producto</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedProduct?.name}
                />
              </div>

              <div>
                <Label htmlFor="edit-code">Código</Label>
                <Input
                  id="edit-code"
                  defaultValue={selectedProduct?.code}
                />
              </div>

              <div>
                <Label htmlFor="edit-type">Tipo de Producto</Label>
                <Select defaultValue={selectedProduct?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lácteos">Lácteos</SelectItem>
                    <SelectItem value="Insumos">Insumos</SelectItem>
                    <SelectItem value="Embalajes">Embalajes</SelectItem>
                    <SelectItem value="Otros">Otros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-unit">Unidad de Medida</Label>
                <Select defaultValue={selectedProduct?.unit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione la unidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Litro">Litro</SelectItem>
                    <SelectItem value="Kg">Kilogramo</SelectItem>
                    <SelectItem value="Unidad">Unidad</SelectItem>
                    <SelectItem value="Caja">Caja</SelectItem>
                    <SelectItem value="Botella">Botella</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-storageType">Tipo de Almacenamiento</Label>
                <Select defaultValue={selectedProduct?.storageType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bulk">A Granel</SelectItem>
                    <SelectItem value="batch">Por Lotes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-minStock">Stock Mínimo</Label>
                <Input
                  id="edit-minStock"
                  type="number"
                  defaultValue={selectedProduct?.minStock}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  defaultValue={selectedProduct?.description}
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="edit-expiryControl" 
                    defaultChecked={selectedProduct?.requiresExpiryControl}
                  />
                  <Label htmlFor="edit-expiryControl">Requiere Control de Vencimiento</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select defaultValue={selectedProduct?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Actualizar Producto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 