import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';

interface InventoryReport {
  id: string;
  productName: string;
  productCode: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  lastMovement: Date;
  daysSinceLastMovement: number;
  stockStatus: 'normal' | 'low' | 'out' | 'overstock';
  turnoverRate: number;
  supplier: string;
  location: string;
}

interface InventoryMetrics {
  totalProducts: number;
  totalValue: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  overstockProducts: number;
  averageTurnoverRate: number;
  totalMovements: number;
  valueChange: number;
}

// Mock data
const mockInventoryReports: InventoryReport[] = [
  {
    id: '1',
    productName: 'Leche Entera',
    productCode: 'LEC-001',
    category: 'Lácteos',
    currentStock: 250,
    minStock: 100,
    maxStock: 500,
    unitPrice: 8000,
    totalValue: 2000000,
    lastMovement: new Date('2024-01-25T10:30:00'),
    daysSinceLastMovement: 2,
    stockStatus: 'normal',
    turnoverRate: 85.5,
    supplier: 'Lácteos del Sur S.A.',
    location: 'Almacén Principal'
  },
  {
    id: '2',
    productName: 'Queso Paraguay',
    productCode: 'QUE-001',
    category: 'Quesos',
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    unitPrice: 25000,
    totalValue: 1125000,
    lastMovement: new Date('2024-01-24T14:15:00'),
    daysSinceLastMovement: 3,
    stockStatus: 'low',
    turnoverRate: 92.3,
    supplier: 'Quesos Paraguay S.A.',
    location: 'Almacén Refrigerado'
  },
  {
    id: '3',
    productName: 'Yogur Natural',
    productCode: 'YOG-001',
    category: 'Lácteos',
    currentStock: 320,
    minStock: 80,
    maxStock: 400,
    unitPrice: 5000,
    totalValue: 1600000,
    lastMovement: new Date('2024-01-25T09:45:00'),
    daysSinceLastMovement: 1,
    stockStatus: 'normal',
    turnoverRate: 78.2,
    supplier: 'Lácteos del Sur S.A.',
    location: 'Almacén Refrigerado'
  },
  {
    id: '4',
    productName: 'Crema de Leche',
    productCode: 'CRE-001',
    category: 'Lácteos',
    currentStock: 0,
    minStock: 20,
    maxStock: 100,
    unitPrice: 12000,
    totalValue: 0,
    lastMovement: new Date('2024-01-20T16:30:00'),
    daysSinceLastMovement: 6,
    stockStatus: 'out',
    turnoverRate: 95.8,
    supplier: 'Lácteos del Sur S.A.',
    location: 'Almacén Refrigerado'
  },
  {
    id: '5',
    productName: 'Mantequilla',
    productCode: 'MANT-001',
    category: 'Lácteos',
    currentStock: 75,
    minStock: 30,
    maxStock: 80,
    unitPrice: 15000,
    totalValue: 1125000,
    lastMovement: new Date('2024-01-25T11:20:00'),
    daysSinceLastMovement: 1,
    stockStatus: 'overstock',
    turnoverRate: 65.4,
    supplier: 'Lácteos del Sur S.A.',
    location: 'Almacén Refrigerado'
  },
  {
    id: '6',
    productName: 'Cultivo Láctico',
    productCode: 'CULT-001',
    category: 'Insumos',
    currentStock: 45,
    minStock: 10,
    maxStock: 50,
    unitPrice: 50000,
    totalValue: 2250000,
    lastMovement: new Date('2024-01-23T08:15:00'),
    daysSinceLastMovement: 4,
    stockStatus: 'normal',
    turnoverRate: 45.2,
    supplier: 'Importadora ABC',
    location: 'Almacén Especial'
  }
];

const mockMetrics: InventoryMetrics = {
  totalProducts: 156,
  totalValue: 45000000,
  lowStockProducts: 12,
  outOfStockProducts: 3,
  overstockProducts: 8,
  averageTurnoverRate: 76.8,
  totalMovements: 245,
  valueChange: 5.2
};

