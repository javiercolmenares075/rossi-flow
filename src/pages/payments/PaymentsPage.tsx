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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Upload,
  Download
} from 'lucide-react';

// Schema de validación
const paymentSchema = z.object({
  orderId: z.string().min(1, 'Debe seleccionar una orden'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  paymentDate: z.string().min(1, 'La fecha de pago es obligatoria'),
  paymentMethod: z.string().min(1, 'Debe seleccionar un método de pago'),
  reference: z.string().optional(),
  description: z.string().optional(),
  receiptFile: z.string().optional()
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PurchaseOrder {
  id: string;
  number: string;
  provider: {
    id: string;
    businessName: string;
    ruc: string;
  };
  total: number;
  scheduledPaymentDate: Date;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  amountPaid: number;
  amountPending: number;
  createdAt: Date;
}

interface Payment {
  id: string;
  orderId: string;
  order: PurchaseOrder;
  amount: number;
  paymentDate: Date;
  paymentMethod: string;
  reference?: string;
  description?: string;
  receiptFile?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: Date;
  createdBy: string;
}

// Mock data
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    number: 'OC-2024-001',
    provider: {
      id: '1',
      businessName: 'Lácteos del Sur S.A.',
      ruc: '80012345-1'
    },
    total: 1500000,
    scheduledPaymentDate: new Date('2024-02-15'),
    paymentStatus: 'partial',
    amountPaid: 750000,
    amountPending: 750000,
    createdAt: new Date('2024-01-20')
  },
  {
    id: '2',
    number: 'OC-2024-002',
    provider: {
      id: '2',
      businessName: 'Granja San Miguel',
      ruc: '80023456-2'
    },
    total: 800000,
    scheduledPaymentDate: new Date('2024-02-20'),
    paymentStatus: 'unpaid',
    amountPaid: 0,
    amountPending: 800000,
    createdAt: new Date('2024-01-25')
  },
  {
    id: '3',
    number: 'OC-2024-003',
    provider: {
      id: '1',
      businessName: 'Lácteos del Sur S.A.',
      ruc: '80012345-1'
    },
    total: 1200000,
    scheduledPaymentDate: new Date('2024-01-30'),
    paymentStatus: 'paid',
    amountPaid: 1200000,
    amountPending: 0,
    createdAt: new Date('2024-01-15')
  }
];

const mockPayments: Payment[] = [
  {
    id: '1',
    orderId: '1',
    order: mockPurchaseOrders[0],
    amount: 750000,
    paymentDate: new Date('2024-02-10'),
    paymentMethod: 'Transferencia Bancaria',
    reference: 'TRF-2024-001',
    description: 'Pago parcial de orden OC-2024-001',
    status: 'confirmed',
    createdAt: new Date('2024-02-10'),
    createdBy: 'Juan Pérez'
  },
  {
    id: '2',
    orderId: '3',
    order: mockPurchaseOrders[2],
    amount: 1200000,
    paymentDate: new Date('2024-01-28'),
    paymentMethod: 'Cheque',
    reference: 'CHQ-2024-001',
    description: 'Pago completo de orden OC-2024-003',
    status: 'confirmed',
    createdAt: new Date('2024-01-28'),
    createdBy: 'María González'
  }
];

const paymentMethods = [
  'Transferencia Bancaria',
  'Cheque',
  'Efectivo',
  'Tarjeta de Crédito',
  'Tarjeta de Débito',
  'Pago Móvil'
];

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [purchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      orderId: '',
      amount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      reference: '',
      description: '',
      receiptFile: ''
    }
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.order.provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesProvider = filterProvider === 'all' || payment.order.provider.id === filterProvider;
    
    return matchesSearch && matchesStatus && matchesProvider;
  });

  const pendingOrders = purchaseOrders.filter(order => order.paymentStatus !== 'paid');

  const handleCreatePayment = (data: PaymentFormData) => {
    const order = purchaseOrders.find(o => o.id === data.orderId);
    if (!order) return;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      orderId: data.orderId,
      order,
      amount: data.amount,
      paymentDate: new Date(data.paymentDate),
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      description: data.description,
      receiptFile: data.receiptFile,
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'Usuario Actual'
    };
    
    setPayments([...payments, newPayment]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditPayment = (data: PaymentFormData) => {
    if (!selectedPayment) return;
    
    const updatedPayment: Payment = {
      ...selectedPayment,
      ...data,
      order: purchaseOrders.find(o => o.id === data.orderId)!,
      paymentDate: new Date(data.paymentDate)
    };
    
    setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p));
    setIsEditDialogOpen(false);
    setSelectedPayment(null);
    form.reset();
  };

  const handleDeletePayment = (id: string) => {
    const payment = payments.find(p => p.id === id);
    if (payment && payment.status === 'confirmed') {
      alert('No se puede eliminar un pago confirmado');
      return;
    }
    
    setPayments(payments.filter(payment => payment.id !== id));
  };

  const handleStatusChange = (paymentId: string, newStatus: Payment['status']) => {
    setPayments(payments.map(payment => {
      if (payment.id === paymentId) {
        return { ...payment, status: newStatus };
      }
      return payment;
    }));
  };

  const openEditDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    form.reset({
      orderId: payment.orderId,
      amount: payment.amount,
      paymentDate: payment.paymentDate.toISOString().split('T')[0],
      paymentMethod: payment.paymentMethod,
      reference: payment.reference || '',
      description: payment.description || '',
      receiptFile: payment.receiptFile || ''
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmado
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: string, pending: number) => {
    if (status === 'paid') {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Pagado
        </Badge>
      );
    } else if (status === 'partial') {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Parcial
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <XCircle className="h-3 w-3 mr-1" />
          Pendiente
        </Badge>
      );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  const isOverdue = (date: Date) => {
    return new Date() > date;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">
            Gestión de pagos pendientes y realizados
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pago
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
              <DialogDescription>
                Registre un nuevo pago para una orden de compra
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreatePayment)} className="space-y-4">
              <div>
                <Label htmlFor="orderId">Orden de Compra *</Label>
                <Select onValueChange={(value) => form.setValue('orderId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una orden" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingOrders.map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.number} - {order.provider.businessName} 
                        (Pendiente: {formatCurrency(order.amountPending)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.orderId && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.orderId.message}</p>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="amount">Monto *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...form.register('amount', { valueAsNumber: true })}
                    placeholder="Ej: 500000"
                  />
                  {form.formState.errors.amount && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.amount.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="paymentDate">Fecha de Pago *</Label>
                  <Input
                    id="paymentDate"
                    type="date"
                    {...form.register('paymentDate')}
                  />
                  {form.formState.errors.paymentDate && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.paymentDate.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="paymentMethod">Método de Pago *</Label>
                <Select onValueChange={(value) => form.setValue('paymentMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.paymentMethod && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.paymentMethod.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="reference">Referencia</Label>
                <Input
                  id="reference"
                  {...form.register('reference')}
                  placeholder="Ej: TRF-2024-001"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Descripción del pago..."
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Registrar Pago</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumen de Pagos */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Pagado</p>
                <p className="text-2xl font-bold">{formatCurrency(payments.reduce((sum, p) => sum + p.amount, 0))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Pendiente</p>
                <p className="text-2xl font-bold">{formatCurrency(pendingOrders.reduce((sum, o) => sum + o.amountPending, 0))}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Vencidos</p>
                <p className="text-2xl font-bold">
                  {pendingOrders.filter(o => isOverdue(o.scheduledPaymentDate)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Órdenes Pagadas</p>
                <p className="text-2xl font-bold">{purchaseOrders.filter(o => o.paymentStatus === 'paid').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Buscar por orden, proveedor o referencia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="provider">Proveedor</Label>
              <select
                id="provider"
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todos</option>
                {Array.from(new Set(purchaseOrders.map(o => o.provider.id))).map(providerId => {
                  const provider = purchaseOrders.find(o => o.provider.id === providerId)?.provider;
                  return (
                    <option key={providerId} value={providerId}>
                      {provider?.businessName}
                    </option>
                  );
                })}
              </select>
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
                <option value="pending">Pendientes</option>
                <option value="confirmed">Confirmados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Pagos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pagos Registrados ({filteredPayments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.order.number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{payment.order.provider.businessName}</div>
                      <div className="text-sm text-muted-foreground">{payment.order.provider.ruc}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.paymentDate.toLocaleDateString()}</TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.reference || '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(payment)}
                        disabled={payment.status === 'confirmed'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {payment.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(payment.id, 'confirmed')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePayment(payment.id)}
                        disabled={payment.status === 'confirmed'}
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

      {/* Tabla de Órdenes Pendientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Órdenes Pendientes de Pago ({pendingOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pagado</TableHead>
                <TableHead>Pendiente</TableHead>
                <TableHead>Fecha Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id} className={isOverdue(order.scheduledPaymentDate) ? 'bg-red-50' : ''}>
                  <TableCell className="font-medium">{order.number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.provider.businessName}</div>
                      <div className="text-sm text-muted-foreground">{order.provider.ruc}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell className="text-green-600">{formatCurrency(order.amountPaid)}</TableCell>
                  <TableCell className="text-red-600 font-medium">{formatCurrency(order.amountPending)}</TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 ${isOverdue(order.scheduledPaymentDate) ? 'text-red-600' : ''}`}>
                      <Calendar className="h-3 w-3" />
                      {order.scheduledPaymentDate.toLocaleDateString()}
                      {isOverdue(order.scheduledPaymentDate) && (
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(order.paymentStatus, order.amountPending)}</TableCell>
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
            <DialogTitle>Editar Pago</DialogTitle>
            <DialogDescription>
              Modifique los datos del pago
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleEditPayment)} className="space-y-4">
            <div>
              <Label htmlFor="edit-orderId">Orden de Compra *</Label>
              <Select onValueChange={(value) => form.setValue('orderId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una orden" />
                </SelectTrigger>
                <SelectContent>
                  {purchaseOrders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.number} - {order.provider.businessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.orderId && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.orderId.message}</p>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-amount">Monto *</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  step="0.01"
                  {...form.register('amount', { valueAsNumber: true })}
                  placeholder="Ej: 500000"
                />
                {form.formState.errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.amount.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-paymentDate">Fecha de Pago *</Label>
                <Input
                  id="edit-paymentDate"
                  type="date"
                  {...form.register('paymentDate')}
                />
                {form.formState.errors.paymentDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.paymentDate.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-paymentMethod">Método de Pago *</Label>
              <Select onValueChange={(value) => form.setValue('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione método de pago" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.paymentMethod && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.paymentMethod.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-reference">Referencia</Label>
              <Input
                id="edit-reference"
                {...form.register('reference')}
                placeholder="Ej: TRF-2024-001"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                {...form.register('description')}
                placeholder="Descripción del pago..."
                rows={3}
              />
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