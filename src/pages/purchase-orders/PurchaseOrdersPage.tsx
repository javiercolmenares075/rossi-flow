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
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Download,
  Mail,
  MessageSquare,
  ShoppingCart,
  Calendar,
  DollarSign,
  Building2,
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { PurchaseOrder, Provider, Product } from '@/types';

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
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  }
];

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

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    number: 'OC-2024-001',
    providerId: '1',
    provider: mockProviders[0],
    creationDate: new Date('2024-01-15'),
    estimatedArrivalDate: new Date('2024-01-20'),
    scheduledPaymentDate: new Date('2024-01-25'),
    paymentStatus: 'unpaid',
    items: [
      {
        id: '1',
        productId: '1',
        product: mockProducts[0],
        quantity: 500,
        unitCost: 2500,
        subtotal: 1250000
      },
      {
        id: '2',
        productId: '2',
        product: mockProducts[1],
        quantity: 100,
        unitCost: 15000,
        subtotal: 1500000
      }
    ],
    subtotal: 2750000,
    iva: 412500,
    total: 3162500,
    status: 'issued',
    emailSent: true,
    whatsappSent: false,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.provider.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPaymentStatus = filterPaymentStatus === 'all' || order.paymentStatus === filterPaymentStatus;
    const matchesProvider = filterProvider === 'all' || order.providerId === filterProvider;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesProvider;
  });

  const handleDeleteOrder = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter(order => order.id !== id));
  };

  const openEditDialog = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pre_order: { label: 'Pre-orden', variant: 'secondary' as const },
      issued: { label: 'Emitida', variant: 'default' as const },
      received: { label: 'Recibida', variant: 'default' as const },
      paid: { label: 'Pagada', variant: 'default' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Órdenes de Compra</h1>
          <p className="text-muted-foreground">
            Gestión de órdenes de compra, proveedores y seguimiento de entregas
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Orden de Compra</DialogTitle>
              <DialogDescription>
                Complete la información de la orden de compra. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="provider">Proveedor *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.businessName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="estimatedArrival">Fecha Estimada de Llegada *</Label>
                  <Input
                    id="estimatedArrival"
                    type="date"
                  />
                </div>

                <div>
                  <Label htmlFor="scheduledPayment">Fecha Programada de Pago</Label>
                  <Input
                    id="scheduledPayment"
                    type="date"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div>
                <Label>Items de la Orden *</Label>
                <div className="mt-2 border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Costo Unitario</TableHead>
                        <TableHead>Subtotal</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione producto" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockProducts.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            placeholder="0"
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">₲ 0</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="p-4 border-t">
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Item
                    </Button>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Subtotal</Label>
                  <div className="text-lg font-semibold">₲ 0</div>
                </div>
                <div>
                  <Label>IVA (15%)</Label>
                  <div className="text-lg font-semibold">₲ 0</div>
                </div>
                <div>
                  <Label>Total</Label>
                  <div className="text-xl font-bold">₲ 0</div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear Orden</Button>
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
                placeholder="Buscar por número o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado de orden" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pre_order">Pre-orden</SelectItem>
                <SelectItem value="issued">Emitida</SelectItem>
                <SelectItem value="received">Recibida</SelectItem>
                <SelectItem value="paid">Pagada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="unpaid">Pendiente</SelectItem>
                <SelectItem value="paid">Pagado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                {mockProviders.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredOrders.length} órdenes
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Órdenes de Compra</CardTitle>
          <CardDescription>
            Gestione todas las órdenes de compra registradas en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Fechas</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Pago</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.number}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.creationDate.toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.provider.businessName}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.provider.ruc}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Llegada:</span> {order.estimatedArrivalDate.toLocaleDateString()}
                        </div>
                        {order.scheduledPaymentDate && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Pago:</span> {order.scheduledPaymentDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.items.length} productos
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatCurrency(order.total)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
                        {order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(order)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Descargar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Enviar por email"
                          className={order.emailSent ? 'text-green-600' : ''}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Enviar por WhatsApp"
                          className={order.whatsappSent ? 'text-green-600' : ''}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteOrder(order.id)}
                          title="Eliminar"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Orden de Compra</DialogTitle>
            <DialogDescription>
              Modifique la información de la orden de compra seleccionada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="edit-provider">Proveedor</Label>
                <Select defaultValue={selectedOrder?.providerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.businessName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-arrival">Fecha Estimada de Llegada</Label>
                <Input
                  id="edit-arrival"
                  type="date"
                  defaultValue={selectedOrder?.estimatedArrivalDate.toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="edit-payment">Fecha Programada de Pago</Label>
                <Input
                  id="edit-payment"
                  type="date"
                  defaultValue={selectedOrder?.scheduledPaymentDate?.toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Items Table */}
            <div>
              <Label>Items de la Orden</Label>
              <div className="mt-2 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Costo Unitario</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder?.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Select defaultValue={item.productId}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {mockProducts.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} ({product.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            defaultValue={item.quantity}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            defaultValue={item.unitCost}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{formatCurrency(item.subtotal)}</span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 border-t">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Item
                  </Button>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>Subtotal</Label>
                <div className="text-lg font-semibold">{formatCurrency(selectedOrder?.subtotal || 0)}</div>
              </div>
              <div>
                <Label>IVA (15%)</Label>
                <div className="text-lg font-semibold">{formatCurrency(selectedOrder?.iva || 0)}</div>
              </div>
              <div>
                <Label>Total</Label>
                <div className="text-xl font-bold">{formatCurrency(selectedOrder?.total || 0)}</div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Actualizar Orden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 