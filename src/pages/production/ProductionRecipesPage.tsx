import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function ProductionRecipesPage() {
  return (
    <PlaceholderPage
      title="Recetas de Producción"
      description="Gestión de recetas y fórmulas para productos lácteos"
      priority="medium"
      estimatedCompletion="Semana 4"
      features={[
        'Definición de recetas por producto',
        'Gestión de ingredientes y cantidades',
        'Control de versiones de recetas',
        'Cálculo automático de insumos requeridos',
        'Validación de stock de ingredientes',
        'Historial de cambios en recetas',
        'Asociación con productos terminados',
        'Reportes de consumo de insumos'
      ]}
    />
  );
} 