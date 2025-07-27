import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Mail,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { PurchaseOrder, Provider } from '@/types';
import { PurchaseOrderService } from '@/lib/purchaseOrderService';

interface PurchaseOrderActionsProps {
  order: PurchaseOrder;
  onView: (order: PurchaseOrder) => void;
  onEdit: (order: PurchaseOrder) => void;
  onDelete: (orderId: string) => void;
  onStatusChange: (orderId: string, status: 'pre_order' | 'issued' | 'received' | 'paid') => void;
}

export function PurchaseOrderActions({
  order,
  onView,
  onEdit,
  onDelete,
  onStatusChange
}: PurchaseOrderActionsProps) {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      await PurchaseOrderService.downloadPDF(order);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      alert('Error al descargar PDF');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      const success = await PurchaseOrderService.sendEmail(order, order.provider);
      if (success) {
        await PurchaseOrderService.markEmailSent(order.id);
        alert(`Email enviado exitosamente a ${order.provider.email}`);
      } else {
        alert('Error al enviar email');
      }
    } catch (error) {
      console.error('Error al enviar email:', error);
      alert('Error al enviar email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleSendWhatsApp = async () => {
    setIsSendingWhatsApp(true);
    try {
      const success = await PurchaseOrderService.sendWhatsApp(order, order.provider);
      if (success) {
        await PurchaseOrderService.markWhatsAppSent(order.id);
        alert('WhatsApp enviado exitosamente');
      } else {
        alert('Error al enviar WhatsApp');
      }
    } catch (error) {
      console.error('Error al enviar WhatsApp:', error);
      alert('Error al enviar WhatsApp');
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const handleStatusChange = async (newStatus: 'pre_order' | 'issued' | 'received' | 'paid') => {
    setIsUpdatingStatus(true);
    try {
      const success = await PurchaseOrderService.updateOrderStatus(order.id, newStatus);
      if (success) {
        onStatusChange(order.id, newStatus);
        alert(`Estado actualizado a: ${getStatusLabel(newStatus)}`);
      } else {
        alert('Error al actualizar estado');
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      alert('Error al actualizar estado');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pre_order': return 'Pre-orden';
      case 'issued': return 'Emitida';
      case 'received': return 'Recibida';
      case 'paid': return 'Pagada';
      default: return status;
    }
  };

  const getNextStatus = (currentStatus: string): 'pre_order' | 'issued' | 'received' | 'paid' | null => {
    switch (currentStatus) {
      case 'pre_order': return 'issued';
      case 'issued': return 'received';
      case 'received': return 'paid';
      default: return null;
    }
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="flex items-center gap-2">
      {/* Ver detalles */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onView(order)}
        title="Ver detalles"
      >
        <Eye className="h-4 w-4" />
      </Button>

      {/* Editar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(order)}
        title="Editar orden"
      >
        <Edit className="h-4 w-4" />
      </Button>

      {/* Descargar PDF */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownloadPDF}
        disabled={isDownloadingPDF}
        title="Descargar PDF"
      >
        <Download className="h-4 w-4" />
      </Button>

      {/* Enviar Email */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSendEmail}
        disabled={isSendingEmail || order.emailSent}
        title={order.emailSent ? "Email ya enviado" : "Enviar email"}
      >
        <Mail className={`h-4 w-4 ${order.emailSent ? 'text-green-600' : ''}`} />
      </Button>

      {/* Enviar WhatsApp */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSendWhatsApp}
        disabled={isSendingWhatsApp || order.whatsappSent}
        title={order.whatsappSent ? "WhatsApp ya enviado" : "Enviar WhatsApp"}
      >
        <MessageSquare className={`h-4 w-4 ${order.whatsappSent ? 'text-green-600' : ''}`} />
      </Button>

      {/* Cambiar estado */}
      {nextStatus && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleStatusChange(nextStatus)}
          disabled={isUpdatingStatus}
          title={`Cambiar a: ${getStatusLabel(nextStatus)}`}
        >
          {nextStatus === 'issued' && <AlertTriangle className="h-4 w-4" />}
          {nextStatus === 'received' && <CheckCircle className="h-4 w-4" />}
          {nextStatus === 'paid' && <CheckCircle className="h-4 w-4" />}
        </Button>
      )}

      {/* Eliminar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(order.id)}
        title="Eliminar orden"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
} 