import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Package,
  Plus,
  Trash2,
  Save,
  Copy,
  FileText,
  Calculator,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Product, Employee } from '@/types';
import { ProductionService } from '@/lib/productionService';

// Mock data for development
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Leche Entera',
    code: 'LEC-001',
    type: 'Lácteos',
    unit: 'Litro',
    storageType: 'batch',
    requiresExpiryControl: true,
    minStock: 100,
    description: 'Leche entera pasteurizada',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Queso Paraguay',
    code: 'QUE-001',
    type: 'Lácteos',
    unit: 'Kg',
    storageType: 'batch',
    requiresExpiryControl: true,
    minStock: 50,
    description: 'Queso paraguay tradicional',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    name: 'Cuajo',
    code: 'CUJ-001',
    type: 'Enzimas',
    unit: 'ml',
    storageType: 'batch',
    requiresExpiryControl: true,
    minStock: 10,
    description: 'Enzima coagulante',
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14')
  },
  {
    id: '4',
    name: 'Sal',
    code: 'SAL-001',
    type: 'Condimentos',
    unit: 'Kg',
    storageType: 'bulk',
    requiresExpiryControl: false,
    minStock: 20,
    description: 'Sal refinada',
    status: 'active',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-13')
  }
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    position: 'Encargado de Producción',
    email: 'juan.perez@rossi.com',
    phone: '0981-123-456',
    status: 'active'
  },
  {
    id: '2',
    name: 'María González',
    position: 'Auxiliar de Producción',
    email: 'maria.gonzalez@rossi.com',
    phone: '0982-234-567',
    status: 'active'
  }
];

