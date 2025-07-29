import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function BulkEntryPage() {
  return (
    <PlaceholderPage
      title="Ingreso Masivo"
      description="Recepción masiva de mercancía desde órdenes de compra"
      priority="high"
      estimatedCompletion="Semana 3"
      features={[
        'Selección de órdenes de compra emitidas',
        'Confirmación de cantidades recibidas',
        'Creación automática de lotes',
        'Generación de códigos QR',
        'Actualización automática de stock',
        'Cambio de estado a "Recibida"',
        'Registro de diferencias vs. solicitado',
        'Integración completa con inventario'
      ]}
    />
  );
} 