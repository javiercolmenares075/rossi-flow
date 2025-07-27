import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  Package,
  Factory,
  Calendar,
  User,
  Calculator
} from 'lucide-react';

// Schema de validación
const productionOrderSchema = z.object({
  recipeId: z.string().min(1, 'Debe seleccionar una receta'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  startDate: z.string().min(1, 'La fecha de inicio es obligatoria'),
  expectedEndDate: z.string().min(1, 'La fecha esperada de finalización es obligatoria'),
  responsible: z.string().min(2, 'El responsable es obligatorio'),
  priority: z.enum(['low', 'medium', 'high']),
  notes: z.string().optional()
});

type ProductionOrderFormData = z.infer<typeof productionOrderSchema>;

interface Recipe {
  id: string;
  name: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
  yield: number;
  yieldUnit: string;
  ingredients: Array<{
    productId: string;
    product: {
      id: string;
      name: string;
      code: string;
    };
    quantity: number;
    unit: string;
  }>;
}

interface ProductionOrder {
  id: string;
  number: string;
  recipeId: string;
  recipe: Recipe;
  quantity: number;
  startDate: Date;
  expectedEndDate: Date;
  actualEndDate?: Date;
  responsible: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress: number; // 0-100
  notes?: string;
  ingredientsConsumed: Array<{
    productId: string;
    product: {
      id: string;
      name: string;
      code: string;
    };
    plannedQuantity: number;
    consumedQuantity: number;
    unit: string;
  }>;
  batchesCreated: Array<{
    id: string;
    code: string;
    quantity: number;
    unit: string;
    expiryDate: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Mock data
const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Queso Paraguay Tradicional',
    product: { id: '1', name: 'Queso Paraguay', code: 'QUE-001' },
    yield: 10,
    yieldUnit: 'Kg',
    ingredients: [
      {
        productId: '3',
        product: { id: '3', name: 'Leche Entera', code: 'LEC-001' },
        quantity: 100,
        unit: 'Litro'
      },
      {
        productId: '5',
        product: { id: '5', name: 'Sal', code: 'SAL-001' },
        quantity: 2,
        unit: 'Kg'
      }
    ]
  },
  {
    id: '2',
    name: 'Yogur Natural',
    product: { id: '2', name: 'Yogur Natural', code: 'YOG-001' },
    yield: 50,
    yieldUnit: 'Litro',
    ingredients: [
      {
        productId: '3',
        product: { id: '3', name: 'Leche Entera', code: 'LEC-001' },
        quantity: 50,
        unit: 'Litro'
      }
    ]
  }
];

const mockProductionOrders: ProductionOrder[] = [
  {
    id: '1',
    number: 'OP-2024-001',
    recipeId: '1',
    recipe: mockRecipes[0],
    quantity: 20,
    startDate: new Date('2024-01-20'),
    expectedEndDate: new Date('2024-01-22'),
    actualEndDate: new Date('2024-01-21'),
    responsible: 'Juan Pérez',
    priority: 'high',
    status: 'completed',
    progress: 100,
    notes: 'Producción completada exitosamente',
    ingredientsConsumed: [
      {
        productId: '3',
        product: { id: '3', name: 'Leche Entera', code: 'LEC-001' },
        plannedQuantity: 200,
        consumedQuantity: 195,
        unit: 'Litro'
      },
      {
        productId: '5',
        product: { id: '5', name: 'Sal', code: 'SAL-001' },
        plannedQuantity: 4,
        consumedQuantity: 3.8,
        unit: 'Kg'
      }
    ],
    batchesCreated: [
      {
        id: '1',
        code: 'QUE-2024-001',
        quantity: 20,
        unit: 'Kg',
        expiryDate: new Date('2024-02-21')
      }
    ],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-21'),
    createdBy: 'María González'
  },
  {
    id: '2',
    number: 'OP-2024-002',
    recipeId: '2',
    recipe: mockRecipes[1],
    quantity: 100,
    startDate: new Date('2024-01-22'),
    expectedEndDate: new Date('2024-01-23'),
    responsible: 'Carlos Rodríguez',
    priority: 'medium',
    status: 'in_progress',
    progress: 65,
    notes: 'Producción en curso',
    ingredientsConsumed: [
      {
        productId: '3',
        product: { id: '3', name: 'Leche Entera', code: 'LEC-001' },
        plannedQuantity: 100,
        consumedQuantity: 65,
        unit: 'Litro'
      }
    ],
    batchesCreated: [],
    createdAt: new Date('2024-01-21'),
    updatedAt: new Date('2024-01-22'),
    createdBy: 'Juan Pérez'
  }
];

export function ProductionOrdersPage() {
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(mockProductionOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

  const form = useForm<ProductionOrderFormData>({
    resolver: zodResolver(productionOrderSchema),
    defaultValues: {
      recipeId: '',
      quantity: 0,
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsible: '',
      priority: 'medium',
      notes: ''
    }
  });

  const filteredOrders = productionOrders.filter(order => {
    const matchesSearch = order.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.responsible.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || order.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateOrder = (data: ProductionOrderFormData) => {
    const recipe = mockRecipes.find(r => r.id === data.recipeId);
    if (!recipe) return;

    const newOrder: ProductionOrder = {
      id: `po-${Date.now()}`,
      number: `OP-${new Date().getFullYear()}-${String(productionOrders.length + 1).padStart(3, '0')}`,
      recipeId: data.recipeId,
      recipe,
      quantity: data.quantity,
      startDate: new Date(data.startDate),
      expectedEndDate: new Date(data.expectedEndDate),
      responsible: data.responsible,
      priority: data.priority,
      status: 'pending',
      progress: 0,
      notes: data.notes,
      ingredientsConsumed: recipe.ingredients.map(ing => ({
        ...ing,
        plannedQuantity: (ing.quantity * data.quantity) / recipe.yield,
        consumedQuantity: 0
      })),
      batchesCreated: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Usuario Actual'
    };
    
    setProductionOrders([...productionOrders, newOrder]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditOrder = (data: ProductionOrderFormData) => {
    if (!selectedOrder) return;
    
    const updatedOrder: ProductionOrder = {
      ...selectedOrder,
      ...data,
      recipe: mockRecipes.find(r => r.id === data.recipeId)!,
      startDate: new Date(data.startDate),
      expectedEndDate: new Date(data.expectedEndDate),
      updatedAt: new Date()
    };
    
    setProductionOrders(productionOrders.map(o => o.id === selectedOrder.id ? updatedOrder : o));
    setIsEditDialogOpen(false);
    setSelectedOrder(null);
    form.reset();
  };

  const handleDeleteOrder = (id: string) => {
    const order = productionOrders.find(o => o.id === id);
    if (order && order.status !== 'pending') {
      alert('Solo se pueden eliminar órdenes pendientes');
      return;
    }
    
    setProductionOrders(productionOrders.filter(order => order.id !== id));
  };

  const handleStatusChange = (orderId: string, newStatus: ProductionOrder['status']) => {
    setProductionOrders(productionOrders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          actualEndDate: newStatus === 'completed' ? new Date() : order.actualEndDate,
          updatedAt: new Date()
        };
      }
      return order;
    }));
  };

  const openEditDialog = (order: ProductionOrder) => {
    setSelectedOrder(order);
    form.reset({
      recipeId: order.recipeId,
      quantity: order.quantity,
      startDate: order.startDate.toISOString().split('T')[0],
      expectedEndDate: order.expectedEndDate.toISOString().split('T')[0],
      responsible: order.responsible,
      priority: order.priority,
      notes: order.notes || ''
    });
    setIsEditDialogOpen(true);
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
            <Play className="h-3 w-3 mr-1" />
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
          <Badge variant="secondary" className="bg-red-100 text-red-800">
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
      case 'high':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            Alta
          </Badge>
        );
      case 'medium':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            Media
          </Badge>
        );
      case 'low':
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Baja
          </Badge>
        );
      default:
        return null;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Órdenes de Producción</h1>
          <p className="text-muted-foreground">
            Gestión de producción de productos lácteos con recetas y seguimiento
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Orden de Producción</DialogTitle>
              <DialogDescription>
                Cree una nueva orden de producción
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateOrder)} className="space-y-4">
              <div>
                <Label htmlFor="recipeId">Receta *</Label>
                <Select onValueChange={(value) => form.setValue('recipeId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una receta" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRecipes.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.id}>
                        {recipe.name} - {recipe.product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.recipeId && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.recipeId.message}</p>
                )}
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="quantity">Cantidad a Producir *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    {...form.register('quantity', { valueAsNumber: true })}
                    placeholder="Ej: 20"
                  />
                  {form.formState.errors.quantity && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.quantity.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select onValueChange={(value) => form.setValue('priority', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione prioridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...form.register('startDate')}
                  />
                  {form.formState.errors.startDate && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.startDate.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="expectedEndDate">Fecha Esperada de Finalización *</Label>
                  <Input
                    id="expectedEndDate"
                    type="date"
                    {...form.register('expectedEndDate')}
                  />
                  {form.formState.errors.expectedEndDate && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.expectedEndDate.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="responsible">Responsable *</Label>
                <Input
                  id="responsible"
                  {...form.register('responsible')}
                  placeholder="Ej: Juan Pérez"
                />
                {form.formState.errors.responsible && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.responsible.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  {...form.register('notes')}
                  placeholder="Notas adicionales..."
                  rows={3}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Orden</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por número, receta o responsable..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
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
              <Label htmlFor="priority">Prioridad</Label>
              <select
                id="priority"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            Órdenes de Producción ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Receta</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Fechas</TableHead>
                <TableHead>Progreso</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.number}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.recipe.name}</div>
                      <div className="text-sm text-muted-foreground">{order.recipe.product.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.quantity} {order.recipe.yieldUnit}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {order.responsible}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Inicio: {order.startDate.toLocaleDateString()}</div>
                      <div>Fin: {order.expectedEndDate.toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(order.progress)}`}
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{order.progress}%</div>
                  </TableCell>
                  <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(order)}
                        disabled={order.status !== 'pending'}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'in_progress')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === 'in_progress' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={order.status !== 'pending'}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Orden de Producción</DialogTitle>
            <DialogDescription>
              Modifique los datos de la orden de producción
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleEditOrder)} className="space-y-4">
            <div>
              <Label htmlFor="edit-recipeId">Receta *</Label>
              <Select onValueChange={(value) => form.setValue('recipeId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una receta" />
                </SelectTrigger>
                <SelectContent>
                  {mockRecipes.map((recipe) => (
                    <SelectItem key={recipe.id} value={recipe.id}>
                      {recipe.name} - {recipe.product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.recipeId && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.recipeId.message}</p>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-quantity">Cantidad a Producir *</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  step="0.01"
                  {...form.register('quantity', { valueAsNumber: true })}
                  placeholder="Ej: 20"
                />
                {form.formState.errors.quantity && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.quantity.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-priority">Prioridad</Label>
                <Select onValueChange={(value) => form.setValue('priority', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-startDate">Fecha de Inicio *</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  {...form.register('startDate')}
                />
                {form.formState.errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.startDate.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-expectedEndDate">Fecha Esperada de Finalización *</Label>
                <Input
                  id="edit-expectedEndDate"
                  type="date"
                  {...form.register('expectedEndDate')}
                />
                {form.formState.errors.expectedEndDate && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.expectedEndDate.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-responsible">Responsable *</Label>
              <Input
                id="edit-responsible"
                {...form.register('responsible')}
                placeholder="Ej: Juan Pérez"
              />
              {form.formState.errors.responsible && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.responsible.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-notes">Notas</Label>
              <Textarea
                id="edit-notes"
                {...form.register('notes')}
                placeholder="Notas adicionales..."
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 