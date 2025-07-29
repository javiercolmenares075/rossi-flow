import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function StockPage() {
  return (
    <PlaceholderPage
      title="Stock"
      description="Control de inventario con gestión de lotes y productos a granel"
      priority="high"
      estimatedCompletion="Semana 3"
      features={[
        'Visualización de stock por producto y almacén',
        'Control por lotes con códigos QR',
        'Gestión de productos a granel',
        'Alertas de stock bajo',
        'Control de fechas de vencimiento',
        'Trazabilidad completa de movimientos',
        'Reportes de inventario en tiempo real',
        'Integración con órdenes de compra',
        'Códigos QR imprimibles para lotes',
        'Historial de movimientos detallado'
      ]}
    />
  );
} 