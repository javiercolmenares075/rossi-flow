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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  Download,
  Warehouse,
  Package,
  QrCode,
  Truck,
  ArrowUp,
  ArrowDown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Scale
} from 'lucide-react';
import { InventoryMovement, Product, Warehouse, Batch } from '@/types';

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
  }
];

const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    name: 'Almacén Principal',
    location: 'Zona Industrial, Luque',
    responsible: 'Juan Pérez',
    capacity: 10000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Almacén Refrigerado',
    location: 'Zona Industrial, Luque',
    responsible: 'María González',
    capacity: 5000,
    status: 'active'
  }
];

const mockBatches: Batch[] = [
  {
    id: '1',
    code: 'LEC-2024-001',
    productId: '1',
    product: mockProducts[0],
    initialQuantity: 500,
    currentQuantity: 350,
    creationDate: new Date('2024-01-15'),
    expiryDate: new Date('2024-02-15'),
    warehouseId: '1',
    warehouse: mockWarehouses[0],
    description: 'Lote de leche entera',
    qrCode: 'LEC-2024-001-QR',
    status: 'active'
  },
  {
    id: '2',
    code: 'QUE-2024-001',
    productId: '2',
    product: mockProducts[1],
    initialQuantity: 100,
    currentQuantity: 75,
    creationDate: new Date('2024-01-10'),
    expiryDate: new Date('2024-03-10'),
    warehouseId: '2',
    warehouse: mockWarehouses[1],
    description: 'Lote de queso paraguay',
    qrCode: 'QUE-2024-001-QR',
    status: 'active'
  }
];

const mockMovements: InventoryMovement[] = [
  {
    id: '1',
    date: new Date('2024-01-15'),
    type: 'entry',
    productId: '1',
    product: mockProducts[0],
    quantity: 500,
    unit: 'Litro',
    warehouseId: '1',
    warehouse: mockWarehouses[0],
    batchId: '1',
    batch: mockBatches[0],
    expiryDate: new Date('2024-02-15'),
    description: 'Ingreso de leche desde proveedor',
    responsibleId: '1',
    responsible: { id: '1', name: 'Juan Pérez', position: 'Almacén', email: 'juan@rossi.com', phone: '0981-123-456', status: 'active' },
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    date: new Date('2024-01-16'),
    type: 'exit',
    productId: '1',
    product: mockProducts[0],
    quantity: 150,
    unit: 'Litro',
    warehouseId: '1',
    warehouse: mockWarehouses[0],
    batchId: '1',
    batch: mockBatches[0],
    description: 'Salida para producción',
    responsibleId: '1',
    responsible: { id: '1', name: 'Juan Pérez', position: 'Almacén', email: 'juan@rossi.com', phone: '0981-123-456', status: 'active' },
    createdAt: new Date('2024-01-16')
  }
];

