import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Package,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  Edit,
  Trash2,
  QrCode,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import { Batch, Product, Warehouse } from '@/types';
import { InventoryService } from '@/lib/inventoryService';

interface BatchListProps {
  onViewBatch?: (batch: Batch) => void;
  onEditBatch?: (batch: Batch) => void;
  onDeleteBatch?: (batchId: string) => void;
}

export function BatchList({ onViewBatch, onEditBatch, onDeleteBatch }: BatchListProps) {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [warehouseFilter, setWarehouseFilter] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isQRDialogOpen, setIsQRDialogOpen] = useState(false);
  const [downloadingQR, setDownloadingQR] = useState<string | null>(null);

  // Mock data for development
  const mockWarehouses: Warehouse[] = [
    {
      id: '1',
      name: 'Almacén Principal',
      location: 'Zona Industrial, Luque',
      responsible: 'Juan Pérez',
      capacity: 10000,
      status: 'active'
    },
    {
      id: '2',
      name: 'Almacén Secundario',
      location: 'Centro de Distribución, Asunción',
      responsible: 'María González',
      capacity: 5000,
      status: 'active'
    }
  ];

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    try {
      const data = await InventoryService.getBatches();
      setBatches(data);
    } catch (error) {
      console.error('Error al cargar lotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = async (batchCode: string) => {
    setDownloadingQR(batchCode);
    try {
      await InventoryService.downloadQRCode(batchCode);
    } catch (error) {
      console.error('Error al descargar QR:', error);
      alert('Error al descargar código QR');
    } finally {
      setDownloadingQR(null);
    }
  };

  const handleViewQR = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsQRDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Activo</Badge>;
      case 'expired':
        return <Badge variant="destructive">Vencido</Badge>;
      case 'depleted':
        return <Badge variant="secondary">Agotado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getExpiryStatus = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', days: Math.abs(daysUntilExpiry) };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', days: daysUntilExpiry };
    } else {
      return { status: 'ok', days: daysUntilExpiry };
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || batch.status === statusFilter;
    const matchesWarehouse = !warehouseFilter || batch.warehouseId === warehouseFilter;
    
    return matchesSearch && matchesStatus && matchesWarehouse;
  });

  const formatQuantity = (quantity: number, unit: string) => {
    return `${quantity} ${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Control de Lotes</h2>
          <p className="text-muted-foreground">
            Gestión y seguimiento de lotes con códigos QR
          </p>
        </div>
        <Button onClick={loadBatches} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por código o producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="expired">Vencido</SelectItem>
                  <SelectItem value="depleted">Agotado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Almacén</Label>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los almacenes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los almacenes</SelectItem>
                  {mockWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Lotes */}
      <Card>
        <CardHeader>
          <CardTitle>Lotes ({filteredBatches.length})</CardTitle>
          <CardDescription>
            Lista de todos los lotes registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Almacén</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map((batch) => {
                    const expiryStatus = getExpiryStatus(batch.expiryDate);
                    
                    return (
                      <TableRow key={batch.id}>
                        <TableCell>
                          <div className="font-medium">{batch.code}</div>
                          <div className="text-sm text-muted-foreground">
                            Creado: {batch.creationDate.toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{batch.product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {batch.product.code}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {formatQuantity(batch.currentQuantity, batch.product.unit)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Inicial: {formatQuantity(batch.initialQuantity, batch.product.unit)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {mockWarehouses.find(w => w.id === batch.warehouseId)?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(batch.status)}
                        </TableCell>
                        <TableCell>
                          {batch.expiryDate ? (
                            <div>
                              <div className="font-medium">
                                {batch.expiryDate.toLocaleDateString()}
                              </div>
                              {expiryStatus && (
                                <div className="flex items-center gap-1 mt-1">
                                  {expiryStatus.status === 'expired' && (
                                    <AlertTriangle className="h-3 w-3 text-red-500" />
                                  )}
                                  {expiryStatus.status === 'warning' && (
                                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                                  )}
                                  {expiryStatus.status === 'ok' && (
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                  )}
                                  <span className={`text-xs ${
                                    expiryStatus.status === 'expired' ? 'text-red-500' :
                                    expiryStatus.status === 'warning' ? 'text-yellow-500' :
                                    'text-green-500'
                                  }`}>
                                    {expiryStatus.status === 'expired' ? `${expiryStatus.days} días vencido` :
                                     expiryStatus.status === 'warning' ? `${expiryStatus.days} días` :
                                     `${expiryStatus.days} días`}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Sin vencimiento</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewQR(batch)}
                              title="Ver QR"
                            >
                              <QrCode className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadQR(batch.code)}
                              disabled={downloadingQR === batch.code}
                              title="Descargar QR"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            {onViewBatch && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewBatch(batch)}
                                title="Ver detalles"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            {onEditBatch && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditBatch(batch)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            {onDeleteBatch && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDeleteBatch(batch.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para mostrar QR */}
      <Dialog open={isQRDialogOpen} onOpenChange={setIsQRDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Código QR - {selectedBatch?.code}</DialogTitle>
            <DialogDescription>
              Información del lote y código QR para trazabilidad
            </DialogDescription>
          </DialogHeader>
          
          {selectedBatch && (
            <div className="space-y-4">
              {/* Información del lote */}
              <div className="grid gap-2">
                <div>
                  <Label className="text-sm font-medium">Producto</Label>
                  <p className="text-sm">{selectedBatch.product.name} ({selectedBatch.product.code})</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Cantidad Actual</Label>
                  <p className="text-sm font-bold">
                    {formatQuantity(selectedBatch.currentQuantity, selectedBatch.product.unit)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Almacén</Label>
                  <p className="text-sm">
                    {mockWarehouses.find(w => w.id === selectedBatch.warehouseId)?.name || 'N/A'}
                  </p>
                </div>
                {selectedBatch.expiryDate && (
                  <div>
                    <Label className="text-sm font-medium">Fecha de Vencimiento</Label>
                    <p className="text-sm">{selectedBatch.expiryDate.toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Código QR simulado */}
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">QR Code</p>
                    <p className="text-xs text-gray-400">{selectedBatch.code}</p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadQR(selectedBatch.code)}
                  disabled={downloadingQR === selectedBatch.code}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar QR
                </Button>
                <Button onClick={() => setIsQRDialogOpen(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 