export function InventoryReportsPage() {
  const [reports, setReports] = useState<InventoryReport[]>(mockInventoryReports);
  const [metrics, setMetrics] = useState<InventoryMetrics>(mockMetrics);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('productName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatusBadge = (status: string) => {
    switch (status) {
      case 'normal':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Normal
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="destructive" className="bg-orange-100 text-orange-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Bajo
          </Badge>
        );
      case 'out':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Sin Stock
          </Badge>
        );
      case 'overstock':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Exceso
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTurnoverRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || report.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || report.stockStatus === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let aValue: any = a[sortBy as keyof InventoryReport];
    let bValue: any = b[sortBy as keyof InventoryReport];
    
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
    console.log('Exportando reporte de inventario...');
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reportes de Inventario</h1>
          <p className="text-muted-foreground">
            Análisis detallado y métricas del inventario
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
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Productos</p>
                <p className="text-2xl font-bold">{metrics.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Valor Total</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium">Stock Bajo</p>
                <p className="text-2xl font-bold">{metrics.lowStockProducts + metrics.outOfStockProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Rotación Promedio</p>
                <p className="text-2xl font-bold">{metrics.averageTurnoverRate}%</p>
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
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-input rounded-md"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Categoría</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todas</option>
                <option value="Lácteos">Lácteos</option>
                <option value="Quesos">Quesos</option>
                <option value="Insumos">Insumos</option>
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
                <option value="normal">Normal</option>
                <option value="low">Bajo</option>
                <option value="out">Sin Stock</option>
                <option value="overstock">Exceso</option>
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
            Reporte Detallado de Inventario ({sortedReports.length} productos)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <button 
                    onClick={() => handleSort('productName')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Producto {getSortIcon('productName')}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('productCode')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Código {getSortIcon('productCode')}
                  </button>
                </TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('currentStock')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Stock Actual {getSortIcon('currentStock')}
                  </button>
                </TableHead>
                <TableHead>Stock Mín.</TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('totalValue')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Valor Total {getSortIcon('totalValue')}
                  </button>
                </TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>
                  <button 
                    onClick={() => handleSort('turnoverRate')}
                    className="flex items-center gap-1 hover:underline"
                  >
                    Rotación {getSortIcon('turnoverRate')}
                  </button>
                </TableHead>
                <TableHead>Último Movimiento</TableHead>
                <TableHead>Proveedor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.productName}</TableCell>
                  <TableCell className="font-mono">{report.productCode}</TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{report.currentStock}</span>
                      <span className="text-xs text-muted-foreground">/ {report.maxStock}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{report.minStock}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(report.totalValue)}</TableCell>
                  <TableCell>{getStockStatusBadge(report.stockStatus)}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${getTurnoverRateColor(report.turnoverRate)}`}>
                      {report.turnoverRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.daysSinceLastMovement} días
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{report.supplier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {sortedReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay productos que coincidan con los filtros</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen por Categorías */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Resumen por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Lácteos</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">4 productos</span>
                  <Badge variant="outline">{formatCurrency(5800000)}</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Quesos</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">1 producto</span>
                  <Badge variant="outline">{formatCurrency(1125000)}</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Insumos</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">1 producto</span>
                  <Badge variant="outline">{formatCurrency(2250000)}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Productos Críticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sin Stock</span>
                <Badge variant="destructive">1 producto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Stock Bajo</span>
                <Badge variant="destructive">1 producto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Exceso de Stock</span>
                <Badge variant="outline">1 producto</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Normal</span>
                <Badge variant="outline">3 productos</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Métricas de Rotación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Alta Rotación (≥80%)</span>
                <Badge variant="outline">2 productos</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Media Rotación (60-79%)</span>
                <Badge variant="outline">2 productos</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Baja Rotación (<60%)</span>
                <Badge variant="outline">2 productos</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Promedio General</span>
                <span className="text-sm font-medium">76.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 