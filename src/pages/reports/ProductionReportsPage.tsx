import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  DollarSign,
  Users,
  Package
} from 'lucide-react';

interface ProductionReport {
  id: string;
  orderNumber: string;
  productName: string;
  recipeName: string;
  quantity: number;
  unit: string;
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  responsible: string;
  efficiency: number;
  costPerUnit: number;
  totalCost: number;
  qualityScore: number;
  delays: number; // días de retraso
  notes?: string;
}

interface ProductionMetrics {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageEfficiency: number;
  totalProductionValue: number;
  averageQualityScore: number;
  totalDelays: number;
  averageCostPerUnit: number;
  totalCost: number;
}

// Mock data
const mockProductionReports: ProductionReport[] = [
  {
    id: '1',
    orderNumber: 'OP-2024-001',
    productName: 'Yogur Natural',
    recipeName: 'Yogur Natural v2.1',
    quantity: 500,
    unit: 'litros',
    startDate: new Date('2024-01-20T08:00:00'),
    expectedEndDate: new Date('2024-01-22T17:00:00'),
    actualEndDate: new Date('2024-01-22T16:30:00'),
    status: 'completed',
    priority: 'high',
    responsible: 'Carlos Rodríguez',
    efficiency: 92.5,
    costPerUnit: 3500,
    totalCost: 1750000,
    qualityScore: 95,
    delays: 0
  },
  {
    id: '2',
    orderNumber: 'OP-2024-002',
    productName: 'Queso Paraguay',
    recipeName: 'Queso Paraguay v1.5',
    quantity: 200,
    unit: 'kg',
    startDate: new Date('2024-01-23T07:00:00'),
    expectedEndDate: new Date('2024-01-25T15:00:00'),
    status: 'in_progress',
    priority: 'critical',
    responsible: 'María González',
    efficiency: 78.3,
    costPerUnit: 18000,
    totalCost: 3600000,
    qualityScore: 88,
    delays: 2,
    notes: 'Retraso por falta de cultivo láctico'
  },
  {
    id: '3',
    orderNumber: 'OP-2024-003',
    productName: 'Leche Entera',
    recipeName: 'Leche Entera v1.0',
    quantity: 1000,
    unit: 'litros',
    startDate: new Date('2024-01-18T06:00:00'),
    expectedEndDate: new Date('2024-01-19T14:00:00'),
    actualEndDate: new Date('2024-01-19T13:45:00'),
    status: 'completed',
    priority: 'medium',
    responsible: 'Luis Pérez',
    efficiency: 96.2,
    costPerUnit: 2800,
    totalCost: 2800000,
    qualityScore: 98,
    delays: 0
  },
  {
    id: '4',
    orderNumber: 'OP-2024-004',
    productName: 'Crema de Leche',
    recipeName: 'Crema de Leche v1.2',
    quantity: 300,
    unit: 'litros',
    startDate: new Date('2024-01-24T09:00:00'),
    expectedEndDate: new Date('2024-01-26T12:00:00'),
    status: 'pending',
    priority: 'medium',
    responsible: 'Elena Martínez',
    efficiency: 0,
    costPerUnit: 8500,
    totalCost: 2550000,
    qualityScore: 0,
    delays: 0
  },
  {
    id: '5',
    orderNumber: 'OP-2024-005',
    productName: 'Mantequilla',
    recipeName: 'Mantequilla v1.0',
    quantity: 150,
    unit: 'kg',
    startDate: new Date('2024-01-15T08:00:00'),
    expectedEndDate: new Date('2024-01-17T16:00:00'),
    actualEndDate: new Date('2024-01-18T10:00:00'),
    status: 'completed',
    priority: 'low',
    responsible: 'Ana Silva',
    efficiency: 85.7,
    costPerUnit: 22000,
    totalCost: 3300000,
    qualityScore: 92,
    delays: 1
  },
  {
    id: '6',
    orderNumber: 'OP-2024-006',
    productName: 'Yogur de Frutas',
    recipeName: 'Yogur de Frutas v2.0',
    quantity: 400,
    unit: 'litros',
    startDate: new Date('2024-01-21T07:30:00'),
    expectedEndDate: new Date('2024-01-23T15:30:00'),
    status: 'cancelled',
    priority: 'high',
    responsible: 'Carlos Rodríguez',
    efficiency: 45.2,
    costPerUnit: 4200,
    totalCost: 1680000,
    qualityScore: 75,
    delays: 3,
    notes: 'Cancelado por problemas de calidad en ingredientes'
  }
];

const mockMetrics: ProductionMetrics = {
  totalOrders: 32,
  activeOrders: 6,
  completedOrders: 26,
  cancelledOrders: 2,
  averageEfficiency: 87.5,
  totalProductionValue: 45000000,
  averageQualityScore: 91.2,
  totalDelays: 8,
  averageCostPerUnit: 12500,
  totalCost: 16800000
};

