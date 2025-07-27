import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Bell, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Repeat,
  AlertCircle,
  Info
} from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  type: 'manual' | 'scheduled' | 'recurring';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'completed' | 'cancelled';
  dueDate: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'none';
  assignedTo?: string;
  category: 'inventory' | 'production' | 'payment' | 'maintenance' | 'general';
  metadata?: {
    productId?: string;
    productName?: string;
    orderId?: string;
    providerName?: string;
  };
}

// Mock data
const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Revisar Stock de Leche Entera',
    description: 'Verificar stock disponible y programar reposición si es necesario',
    type: 'manual',
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2024-01-26T10:00:00'),
    category: 'inventory',
    metadata: {
      productId: '1',
      productName: 'Leche Entera'
    }
  },
  {
    id: '2',
    title: 'Pago a Lácteos del Sur S.A.',
    description: 'Realizar pago de la orden OC-2024-001 por ₲750,000',
    type: 'scheduled',
    priority: 'critical',
    status: 'pending',
    dueDate: new Date('2024-01-27T14:00:00'),
    category: 'payment',
    metadata: {
      orderId: 'OC-2024-001',
      providerName: 'Lácteos del Sur S.A.'
    }
  },
  {
    id: '3',
    title: 'Mantenimiento de Equipos',
    description: 'Revisión mensual de equipos de producción',
    type: 'recurring',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date('2024-01-30T08:00:00'),
    recurrence: 'monthly',
    category: 'maintenance'
  },
  {
    id: '4',
    title: 'Control de Calidad - Yogur Natural',
    description: 'Realizar control de calidad del lote YOG-2024-001',
    type: 'manual',
    priority: 'high',
    status: 'completed',
    dueDate: new Date('2024-01-25T09:00:00'),
    completedAt: new Date('2024-01-25T11:30:00'),
    category: 'production',
    metadata: {
      productName: 'Yogur Natural'
    }
  },
  {
    id: '5',
    title: 'Inventario Físico Mensual',
    description: 'Realizar conteo físico de todos los productos en almacén',
    type: 'recurring',
    priority: 'high',
    status: 'pending',
    dueDate: new Date('2024-02-01T08:00:00'),
    recurrence: 'monthly',
    category: 'inventory'
  },
  {
    id: '6',
    title: 'Renovación de Contrato - Proveedor A',
    description: 'Revisar y renovar contrato con proveedor principal',
    type: 'scheduled',
    priority: 'medium',
    status: 'cancelled',
    dueDate: new Date('2024-01-28T16:00:00'),
    cancelledAt: new Date('2024-01-26T10:00:00'),
    category: 'general'
  }
];

