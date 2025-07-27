import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  Factory,
  Warehouse,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for dashboard
const dashboardStats = {
  totalProducts: 45,
  activeProducts: 42,
  lowStockProducts: 8,
  expiringProducts: 3,
  totalOrders: 156,
  pendingOrders: 12,
  completedOrders: 144,
  totalPayments: 89,
  pendingPayments: 5,
  completedPayments: 84,
  totalRevenue: 125000000,
  monthlyRevenue: 15000000,
  revenueGrowth: 12.5,
  totalInventory: 2500000,
  inventoryGrowth: -2.3
};

const recentActivities = [
  {
    id: '1',
    type: 'order_created',
    title: 'Nueva Orden de Compra',
    description: 'Orden OC-2024-025 creada para Lácteos del Sur',
    time: 'Hace 2 horas',
    status: 'pending'
  },
  {
    id: '2',
    type: 'stock_low',
    title: 'Stock Bajo Detectado',
    description: 'Leche Entera (LEC-001) bajo el mínimo',
    time: 'Hace 4 horas',
    status: 'warning'
  },
  {
    id: '3',
    type: 'payment_received',
    title: 'Pago Recibido',
    description: 'Pago de ₲750,000 para orden OC-2024-020',
    time: 'Hace 6 horas',
    status: 'success'
  },
  {
    id: '4',
    type: 'product_expiring',
    title: 'Producto por Vencer',
    description: 'Queso Paraguay (LOT-2024-003) vence en 3 días',
    time: 'Hace 8 horas',
    status: 'warning'
  },
  {
    id: '5',
    type: 'production_completed',
    title: 'Producción Completada',
    description: 'Orden de producción OP-2024-015 finalizada',
    time: 'Hace 1 día',
    status: 'success'
  }
];

const quickActions = [
  {
    title: 'Nueva Orden de Compra',
    description: 'Crear orden de compra',
    icon: ShoppingCart,
    href: '/purchase-orders/new',
    color: 'bg-blue-500'
  },
  {
    title: 'Registrar Movimiento',
    description: 'Entrada/salida de inventario',
    icon: Package,
    href: '/inventory/movements',
    color: 'bg-green-500'
  },
  {
    title: 'Registrar Pago',
    description: 'Registrar pago a proveedor',
    icon: DollarSign,
    href: '/payments/new',
    color: 'bg-purple-500'
  },
  {
    title: 'Nueva Orden de Producción',
    description: 'Crear orden de producción',
    icon: Factory,
    href: '/production/orders',
    color: 'bg-orange-500'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-blue-600" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'success':
      return <Badge variant="default" className="bg-green-100 text-green-800">Completado</Badge>;
    case 'warning':
      return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    case 'error':
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="secondary">En Proceso</Badge>;
  }
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG'
  }).format(amount);
};

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen general del sistema de inventarios
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Notificaciones
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Acción Rápida
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.activeProducts} activos
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">
                {dashboardStats.lowStockProducts} bajo stock
              </Badge>
              <Badge variant="default" className="bg-yellow-100 text-yellow-800 text-xs">
                {dashboardStats.expiringProducts} por vencer
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes de Compra</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.completedOrders} completadas
            </p>
            <div className="mt-2">
              <Badge variant="default" className="bg-orange-100 text-orange-800 text-xs">
                {dashboardStats.pendingOrders} pendientes
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalPayments}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardStats.completedPayments} completados
            </p>
            <div className="mt-2">
              <Badge variant="default" className="bg-red-100 text-red-800 text-xs">
                {dashboardStats.pendingPayments} pendientes
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardStats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              +{dashboardStats.revenueGrowth}% vs mes anterior
            </p>
            <div className="mt-2 flex items-center text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span className="text-xs">+{formatCurrency(dashboardStats.monthlyRevenue)} este mes</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Acceso directo a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Button
                  variant="outline"
                  className="w-full h-20 flex-col gap-2 hover:bg-accent"
                >
                  <div className={`p-2 rounded-full ${action.color}`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities and Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas acciones realizadas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      {getStatusBadge(activity.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas del Sistema
            </CardTitle>
            <CardDescription>
              Notificaciones importantes que requieren atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">Stock Crítico</p>
                  <p className="text-xs text-red-600">8 productos bajo el mínimo</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Calendar className="h-4 w-4 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">Vencimientos Próximos</p>
                  <p className="text-xs text-yellow-600">3 productos vencen esta semana</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">Pagos Pendientes</p>
                  <p className="text-xs text-blue-600">5 pagos vencen esta semana</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Factory className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800">Producción Activa</p>
                  <p className="text-xs text-green-600">2 órdenes en producción</p>
                </div>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Warehouse className="h-5 w-5" />
            Resumen de Inventario
          </CardTitle>
          <CardDescription>
            Estado actual del inventario y movimientos recientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Valor Total</span>
                <span className="text-sm font-bold">{formatCurrency(dashboardStats.totalInventory)}</span>
              </div>
              <div className="flex items-center gap-2">
                {dashboardStats.inventoryGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={`text-xs ${dashboardStats.inventoryGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {dashboardStats.inventoryGrowth > 0 ? '+' : ''}{dashboardStats.inventoryGrowth}% vs mes anterior
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Productos Activos</span>
                <span className="text-sm font-bold">{dashboardStats.activeProducts}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {dashboardStats.totalProducts} total registrados
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Movimientos Hoy</span>
                <span className="text-sm font-bold">24</span>
              </div>
              <div className="text-xs text-muted-foreground">
                12 entradas, 12 salidas
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}