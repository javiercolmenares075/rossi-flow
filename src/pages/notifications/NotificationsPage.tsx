import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Package, 
  DollarSign,
  Calendar,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Download,
  Archive
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'stock_low' | 'expiry_warning' | 'payment_due' | 'production_alert' | 'import_alert' | 'manual';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read' | 'archived';
  createdAt: Date;
  readAt?: Date;
  archivedAt?: Date;
  metadata?: {
    productId?: string;
    productName?: string;
    batchId?: string;
    orderId?: string;
    providerName?: string;
    amount?: number;
    daysUntilExpiry?: number;
    currentStock?: number;
    minStock?: number;
  };
}

interface NotificationSettings {
  stockAlerts: boolean;
  expiryAlerts: boolean;
  paymentAlerts: boolean;
  productionAlerts: boolean;
  importAlerts: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  lowStockThreshold: number;
  expiryWarningDays: number;
  paymentReminderDays: number;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'stock_low',
    title: 'Stock Bajo - Leche Entera',
    message: 'El producto Leche Entera (LEC-001) tiene stock bajo. Actual: 50 litros, Mínimo: 100 litros',
    priority: 'high',
    status: 'unread',
    createdAt: new Date('2024-01-25T10:30:00'),
    metadata: {
      productId: '1',
      productName: 'Leche Entera',
      currentStock: 50,
      minStock: 100
    }
  },
  {
    id: '2',
    type: 'expiry_warning',
    title: 'Vencimiento Próximo - Queso Paraguay',
    message: 'El lote QUE-2024-001 de Queso Paraguay vence en 5 días',
    priority: 'medium',
    status: 'unread',
    createdAt: new Date('2024-01-25T09:15:00'),
    metadata: {
      productId: '2',
      productName: 'Queso Paraguay',
      batchId: 'QUE-2024-001',
      daysUntilExpiry: 5
    }
  },
  {
    id: '3',
    type: 'payment_due',
    title: 'Pago Vencido - Lácteos del Sur S.A.',
    message: 'La orden OC-2024-001 tiene un pago vencido de ₲750,000',
    priority: 'critical',
    status: 'unread',
    createdAt: new Date('2024-01-25T08:45:00'),
    metadata: {
      orderId: 'OC-2024-001',
      providerName: 'Lácteos del Sur S.A.',
      amount: 750000
    }
  },
  {
    id: '4',
    type: 'production_alert',
    title: 'Producción Completada - Yogur Natural',
    message: 'La orden de producción OP-2024-002 ha sido completada exitosamente',
    priority: 'low',
    status: 'read',
    createdAt: new Date('2024-01-24T16:20:00'),
    readAt: new Date('2024-01-24T16:25:00'),
    metadata: {
      productName: 'Yogur Natural'
    }
  },
  {
    id: '5',
    type: 'import_alert',
    title: 'Importación Programada - Cultivo Láctico',
    message: 'Se ha programado la importación de cultivo láctico para mañana',
    priority: 'medium',
    status: 'read',
    createdAt: new Date('2024-01-24T14:30:00'),
    readAt: new Date('2024-01-24T15:00:00'),
    metadata: {
      productName: 'Cultivo Láctico'
    }
  },
  {
    id: '6',
    type: 'manual',
    title: 'Recordatorio - Inventario Mensual',
    message: 'Recordatorio: Realizar inventario físico mensual el próximo lunes',
    priority: 'medium',
    status: 'unread',
    createdAt: new Date('2024-01-24T12:00:00')
  }
];

