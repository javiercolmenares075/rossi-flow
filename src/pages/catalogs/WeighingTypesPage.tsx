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
import { Plus, Edit, Trash2, Scale, Search } from 'lucide-react';

// Schema para validación
const weighingTypeSchema = z.object({
  code: z.string().min(1, 'El código es obligatorio'),
  name: z.string().min(1, 'El nombre es obligatorio'),
  description: z.string().optional(),
  unit: z.enum(['kg', 'lb', 'g', 'oz']),
  precision: z.number().min(0.001, 'La precisión debe ser mayor a 0.001'),
  isActive: z.boolean().default(true)
});

type WeighingTypeFormData = z.infer<typeof weighingTypeSchema>;

// Datos mock
const mockWeighingTypes = [
  {
    id: '1',
    code: 'BAL-001',
    name: 'Balanza Digital Principal',
    description: 'Balanza digital de alta precisión para productos principales',
    unit: 'kg' as const,
    precision: 0.01,
    isActive: true
  },
  {
    id: '2',
    code: 'BAL-002',
    name: 'Balanza Analítica',
    description: 'Balanza analítica para mediciones precisas de ingredientes',
    unit: 'g' as const,
    precision: 0.001,
    isActive: true
  },
  {
    id: '3',
    code: 'BAL-003',
    name: 'Balanza Industrial',
    description: 'Balanza industrial para productos a granel',
    unit: 'kg' as const,
    precision: 0.1,
    isActive: false
  }
];

const units = [
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'lb', label: 'Libras (lb)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'oz', label: 'Onzas (oz)' }
];

export function WeighingTypesPage() {
  const [weighingTypes, setWeighingTypes] = useState(mockWeighingTypes);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingWeighingType, setEditingWeighingType] = useState<WeighingTypeFormData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<WeighingTypeFormData>({
    resolver: zodResolver(weighingTypeSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      unit: 'kg',
      precision: 0.01,
      isActive: true
    }
  });

  const handleCreateWeighingType = (data: WeighingTypeFormData) => {
    const newWeighingType = {
      id: Date.now().toString(),
      ...data
    };
    setWeighingTypes([...weighingTypes, newWeighingType]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditWeighingType = (data: WeighingTypeFormData) => {
    if (editingWeighingType) {
      setWeighingTypes(weighingTypes.map(wt => 
        wt.id === editingWeighingType.id ? { ...wt, ...data } : wt
      ));
    }
    setIsEditDialogOpen(false);
    setEditingWeighingType(null);
    form.reset();
  };

  const handleDeleteWeighingType = (id: string) => {
    setWeighingTypes(weighingTypes.filter(wt => wt.id !== id));
  };

  const openEditDialog = (weighingType: any) => {
    setEditingWeighingType(weighingType);
    form.reset(weighingType);
    setIsEditDialogOpen(true);
  };

  const filteredWeighingTypes = weighingTypes.filter(wt =>
    wt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wt.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUnitLabel = (unit: string) => {
    return units.find(u => u.value === unit)?.label || unit;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tipos de Pesaje</h1>
          <p className="text-muted-foreground">
            Gestión de equipos y métodos de pesaje utilizados en el sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Tipo de Pesaje
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Crear Tipo de Pesaje</DialogTitle>
              <DialogDescription>
                Agrega un nuevo equipo o método de pesaje al sistema
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateWeighingType)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    {...form.register('code')}
                    placeholder="BAL-001"
                  />
                  {form.formState.errors.code && (
                    <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unidad</Label>
                  <Select onValueChange={(value) => form.setValue('unit', value as any)} defaultValue={form.getValues('unit')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {units.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.unit && (
                    <p className="text-sm text-red-500">{form.formState.errors.unit.message}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="Balanza Digital Principal"
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
                  placeholder="Descripción del equipo o método de pesaje"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precision">Precisión</Label>
                <Input
                  id="precision"
                  type="number"
                  step="0.001"
                  {...form.register('precision', { valueAsNumber: true })}
                  placeholder="0.01"
                />
                {form.formState.errors.precision && (
                  <p className="text-sm text-red-500">{form.formState.errors.precision.message}</p>
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
            placeholder="Buscar tipos de pesaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredWeighingTypes.map((weighingType) => (
          <Card key={weighingType.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    {weighingType.name}
                  </CardTitle>
                  <CardDescription>
                    Código: {weighingType.code} • Unidad: {getUnitLabel(weighingType.unit)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={weighingType.isActive ? "default" : "secondary"}>
                    {weighingType.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(weighingType)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Editar Tipo de Pesaje</DialogTitle>
                        <DialogDescription>
                          Modifica la información del tipo de pesaje
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={form.handleSubmit(handleEditWeighingType)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-code">Código</Label>
                            <Input
                              id="edit-code"
                              {...form.register('code')}
                              placeholder="BAL-001"
                            />
                            {form.formState.errors.code && (
                              <p className="text-sm text-red-500">{form.formState.errors.code.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-unit">Unidad</Label>
                            <Select onValueChange={(value) => form.setValue('unit', value as any)} defaultValue={form.getValues('unit')}>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar unidad" />
                              </SelectTrigger>
                              <SelectContent>
                                {units.map((unit) => (
                                  <SelectItem key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {form.formState.errors.unit && (
                              <p className="text-sm text-red-500">{form.formState.errors.unit.message}</p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-name">Nombre</Label>
                          <Input
                            id="edit-name"
                            {...form.register('name')}
                            placeholder="Balanza Digital Principal"
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
                            placeholder="Descripción del equipo o método de pesaje"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-precision">Precisión</Label>
                          <Input
                            id="edit-precision"
                            type="number"
                            step="0.001"
                            {...form.register('precision', { valueAsNumber: true })}
                            placeholder="0.01"
                          />
                          {form.formState.errors.precision && (
                            <p className="text-sm text-red-500">{form.formState.errors.precision.message}</p>
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
                    onClick={() => handleDeleteWeighingType(weighingType.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {weighingType.description && (
                  <p className="text-sm text-muted-foreground">{weighingType.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Precisión: ±{weighingType.precision} {weighingType.unit}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWeighingTypes.length === 0 && (
        <div className="text-center py-8">
          <Scale className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">No se encontraron tipos de pesaje</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'Comienza agregando un nuevo tipo de pesaje.'}
          </p>
        </div>
      )}
    </div>
  );
} 