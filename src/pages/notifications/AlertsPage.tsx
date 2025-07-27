import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  AlertTriangle, 
  Package, 
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Filter,
  Search,
  RefreshCw,
  Bell,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'stock_low' | 'expiry_warning' | 'payment_overdue' | 'production_delay' | 'import_issue' | 'system_error';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: Date;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  metadata?: {
    productId?: string;
    productName?: string;
    currentStock?: number;
    minStock?: number;
    daysUntilExpiry?: number;
    orderId?: string;
    amount?: number;
    providerName?: string;
  };
}

// Mock data
const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'stock_low',
    title: 'Stock Crítico - Leche Entera',
    description: 'El producto Leche Entera tiene stock críticamente bajo. Actual: 25 litros, Mínimo: 100 litros',
    severity: 'critical',
    status: 'active',
    createdAt: new Date('2024-01-25T10:30:00'),
    metadata: {
      productId: '1',
      productName: 'Leche Entera',
      currentStock: 25,
      minStock: 100
    }
  },
  {
    id: '2',
    type: 'expiry_warning',
    title: 'Vencimiento Inminente - Queso Paraguay',
    description: 'El lote QUE-2024-001 vence en 2 días. Stock restante: 15 kg',
    severity: 'high',
    status: 'acknowledged',
    createdAt: new Date('2024-01-25T09:15:00'),
    acknowledgedAt: new Date('2024-01-25T11:00:00'),
    metadata: {
      productId: '2',
      productName: 'Queso Paraguay',
      daysUntilExpiry: 2
    }
  },
  {
    id: '3',
    type: 'payment_overdue',
    title: 'Pago Vencido - Lácteos del Sur S.A.',
    description: 'La orden OC-2024-001 tiene un pago vencido de ₲750,000 desde hace 3 días',
    severity: 'critical',
    status: 'active',
    createdAt: new Date('2024-01-22T08:45:00'),
    metadata: {
      orderId: 'OC-2024-001',
      providerName: 'Lácteos del Sur S.A.',
      amount: 750000
    }
  },
  {
    id: '4',
    type: 'production_delay',
    title: 'Retraso en Producción - Yogur Natural',
    description: 'La orden de producción OP-2024-002 está retrasada por 2 días',
    severity: 'medium',
    status: 'resolved',
    createdAt: new Date('2024-01-20T14:30:00'),
    resolvedAt: new Date('2024-01-23T16:00:00'),
    metadata: {
      productName: 'Yogur Natural'
    }
  },
  {
    id: '5',
    type: 'import_issue',
    title: 'Problema con Importación - Cultivo Láctico',
    description: 'La importación de cultivo láctico se retrasó por problemas aduaneros',
    severity: 'high',
    status: 'acknowledged',
    createdAt: new Date('2024-01-24T12:00:00'),
    acknowledgedAt: new Date('2024-01-24T15:30:00'),
    metadata: {
      productName: 'Cultivo Láctico'
    }
  }
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' && alert.status === 'active');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || alert.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    
    return matchesSearch && matchesType && matchesSeverity && matchesStatus;
  });

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: 'acknowledged', acknowledgedAt: new Date() }
        : alert
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id 
        ? { ...alert, status: 'resolved', resolvedAt: new Date() }
        : alert
    ));
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Crítico
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Alto
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Medio
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Bell className="h-3 w-3 mr-1" />
            Bajo
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        );
      case 'acknowledged':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Reconocido
          </Badge>
        );
      case 'resolved':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Resuelto
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stock_low':
        return <Package className="h-4 w-4 text-red-500" />;
      case 'expiry_warning':
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case 'payment_overdue':
        return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'production_delay':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'import_issue':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'system_error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stock_low':
        return 'Stock Bajo';
      case 'expiry_warning':
        return 'Vencimiento';
      case 'payment_overdue':
        return 'Pago Vencido';
      case 'production_delay':
        return 'Retraso Producción';
      case 'import_issue':
        return 'Problema Importación';
      case 'system_error':
        return 'Error Sistema';
      default:
        return 'Otro';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alertas del Sistema</h1>
          <p className="text-muted-foreground">
            Gestión de alertas críticas y advertencias del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
        </div>
      </div>

      {/* Resumen de Alertas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Alertas Activas</p>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Críticas</p>
                <p className="text-2xl font-bold">{criticalAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Reconocidas</p>
                <p className="text-2xl font-bold">{alerts.filter(a => a.status === 'acknowledged').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Resueltas</p>
                <p className="text-2xl font-bold">{resolvedAlerts.length}</p>
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
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar en alertas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-input rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todos</option>
                <option value="stock_low">Stock Bajo</option>
                <option value="expiry_warning">Vencimiento</option>
                <option value="payment_overdue">Pago Vencido</option>
                <option value="production_delay">Retraso Producción</option>
                <option value="import_issue">Problema Importación</option>
                <option value="system_error">Error Sistema</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Severidad</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todas</option>
                <option value="critical">Crítica</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todos</option>
                <option value="active">Activas</option>
                <option value="acknowledged">Reconocidas</option>
                <option value="resolved">Resueltas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas del Sistema ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Alerta</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className={alert.status === 'active' ? 'bg-red-50' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(alert.type)}
                      <span className="text-sm">{getTypeLabel(alert.type)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{alert.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-md">
                    {alert.description}
                  </TableCell>
                  <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                  <TableCell>{getStatusBadge(alert.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {alert.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {alert.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      )}
                      {alert.status !== 'resolved' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResolve(alert.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(alert.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay alertas que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 