export function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    type: 'manual' as Reminder['type'],
    priority: 'medium' as Reminder['priority'],
    category: 'general' as Reminder['category'],
    dueDate: '',
    recurrence: 'none' as Reminder['recurrence']
  });

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const overdueReminders = reminders.filter(r => r.status === 'pending' && r.dueDate < new Date());
  const completedReminders = reminders.filter(r => r.status === 'completed');

  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reminder.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || reminder.type === filterType;
    const matchesPriority = filterPriority === 'all' || reminder.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || reminder.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || reminder.category === filterCategory;
    
    return matchesSearch && matchesType && matchesPriority && matchesStatus && matchesCategory;
  });

  const handleComplete = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, status: 'completed', completedAt: new Date() }
        : reminder
    ));
  };

  const handleCancel = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id 
        ? { ...reminder, status: 'cancelled', cancelledAt: new Date() }
        : reminder
    ));
  };

  const handleDelete = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
  };

  const handleCreateReminder = () => {
    const newRem: Reminder = {
      id: `reminder-${Date.now()}`,
      title: newReminder.title,
      description: newReminder.description,
      type: newReminder.type,
      priority: newReminder.priority,
      status: 'pending',
      dueDate: new Date(newReminder.dueDate),
      category: newReminder.category,
      recurrence: newReminder.recurrence
    };
    
    setReminders([newRem, ...reminders]);
    setNewReminder({ 
      title: '', 
      description: '', 
      type: 'manual', 
      priority: 'medium', 
      category: 'general',
      dueDate: '',
      recurrence: 'none'
    });
    setIsCreateDialogOpen(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Crítico
          </Badge>
        );
      case 'high':
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            <AlertCircle className="h-3 w-3 mr-1" />
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
            <Info className="h-3 w-3 mr-1" />
            Bajo
          </Badge>
        );
      default:
        return null;
    }
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
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-600">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'manual':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Manual
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Programado
          </Badge>
        );
      case 'recurring':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            <Repeat className="h-3 w-3 mr-1" />
            Recurrente
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'inventory':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Inventario
          </Badge>
        );
      case 'production':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Producción
          </Badge>
        );
      case 'payment':
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800">
            Pago
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Mantenimiento
          </Badge>
        );
      case 'general':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            General
          </Badge>
        );
      default:
        return null;
    }
  };

  const isOverdue = (dueDate: Date) => {
    return dueDate < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recordatorios</h1>
          <p className="text-muted-foreground">
            Gestión de recordatorios y tareas programadas
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Recordatorio
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Recordatorio</DialogTitle>
                <DialogDescription>
                  Configure un nuevo recordatorio o tarea programada
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    placeholder="Título del recordatorio"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descripción</label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md"
                    rows={3}
                    placeholder="Descripción del recordatorio"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <select
                      value={newReminder.type}
                      onChange={(e) => setNewReminder({...newReminder, type: e.target.value as Reminder['type']})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="manual">Manual</option>
                      <option value="scheduled">Programado</option>
                      <option value="recurring">Recurrente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Prioridad</label>
                    <select
                      value={newReminder.priority}
                      onChange={(e) => setNewReminder({...newReminder, priority: e.target.value as Reminder['priority']})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoría</label>
                    <select
                      value={newReminder.category}
                      onChange={(e) => setNewReminder({...newReminder, category: e.target.value as Reminder['category']})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    >
                      <option value="general">General</option>
                      <option value="inventory">Inventario</option>
                      <option value="production">Producción</option>
                      <option value="payment">Pago</option>
                      <option value="maintenance">Mantenimiento</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Fecha de Vencimiento</label>
                    <input
                      type="datetime-local"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder({...newReminder, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  </div>
                  {newReminder.type === 'recurring' && (
                    <div>
                      <label className="text-sm font-medium">Recurrencia</label>
                      <select
                        value={newReminder.recurrence}
                        onChange={(e) => setNewReminder({...newReminder, recurrence: e.target.value as Reminder['recurrence']})}
                        className="w-full px-3 py-2 border border-input rounded-md"
                      >
                        <option value="daily">Diaria</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensual</option>
                        <option value="yearly">Anual</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateReminder}>
                  Crear Recordatorio
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumen de Recordatorios */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pendientes</p>
                <p className="text-2xl font-bold">{pendingReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Vencidos</p>
                <p className="text-2xl font-bold">{overdueReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completados</p>
                <p className="text-2xl font-bold">{completedReminders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Recurrentes</p>
                <p className="text-2xl font-bold">{reminders.filter(r => r.type === 'recurring').length}</p>
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
                  placeholder="Buscar en recordatorios..."
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
                <option value="manual">Manual</option>
                <option value="scheduled">Programado</option>
                <option value="recurring">Recurrente</option>
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
                <option value="pending">Pendientes</option>
                <option value="completed">Completados</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Categoría</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todas</option>
                <option value="inventory">Inventario</option>
                <option value="production">Producción</option>
                <option value="payment">Pago</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Recordatorios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recordatorios ({filteredReminders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReminders.map((reminder) => (
                <TableRow 
                  key={reminder.id} 
                  className={isOverdue(reminder.dueDate) && reminder.status === 'pending' ? 'bg-red-50' : ''}
                >
                  <TableCell className="font-medium">{reminder.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-md">
                    {reminder.description}
                  </TableCell>
                  <TableCell>{getTypeBadge(reminder.type)}</TableCell>
                  <TableCell>{getPriorityBadge(reminder.priority)}</TableCell>
                  <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                  <TableCell>{getCategoryBadge(reminder.category)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {reminder.dueDate.toLocaleString()}
                      {isOverdue(reminder.dueDate) && reminder.status === 'pending' && (
                        <Badge variant="destructive" className="text-xs">
                          Vencido
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {reminder.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleComplete(reminder.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {reminder.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancel(reminder.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredReminders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay recordatorios que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 