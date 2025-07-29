import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function BatchesPage() {
  return (
    <PlaceholderPage
      title="Lotes"
      description="Gestión de lotes con códigos QR y control de vencimientos"
      priority="high"
      estimatedCompletion="Semana 3"
      features={[
        'Visualización de todos los lotes activos',
        'Códigos QR imprimibles para cada lote',
        'Control de fechas de vencimiento',
        'Trazabilidad completa por lote',
        'Alertas de vencimiento próximo',
        'Historial de movimientos por lote',
        'Estados: Activo, Vencido, Agotado',
        'Exportación de códigos QR'
      ]}
    />
  );
} 