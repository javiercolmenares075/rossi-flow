import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlaceholderPageProps {
  title: string;
  description: string;
  features?: string[];
  estimatedCompletion?: string;
  priority?: 'low' | 'medium' | 'high';
}

export function PlaceholderPage({ 
  title, 
  description, 
  features = [],
  estimatedCompletion = 'Próximamente',
  priority = 'medium'
}: PlaceholderPageProps) {
  
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const priorityText = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <span className="text-2xl">🚧</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={priorityColors[priority]}>
            Prioridad: {priorityText[priority]}
          </Badge>
          <Button variant="outline">
            Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Development Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🔨</span>
              Estado de Desarrollo
            </CardTitle>
            <CardDescription>
              Información sobre el progreso de implementación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estado:</span>
              <Badge variant="secondary">En Desarrollo</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completado:</span>
              <span className="text-sm text-muted-foreground">0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Estimado:</span>
              <span className="text-sm text-muted-foreground">{estimatedCompletion}</span>
            </div>
            <div className="pt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades Planificadas</CardTitle>
            <CardDescription>
              Características que se implementarán
            </CardDescription>
          </CardHeader>
          <CardContent>
            {features.length > 0 ? (
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Las funcionalidades específicas se definirán durante el desarrollo.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Development Info */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Desarrollo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">Tecnologías Utilizadas</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">React</Badge>
                <Badge variant="outline">TypeScript</Badge>
                <Badge variant="outline">Tailwind CSS</Badge>
                <Badge variant="outline">shadcn/ui</Badge>
                <Badge variant="outline">React Router</Badge>
                <Badge variant="outline">Zod</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Próximos Pasos</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Definir estructura de datos</li>
                <li>• Crear formularios de entrada</li>
                <li>• Implementar validaciones</li>
                <li>• Conectar con backend</li>
                <li>• Pruebas y optimización</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 