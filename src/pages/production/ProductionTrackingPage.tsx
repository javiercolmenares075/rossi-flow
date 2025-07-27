import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play,
  CheckCircle,
  Clock,
  Package,
  Factory,
  Target
} from 'lucide-react';

export function ProductionTrackingPage() {
  const [orders] = useState([
    {
      id: '1',
      number: 'PO-2024-001',
      recipe: 'Queso Paraguay Tradicional',
      quantity: 100,
      responsible: 'Juan Pérez',
      status: 'in_progress',
      priority: 'high',
      progress: 65,
      startDate: '2024-01-15',
      expectedEndDate: '2024-01-20'
    },
    {
      id: '2',
      number: 'PO-2024-002',
      recipe: 'Yogur Natural',
      quantity: 200,
      responsible: 'María González',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      startDate: '2024-01-16',
      expectedEndDate: '2024-01-18'
    }
  ]);

  const stats = {
    total: orders.length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    averageProgress: Math.round(orders.reduce((sum, o) => sum + o.progress, 0) / orders.length)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendiente</Badge>;
      case 'in_progress':
        return <Badge variant="default">En Progreso</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="default">Media</Badge>;
      case 'low':
        return <Badge variant="secondary">Baja</Badge>;
      default:
        return <Badge variant="outline">Desconocida</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seguimiento de Producción</h1>
          <p className="text-muted-foreground">
            Control y seguimiento de órdenes de producción en tiempo real
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Play className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.averageProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Producción</CardTitle>
          <CardDescription>
            {orders.length} órdenes encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{order.number}</h3>
                    <p className="text-sm text-muted-foreground">{order.recipe}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(order.status)}
                    {getPriorityBadge(order.priority)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Cantidad</p>
                    <p className="text-sm">{order.quantity} Kg</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Responsable</p>
                    <p className="text-sm">{order.responsible}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Inicio</p>
                    <p className="text-sm">{order.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fin Esperado</p>
                    <p className="text-sm">{order.expectedEndDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Progress value={order.progress} className="flex-1" />
                  <span className="text-sm font-medium">{order.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 