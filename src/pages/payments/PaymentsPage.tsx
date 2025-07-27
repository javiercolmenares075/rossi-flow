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
  DollarSign,
  Calendar,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  Upload,
  Eye
} from 'lucide-react';

// Validation schema for payment
const paymentSchema = z.object({
  orderId: z.string().min(1, 'Debe seleccionar una orden'),
  amount: z.number().min(0.01, 'El monto debe ser mayor a 0'),
  paymentDate: z.string().min(1, 'La fecha de pago es obligatoria'),
  paymentType: z.enum(['cash', 'transfer', 'check', 'card']),
  reference: z.string().optional(),
  description: z.string().optional(),
  receiptFile: z.string().optional()
});

type PaymentFormData = z.infer<typeof paymentSchema>;

// Mock data for development
const mockPendingOrders = [
  {
    id: '1',
    orderNumber: 'OC-2024-001',
    providerName: 'Lácteos del Sur S.A.',
    total: 1437500,
    status: 'pending',
    paymentDate: new Date('2024-02-15'),
    orderDate: new Date('2024-01-15'),
    remainingAmount: 1437500
  },
  {
    id: '2',
    orderNumber: 'OC-2024-002',
    providerName: 'Granja San Miguel',
    total: 1725000,
    status: 'partial',
    paymentDate: new Date('2024-02-18'),
    orderDate: new Date('2024-01-18'),
    remainingAmount: 725000
  },
  {
    id: '3',
    orderNumber: 'OC-2024-003',
    providerName: 'Distribuidora Central',
    total: 2100000,
    status: 'pending',
    paymentDate: new Date('2024-01-30'),
    orderDate: new Date('2024-01-10'),
    remainingAmount: 2100000
  }
];

const mockPayments = [
  {
    id: '1',
    orderId: '1',
    orderNumber: 'OC-2024-001',
    amount: 1437500,
    paymentDate: new Date('2024-02-10'),
    paymentType: 'transfer',
    reference: 'TRF-2024-001',
    description: 'Pago completo de orden OC-2024-001',
    receiptFile: 'comprobante_oc_001.pdf',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '2',
    orderId: '2',
    orderNumber: 'OC-2024-002',
    amount: 1000000,
    paymentDate: new Date('2024-02-05'),
    paymentType: 'check',
    reference: 'CHK-2024-001',
    description: 'Pago parcial de orden OC-2024-002',
    receiptFile: 'comprobante_oc_002.pdf',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  }
];

const paymentTypes = [
  { value: 'cash', label: 'Efectivo' },
  { value: 'transfer', label: 'Transferencia' },
  { value: 'check', label: 'Cheque' },
  { value: 'card', label: 'Tarjeta' }
];

