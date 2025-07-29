import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, MapPin, Search } from 'lucide-react';

// Schema para validación
const stateSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  module: z.enum(['orders', 'payments', 'inventory', 'production', 'general']),
  color: z.enum(['default', 'secondary', 'destructive', 'outline', 'success', 'warning']),
  isActive: z.boolean().default(true)
});

type StateFormData = z.infer<typeof stateSchema>;

// Datos mock
const mockStates = [
  {
    id: '1',
    code: 'PEN',
    name: 'Pendiente',
    description: 'Estado inicial de órdenes y pagos',
    module: 'orders' as const,
    color: 'warning' as const,
    isActive: true
  },
  {
    id: '2',
    code: 'APR',
    name: 'Aprobado',
    description: 'Estado de aprobación para órdenes y pagos',
    module: 'orders' as const,
    color: 'success' as const,
    isActive: true
  },
  {
    id: '3',
    code: 'REC',
    name: 'Rechazado',
    description: 'Estado de rechazo para órdenes y pagos',
    module: 'orders' as const,
    color: 'destructive' as const,
    isActive: true
  },
  {
    id: '4',
    code: 'COM',
    name: 'Completado',
    description: 'Estado final de órdenes y pagos',
    module: 'orders' as const,
    color: 'success' as const,
    isActive: true
  },
  {
    id: '5',
    code: 'CAN',
    name: 'Cancelado',
    description: 'Estado de cancelación para órdenes y pagos',
    module: 'orders' as const,
    color: 'destructive' as const,
    isActive: true
  },
  {
    id: '6',
    code: 'PAG',
    name: 'Pagado',
    description: 'Estado de pago completado',
    module: 'payments' as const,
    color: 'success' as const,
    isActive: true
  },
  {
    id: '7',
    code: 'PAR',
    name: 'Pago Parcial',
    description: 'Estado de pago parcial',
    module: 'payments' as const,
    color: 'warning' as const,
    isActive: true
  },
  {
    id: '8',
    code: 'VEN',
    name: 'Vencido',
    description: 'Estado de pago vencido',
    module: 'payments' as const,
    color: 'destructive' as const,
    isActive: true
  }
];

const modules = [
  { value: 'orders', label: 'Órdenes' },
  { value: 'payments', label: 'Pagos' },
  { value: 'inventory', label: 'Inventario' },
  { value: 'production', label: 'Producción' },
  { value: 'general', label: 'General' }
];

const colors = [
  { value: 'default', label: 'Predeterminado' },
  { value: 'secondary', label: 'Secundario' },
  { value: 'destructive', label: 'Destructivo' },
  { value: 'outline', label: 'Contorno' },
  { value: 'success', label: 'Éxito' },
  { value: 'warning', label: 'Advertencia' }
];

export default function StatesPage() {
  const [states, setStates] = useState(mockStates);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingState, setEditingState] = useState<StateFormData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<StateFormData>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      module: 'orders',
      color: 'default',
      isActive: true
    }
  });

  const handleCreateState = (data: StateFormData) => {
    const newState = {
      id: Date.now().toString(),
      ...data
    };
    setStates([...states, newState]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditState = (data: StateFormData) => {
    if (editingState) {
      setStates(states.map(s => 
        s.id === editingState.id ? { ...s, ...data } : s
      ));
    }
    setIsEditDialogOpen(false);
    setEditingState(null);
    form.reset();
  };

  const handleDeleteState = (id: string) => {
    setStates(states.filter(s => s.id !== id));
  };

  const openEditDialog = (state: any) => {
    setEditingState(state);
    form.reset(state);
    setIsEditDialogOpen(true);
  };

  const filteredStates = states.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getModuleLabel = (module: string) => {
    return modules.find(m => m.value === module)?.label || module;
  };

  const getColorLabel = (color: string) => {
    return colors.find(c => c.value === color)?.label || color;
  };

  const getStateBadge = (state: any) => {
    return (
      <Badge variant={state.color}>
        {state.name}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estados</h1>
          <p className="text-muted-foreground">
            Gestión de estados para diferentes módulos del sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Estado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Estado</DialogTitle>
              <DialogDescription>
                Agrega un nuevo estado al sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateState)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    {...form.register('code')}
                    placeholder="PEN"
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="module">Módulo</Label>
                  <Select onValueChange={(value) => form.setValue('module', value as any)} defaultValue={form.getValues('module')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar módulo" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.value} value={module.value}>
                          {module.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.module && (
                    <p className="text-sm text-red-500">{form.formState.errors.module.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Pendiente"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Descripción del estado"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select onValueChange={(value) => form.setValue('color', value as any)} defaultValue={form.getValues('color')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        {color.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.color && (
                  <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar estados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredStates.map((state) => (
          <Card key={state.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {state.name}
                  </CardTitle>
                  <CardDescription>
                    Código: {state.code} • Módulo: {getModuleLabel(state.module)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStateBadge(state)}
                  <Badge variant={state.isActive ? "default" : "secondary"}>
                    {state.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(state)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Estado</DialogTitle>
                        <DialogDescription>
                          Modifica la información del estado
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={form.handleSubmit(handleEditState)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-code">Código</Label>
                            <Input
                              id="edit-code"
                              {...form.register('code')}
                              placeholder="PEN"
                            />
                            {form.formState.errors.code && (
                              <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-module">Módulo</Label>
                            <Select onValueChange={(value) => form.setValue('module', value as any)} defaultValue={form.getValues('module')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar módulo" />
                              </SelectTrigger>
                              <SelectContent>
                                {modules.map((module) => (
                                  <SelectItem key={module.value} value={module.value}>
                                    {module.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {form.formState.errors.module && (
                              <p className="text-sm text-red-500">{form.formState.errors.module.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nombre</Label>
                          <Input
                            id="edit-name"
                            {...form.register('name')}
                            placeholder="Pendiente"
                          />
                          {form.formState.errors.name && (
                            <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-description">Descripción</Label>
                          <Textarea
                            id="edit-description"
                            {...form.register('description')}
                            placeholder="Descripción del estado"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-color">Color</Label>
                          <Select onValueChange={(value) => form.setValue('color', value as any)} defaultValue={form.getValues('color')}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar color" />
                            </SelectTrigger>
                            <SelectContent>
                              {colors.map((color) => (
                                <SelectItem key={color.value} value={color.value}>
                                  {color.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.color && (
                            <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
                          )}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit">Guardar</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteState(state.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {state.description && (
                  <p className="text-sm text-muted-foreground">{state.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Módulo: {getModuleLabel(state.module)}
                  </span>
                  <span className="text-muted-foreground">
                    • Color: {getColorLabel(state.color)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStates.length === 0 && (
        <div className="text-center py-8">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">No se encontraron estados</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando un nuevo estado.'}
          </p>
        </div>
      )}
    </div>
  );
} 