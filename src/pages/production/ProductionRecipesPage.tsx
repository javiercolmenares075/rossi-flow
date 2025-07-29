import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
  Copy,
  History,
  Calculator,
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';

// Schema de validación
const recipeIngredientSchema = z.object({
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  unit: z.string().min(1, 'La unidad es obligatoria')
});

const recipeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  version: z.string().min(1, 'La versión es obligatoria'),
  description: z.string().optional(),
  yield: z.number().min(0.01, 'El rendimiento debe ser mayor a 0'),
  yieldUnit: z.string().min(1, 'La unidad de rendimiento es obligatoria'),
  ingredients: z.array(recipeIngredientSchema).min(1, 'Debe agregar al menos un ingrediente'),
  instructions: z.string().optional(),
  status: z.enum(['active', 'inactive', 'draft'])
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeIngredient {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
    unit: string;
  };
  quantity: number;
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
  version: string;
  description?: string;
  yield: number;
  yieldUnit: string;
  ingredients: RecipeIngredient[];
  instructions?: string;
  status: 'active' | 'inactive' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastUsed?: Date;
  usageCount: number;
}

// Mock data
const mockProducts = [
  { id: '1', name: 'Queso Paraguay', code: 'QUE-001', unit: 'Kg' },
  { id: '2', name: 'Yogur Natural', code: 'YOG-001', unit: 'Litro' },
  { id: '3', name: 'Leche Entera', code: 'LEC-001', unit: 'Litro' },
  { id: '4', name: 'Crema de Leche', code: 'CRE-001', unit: 'Litro' },
  { id: '5', name: 'Sal', code: 'SAL-001', unit: 'Kg' },
  { id: '6', name: 'Cultivo Láctico', code: 'CUL-001', unit: 'Unidad' }
];

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Queso Paraguay Tradicional',
    productId: '1',
    product: mockProducts[0],
    version: '1.0',
    description: 'Receta tradicional para queso paraguay',
    yield: 10,
    yieldUnit: 'Kg',
    ingredients: [
      {
        id: '1',
        productId: '3',
        product: mockProducts[2],
        quantity: 100,
        unit: 'Litro'
      },
      {
        id: '2',
        productId: '5',
        product: mockProducts[4],
        quantity: 2,
        unit: 'Kg'
      },
      {
        id: '3',
        productId: '6',
        product: mockProducts[5],
        quantity: 1,
        unit: 'Unidad'
      }
    ],
    instructions: '1. Calentar la leche a 32°C\n2. Agregar cultivo láctico\n3. Coagular por 2 horas\n4. Cortar la cuajada\n5. Prensar por 24 horas',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'Juan Pérez',
    lastUsed: new Date('2024-01-20'),
    usageCount: 15
  },
  {
    id: '2',
    name: 'Yogur Natural',
    productId: '2',
    product: mockProducts[1],
    version: '2.1',
    description: 'Yogur natural sin azúcar',
    yield: 50,
    yieldUnit: 'Litro',
    ingredients: [
      {
        id: '4',
        productId: '3',
        product: mockProducts[2],
        quantity: 50,
        unit: 'Litro'
      },
      {
        id: '5',
        productId: '6',
        product: mockProducts[5],
        quantity: 2,
        unit: 'Unidad'
      }
    ],
    instructions: '1. Pasteurizar la leche\n2. Enfriar a 42°C\n3. Inocular cultivo\n4. Incubar por 6 horas\n5. Refrigerar',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    createdBy: 'María González',
    lastUsed: new Date('2024-01-18'),
    usageCount: 8
  }
];

