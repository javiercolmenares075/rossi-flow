import { InventoryMovement, Batch, Product, Warehouse, Employee, PurchaseOrder } from '@/types';

// Mock service for development
export class InventoryService {
  
  /**
   * Crea un nuevo movimiento de inventario
   */
  static async createMovement(movementData: {
    type: 'entry' | 'exit';
    productId: string;
    quantity: number;
    warehouseId: string;
    batchId?: string;
    expiryDate?: Date;
    description: string;
    responsibleId: string;
    purchaseOrderId?: string;
    weighingTypeId?: string;
  }): Promise<InventoryMovement> {
    // Simular creación en backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMovement: InventoryMovement = {
      id: `mov-${Date.now()}`,
      date: new Date(),
      type: movementData.type,
      productId: movementData.productId,
      product: {} as Product, // Se llenaría con datos del producto
      quantity: movementData.quantity,
      unit: 'unidad', // Se obtendría del producto
      warehouseId: movementData.warehouseId,
      warehouse: {} as Warehouse, // Se llenaría con datos del almacén
      batchId: movementData.batchId,
      batch: movementData.batchId ? {} as Batch : undefined,
      expiryDate: movementData.expiryDate,
      description: movementData.description,
      responsibleId: movementData.responsibleId,
      responsible: {} as Employee, // Se llenaría con datos del empleado
      weighingTypeId: movementData.weighingTypeId,
      weighingType: movementData.weighingTypeId ? {} as any : undefined,
      purchaseOrderId: movementData.purchaseOrderId,
      purchaseOrder: movementData.purchaseOrderId ? {} as PurchaseOrder : undefined,
      createdAt: new Date()
    };
    
