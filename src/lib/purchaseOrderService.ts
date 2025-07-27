import { PurchaseOrder, Provider, Product } from '@/types';

// Mock service for development
export class PurchaseOrderService {
  
  /**
   * Genera un PDF de la orden de compra
   */
  static async generatePDF(order: PurchaseOrder): Promise<Blob> {
    // Simular generación de PDF
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // En producción, aquí se usaría una librería como jsPDF o similar
    const pdfContent = `
      ORDEN DE COMPRA
      
      Número: ${order.number}
      Fecha: ${order.creationDate.toLocaleDateString()}
      
      PROVEEDOR:
      ${order.provider.businessName}
      RUC: ${order.provider.ruc}
      Email: ${order.provider.email}
      
      PRODUCTOS:
      ${order.items.map(item => 
        `${item.product.name} - ${item.quantity} ${item.product.unit} - ${item.unitPrice} ₲`
      ).join('\n')}
      
      SUBTOTAL: ${order.subtotal.toLocaleString()} ₲
      IVA (15%): ${order.iva.toLocaleString()} ₲
      TOTAL: ${order.total.toLocaleString()} ₲
      
      Fecha estimada de llegada: ${order.estimatedArrivalDate.toLocaleDateString()}
      Fecha programada de pago: ${order.scheduledPaymentDate?.toLocaleDateString()}
    `;
    
    // Crear un blob simulado del PDF
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  /**
   * Envía la orden de compra por email al proveedor
   */
  static async sendEmail(order: PurchaseOrder, provider: Provider): Promise<boolean> {
    try {
      // Simular envío de email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const emailContent = {
        to: provider.email,
        subject: `Orden de Compra ${order.number} - Inventarios Rossi`,
        body: `
          Estimado proveedor ${provider.businessName},
          
          Adjunto encontrará la orden de compra ${order.number} por un total de ${order.total.toLocaleString()} ₲.
          
          Fecha estimada de entrega: ${order.estimatedArrivalDate.toLocaleDateString()}
          Fecha programada de pago: ${order.scheduledPaymentDate?.toLocaleDateString()}
          
          Productos solicitados:
          ${order.items.map(item => 
            `- ${item.product.name}: ${item.quantity} ${item.product.unit}`
          ).join('\n')}
          
          Por favor confirme la recepción de esta orden.
          
          Saludos cordiales,
          Equipo de Inventarios Rossi
        `
      };
      
      console.log('Email enviado:', emailContent);
      return true;
    } catch (error) {
      console.error('Error al enviar email:', error);
      return false;
    }
  }

  /**
   * Envía la orden de compra por WhatsApp al proveedor
   */
  static async sendWhatsApp(order: PurchaseOrder, provider: Provider): Promise<boolean> {
    try {
      // Simular envío por WhatsApp
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const whatsappMessage = `
        🛒 *Orden de Compra ${order.number}*
        
        Estimado ${provider.businessName},
        
        Hemos generado una nueva orden de compra por un total de *${order.total.toLocaleString()} ₲*.
        
        📅 Fecha estimada de entrega: ${order.estimatedArrivalDate.toLocaleDateString()}
        💰 Fecha programada de pago: ${order.scheduledPaymentDate?.toLocaleDateString()}
        
        📦 Productos solicitados:
        ${order.items.map(item => 
          `• ${item.product.name}: ${item.quantity} ${item.product.unit}`
        ).join('\n')}
        
        Por favor confirme la recepción de esta orden.
        
        Saludos cordiales,
        Equipo de Inventarios Rossi
      `;
      
      console.log('WhatsApp enviado:', whatsappMessage);
      return true;
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error);
      return false;
    }
  }

  /**
   * Crea una nueva orden de compra
   */
  static async createOrder(orderData: {
    providerId: string;
    creationDate: Date;
    estimatedArrivalDate: Date;
    scheduledPaymentDate?: Date;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      description?: string;
    }>;
    notes?: string;
  }): Promise<PurchaseOrder> {
    // Simular creación en backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En producción, aquí se haría la llamada al API
    const newOrder: PurchaseOrder = {
      id: `oc-${Date.now()}`,
      number: `OC-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      providerId: orderData.providerId,
      provider: {} as Provider, // Se llenaría con datos del proveedor
      creationDate: orderData.creationDate,
      estimatedArrivalDate: orderData.estimatedArrivalDate,
      scheduledPaymentDate: orderData.scheduledPaymentDate,
      paymentStatus: 'unpaid',
      items: orderData.items.map(item => ({
        id: `item-${Date.now()}-${Math.random()}`,
        productId: item.productId,
        product: {} as Product, // Se llenaría con datos del producto
        quantity: item.quantity,
        unitCost: item.unitPrice,
        subtotal: item.quantity * item.unitPrice
      })),
      subtotal: orderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
      iva: orderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * 0.15,
      total: orderData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * 1.15,
      status: 'pre_order',
      emailSent: false,
      whatsappSent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newOrder;
  }

  /**
   * Actualiza el estado de una orden de compra
   */
  static async updateOrderStatus(orderId: string, status: 'pre_order' | 'issued' | 'received' | 'paid'): Promise<boolean> {
    try {
      // Simular actualización en backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Orden ${orderId} actualizada a estado: ${status}`);
      return true;
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      return false;
    }
  }

  /**
   * Marca una orden como enviada por email
   */
  static async markEmailSent(orderId: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Orden ${orderId} marcada como email enviado`);
      return true;
    } catch (error) {
      console.error('Error al marcar email enviado:', error);
      return false;
    }
  }

  /**
   * Marca una orden como enviada por WhatsApp
   */
  static async markWhatsAppSent(orderId: string): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log(`Orden ${orderId} marcada como WhatsApp enviado`);
      return true;
    } catch (error) {
      console.error('Error al marcar WhatsApp enviado:', error);
      return false;
    }
  }

  /**
   * Descarga el PDF de la orden de compra
   */
  static async downloadPDF(order: PurchaseOrder): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(order);
      
      // Crear URL del blob
      const url = window.URL.createObjectURL(pdfBlob);
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `Orden_Compra_${order.number}.pdf`;
      
      // Simular clic
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      throw error;
    }
  }
} 