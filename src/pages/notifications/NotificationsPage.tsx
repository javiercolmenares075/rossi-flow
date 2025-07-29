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
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  DollarSign,
  Calendar,
  Mail,
  MessageSquare,
  Settings
} from 'lucide-react';

// Types
interface Notification {
  id: string;
  type: 'low_stock' | 'expiry' | 'payment' | 'import' | 'manual';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'unread' | 'read';
  relatedEntity?: {
    type: 'product' | 'batch' | 'purchase_order' | 'payment';
    id: string;
    name: string;
  };
  createdAt: Date;
  readAt?: Date;
}

// Mock data
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'low_stock',
    title: 'Stock Bajo - Leche Entera',
    message: 'El producto Leche Entera (LEC-001) tiene stock bajo. Cantidad actual: 50 litros, mínimo: 100 litros',
    priority: 'high',
    status: 'unread',
    relatedEntity: {
      type: 'product',
      id: '1',
      name: 'Leche Entera'
    },
    createdAt: new Date('2024-01-20T10:30:00')
  },
  {
    id: '2',
    type: 'expiry',
    title: 'Vencimiento Próximo - Queso Paraguay',
    message: 'El lote LOT-2024-001 de Queso Paraguay vence en 5 días',
    priority: 'critical',
    status: 'unread',
    relatedEntity: {
      type: 'batch',
      id: '1',
      name: 'LOT-2024-001'
    },
    createdAt: new Date('2024-01-20T09:15:00')
  },
  {
    id: '3',
    type: 'payment',
    title: 'Pago Próximo - Orden OC-2024-001',
    message: 'La orden de compra OC-2024-001 tiene pago programado para mañana',
    priority: 'medium',
    status: 'read',
    relatedEntity: {
      type: 'purchase_order',
      id: '1',
      name: 'OC-2024-001'
    },
    createdAt: new Date('2024-01-19T14:20:00'),
    readAt: new Date('2024-01-19T15:30:00')
  },
  {
    id: '4',
    type: 'manual',
    title: 'Recordatorio - Revisión de Inventario',
    message: 'Recordatorio: Revisión mensual de inventario programada para el 25 de enero',
    priority: 'low',
    status: 'unread',
    createdAt: new Date('2024-01-18T16:45:00')
  }
];

const notificationTypes = [
  { value: 'low_stock', label: 'Stock Bajo', icon: Package },
  { value: 'expiry', label: 'Vencimientos', icon: Calendar },
  { value: 'payment', label: 'Pagos', icon: DollarSign },
  { value: 'import', label: 'Importaciones', icon: Package },
  { value: 'manual', label: 'Manuales', icon: Bell }
];

const priorities = [
  { value: 'low', label: 'Baja', color: 'bg-blue-100 text-blue-800' },
  { value: 'medium', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' }
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus;
  });

  const unreadCount = notifications.filter(n => n.status === 'unread').length;
  const criticalCount = notifications.filter(n => n.priority === 'critical' && n.status === 'unread').length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, status: 'read' as const, readAt: new Date() }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      notification.status === 'unread'
        ? { ...notification, status: 'read' as const, readAt: new Date() }
        : notification
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = priorities.find(p => p.value === priority);
    return (
      <Badge className={priorityConfig?.color}>
        {priorityConfig?.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = notificationTypes.find(t => t.value === type);
    const Icon = typeConfig?.icon || Bell;
    return <Icon className="h-4 w-4" />;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground">
            Gestión de alertas, recordatorios y notificaciones del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSettingsDialogOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configuración
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Notificación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Notificación Manual</DialogTitle>
                <DialogDescription>
                  Cree una notificación manual para recordatorios personalizados
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    placeholder="Título de la notificación"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Mensaje *</Label>
                  <Textarea
                    id="message"
                    placeholder="Descripción detallada..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Crear Notificación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">No Leídas</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Críticas</p>
                <p className="text-2xl font-bold">{criticalCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hoy</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => 
                    n.createdAt.toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
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
                placeholder="Buscar notificaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de notificación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {notificationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="unread">No leídas</SelectItem>
                <SelectItem value="read">Leídas</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              Marcar todas como leídas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notificaciones</CardTitle>
          <CardDescription>
            Gestione todas las notificaciones y alertas del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Notificación</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => (
                  <TableRow key={notification.id} className={notification.status === 'unread' ? 'bg-blue-50' : ''}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(notification.priority)}
                          <div className="font-medium">{notification.title}</div>
                          {notification.status === 'unread' && (
                            <Badge variant="default" className="text-xs">Nueva</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {notification.message}
                        </div>
                        {notification.relatedEntity && (
                          <div className="text-xs text-blue-600">
                            Relacionado: {notification.relatedEntity.name}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(notification.type)}
                        <span className="text-sm">
                          {notificationTypes.find(t => t.value === notification.type)?.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPriorityBadge(notification.priority)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.status === 'unread' ? 'default' : 'secondary'}>
                        {notification.status === 'unread' ? 'No leída' : 'Leída'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(notification.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {notification.status === 'unread' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
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

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configuración de Notificaciones</DialogTitle>
            <DialogDescription>
              Configure las preferencias de notificaciones
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipos de Notificación</Label>
              {notificationTypes.map((type) => (
                <div key={type.value} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(type.value)}
                    <span className="text-sm">{type.label}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Métodos de Notificación</Label>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">WhatsApp</span>
                </div>
                <Switch />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Configuración
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 