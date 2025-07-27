import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function EmployeesPage() {
  return (
    <PlaceholderPage
      title="Empleados"
      description="Gestión del personal que interactúa con el sistema"
      priority="medium"
      estimatedCompletion="Semana 1"
      features={[
        'Registro de empleados con datos completos',
        'Asignación de cargos y responsabilidades',
        'Asociación a movimientos y operaciones',
        'Control de estados activo/inactivo',
        'Historial de actividades por empleado'
      ]}
    />
  );
} 