export function PaymentsPage() {
  const [pendingOrders, setPendingOrders] = useState(mockPendingOrders);
  const [payments, setPayments] = useState(mockPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPaymentType, setFilterPaymentType] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentType: 'transfer',
      paymentDate: new Date().toISOString().split('T')[0]
    }
  });

  const editForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema)
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  const getDaysUntilPayment = (paymentDate: Date) => {
    const today = new Date();
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPaymentStatusBadge = (order: any) => {
    const daysUntil = getDaysUntilPayment(order.paymentDate);
    
    if (order.status === 'paid') {
      return <Badge variant="default">Pagado</Badge>;
    } else if (order.status === 'partial') {
      return <Badge variant="secondary">Parcial</Badge>;
    } else if (daysUntil < 0) {
      return <Badge variant="destructive">Vencido</Badge>;
    } else if (daysUntil <= 7) {
      return <Badge variant="destructive">Próximo ({daysUntil} días)</Badge>;
    } else {
      return <Badge variant="outline">Pendiente ({daysUntil} días)</Badge>;
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    const paymentType = paymentTypes.find(t => t.value === type);
    return (
      <Badge variant="outline">
        {paymentType?.label || type}
      </Badge>
    );
  };

  const totalPending = pendingOrders.reduce((sum, order) => {
    if (order.status !== 'paid') return sum + order.remainingAmount;
    return sum;
  }, 0);

  const overdueOrders = pendingOrders.filter(order => getDaysUntilPayment(order.paymentDate) < 0).length;
  const upcomingOrders = pendingOrders.filter(order => {
    const days = getDaysUntilPayment(order.paymentDate);
    return days >= 0 && days <= 7;
  }).length;

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPaymentType = filterPaymentType === 'all' || payment.paymentType === filterPaymentType;
    
    return matchesSearch && matchesPaymentType;
  });

  const handleCreatePayment = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      const order = pendingOrders.find(o => o.id === data.orderId);
      if (!order) return;

      const newPayment = {
        id: Date.now().toString(),
        ...data,
        orderNumber: order.orderNumber,
        paymentDate: new Date(data.paymentDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setPayments([...payments, newPayment]);

      // Update order status
      const updatedOrders = pendingOrders.map(o => {
        if (o.id === data.orderId) {
          const newRemaining = o.remainingAmount - data.amount;
          return {
            ...o,
            remainingAmount: Math.max(0, newRemaining),
            status: newRemaining <= 0 ? 'paid' : 'partial'
          };
        }
        return o;
      });
      setPendingOrders(updatedOrders);

      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      console.error('Error creating payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPayment = async (data: PaymentFormData) => {
    if (!selectedPayment) return;
    
    setIsSubmitting(true);
    try {
      const updatedPayment = {
        ...selectedPayment,
        ...data,
        paymentDate: new Date(data.paymentDate),
        updatedAt: new Date()
      };
      setPayments(payments.map(p => p.id === selectedPayment.id ? updatedPayment : p));
      setIsEditDialogOpen(false);
      setSelectedPayment(null);
      editForm.reset();
    } catch (error) {
      console.error('Error updating payment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (payment: any) => {
    setSelectedPayment(payment);
    editForm.reset({
      orderId: payment.orderId,
      amount: payment.amount,
      paymentDate: payment.paymentDate.toISOString().split('T')[0],
      paymentType: payment.paymentType,
      reference: payment.reference,
      description: payment.description
    });
    setIsEditDialogOpen(true);
  };

  const handleDeletePayment = (id: string) => {
    setPayments(payments.filter(payment => payment.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pagos</h1>
          <p className="text-muted-foreground">
            Gestión de pagos a proveedores y control de cuentas por pagar
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
              <DialogDescription>
                Complete la información del pago. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreatePayment)} className="space-y-4">
              <div>
                <Label htmlFor="orderId">Orden de Compra *</Label>
                <Select 
                  value={createForm.watch('orderId')} 
                  onValueChange={(value) => createForm.setValue('orderId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una orden" />
                  </SelectTrigger>
                  <SelectContent>
                    {pendingOrders.filter(order => order.status !== 'paid').map(order => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.orderNumber} - {order.providerName} ({formatCurrency(order.remainingAmount)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.orderId && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.orderId.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="amount">Monto (₲) *</Label>
                <Input
                  {...createForm.register('amount', { valueAsNumber: true })}
                  type="number"
                  placeholder="0"
                />
                {createForm.formState.errors.amount && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="paymentDate">Fecha de Pago *</Label>
                <Input
                  {...createForm.register('paymentDate')}
                  type="date"
                />
                {createForm.formState.errors.paymentDate && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.paymentDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="paymentType">Tipo de Pago *</Label>
                <Select 
                  value={createForm.watch('paymentType')} 
                  onValueChange={(value) => createForm.setValue('paymentType', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {createForm.formState.errors.paymentType && (
                  <p className="text-sm text-destructive mt-1">
                    {createForm.formState.errors.paymentType.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="reference">Referencia</Label>
                <Input
                  {...createForm.register('reference')}
                  placeholder="Número de transferencia, cheque, etc."
                />
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  {...createForm.register('description')}
                  placeholder="Descripción opcional del pago"
                />
              </div>

              <div>
                <Label htmlFor="receiptFile">Comprobante</Label>
                <div className="flex items-center gap-2">
                  <Input
                    {...createForm.register('receiptFile')}
                    placeholder="Nombre del archivo"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendiente</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPending)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingOrders.filter(order => order.status !== 'paid').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {overdueOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas a Vencer</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {upcomingOrders}
            </div>
          </CardContent>
        </Card>
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
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por orden, referencia..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filterPaymentType">Tipo de Pago</Label>
              <Select value={filterPaymentType} onValueChange={setFilterPaymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {paymentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes Pendientes de Pago</CardTitle>
          <CardDescription>
            Órdenes de compra con pagos pendientes o parciales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Pendiente</TableHead>
                <TableHead>Estado de Pago</TableHead>
                <TableHead>Fecha de Pago</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.orderDate.toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.providerName}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatCurrency(order.total)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-destructive">
                      {formatCurrency(order.remainingAmount)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.paymentDate.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
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
        </CardContent>
      </Card>

      {/* Payments History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
          <CardDescription>
            Registro de todos los pagos realizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Comprobante</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="font-medium">{payment.orderNumber}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatCurrency(payment.amount)}</div>
                  </TableCell>
                  <TableCell>
                    {getPaymentTypeBadge(payment.paymentType)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {payment.paymentDate.toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {payment.reference || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payment.receiptFile && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(payment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeletePayment(payment.id)}>
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
            <DialogTitle>Editar Pago</DialogTitle>
            <DialogDescription>
              Modifique la información del pago seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditPayment)} className="space-y-4">
            <div>
              <Label htmlFor="edit-amount">Monto (₲) *</Label>
              <Input
                {...editForm.register('amount', { valueAsNumber: true })}
                type="number"
                placeholder="0"
              />
              {editForm.formState.errors.amount && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-paymentDate">Fecha de Pago *</Label>
              <Input
                {...editForm.register('paymentDate')}
                type="date"
              />
              {editForm.formState.errors.paymentDate && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.paymentDate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-paymentType">Tipo de Pago *</Label>
              <Select 
                value={editForm.watch('paymentType')} 
                onValueChange={(value) => editForm.setValue('paymentType', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.formState.errors.paymentType && (
                <p className="text-sm text-destructive mt-1">
                  {editForm.formState.errors.paymentType.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-reference">Referencia</Label>
              <Input
                {...editForm.register('reference')}
                placeholder="Número de transferencia, cheque, etc."
              />
            </div>

            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                {...editForm.register('description')}
                placeholder="Descripción opcional del pago"
              />
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