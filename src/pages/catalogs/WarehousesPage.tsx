import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function WarehousesPage() {
  return (
    <PlaceholderPage
      title="Almacenes"
      description="Gestión de almacenes físicos y virtuales"
      priority="medium"
      estimatedCompletion="Semana 1"
      features={[
        'Registro de almacenes con ubicación',
        'Asignación de responsables',
        'Control de capacidad',
        'Estados activo/inactivo',
        'Asociación de movimientos',
        'Visualización de stock por almacén'
      ]}
    />
  );
} 