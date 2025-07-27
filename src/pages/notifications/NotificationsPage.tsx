import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function NotificationsPage() {
  return (
    <PlaceholderPage
      title="Notificaciones"
      description="Sistema de alertas y notificaciones inteligentes"
      priority="medium"
      estimatedCompletion="Semana 5"
      features={[
        'Panel central de notificaciones',
        'Alertas de stock bajo',
        'Notificaciones de vencimientos',
        'Recordatorios de pagos',
        'Alertas de importaciones',
        'Recordatorios manuales',
        'Configuración de preferencias',
        'Historial de notificaciones'
      ]}
    />
  );
} 