export default function ProductionRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      productId: '',
      version: '1.0',
      description: '',
      yield: 0,
      yieldUnit: '',
      ingredients: [{ productId: '', quantity: 0, unit: '' }],
      instructions: '',
      status: 'draft'
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients'
  });

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || recipe.status === filterStatus;
    const matchesProduct = filterProduct === 'all' || recipe.productId === filterProduct;
    
    return matchesSearch && matchesStatus && matchesProduct;
  });

  const handleCreateRecipe = (data: RecipeFormData) => {
    const newRecipe: Recipe = {
      id: `rec-${Date.now()}`,
      ...data,
      product: mockProducts.find(p => p.id === data.productId)!,
      ingredients: data.ingredients.map((ing, index) => ({
        id: `ing-${Date.now()}-${index}`,
        ...ing,
        product: mockProducts.find(p => p.id === ing.productId)!
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'Usuario Actual',
      usageCount: 0
    };
    
    setRecipes([...recipes, newRecipe]);
    setIsCreateDialogOpen(false);
    form.reset();
  };

  const handleEditRecipe = (data: RecipeFormData) => {
    if (!selectedRecipe) return;
    
    const updatedRecipe: Recipe = {
      ...selectedRecipe,
      ...data,
      product: mockProducts.find(p => p.id === data.productId)!,
      ingredients: data.ingredients.map((ing, index) => ({
        id: `ing-${Date.now()}-${index}`,
        ...ing,
        product: mockProducts.find(p => p.id === ing.productId)!
      })),
      updatedAt: new Date()
    };
    
    setRecipes(recipes.map(r => r.id === selectedRecipe.id ? updatedRecipe : r));
    setIsEditDialogOpen(false);
    setSelectedRecipe(null);
    form.reset();
  };

  const handleDeleteRecipe = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe && recipe.usageCount > 0) {
      alert('No se puede eliminar una receta que ha sido utilizada en producción');
      return;
    }
    
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const openEditDialog = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    form.reset({
      name: recipe.name,
      productId: recipe.productId,
      version: recipe.version,
      description: recipe.description || '',
      yield: recipe.yield,
      yieldUnit: recipe.yieldUnit,
      ingredients: recipe.ingredients.map(ing => ({
        productId: ing.productId,
        quantity: ing.quantity,
        unit: ing.unit
      })),
      instructions: recipe.instructions || '',
      status: recipe.status
    });
    setIsEditDialogOpen(true);
  };

  const handleAddIngredient = () => {
    append({ productId: '', quantity: 0, unit: '' });
  };

  const handleRemoveIngredient = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Activa
          </Badge>
        );
      case 'inactive':
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Inactiva
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" />
            Borrador
          </Badge>
        );
      default:
        return null;
    }
  };

  const calculateTotalIngredients = (recipe: Recipe) => {
    return recipe.ingredients.reduce((sum, ing) => sum + ing.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recetas de Producción</h1>
          <p className="text-muted-foreground">
            Gestión de recetas y fórmulas para productos lácteos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Receta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nueva Receta</DialogTitle>
              <DialogDescription>
                Defina una nueva receta de producción
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(handleCreateRecipe)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nombre de la Receta *</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Ej: Queso Paraguay Tradicional"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="productId">Producto Final *</Label>
                  <Select onValueChange={(value) => form.setValue('productId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.productId && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.productId.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="version">Versión *</Label>
                  <Input
                    id="version"
                    {...form.register('version')}
                    placeholder="Ej: 1.0"
                  />
                  {form.formState.errors.version && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.version.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="yield">Rendimiento *</Label>
                  <Input
                    id="yield"
                    type="number"
                    step="0.01"
                    {...form.register('yield', { valueAsNumber: true })}
                    placeholder="Ej: 10"
                  />
                  {form.formState.errors.yield && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.yield.message}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="yieldUnit">Unidad de Rendimiento *</Label>
                  <Input
                    id="yieldUnit"
                    {...form.register('yieldUnit')}
                    placeholder="Ej: Kg"
                  />
                  {form.formState.errors.yieldUnit && (
                    <p className="text-sm text-red-500 mt-1">{form.formState.errors.yieldUnit.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Descripción de la receta..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Ingredientes *</Label>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid gap-4 p-4 border rounded-lg md:grid-cols-4">
                      <div>
                        <Label>Producto</Label>
                        <Select onValueChange={(value) => form.setValue(`ingredients.${index}.productId`, value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione un producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} ({product.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Cantidad</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0"
                          {...form.register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </div>
                      
                      <div>
                        <Label>Unidad</Label>
                        <Input
                          placeholder="Ej: Kg"
                          {...form.register(`ingredients.${index}.unit`)}
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveIngredient(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <Button type="button" variant="outline" onClick={handleAddIngredient}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Ingrediente
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="instructions">Instrucciones</Label>
                <Textarea
                  id="instructions"
                  {...form.register('instructions')}
                  placeholder="Instrucciones paso a paso..."
                  rows={5}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Receta</Button>
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
                  placeholder="Buscar por nombre de receta o producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="product">Producto</Label>
              <select
                id="product"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todos los productos</option>
                {mockProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
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
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
                <option value="draft">Borradores</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recetas de Producción ({filteredRecipes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receta</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Versión</TableHead>
                <TableHead>Rendimiento</TableHead>
                <TableHead>Ingredientes</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Uso</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {recipe.description?.substring(0, 50)}...
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{recipe.product.name}</div>
                      <div className="text-sm text-muted-foreground">{recipe.product.code}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{recipe.version}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{recipe.yield} {recipe.yieldUnit}</div>
                      <div className="text-sm text-muted-foreground">
                        {recipe.ingredients.length} ingredientes
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {recipe.ingredients.map((ing, index) => (
                        <div key={ing.id} className="text-muted-foreground">
                          {ing.product.name}: {ing.quantity} {ing.unit}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(recipe.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{recipe.usageCount} veces</div>
                      {recipe.lastUsed && (
                        <div className="text-muted-foreground">
                          Último: {recipe.lastUsed.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(recipe)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        disabled={recipe.usageCount > 0}
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

      {/* Dialog de Edición - Similar al de creación pero con datos precargados */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Receta</DialogTitle>
            <DialogDescription>
              Modifique los datos de la receta
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(handleEditRecipe)} className="space-y-6">
            {/* Mismo contenido que el formulario de creación */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-name">Nombre de la Receta *</Label>
                <Input
                  id="edit-name"
                  {...form.register('name')}
                  placeholder="Ej: Queso Paraguay Tradicional"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-productId">Producto Final *</Label>
                <Select onValueChange={(value) => form.setValue('productId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.productId && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.productId.message}</p>
                )}
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="edit-version">Versión *</Label>
                <Input
                  id="edit-version"
                  {...form.register('version')}
                  placeholder="Ej: 1.0"
                />
                {form.formState.errors.version && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.version.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-yield">Rendimiento *</Label>
                <Input
                  id="edit-yield"
                  type="number"
                  step="0.01"
                  {...form.register('yield', { valueAsNumber: true })}
                  placeholder="Ej: 10"
                />
                {form.formState.errors.yield && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.yield.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="edit-yieldUnit">Unidad de Rendimiento *</Label>
                <Input
                  id="edit-yieldUnit"
                  {...form.register('yieldUnit')}
                  placeholder="Ej: Kg"
                />
                {form.formState.errors.yieldUnit && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.yieldUnit.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Descripción</Label>
              <Textarea
                id="edit-description"
                {...form.register('description')}
                placeholder="Descripción de la receta..."
                rows={3}
              />
            </div>
            
            <div>
              <Label>Ingredientes *</Label>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-4 p-4 border rounded-lg md:grid-cols-4">
                    <div>
                      <Label>Producto</Label>
                      <Select onValueChange={(value) => form.setValue(`ingredients.${index}.productId`, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un producto" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} ({product.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...form.register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                      />
                    </div>
                    
                    <div>
                      <Label>Unidad</Label>
                      <Input
                        placeholder="Ej: Kg"
                        {...form.register(`ingredients.${index}.unit`)}
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIngredient(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button type="button" variant="outline" onClick={handleAddIngredient}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Ingrediente
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-instructions">Instrucciones</Label>
              <Textarea
                id="edit-instructions"
                {...form.register('instructions')}
                placeholder="Instrucciones paso a paso..."
                rows={5}
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