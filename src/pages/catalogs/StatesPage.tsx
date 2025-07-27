import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function StatesPage() {
  return (
    <PlaceholderPage
      title="Estados"
      description="Gestión de estados para diferentes módulos del sistema"
      priority="low"
      estimatedCompletion="Semana 1"
      features={[
        'Definición de estados por módulo',
        'Estados para mercancía, órdenes, pagos',
        'Catálogo editable por administradores',
        'Asociación automática según flujos'
      ]}
    />
  );
} 