export function ProductionReportsPage() {
  const [reports, setReports] = useState<ProductionReport[]>(mockProductionReports);
  const [metrics, setMetrics] = useState<ProductionMetrics>(mockMetrics);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('orderNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
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
      case 'in_progress':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            <Activity className="h-3 w-3 mr-1" />
            En Progreso
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completada
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cancelada
          </Badge>
        );
      default:
        return null;
    }
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
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Bajo
          </Badge>
        );
      default:
        return null;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || report.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue: any = a[sortBy as keyof ProductionReport];
    let bValue: any = b[sortBy as keyof ProductionReport];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleExportReport = () => {
    // Simular exportación de reporte
    console.log('Exportando reporte de producción...');
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const calculateProgress = (report: ProductionReport) => {
    if (report.status === 'completed') return 100;
    if (report.status === 'pending') return 0;
    
    const totalTime = report.expectedEndDate.getTime() - report.startDate.getTime();
    const elapsedTime = new Date().getTime() - report.startDate.getTime();
    const progress = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
    
    return Math.round(progress);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Producción</h1>
          <p className="text-muted-foreground">
            Análisis detallado y métricas de producción
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avanzados
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Reporte
          </Button>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Órdenes</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Eficiencia Promedio</p>
                <p className="text-2xl font-bold">{metrics.averageEfficiency}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completadas</p>
                <p className="text-2xl font-bold">{metrics.completedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalProductionValue)}</p>
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
                  placeholder="Buscar órdenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-input rounded-md"
                />
              </div>
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
                <option value="in_progress">En Progreso</option>
                <option value="completed">Completadas</option>
                <option value="cancelled">Canceladas</option>
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
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Reportes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Reporte Detallado de Producción ({sortedReports.length} órdenes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button 
                    onClick={() => handleSort('orderNumber')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Orden {getSortIcon('orderNumber')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('productName')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Producto {getSortIcon('productName')}
                  </button>
                </TableHead>
                <TableHead>Receta</TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('quantity')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Cantidad {getSortIcon('quantity')}
                  </button>
                </TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('efficiency')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Eficiencia {getSortIcon('efficiency')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('qualityScore')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Calidad {getSortIcon('qualityScore')}
                  </button>
                </TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('totalCost')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Costo {getSortIcon('totalCost')}
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-mono">{report.orderNumber}</TableCell>
                  <TableCell className="font-medium">{report.productName}</TableCell>
                  <TableCell className="text-sm">{report.recipeName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{report.quantity}</span>
                      <span className="text-xs text-muted-foreground">{report.unit}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{getPriorityBadge(report.priority)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getEfficiencyColor(report.efficiency)}`}>
                      {report.efficiency > 0 ? `${report.efficiency}%` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getQualityColor(report.qualityScore)}`}>
                      {report.qualityScore > 0 ? `${report.qualityScore}%` : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {report.status === 'in_progress' && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${calculateProgress(report)}%` }}
                        />
                      </div>
                    )}
                    {report.status === 'completed' && (
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        100%
                      </Badge>
                    )}
                    {report.status === 'pending' && (
                      <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        0%
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{report.responsible}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(report.totalCost)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {sortedReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Factory className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay órdenes que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de Métricas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Estado de Órdenes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Completadas</span>
                <Badge variant="outline">{metrics.completedOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">En Progreso</span>
                <Badge variant="default">{metrics.activeOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Pendientes</span>
                <Badge variant="outline">{metrics.totalOrders - metrics.completedOrders - metrics.activeOrders - metrics.cancelledOrders}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Canceladas</span>
                <Badge variant="destructive">{metrics.cancelledOrders}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Métricas de Calidad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Calidad Promedio</span>
                <span className="text-sm font-medium">{metrics.averageQualityScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Eficiencia Promedio</span>
                <span className="text-sm font-medium">{metrics.averageEfficiency}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Retrasos Totales</span>
                <Badge variant="destructive">{metrics.totalDelays} días</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Costo Promedio</span>
                <span className="text-sm font-medium">{formatCurrency(metrics.averageCostPerUnit)}/unidad</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Análisis Financiero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Valor Total Producción</span>
                <span className="text-sm font-medium">{formatCurrency(metrics.totalProductionValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Costo Total</span>
                <span className="text-sm font-medium">{formatCurrency(metrics.totalCost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Margen de Ganancia</span>
                <span className="text-sm font-medium text-green-600">
                  {formatCurrency(metrics.totalProductionValue - metrics.totalCost)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Porcentaje de Ganancia</span>
                <span className="text-sm font-medium text-green-600">
                  {Math.round(((metrics.totalProductionValue - metrics.totalCost) / metrics.totalCost) * 100)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 