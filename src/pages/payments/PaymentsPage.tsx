import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function PaymentsPage() {
  return (
    <PlaceholderPage
      title="Pagos"
      description="Gestión de pagos pendientes y realizados"
      priority="medium"
      estimatedCompletion="Semana 5"
      features={[
        'Listado de órdenes pendientes de pago',
        'Filtros por proveedor, fecha, monto',
        'Registro de pagos con comprobantes',
        'Historial completo de pagos',
        'Alertas de pagos próximos/vencidos',
        'Estados: No pagado, Pagado',
        'Integración con órdenes de compra',
        'Reportes de pagos por período'
      ]}
    />
  );
} 