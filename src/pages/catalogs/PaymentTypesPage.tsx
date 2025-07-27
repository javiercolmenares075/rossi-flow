import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function PaymentTypesPage() {
  return (
    <PlaceholderPage
      title="Tipos de Pago"
      description="Gestión de modalidades de pago aceptadas"
      priority="low"
      estimatedCompletion="Semana 1"
      features={[
        'Registro de modalidades de pago',
        'Tipos: Crédito, Contado, Transferencia, Efectivo',
        'Asociación a órdenes de compra y pagos',
        'Catálogo editable por administradores'
      ]}
    />
  );
} 