export function InventoryPage() {
  const [activeTab, setActiveTab] = useState('movements');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [isMovementDialogOpen, setIsMovementDialogOpen] = useState(false);
  const [isBulkEntryDialogOpen, setIsBulkEntryDialogOpen] = useState(false);

  const filteredMovements = mockMovements.filter(movement => {
    const matchesSearch = movement.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || movement.type === filterType;
    const matchesWarehouse = filterWarehouse === 'all' || movement.warehouseId === filterWarehouse;
    const matchesProduct = filterProduct === 'all' || movement.productId === filterProduct;
    
    return matchesSearch && matchesType && matchesWarehouse && matchesProduct;
  });

  const filteredBatches = mockBatches.filter(batch => {
    const matchesSearch = batch.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = filterWarehouse === 'all' || batch.warehouseId === filterWarehouse;
    const matchesProduct = filterProduct === 'all' || batch.productId === filterProduct;
    
    return matchesSearch && matchesWarehouse && matchesProduct;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  const getMovementIcon = (type: string) => {
    return type === 'entry' ? <ArrowUp className="h-4 w-4 text-green-600" /> : <ArrowDown className="h-4 w-4 text-red-600" />;
  };

  const getBatchStatusBadge = (batch: Batch) => {
    if (batch.status === 'expired') {
      return <Badge variant="destructive">Vencido</Badge>;
    } else if (batch.status === 'depleted') {
      return <Badge variant="secondary">Agotado</Badge>;
    } else {
      return <Badge variant="default">Activo</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventario</h1>
          <p className="text-muted-foreground">
            Gestión de movimientos, stock y control de lotes
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isBulkEntryDialogOpen} onOpenChange={setIsBulkEntryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Ingreso Masivo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ingreso Masivo de Inventario</DialogTitle>
                <DialogDescription>
                  Ingrese múltiples productos desde una orden de compra o archivo.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Seleccionar Orden de Compra</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una orden de compra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oc-001">OC-2024-001 - Lácteos del Sur</SelectItem>
                      <SelectItem value="oc-002">OC-2024-002 - Granja San Miguel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>O subir archivo CSV</Label>
                  <Input type="file" accept=".csv" />
                </div>
              </div>
              <DialogFooter>
                <Button>Procesar Ingreso</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isMovementDialogOpen} onOpenChange={setIsMovementDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Movimiento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nuevo Movimiento de Inventario</DialogTitle>
                <DialogDescription>
                  Registre un movimiento de entrada o salida de inventario.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="movementType">Tipo de Movimiento *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entrada</SelectItem>
                        <SelectItem value="exit">Salida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="movementDate">Fecha *</Label>
                    <Input
                      id="movementDate"
                      type="date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="movementProduct">Producto *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="movementQuantity">Cantidad *</Label>
                    <Input
                      id="movementQuantity"
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="movementWarehouse">Almacén *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el almacén" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockWarehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="movementBatch">Lote (opcional)</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione el lote" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockBatches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="movementDescription">Descripción *</Label>
                    <Textarea
                      id="movementDescription"
                      placeholder="Descripción del movimiento"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button>Registrar Movimiento</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
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
                placeholder="Buscar por producto, lote o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de movimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="entry">Entrada</SelectItem>
                <SelectItem value="exit">Salida</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
              <SelectTrigger>
                <SelectValue placeholder="Almacén" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los almacenes</SelectItem>
                {mockWarehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Producto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los productos</SelectItem>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="movements">Movimientos</TabsTrigger>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="batches">Lotes</TabsTrigger>
        </TabsList>

        <TabsContent value="movements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Movimientos de Inventario</CardTitle>
              <CardDescription>
                Historial de entradas y salidas de inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Almacén</TableHead>
                      <TableHead>Lote</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMovements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <div className="text-sm">
                            {movement.date.toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getMovementIcon(movement.type)}
                            <Badge variant={movement.type === 'entry' ? 'default' : 'secondary'}>
                              {movement.type === 'entry' ? 'Entrada' : 'Salida'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{movement.product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {movement.product.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {movement.quantity} {movement.unit}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {movement.warehouse.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {movement.batch ? (
                            <div className="text-sm">
                              {movement.batch.code}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {movement.responsible.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="stock" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Actual</CardTitle>
              <CardDescription>
                Estado actual del inventario por producto y almacén
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Almacén</TableHead>
                      <TableHead>Stock Actual</TableHead>
                      <TableHead>Stock Mínimo</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último Movimiento</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {mockWarehouses[0].name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {product.storageType === 'batch' ? '350' : '1000'} {product.unit}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {product.minStock} {product.unit}
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.storageType === 'batch' ? (
                            <Badge variant="default">Por Lotes</Badge>
                          ) : (
                            <Badge variant="secondary">A Granel</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <QrCode className="h-4 w-4" />
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
        </TabsContent>

        <TabsContent value="batches" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Control de Lotes</CardTitle>
              <CardDescription>
                Gestión de lotes con códigos QR y control de vencimientos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código de Lote</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Almacén</TableHead>
                      <TableHead>Fecha Creación</TableHead>
                      <TableHead>Vencimiento</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{batch.code}</div>
                            <div className="text-sm text-muted-foreground">
                              {batch.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{batch.product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {batch.product.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {batch.currentQuantity} / {batch.initialQuantity} {batch.product.unit}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {batch.warehouse.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {batch.creationDate.toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          {batch.expiryDate ? (
                            <div className="text-sm">
                              {batch.expiryDate.toLocaleDateString()}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getBatchStatusBadge(batch)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 