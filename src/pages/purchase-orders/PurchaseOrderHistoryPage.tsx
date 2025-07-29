import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export default function PurchaseOrderHistoryPage() {
  return (
    <PlaceholderPage
      title="Historial de Órdenes de Compra"
      description="Consulta y gestión del historial completo de órdenes de compra"
      priority="medium"
      estimatedCompletion="Semana 2"
      features={[
        'Listado completo de órdenes históricas',
        'Filtros por proveedor, estado, fecha',
        'Búsqueda avanzada por número, proveedor',
        'Visualización de detalles completos',
        'Exportación a PDF y Excel',
        'Auditoría de cambios y modificaciones',
        'Estadísticas y reportes'
      ]}
    />
  );
} 