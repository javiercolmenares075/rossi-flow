import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function ProductTypesPage() {
  return (
    <PlaceholderPage
      title="Tipos de Producto"
      description="Clasificación de productos para facilitar búsquedas y reportes"
      priority="medium"
      estimatedCompletion="Semana 1"
      features={[
        'Creación de tipos de producto',
        'Asociación de productos a tipos',
        'Filtros y reportes por tipo',
        'Estados activo/inactivo',
        'Descripción opcional'
      ]}
    />
  );
} 