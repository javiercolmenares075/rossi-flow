import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function ProductionOrdersPage() {
  return (
    <PlaceholderPage
      title="Órdenes de Producción"
      description="Gestión de producción de productos lácteos con recetas y seguimiento"
      priority="medium"
      estimatedCompletion="Semana 4"
      features={[
        'Creación de órdenes de producción',
        'Gestión de recetas por producto',
        'Cálculo automático de insumos requeridos',
        'Control de stock de insumos',
        'Seguimiento de avance de producción',
        'Generación de lotes para productos terminados',
        'Códigos QR para trazabilidad',
        'Control de fechas de vencimiento',
        'Integración con inventario',
        'Reportes de producción'
      ]}
    />
  );
} 