import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Factory,
  CreditCard,
  AlertTriangle,
  Calendar,
  DollarSign,
  Users,
  Activity
} from 'lucide-react';

export function ReportsDashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const stats = {
    totalRevenue: 12500000, // PYG
    totalExpenses: 8500000,
    netProfit: 4000000,
    totalOrders: 45,
    completedOrders: 38,
    pendingOrders: 7,
    totalProducts: 156,
    lowStockProducts: 12,
    totalProduction: 1250, // Kg
    averageQuality: 4.8,
    activeSuppliers: 8,
    totalEmployees: 15
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  const getTrendIcon = (trend: 'up' | 'down') => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-500" /> : 
      <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Reportes</h1>
          <p className="text-muted-foreground">
            Análisis completo y estadísticas del sistema
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Último mes</Badge>
          <Badge variant="outline">Exportar PDF</Badge>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              {getTrendIcon('up')}
              <span>+12.5% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(stats.totalExpenses)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-red-600">
              {getTrendIcon('down')}
              <span>-5.2% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficio Neto</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.netProfit)}
            </div>
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              {getTrendIcon('up')}
              <span>+18.7% vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes de Compra</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedOrders} completadas, {stats.pendingOrders} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos en Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockProducts} con stock bajo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Producción Total</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProduction} Kg</div>
            <p className="text-xs text-muted-foreground">
              Calidad promedio: {stats.averageQuality}/5
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personal Activo</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSuppliers} proveedores activos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Reporte de Inventario</span>
            </CardTitle>
            <CardDescription>
              Estado actual del inventario y alertas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">144</div>
                <div className="text-sm text-green-600">Productos OK</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">12</div>
                <div className="text-sm text-red-600">Stock Bajo</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Productos con stock crítico:</span>
                <Badge variant="destructive">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Productos próximos a vencer:</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Valor total del inventario:</span>
                <span className="text-sm font-medium">{formatCurrency(25000000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Factory className="h-5 w-5" />
              <span>Reporte de Producción</span>
            </CardTitle>
            <CardDescription>
              Rendimiento y eficiencia de producción
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-blue-600">Eficiencia</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-green-600">Calidad</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Órdenes completadas:</span>
                <Badge variant="default">24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Órdenes en progreso:</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiempo promedio:</span>
                <span className="text-sm font-medium">4.2 días</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Reporte Financiero</span>
            </CardTitle>
            <CardDescription>
              Análisis de ingresos, gastos y rentabilidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ingresos por ventas:</span>
                <span className="text-sm font-medium">{formatCurrency(10000000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Costos de producción:</span>
                <span className="text-sm font-medium">{formatCurrency(6000000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Gastos operativos:</span>
                <span className="text-sm font-medium">{formatCurrency(2500000)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Margen de beneficio:</span>
                  <Badge variant="default">32%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supplier Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Reporte de Proveedores</span>
            </CardTitle>
            <CardDescription>
              Análisis de proveedores y compras
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-green-600">Activos</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-yellow-600">Pendientes</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Compras este mes:</span>
                <Badge variant="default">15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Valor total compras:</span>
                <span className="text-sm font-medium">{formatCurrency(8500000)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Proveedor principal:</span>
                <span className="text-sm font-medium">Lácteos Paraguay</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Generar reportes específicos y exportar datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Reporte Mensual</span>
              </div>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium">Inventario</span>
              </div>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <Factory className="h-5 w-5 text-orange-500" />
                <span className="text-sm font-medium">Producción</span>
              </div>
            </button>
            
            <button className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Financiero</span>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 