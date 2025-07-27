import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Building2,
  Calendar,
  DollarSign,
  Package,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { PurchaseOrder } from '@/types';

interface PurchaseOrderDetailsProps {
  order: PurchaseOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PurchaseOrderDetails({ order, isOpen, onClose }: PurchaseOrderDetailsProps) {
  if (!order) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pre_order':
        return <Badge variant="secondary">Pre-orden</Badge>;
      case 'issued':
        return <Badge variant="default">Emitida</Badge>;
      case 'received':
        return <Badge variant="default">Recibida</Badge>;
      case 'paid':
        return <Badge variant="default">Pagada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default">Pagado</Badge>;
      case 'unpaid':
        return <Badge variant="destructive">Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Orden de Compra: {order.number}
          </DialogTitle>
          <DialogDescription>
            Detalles completos de la orden de compra
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Número de Orden</Label>
                  <p className="text-lg font-bold">{order.number}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado</Label>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Estado de Pago</Label>
                  <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total</Label>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Proveedor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información del Proveedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Razón Social</Label>
                  <p className="font-medium">{order.provider.businessName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">RUC</Label>
                  <p>{order.provider.ruc}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {order.provider.email}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Teléfono</Label>
                  <p>{order.provider.phones[0]}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm font-medium">Dirección</Label>
                  <p>{order.provider.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Fechas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium">Fecha de Creación</Label>
                  <p>{order.creationDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Fecha Estimada de Llegada</Label>
                  <p>{order.estimatedArrivalDate.toLocaleDateString()}</p>
                </div>
                {order.scheduledPaymentDate && (
                  <div>
                    <Label className="text-sm font-medium">Fecha Programada de Pago</Label>
                    <p>{order.scheduledPaymentDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio Unitario</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.code}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.quantity} {item.product.unit}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.unitCost)}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Costos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumen de Costos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IVA (15%):</span>
                  <span className="font-medium">{formatCurrency(order.iva)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-green-600">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estado de Envío */}
          <Card>
            <CardHeader>
              <CardTitle>Estado de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Mail className={`h-4 w-4 ${order.emailSent ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>Email: {order.emailSent ? 'Enviado' : 'Pendiente'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className={`h-4 w-4 ${order.whatsappSent ? 'text-green-600' : 'text-gray-400'}`} />
                  <span>WhatsApp: {order.whatsappSent ? 'Enviado' : 'Pendiente'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fechas de Creación */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Creado el</Label>
                  <p>{order.createdAt.toLocaleDateString()} {order.createdAt.toLocaleTimeString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Última actualización</Label>
                  <p>{order.updatedAt.toLocaleDateString()} {order.updatedAt.toLocaleTimeString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componente Label para evitar errores de importación
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium ${className || ''}`}>{children}</label>;
} 