    return newMovement;
  }

  /**
   * Crea un nuevo lote
   */
  static async createBatch(batchData: {
    productId: string;
    initialQuantity: number;
    warehouseId: string;
    expiryDate?: Date;
    description?: string;
  }): Promise<Batch> {
    // Simular creación en backend
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const batchCode = `LOT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
    const qrCode = await this.generateQRCode(batchCode);
    
    const newBatch: Batch = {
      id: `batch-${Date.now()}`,
      code: batchCode,
      productId: batchData.productId,
      product: {} as Product, // Se llenaría con datos del producto
      initialQuantity: batchData.initialQuantity,
      currentQuantity: batchData.initialQuantity,
      creationDate: new Date(),
      expiryDate: batchData.expiryDate,
      warehouseId: batchData.warehouseId,
      warehouse: {} as Warehouse, // Se llenaría con datos del almacén
      description: batchData.description,
      qrCode: qrCode,
      status: 'active'
    };
    
    return newBatch;
  }

  /**
   * Genera un código QR para un lote
   */
  static async generateQRCode(content: string): Promise<string> {
    // Simular generación de QR
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // En producción, aquí se usaría una librería como qrcode
    // Por ahora retornamos una URL simulada
    return `data:image/png;base64,QR_${content}_${Date.now()}`;
  }

  /**
   * Realiza ingreso masivo desde una orden de compra
   */
  static async bulkEntryFromPurchaseOrder(purchaseOrderId: string, entries: Array<{
    productId: string;
    quantity: number;
    warehouseId: string;
    expiryDate?: Date;
    description?: string;
    responsibleId: string;
  }>): Promise<{
    movements: InventoryMovement[];
    batches: Batch[];
    success: boolean;
    message: string;
  }> {
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const movements: InventoryMovement[] = [];
      const batches: Batch[] = [];
      
      for (const entry of entries) {
        // Crear movimiento de entrada
        const movement = await this.createMovement({
          type: 'entry',
          productId: entry.productId,
          quantity: entry.quantity,
          warehouseId: entry.warehouseId,
          expiryDate: entry.expiryDate,
          description: entry.description || `Ingreso desde orden de compra ${purchaseOrderId}`,
          responsibleId: entry.responsibleId,
          purchaseOrderId: purchaseOrderId
        });
        
        movements.push(movement);
        
        // Si el producto requiere control de lotes, crear lote
        const product = {} as Product; // Se obtendría del backend
        if (product.storageType === 'batch') {
          const batch = await this.createBatch({
            productId: entry.productId,
            initialQuantity: entry.quantity,
            warehouseId: entry.warehouseId,
            expiryDate: entry.expiryDate,
            description: entry.description
          });
          
          batches.push(batch);
        }
      }
      
      return {
        movements,
        batches,
        success: true,
        message: `Ingreso masivo completado: ${movements.length} movimientos, ${batches.length} lotes creados`
      };
      
    } catch (error) {
      console.error('Error en ingreso masivo:', error);
      return {
        movements: [],
        batches: [],
        success: false,
        message: 'Error al procesar ingreso masivo'
      };
    }
  }

  /**
   * Obtiene el stock actual de un producto
   */
  static async getProductStock(productId: string, warehouseId?: string): Promise<{
    total: number;
    byWarehouse: Array<{
      warehouseId: string;
      warehouseName: string;
      quantity: number;
    }>;
    batches: Array<{
      batchId: string;
      batchCode: string;
      quantity: number;
      expiryDate?: Date;
      status: string;
    }>;
  }> {
    // Simular consulta de stock
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      total: 150, // Stock total simulado
      byWarehouse: [
        {
          warehouseId: '1',
          warehouseName: 'Almacén Principal',
          quantity: 100
        },
        {
          warehouseId: '2',
          warehouseName: 'Almacén Secundario',
          quantity: 50
        }
      ],
      batches: [
        {
          batchId: '1',
          batchCode: 'LOT-2024-001',
          quantity: 75,
          expiryDate: new Date('2024-12-31'),
          status: 'active'
        },
        {
          batchId: '2',
          batchCode: 'LOT-2024-002',
          quantity: 75,
          expiryDate: new Date('2024-12-31'),
          status: 'active'
        }
      ]
    };
  }

  /**
   * Obtiene movimientos de inventario con filtros
   */
  static async getMovements(filters?: {
    productId?: string;
    warehouseId?: string;
    type?: 'entry' | 'exit';
    dateFrom?: Date;
    dateTo?: Date;
    purchaseOrderId?: string;
  }): Promise<InventoryMovement[]> {
    // Simular consulta de movimientos
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retornar movimientos simulados
    return [
      {
        id: '1',
        date: new Date('2024-01-15'),
        type: 'entry',
        productId: '1',
        product: {} as Product,
        quantity: 100,
        unit: 'Litro',
        warehouseId: '1',
        warehouse: {} as Warehouse,
        description: 'Ingreso inicial de leche',
        responsibleId: '1',
        responsible: {} as Employee,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        date: new Date('2024-01-16'),
        type: 'exit',
        productId: '1',
        product: {} as Product,
        quantity: 25,
        unit: 'Litro',
        warehouseId: '1',
        warehouse: {} as Warehouse,
        description: 'Salida para producción',
        responsibleId: '2',
        responsible: {} as Employee,
        createdAt: new Date('2024-01-16')
      }
    ];
  }

  /**
   * Obtiene lotes con filtros
   */
  static async getBatches(filters?: {
    productId?: string;
    warehouseId?: string;
    status?: 'active' | 'expired' | 'depleted';
    expiryDateFrom?: Date;
    expiryDateTo?: Date;
  }): Promise<Batch[]> {
    // Simular consulta de lotes
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        id: '1',
        code: 'LOT-2024-001',
        productId: '1',
        product: {} as Product,
        initialQuantity: 100,
        currentQuantity: 75,
        creationDate: new Date('2024-01-15'),
        expiryDate: new Date('2024-12-31'),
        warehouseId: '1',
        warehouse: {} as Warehouse,
        description: 'Lote de leche fresca',
        qrCode: 'data:image/png;base64,QR_LOT-2024-001_123456',
        status: 'active'
      },
      {
        id: '2',
        code: 'LOT-2024-002',
        productId: '2',
        product: {} as Product,
        initialQuantity: 50,
        currentQuantity: 30,
        creationDate: new Date('2024-01-10'),
        expiryDate: new Date('2024-06-30'),
        warehouseId: '1',
        warehouse: {} as Warehouse,
        description: 'Lote de queso',
        qrCode: 'data:image/png;base64,QR_LOT-2024-002_789012',
        status: 'active'
      }
    ];
  }

  /**
   * Actualiza la cantidad de un lote
   */
  static async updateBatchQuantity(batchId: string, newQuantity: number): Promise<boolean> {
    try {
      // Simular actualización
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`Lote ${batchId} actualizado a cantidad: ${newQuantity}`);
      return true;
    } catch (error) {
      console.error('Error al actualizar cantidad del lote:', error);
      return false;
    }
  }

  /**
   * Descarga el código QR de un lote
   */
  static async downloadQRCode(batchCode: string): Promise<void> {
    try {
      // Simular generación y descarga de QR
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear un blob simulado del QR
      const qrBlob = new Blob([`QR Code for ${batchCode}`], { type: 'image/png' });
      
      // Crear URL del blob
      const url = window.URL.createObjectURL(qrBlob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `QR_${batchCode}.png`;
      
      // Simular clic
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar QR:', error);
      throw error;
    }
  }

  /**
   * Valida si hay stock suficiente para una salida
   */
  static async validateStockForExit(productId: string, quantity: number, warehouseId?: string): Promise<{
    valid: boolean;
    available: number;
    message: string;
  }> {
    const stock = await this.getProductStock(productId, warehouseId);
    
    if (stock.total >= quantity) {
      return {
        valid: true,
        available: stock.total,
        message: 'Stock suficiente disponible'
      };
    } else {
      return {
        valid: false,
        available: stock.total,
        message: `Stock insuficiente. Disponible: ${stock.total}, Solicitado: ${quantity}`
      };
    }
  }

  /**
   * Obtiene productos con stock bajo
   */
  static async getLowStockProducts(): Promise<Array<{
    product: Product;
    currentStock: number;
    minStock: number;
    difference: number;
  }>> {
    // Simular consulta de productos con stock bajo
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        product: {} as Product,
        currentStock: 15,
        minStock: 50,
        difference: -35
      },
      {
        product: {} as Product,
        currentStock: 8,
        minStock: 20,
        difference: -12
      }
    ];
  }

  /**
   * Obtiene lotes próximos a vencer
   */
  static async getExpiringBatches(daysThreshold: number = 30): Promise<Array<{
    batch: Batch;
    daysUntilExpiry: number;
  }>> {
    // Simular consulta de lotes próximos a vencer
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return [
      {
        batch: {} as Batch,
        daysUntilExpiry: 15
      },
      {
        batch: {} as Batch,
        daysUntilExpiry: 7
      }
    ];
  }
} 