import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function WeighingTypesPage() {
  return (
    <PlaceholderPage
      title="Tipos de Pesaje"
      description="Gestión de equipos y métodos de pesaje utilizados"
      priority="low"
      estimatedCompletion="Semana 1"
      features={[
        'Registro de equipos de pesaje',
        'Descripción de métodos utilizados',
        'Asociación a movimientos de inventario',
        'Catálogo simple y editable'
      ]}
    />
  );
} 