const mockSettings: NotificationSettings = {
  stockAlerts: true,
  expiryAlerts: true,
  paymentAlerts: true,
  productionAlerts: true,
  importAlerts: true,
  emailNotifications: true,
  pushNotifications: false,
  lowStockThreshold: 20,
  expiryWarningDays: 7,
  paymentReminderDays: 3
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'manual' as Notification['type'],
    priority: 'medium' as Notification['priority']
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && n.status === 'unread').length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'read', readAt: new Date() }
        : notification
    ));
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'unread', readAt: undefined }
        : notification
    ));
  };

  const handleArchive = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'archived', archivedAt: new Date() }
        : notification
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleCreateNotification = () => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      type: newNotification.type,
      title: newNotification.title,
      message: newNotification.message,
      priority: newNotification.priority,
      status: 'unread',
      createdAt: new Date()
    };
    
    setNotifications([newNotif, ...notifications]);
    setNewNotification({ title: '', message: '', type: 'manual', priority: 'medium' });
    setIsCreateDialogOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      notification.status === 'unread' 
        ? { ...notification, status: 'read', readAt: new Date() }
        : notification
    ));
  };

  const handleArchiveAll = () => {
    setNotifications(notifications.map(notification => 
      notification.status === 'read' 
        ? { ...notification, status: 'archived', archivedAt: new Date() }
        : notification
    ));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Crítico
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            Alto
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Medio
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Bajo
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
      case 'payment_due':
        return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'production_alert':
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'import_alert':
        return <Package className="h-4 w-4 text-purple-500" />;
      case 'manual':
        return <Bell className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'stock_low':
        return 'Stock Bajo';
      case 'expiry_warning':
        return 'Vencimiento';
      case 'payment_due':
        return 'Pago';
      case 'production_alert':
        return 'Producción';
      case 'import_alert':
        return 'Importación';
      case 'manual':
        return 'Manual';
      default:
        return 'Otro';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unread':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Eye className="h-3 w-3 mr-1" />
            No Leída
          </Badge>
        );
      case 'read':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-600">
            <EyeOff className="h-3 w-3 mr-1" />
            Leída
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-500">
            <Archive className="h-3 w-3 mr-1" />
            Archivada
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground">
            Sistema de alertas y notificaciones inteligentes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Marcar Todo como Leído
          </Button>
          <Button variant="outline" onClick={handleArchiveAll}>
            <Archive className="h-4 w-4 mr-2" />
            Archivar Leídas
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Notificación
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Notificación Manual</DialogTitle>
                <DialogDescription>
                  Cree una notificación manual para recordatorios
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    placeholder="Título de la notificación"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mensaje</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    rows={3}
                    placeholder="Mensaje de la notificación"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({...newNotification, type: e.target.value as Notification['type']})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="manual">Manual</option>
                      <option value="stock_low">Stock Bajo</option>
                      <option value="expiry_warning">Vencimiento</option>
                      <option value="payment_due">Pago</option>
                      <option value="production_alert">Producción</option>
                      <option value="import_alert">Importación</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prioridad</label>
                    <select
                      value={newNotification.priority}
                      onChange={(e) => setNewNotification({...newNotification, priority: e.target.value as Notification['priority']})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateNotification}>
                  Crear Notificación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Configuración
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configuración de Notificaciones</DialogTitle>
                <DialogDescription>
                  Configure las preferencias de notificaciones
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tipos de Alertas</label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="stockAlerts"
                        checked={settings.stockAlerts}
                        onChange={(e) => setSettings({...settings, stockAlerts: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="stockAlerts">Alertas de stock bajo</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="expiryAlerts"
                        checked={settings.expiryAlerts}
                        onChange={(e) => setSettings({...settings, expiryAlerts: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="expiryAlerts">Alertas de vencimiento</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="paymentAlerts"
                        checked={settings.paymentAlerts}
                        onChange={(e) => setSettings({...settings, paymentAlerts: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="paymentAlerts">Alertas de pagos</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="productionAlerts"
                        checked={settings.productionAlerts}
                        onChange={(e) => setSettings({...settings, productionAlerts: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="productionAlerts">Alertas de producción</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="importAlerts"
                        checked={settings.importAlerts}
                        onChange={(e) => setSettings({...settings, importAlerts: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="importAlerts">Alertas de importación</label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Métodos de Notificación</label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emailNotifications"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="emailNotifications">Notificaciones por email</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="pushNotifications"
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="pushNotifications">Notificaciones push</label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">Umbral Stock Bajo (%)</label>
                    <input
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => setSettings({...settings, lowStockThreshold: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Días Antes Vencimiento</label>
                    <input
                      type="number"
                      value={settings.expiryWarningDays}
                      onChange={(e) => setSettings({...settings, expiryWarningDays: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Recordatorio Pagos (días)</label>
                    <input
                      type="number"
                      value={settings.paymentReminderDays}
                      onChange={(e) => setSettings({...settings, paymentReminderDays: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsSettingsDialogOpen(false)}>
                  Guardar Configuración
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumen de Notificaciones */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">No Leídas</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
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
                <p className="text-2xl font-bold">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Leídas</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'read').length}</p>
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
                  placeholder="Buscar en notificaciones..."
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
                <option value="payment_due">Pago</option>
                <option value="production_alert">Producción</option>
                <option value="import_alert">Importación</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Prioridad</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
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
                <option value="unread">No Leídas</option>
                <option value="read">Leídas</option>
                <option value="archived">Archivadas</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones ({filteredNotifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg ${
                  notification.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{notification.title}</h3>
                        {getPriorityBadge(notification.priority)}
                        {getStatusBadge(notification.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{getTypeLabel(notification.type)}</span>
                        <span>{notification.createdAt.toLocaleString()}</span>
                        {notification.metadata?.productName && (
                          <span>Producto: {notification.metadata.productName}</span>
                        )}
                        {notification.metadata?.amount && (
                          <span>Monto: ₲{notification.metadata.amount.toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {notification.status === 'unread' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsUnread(notification.id)}
                      >
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchive(notification.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay notificaciones que coincidan con los filtros</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 