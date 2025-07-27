import { ProductRecipe, ProductionOrder, Product, Employee, InventoryMovement } from '@/types';

// Mock service for development
export class ProductionService {
  
  /**
   * Crea una nueva receta de producción
   */
  static async createRecipe(recipeData: {
    productId: string;
    name: string;
    description: string;
    version: string;
    ingredients: Array<{
      productId: string;
      quantity: number;
      unit: string;
    }>;
    yieldQuantity: number;
    yieldUnit: string;
    instructions: string;
    createdBy: string;
  }): Promise<ProductRecipe> {
    // Simular creación en backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRecipe: ProductRecipe = {
      id: `recipe-${Date.now()}`,
      productId: recipeData.productId,
      product: {} as Product, // Se llenaría con datos del producto
      name: recipeData.name,
      description: recipeData.description,
      version: recipeData.version,
      ingredients: recipeData.ingredients.map(ing => ({
        id: `ing-${Date.now()}-${Math.random()}`,
        productId: ing.productId,
        product: {} as Product, // Se llenaría con datos del producto
        quantity: ing.quantity,
        unit: ing.unit
      })),
      yieldQuantity: recipeData.yieldQuantity,
      yieldUnit: recipeData.yieldUnit,
      instructions: recipeData.instructions,
      createdBy: recipeData.createdBy,
      createdByUser: {} as Employee, // Se llenaría con datos del empleado
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };
    