// Schema de validación
const recipeSchema = z.object({
  productId: z.string().min(1, 'Debe seleccionar un producto'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  version: z.string().min(1, 'Debe especificar una versión'),
  ingredients: z.array(z.object({
    productId: z.string().min(1, 'Debe seleccionar un ingrediente'),
    quantity: z.number().min(0.01, 'La cantidad debe ser mayor a 0'),
    unit: z.string().min(1, 'Debe especificar la unidad')
  })).min(1, 'Debe agregar al menos un ingrediente'),
  yieldQuantity: z.number().min(0.01, 'La cantidad de rendimiento debe ser mayor a 0'),
  yieldUnit: z.string().min(1, 'Debe especificar la unidad de rendimiento'),
  instructions: z.string().min(20, 'Las instrucciones deben tener al menos 20 caracteres'),
  createdBy: z.string().min(1, 'Debe seleccionar un responsable')
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface RecipeFormProps {
  onSuccess?: (recipe: any) => void;
  onCancel?: () => void;
  initialData?: Partial<RecipeFormData>;
  isEditing?: boolean;
}

export function RecipeForm({ 
  onSuccess, 
  onCancel, 
  initialData,
  isEditing = false 
}: RecipeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [ingredientsValidation, setIngredientsValidation] = useState<any>(null);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      description: '',
      version: '1.0',
      ingredients: [{ productId: '', quantity: 0, unit: '' }],
      yieldQuantity: 1,
      yieldUnit: '',
      instructions: '',
      ...initialData
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients'
  });

  const watchedProductId = form.watch('productId');
  const watchedIngredients = form.watch('ingredients');

  // Actualizar producto seleccionado
  useEffect(() => {
    if (watchedProductId) {
      const product = mockProducts.find(p => p.id === watchedProductId);
      setSelectedProduct(product || null);
      
      // Auto-completar unidad de rendimiento
      if (product && !form.getValues('yieldUnit')) {
        form.setValue('yieldUnit', product.unit);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [watchedProductId, form]);

  // Validar ingredientes
  useEffect(() => {
    validateIngredients();
  }, [watchedIngredients]);

  const validateIngredients = () => {
    const ingredients = form.getValues('ingredients');
    const hasEmptyIngredients = ingredients.some(ing => !ing.productId || ing.quantity <= 0);
    
    if (hasEmptyIngredients) {
      setIngredientsValidation({
        valid: false,
        message: 'Todos los ingredientes deben estar completos'
      });
    } else {
      setIngredientsValidation({
        valid: true,
        message: 'Ingredientes válidos'
      });
    }
  };

  const handleSubmit = async (data: RecipeFormData) => {
    setIsSubmitting(true);
    try {
      const recipe = await ProductionService.createRecipe({
        productId: data.productId,
        name: data.name,
        description: data.description,
        version: data.version,
        ingredients: data.ingredients,
        yieldQuantity: data.yieldQuantity,
        yieldUnit: data.yieldUnit,
        instructions: data.instructions,
        createdBy: data.createdBy
      });

      console.log('Receta creada:', recipe);
      
      if (onSuccess) {
        onSuccess(recipe);
      }
      
      alert('Receta creada exitosamente');
      
    } catch (error) {
      console.error('Error al crear receta:', error);
      alert('Error al crear receta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIngredient = () => {
    append({ productId: '', quantity: 0, unit: '' });
  };

  const handleRemoveIngredient = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleIngredientChange = (index: number, field: 'productId' | 'quantity' | 'unit', value: any) => {
    const ingredients = [...form.getValues('ingredients')];
    ingredients[index][field] = value;
    
    // Auto-completar unidad si se selecciona un producto
    if (field === 'productId' && value) {
      const product = mockProducts.find(p => p.id === value);
      if (product) {
        ingredients[index].unit = product.unit;
      }
    }
    
    form.setValue('ingredients', ingredients);
  };

  const calculateYieldRatio = () => {
    const yieldQty = form.getValues('yieldQuantity');
    const yieldUnit = form.getValues('yieldUnit');
    
    if (yieldQty && yieldUnit) {
      return `1 ${yieldUnit} de producto terminado`;
    }
    return '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {isEditing ? 'Editar Receta' : 'Nueva Receta de Producción'}
        </CardTitle>
        <CardDescription>
          Defina los ingredientes, cantidades e instrucciones para la producción
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Producto a Producir *</Label>
              <Select onValueChange={(value) => form.setValue('productId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un producto" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.filter(p => p.type === 'Lácteos').map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{product.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {product.code} - {product.unit}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.productId && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.productId.message}</p>
              )}
            </div>

            <div>
              <Label>Versión *</Label>
              <Input
                placeholder="1.0"
                {...form.register('version')}
              />
              {form.formState.errors.version && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.version.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nombre de la Receta *</Label>
              <Input
                placeholder="Ej: Receta Tradicional Queso Paraguay"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label>Responsable *</Label>
              <Select onValueChange={(value) => form.setValue('createdBy', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un responsable" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{employee.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {employee.position}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.createdBy && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.createdBy.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Descripción *</Label>
            <Textarea
              placeholder="Describa el propósito y características de esta receta..."
              rows={3}
              {...form.register('description')}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          {/* Información del Producto Seleccionado */}
          {selectedProduct && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Información del Producto</h4>
              <div className="grid gap-2 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium">Código</Label>
                  <p className="text-sm">{selectedProduct.code}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p className="text-sm">{selectedProduct.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Unidad</Label>
                  <p className="text-sm">{selectedProduct.unit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Rendimiento */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Cantidad de Rendimiento *</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="1"
                {...form.register('yieldQuantity', { valueAsNumber: true })}
              />
              {form.formState.errors.yieldQuantity && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.yieldQuantity.message}</p>
              )}
            </div>

            <div>
              <Label>Unidad de Rendimiento *</Label>
              <Input
                placeholder={selectedProduct?.unit || 'Kg'}
                {...form.register('yieldUnit')}
              />
              {form.formState.errors.yieldUnit && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.yieldUnit.message}</p>
              )}
            </div>
          </div>

          {/* Ratio de Rendimiento */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Ratio de Rendimiento:</span>
              <Badge variant="outline">{calculateYieldRatio()}</Badge>
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Ingredientes</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleAddIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Ingrediente
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium">Ingrediente {index + 1}</h5>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label>Producto *</Label>
                      <Select 
                        value={field.productId} 
                        onValueChange={(value) => handleIngredientChange(index, 'productId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un ingrediente" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">{product.name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {product.code} - {product.unit}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Cantidad *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={field.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <Label>Unidad *</Label>
                      <Input
                        placeholder="Litro"
                        value={field.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Validación de Ingredientes */}
            {ingredientsValidation && (
              <Alert variant={ingredientsValidation.valid ? "default" : "destructive"}>
                {ingredientsValidation.valid ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertDescription>
                  {ingredientsValidation.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Instrucciones */}
          <div>
            <Label>Instrucciones de Producción *</Label>
            <Textarea
              placeholder="1. Calentar la leche a 32°C&#10;2. Agregar cuajo&#10;3. Dejar reposar 30 minutos&#10;4. Cortar la cuajada&#10;5. Prensar por 2 horas"
              rows={8}
              {...form.register('instructions')}
            />
            {form.formState.errors.instructions && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.instructions.message}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Use numeración para cada paso del proceso
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || (ingredientsValidation && !ingredientsValidation.valid)}
            >
              {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Receta' : 'Crear Receta')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 