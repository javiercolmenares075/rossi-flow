import { PlaceholderPage } from '@/components/ui/PlaceholderPage';

export function NewPurchaseOrderPage() {
  return (
    <PlaceholderPage
      title="Nueva Orden de Compra"
      description="Creación de órdenes de compra con validaciones y cálculos automáticos"
      priority="high"
      estimatedCompletion="Semana 2"
      features={[
        'Formulario de creación con validaciones',
        'Selección de proveedor con búsqueda',
        'Agregar productos con cantidades y costos',
        'Cálculo automático de subtotales e IVA',
        'Validación de fechas y datos obligatorios',
        'Generación de pre-orden',
        'Integración con inventario'
      ]}
    />
  );
} 