    return newRecipe;
  }

  /**
   * Crea una nueva orden de producción
   */
  static async createProductionOrder(orderData: {
    productId: string;
    recipeId: string;
    quantity: number;
    unit: string;
    startDate: Date;
    estimatedEndDate: Date;
    responsibleId: string;
    priority: 'low' | 'medium' | 'high';
    notes?: string;
  }): Promise<ProductionOrder> {
    // Simular creación en backend
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const orderNumber = `OP-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    
    const newOrder: ProductionOrder = {
      id: `prod-${Date.now()}`,
      number: orderNumber,
      productId: orderData.productId,
      product: {} as Product, // Se llenaría con datos del producto
      recipeId: orderData.recipeId,
      recipe: {} as ProductRecipe, // Se llenaría con datos de la receta
      quantity: orderData.quantity,
      unit: orderData.unit,
      startDate: orderData.startDate,
      estimatedEndDate: orderData.estimatedEndDate,
      actualEndDate: undefined,
      responsibleId: orderData.responsibleId,
      responsible: {} as Employee, // Se llenaría con datos del empleado
      priority: orderData.priority,
      status: 'pre_production',
      progress: 0,
      notes: orderData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newOrder;
  }

  /**
   * Valida si hay stock suficiente de insumos para una orden de producción
   */
  static async validateIngredientsStock(recipeId: string, quantity: number): Promise<{
    valid: boolean;
    missingIngredients: Array<{
      productId: string;
      productName: string;
      required: number;
      available: number;
      unit: string;
    }>;
    message: string;
  }> {
    // Simular validación de stock
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - en producción se consultaría el inventario real
    const mockMissingIngredients = [
      {
        productId: '1',
        productName: 'Leche Entera',
        required: 100,
        available: 75,
        unit: 'Litro'
      }
    ];
    
    const hasMissingIngredients = mockMissingIngredients.length > 0;
    
    return {
      valid: !hasMissingIngredients,
      missingIngredients: mockMissingIngredients,
      message: hasMissingIngredients 
        ? 'Stock insuficiente de algunos insumos' 
        : 'Stock suficiente para todos los insumos'
    };
  }

  /**
   * Actualiza el progreso de una orden de producción
   */
  static async updateProductionProgress(orderId: string, progress: number, notes?: string): Promise<boolean> {
    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`Orden ${orderId} actualizada a progreso: ${progress}%`);
      
      // Si el progreso llega al 100%, cambiar estado a completado
      if (progress >= 100) {
        console.log(`Orden ${orderId} completada`);
      }
      
      return true;
    } catch (error) {
      console.error('Error al actualizar progreso:', error);
      return false;
    }
  }

  /**
   * Completa una orden de producción y genera los movimientos de inventario
   */
  static async completeProductionOrder(orderId: string, actualQuantity: number): Promise<{
    success: boolean;
    movements: InventoryMovement[];
    message: string;
  }> {
    try {
      // Simular procesamiento de completado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Crear movimiento de salida para insumos consumidos
      const ingredientMovements: InventoryMovement[] = [
        {
          id: `mov-${Date.now()}-1`,
          date: new Date(),
          type: 'exit',
          productId: '1',
          product: {} as Product,
          quantity: 100,
          unit: 'Litro',
          warehouseId: '1',
          warehouse: {} as any,
          description: 'Consumo para producción OP-2024-001',
          responsibleId: '1',
          responsible: {} as Employee,
          createdAt: new Date()
        }
      ];
      
      // Crear movimiento de entrada para producto terminado
      const finishedProductMovement: InventoryMovement = {
        id: `mov-${Date.now()}-2`,
        date: new Date(),
        type: 'entry',
        productId: '2',
        product: {} as Product,
        quantity: actualQuantity,
        unit: 'Kg',
        warehouseId: '1',
        warehouse: {} as any,
        description: 'Producto terminado de OP-2024-001',
        responsibleId: '1',
        responsible: {} as Employee,
        createdAt: new Date()
      };
      
      const allMovements = [...ingredientMovements, finishedProductMovement];
      
      return {
        success: true,
        movements: allMovements,
        message: `Orden completada. ${actualQuantity} unidades producidas.`
      };
      
    } catch (error) {
      console.error('Error al completar orden de producción:', error);
      return {
        success: false,
        movements: [],
        message: 'Error al completar la orden de producción'
      };
    }
  }

  /**
   * Obtiene todas las recetas con filtros
   */
  static async getRecipes(filters?: {
    productId?: string;
    status?: 'active' | 'inactive';
    version?: string;
  }): Promise<ProductRecipe[]> {
    // Simular consulta de recetas
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: '1',
        productId: '2',
        product: {
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
        name: 'Receta Tradicional Queso Paraguay',
        description: 'Receta tradicional para queso paraguay',
        version: '1.0',
        ingredients: [
          {
            id: '1',
            productId: '1',
            product: {
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
            quantity: 10,
            unit: 'Litro'
          }
        ],
        yieldQuantity: 1,
        yieldUnit: 'Kg',
        instructions: '1. Calentar la leche a 32°C\n2. Agregar cuajo\n3. Dejar reposar 30 minutos\n4. Cortar la cuajada\n5. Prensar por 2 horas',
        createdBy: '1',
        createdByUser: {} as Employee,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        status: 'active'
      }
    ];
  }

  /**
   * Obtiene todas las órdenes de producción con filtros
   */
  static async getProductionOrders(filters?: {
    status?: 'pre_production' | 'in_production' | 'completed' | 'cancelled';
    productId?: string;
    responsibleId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<ProductionOrder[]> {
    // Simular consulta de órdenes de producción
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: '1',
        number: 'OP-2024-001',
        productId: '2',
        product: {
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
        recipeId: '1',
        recipe: {} as ProductRecipe,
        quantity: 50,
        unit: 'Kg',
        startDate: new Date('2024-01-15'),
        estimatedEndDate: new Date('2024-01-17'),
        actualEndDate: undefined,
        responsibleId: '1',
        responsible: {
          id: '1',
          name: 'Juan Pérez',
          position: 'Encargado de Producción',
          email: 'juan.perez@rossi.com',
          phone: '0981-123-456',
          status: 'active'
        },
        priority: 'high',
        status: 'in_production',
        progress: 65,
        notes: 'Producción para pedido urgente',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-16')
      },
      {
        id: '2',
        number: 'OP-2024-002',
        productId: '2',
        product: {
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
        recipeId: '1',
        recipe: {} as ProductRecipe,
        quantity: 30,
        unit: 'Kg',
        startDate: new Date('2024-01-18'),
        estimatedEndDate: new Date('2024-01-20'),
        actualEndDate: undefined,
        responsibleId: '2',
        responsible: {
          id: '2',
          name: 'María González',
          position: 'Auxiliar de Producción',
          email: 'maria.gonzalez@rossi.com',
          phone: '0982-234-567',
          status: 'active'
        },
        priority: 'medium',
        status: 'pre_production',
        progress: 0,
        notes: 'Producción regular',
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18')
      }
    ];
  }

  /**
   * Obtiene el historial de avances de una orden de producción
   */
  static async getProductionProgress(orderId: string): Promise<Array<{
    id: string;
    date: Date;
    progress: number;
    notes: string;
    updatedBy: string;
    updatedByUser: Employee;
  }>> {
    // Simular consulta de historial de avances
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        date: new Date('2024-01-15 08:00'),
        progress: 0,
        notes: 'Inicio de producción',
        updatedBy: '1',
        updatedByUser: {} as Employee
      },
      {
        id: '2',
        date: new Date('2024-01-15 10:30'),
        progress: 25,
        notes: 'Leche calentada y cuajo agregado',
        updatedBy: '1',
        updatedByUser: {} as Employee
      },
      {
        id: '3',
        date: new Date('2024-01-15 14:00'),
        progress: 50,
        notes: 'Cuajada cortada, iniciando prensado',
        updatedBy: '1',
        updatedByUser: {} as Employee
      },
      {
        id: '4',
        date: new Date('2024-01-16 08:00'),
        progress: 65,
        notes: 'Prensado completado, iniciando maduración',
        updatedBy: '1',
        updatedByUser: {} as Employee
      }
    ];
  }

  /**
   * Calcula los insumos requeridos para una cantidad de producción
   */
  static async calculateRequiredIngredients(recipeId: string, targetQuantity: number): Promise<Array<{
    productId: string;
    productName: string;
    requiredQuantity: number;
    unit: string;
    availableQuantity: number;
    deficit: number;
  }>> {
    // Simular cálculo de insumos requeridos
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        productId: '1',
        productName: 'Leche Entera',
        requiredQuantity: 500, // 10L por 1Kg de queso * 50Kg
        unit: 'Litro',
        availableQuantity: 400,
        deficit: 100
      }
    ];
  }

  /**
   * Obtiene estadísticas de producción
   */
  static async getProductionStats(dateFrom?: Date, dateTo?: Date): Promise<{
    totalOrders: number;
    completedOrders: number;
    inProgressOrders: number;
    totalQuantity: number;
    averageProgress: number;
    topProducts: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unit: string;
    }>;
  }> {
    // Simular consulta de estadísticas
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      totalOrders: 15,
      completedOrders: 8,
      inProgressOrders: 4,
      totalQuantity: 450,
      averageProgress: 72,
      topProducts: [
        {
          productId: '2',
          productName: 'Queso Paraguay',
          quantity: 300,
          unit: 'Kg'
        },
        {
          productId: '3',
          productName: 'Yogur Natural',
          quantity: 150,
          unit: 'Litro'
        }
      ]
    };
  }

  /**
   * Cancela una orden de producción
   */
  static async cancelProductionOrder(orderId: string, reason: string): Promise<boolean> {
    try {
      // Simular cancelación
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Orden ${orderId} cancelada. Razón: ${reason}`);
      return true;
    } catch (error) {
      console.error('Error al cancelar orden:', error);
      return false;
    }
  }

  /**
   * Duplica una receta existente
   */
  static async duplicateRecipe(recipeId: string, newVersion: string): Promise<ProductRecipe> {
    try {
      // Simular duplicación
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const originalRecipe = await this.getRecipes({ productId: '2' });
      const recipe = originalRecipe[0];
      
      const duplicatedRecipe: ProductRecipe = {
        ...recipe,
        id: `recipe-${Date.now()}`,
        version: newVersion,
        name: `${recipe.name} (v${newVersion})`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return duplicatedRecipe;
    } catch (error) {
      console.error('Error al duplicar receta:', error);
      throw error;
    }
  }
} 