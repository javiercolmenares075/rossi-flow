import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function StorageTypesPage() {
  return (
    <PlaceholderPage
      title="Tipos de Almacenamiento"
      description="Definición de métodos de almacenamiento (granel y lotes)"
      priority="low"
      estimatedCompletion="Semana 1"
      features={[
        'Catálogo de tipos de almacenamiento',
        'A granel y por lotes',
        'Edición solo por administradores',
        'Asociación directa en productos'
      ]}
    />
  );
} 