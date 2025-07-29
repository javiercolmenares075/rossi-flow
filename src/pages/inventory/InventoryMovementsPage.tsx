import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function InventoryMovementsPage() {
  return (
    <PlaceholderPage
      title="Movimientos de Inventario"
      description="Registro y control de entradas y salidas de inventario"
      priority="high"
      estimatedCompletion="Semana 3"
      features={[
        'Registro de entradas y salidas',
        'Selección de productos y cantidades',
        'Control de lotes y fechas de vencimiento',
        'Asignación de almacenes y responsables',
        'Validación de stock disponible',
        'Trazabilidad completa de movimientos',
        'Historial detallado por producto',
        'Integración con órdenes de compra'
      ]}
    />
  );
} 