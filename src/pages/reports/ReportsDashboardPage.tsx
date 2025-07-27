import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Users,
  ShoppingCart,
  Factory,
  CreditCard,
  Download,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

interface DashboardMetrics {
  // Inventario
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  totalStockValue: number;
  stockValueChange: number;
  
  // Compras
  totalPurchaseOrders: number;
  pendingPurchaseOrders: number;
  totalPurchaseValue: number;
  purchaseValueChange: number;
  
  // Producción
  totalProductionOrders: number;
  activeProductionOrders: number;
  completedProductionOrders: number;
  productionEfficiency: number;
  
  // Pagos
  totalPayments: number;
  pendingPayments: number;
  overduePayments: number;
  totalPaymentValue: number;
  
  // Alertas
  activeAlerts: number;
  criticalAlerts: number;
  unreadNotifications: number;
  
  // Tendencias
  monthlyRevenue: number;
  monthlyExpenses: number;
  profitMargin: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

// Mock data
const mockMetrics: DashboardMetrics = {
  totalProducts: 156,
  lowStockProducts: 12,
  outOfStockProducts: 3,
  totalStockValue: 45000000,
  stockValueChange: 5.2,
  
  totalPurchaseOrders: 45,
  pendingPurchaseOrders: 8,
  totalPurchaseValue: 125000000,
  purchaseValueChange: -2.1,
  
  totalProductionOrders: 32,
  activeProductionOrders: 6,
  completedProductionOrders: 26,
  productionEfficiency: 87.5,
  
  totalPayments: 38,
  pendingPayments: 5,
  overduePayments: 2,
  totalPaymentValue: 98000000,
  
  activeAlerts: 15,
  criticalAlerts: 3,
  unreadNotifications: 8,
  
  monthlyRevenue: 180000000,
  monthlyExpenses: 145000000,
  profitMargin: 19.4
};

const mockStockData: ChartData = {
  labels: ['Leche Entera', 'Queso Paraguay', 'Yogur Natural', 'Crema de Leche', 'Mantequilla', 'Cultivo Láctico'],
  datasets: [{
    label: 'Stock Actual',
    data: [250, 180, 320, 95, 75, 45],
    backgroundColor: [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'
    ]
  }]
};

const mockRevenueData: ChartData = {
  labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  datasets: [{
    label: 'Ingresos Mensuales (₲)',
    data: [150000000, 165000000, 180000000, 175000000, 190000000, 185000000, 200000000, 195000000, 210000000, 205000000, 220000000, 215000000],
    borderColor: '#3B82F6',
    borderWidth: 2
  }]
};

const mockProductionData: ChartData = {
  labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
  datasets: [{
    label: 'Órdenes de Producción',
    data: [8, 12, 10, 15, 11, 6, 2],
    backgroundColor: '#10B981'
  }]
};

export function ReportsDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailedMetrics, setShowDetailedMetrics] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simular actualización de datos
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleExportReport = () => {
    // Simular exportación de reporte
    console.log('Exportando reporte...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Reportes</h1>
          <p className="text-muted-foreground">
            Métricas clave y estadísticas en tiempo real del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowDetailedMetrics(!showDetailedMetrics)}>
            {showDetailedMetrics ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDetailedMetrics ? 'Vista Simple' : 'Vista Detallada'}
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalStockValue)}</div>
            <div className={`flex items-center text-xs ${getChangeColor(metrics.stockValueChange)}`}>
              {getChangeIcon(metrics.stockValueChange)}
              <span className="ml-1">{formatPercentage(metrics.stockValueChange)}</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Mensuales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</div>
            <div className="text-xs text-muted-foreground">
              Margen de ganancia: {metrics.profitMargin}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Órdenes de Producción</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalProductionOrders}</div>
            <div className="text-xs text-muted-foreground">
              {metrics.activeProductionOrders} activas, {metrics.completedProductionOrders} completadas
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Activas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeAlerts}</div>
            <div className="text-xs text-muted-foreground">
              {metrics.criticalAlerts} críticas, {metrics.unreadNotifications} notificaciones
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Reportes */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen General</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
          <TabsTrigger value="production">Producción</TabsTrigger>
          <TabsTrigger value="financial">Financiero</TabsTrigger>
        </TabsList>

        {/* Resumen General */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Estado del Inventario */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Estado del Inventario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Productos</span>
                  <Badge variant="outline">{metrics.totalProducts}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Stock Bajo</span>
                  <Badge variant="destructive">{metrics.lowStockProducts}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Sin Stock</span>
                  <Badge variant="destructive">{metrics.outOfStockProducts}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Estado de Compras */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Estado de Compras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Órdenes</span>
                  <Badge variant="outline">{metrics.totalPurchaseOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pendientes</span>
                  <Badge variant="secondary">{metrics.pendingPurchaseOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Valor Total</span>
                  <span className="text-sm font-medium">{formatCurrency(metrics.totalPurchaseValue)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Estado de Producción */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Estado de Producción
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Órdenes Activas</span>
                  <Badge variant="default">{metrics.activeProductionOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completadas</span>
                  <Badge variant="outline">{metrics.completedProductionOrders}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Eficiencia</span>
                  <Badge variant="outline">{metrics.productionEfficiency}%</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Estado de Pagos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Estado de Pagos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Pagos</span>
                  <Badge variant="outline">{metrics.totalPayments}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pendientes</span>
                  <Badge variant="secondary">{metrics.pendingPayments}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Vencidos</span>
                  <Badge variant="destructive">{metrics.overduePayments}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Alertas y Notificaciones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas y Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Alertas Activas</span>
                  <Badge variant="destructive">{metrics.activeAlerts}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Críticas</span>
                  <Badge variant="destructive">{metrics.criticalAlerts}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">No Leídas</span>
                  <Badge variant="secondary">{metrics.unreadNotifications}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Resumen Financiero */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Ingresos</span>
                  <span className="text-sm font-medium text-green-600">{formatCurrency(metrics.monthlyRevenue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Gastos</span>
                  <span className="text-sm font-medium text-red-600">{formatCurrency(metrics.monthlyExpenses)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Margen</span>
                  <span className="text-sm font-medium text-blue-600">{metrics.profitMargin}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Inventario */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Stock
                </CardTitle>
                <CardDescription>
                  Productos con mayor stock disponible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockStockData.labels.map((label, index) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: mockStockData.datasets[0].backgroundColor?.[index] }}
                        />
                        <span className="text-sm">{label}</span>
                      </div>
                      <span className="text-sm font-medium">{mockStockData.datasets[0].data[index]} unidades</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Tendencias de Inventario
                </CardTitle>
                <CardDescription>
                  Cambios en el valor del inventario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Valor Total</span>
                    <span className="text-lg font-bold">{formatCurrency(metrics.totalStockValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cambio Mensual</span>
                    <div className={`flex items-center ${getChangeColor(metrics.stockValueChange)}`}>
                      {getChangeIcon(metrics.stockValueChange)}
                      <span className="ml-1">{formatPercentage(metrics.stockValueChange)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Productos Críticos</span>
                    <Badge variant="destructive">{metrics.lowStockProducts + metrics.outOfStockProducts}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Producción */}
        <TabsContent value="production" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Órdenes de Producción Semanales
                </CardTitle>
                <CardDescription>
                  Actividad de producción por día de la semana
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockProductionData.labels.map((day, index) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm">{day}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${(mockProductionData.datasets[0].data[index] / 15) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{mockProductionData.datasets[0].data[index]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Eficiencia de Producción
                </CardTitle>
                <CardDescription>
                  Métricas de rendimiento de producción
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Eficiencia General</span>
                    <Badge variant="outline">{metrics.productionEfficiency}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Órdenes Activas</span>
                    <Badge variant="default">{metrics.activeProductionOrders}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completadas este Mes</span>
                    <Badge variant="outline">{metrics.completedProductionOrders}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Órdenes</span>
                    <Badge variant="outline">{metrics.totalProductionOrders}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financiero */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ingresos Mensuales
                </CardTitle>
                <CardDescription>
                  Tendencias de ingresos en los últimos 12 meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ingresos Actuales</span>
                    <span className="text-lg font-bold text-green-600">{formatCurrency(metrics.monthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gastos Mensuales</span>
                    <span className="text-lg font-bold text-red-600">{formatCurrency(metrics.monthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Margen de Ganancia</span>
                    <span className="text-lg font-bold text-blue-600">{metrics.profitMargin}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Estado de Pagos
                </CardTitle>
                <CardDescription>
                  Resumen de pagos y obligaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Pagos</span>
                    <span className="text-lg font-bold">{formatCurrency(metrics.totalPaymentValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pendientes</span>
                    <Badge variant="secondary">{metrics.pendingPayments}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vencidos</span>
                    <Badge variant="destructive">{metrics.overduePayments}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completados</span>
                    <Badge variant="outline">{metrics.totalPayments - metrics.pendingPayments - metrics.overduePayments}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 