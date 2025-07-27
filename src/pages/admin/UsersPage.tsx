import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function UsersPage() {
  return (
    <PlaceholderPage
      title="Usuarios"
      description="Gestión de usuarios y control de acceso al sistema"
      priority="medium"
      estimatedCompletion="Semana 6"
      features={[
        'Registro de usuarios con roles',
        'Asignación de permisos granulares',
        'Control de estados activo/inactivo',
        'Historial de actividades',
        'Políticas de seguridad',
        'Recuperación de contraseñas',
        'Auditoría de accesos',
        'Gestión de sesiones'
      ]}
    />
  );
} 