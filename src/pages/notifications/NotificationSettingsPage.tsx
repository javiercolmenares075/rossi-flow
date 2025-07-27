import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  AlertTriangle, 
  Settings,
  Save,
  RefreshCw,
  Mail,
  Smartphone,
  Clock,
  Package,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface NotificationSettings {
  // Alertas por tipo
  stockAlerts: boolean;
  expiryAlerts: boolean;
  paymentAlerts: boolean;
  productionAlerts: boolean;
  importAlerts: boolean;
  systemAlerts: boolean;
  
  // Métodos de notificación
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  
  // Configuración de umbrales
  lowStockThreshold: number;
  expiryWarningDays: number;
  paymentReminderDays: number;
  productionDelayHours: number;
  
  // Configuración de horarios
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  
  // Configuración de frecuencia
  notificationFrequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  
  // Configuración de usuarios
  notifyUsers: string[];
  excludeUsers: string[];
  
  // Configuración de productos
  excludedProducts: string[];
  priorityProducts: string[];
}

// Mock data
const mockSettings: NotificationSettings = {
  stockAlerts: true,
  expiryAlerts: true,
  paymentAlerts: true,
  productionAlerts: true,
  importAlerts: true,
  systemAlerts: false,
  
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: false,
  inAppNotifications: true,
  
  lowStockThreshold: 20,
  expiryWarningDays: 7,
  paymentReminderDays: 3,
  productionDelayHours: 24,
  
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  
  notificationFrequency: 'immediate',
  
  notifyUsers: ['admin', 'inventory-manager', 'production-manager'],
  excludeUsers: [],
  
  excludedProducts: [],
  priorityProducts: ['LEC-001', 'QUE-001', 'YOG-001']
};

const mockUsers = [
  { id: 'admin', name: 'Administrador', role: 'Administrador' },
  { id: 'inventory-manager', name: 'María González', role: 'Gerente de Inventario' },
  { id: 'production-manager', name: 'Carlos Rodríguez', role: 'Gerente de Producción' },
  { id: 'finance-manager', name: 'Ana Silva', role: 'Gerente Financiero' },
  { id: 'operator-1', name: 'Luis Pérez', role: 'Operador' },
  { id: 'operator-2', name: 'Elena Martínez', role: 'Operadora' }
];

const mockProducts = [
  { id: 'LEC-001', name: 'Leche Entera', category: 'Lácteos' },
  { id: 'QUE-001', name: 'Queso Paraguay', category: 'Quesos' },
  { id: 'YOG-001', name: 'Yogur Natural', category: 'Lácteos' },
  { id: 'CRE-001', name: 'Crema de Leche', category: 'Lácteos' },
  { id: 'MANT-001', name: 'Mantequilla', category: 'Lácteos' },
  { id: 'CULT-001', name: 'Cultivo Láctico', category: 'Insumos' }
];

export function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(mockSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('alerts');

  const handleSave = async () => {
    setIsSaving(true);
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleReset = () => {
    setSettings(mockSettings);
  };

  const updateSetting = (key: keyof NotificationSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleUserNotification = (userId: string) => {
    const isNotified = settings.notifyUsers.includes(userId);
    if (isNotified) {
      updateSetting('notifyUsers', settings.notifyUsers.filter(id => id !== userId));
    } else {
      updateSetting('notifyUsers', [...settings.notifyUsers, userId]);
    }
  };

  const toggleProductExclusion = (productId: string) => {
    const isExcluded = settings.excludedProducts.includes(productId);
    if (isExcluded) {
      updateSetting('excludedProducts', settings.excludedProducts.filter(id => id !== productId));
    } else {
      updateSetting('excludedProducts', [...settings.excludedProducts, productId]);
    }
  };

  const toggleProductPriority = (productId: string) => {
    const isPriority = settings.priorityProducts.includes(productId);
    if (isPriority) {
      updateSetting('priorityProducts', settings.priorityProducts.filter(id => id !== productId));
    } else {
      updateSetting('priorityProducts', [...settings.priorityProducts, productId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Notificaciones</h1>
          <p className="text-muted-foreground">
            Configure las preferencias y reglas de notificaciones del sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>

      {/* Tabs de Configuración */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'alerts' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 inline" />
                  Tipos de Alertas
                </button>
                <button
                  onClick={() => setActiveTab('methods')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'methods' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <Bell className="h-4 w-4 mr-2 inline" />
                  Métodos de Notificación
                </button>
                <button
                  onClick={() => setActiveTab('thresholds')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'thresholds' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2 inline" />
                  Umbrales y Límites
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'schedule' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2 inline" />
                  Horarios y Frecuencia
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'users' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-2 inline" />
                  Usuarios y Permisos
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'products' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <Package className="h-4 w-4 mr-2 inline" />
                  Productos Especiales
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          {/* Tipos de Alertas */}
          {activeTab === 'alerts' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Tipos de Alertas
                </CardTitle>
                <CardDescription>
                  Configure qué tipos de alertas desea recibir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-red-500" />
                      <div>
                        <Label className="font-medium">Alertas de Stock Bajo</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar cuando los productos tengan stock bajo
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.stockAlerts}
                      onCheckedChange={(checked) => updateSetting('stockAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-orange-500" />
                      <div>
                        <Label className="font-medium">Alertas de Vencimiento</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar sobre productos próximos a vencer
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.expiryAlerts}
                      onCheckedChange={(checked) => updateSetting('expiryAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-red-500" />
                      <div>
                        <Label className="font-medium">Alertas de Pagos</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar sobre pagos vencidos o próximos
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.paymentAlerts}
                      onCheckedChange={(checked) => updateSetting('paymentAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-500" />
                      <div>
                        <Label className="font-medium">Alertas de Producción</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar sobre retrasos o problemas en producción
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.productionAlerts}
                      onCheckedChange={(checked) => updateSetting('productionAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label className="font-medium">Alertas de Importación</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar sobre problemas con importaciones
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.importAlerts}
                      onCheckedChange={(checked) => updateSetting('importAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <Label className="font-medium">Alertas del Sistema</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificar sobre errores o problemas del sistema
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.systemAlerts}
                      onCheckedChange={(checked) => updateSetting('systemAlerts', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Métodos de Notificación */}
          {activeTab === 'methods' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Métodos de Notificación
                </CardTitle>
                <CardDescription>
                  Configure cómo desea recibir las notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label className="font-medium">Notificaciones por Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibir notificaciones por correo electrónico
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <Label className="font-medium">Notificaciones Push</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibir notificaciones push en el navegador
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-orange-500" />
                      <div>
                        <Label className="font-medium">Notificaciones SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibir notificaciones por mensaje de texto
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label className="font-medium">Notificaciones en App</Label>
                        <p className="text-sm text-muted-foreground">
                          Mostrar notificaciones dentro de la aplicación
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.inAppNotifications}
                      onCheckedChange={(checked) => updateSetting('inAppNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Umbrales y Límites */}
          {activeTab === 'thresholds' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Umbrales y Límites
                </CardTitle>
                <CardDescription>
                  Configure los umbrales para las diferentes alertas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="lowStockThreshold">Umbral de Stock Bajo (%)</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={settings.lowStockThreshold}
                      onChange={(e) => updateSetting('lowStockThreshold', parseInt(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Porcentaje mínimo de stock antes de generar alerta
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="expiryWarningDays">Días Antes del Vencimiento</Label>
                    <Input
                      id="expiryWarningDays"
                      type="number"
                      value={settings.expiryWarningDays}
                      onChange={(e) => updateSetting('expiryWarningDays', parseInt(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Días de anticipación para alertas de vencimiento
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="paymentReminderDays">Recordatorio de Pagos (días)</Label>
                    <Input
                      id="paymentReminderDays"
                      type="number"
                      value={settings.paymentReminderDays}
                      onChange={(e) => updateSetting('paymentReminderDays', parseInt(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Días antes del vencimiento para recordar pagos
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="productionDelayHours">Retraso de Producción (horas)</Label>
                    <Input
                      id="productionDelayHours"
                      type="number"
                      value={settings.productionDelayHours}
                      onChange={(e) => updateSetting('productionDelayHours', parseInt(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Horas de retraso antes de generar alerta
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Horarios y Frecuencia */}
          {activeTab === 'schedule' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Horarios y Frecuencia
                </CardTitle>
                <CardDescription>
                  Configure cuándo y con qué frecuencia recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Frecuencia de Notificaciones</Label>
                    <Select
                      value={settings.notificationFrequency}
                      onValueChange={(value) => updateSetting('notificationFrequency', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Inmediata</SelectItem>
                        <SelectItem value="hourly">Cada hora</SelectItem>
                        <SelectItem value="daily">Diaria</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label className="font-medium">Horas Silenciosas</Label>
                        <p className="text-sm text-muted-foreground">
                          No enviar notificaciones durante la noche
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.quietHoursEnabled}
                      onCheckedChange={(checked) => updateSetting('quietHoursEnabled', checked)}
                    />
                  </div>

                  {settings.quietHoursEnabled && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="quietHoursStart">Hora de Inicio</Label>
                        <Input
                          id="quietHoursStart"
                          type="time"
                          value={settings.quietHoursStart}
                          onChange={(e) => updateSetting('quietHoursStart', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quietHoursEnd">Hora de Fin</Label>
                        <Input
                          id="quietHoursEnd"
                          type="time"
                          value={settings.quietHoursEnd}
                          onChange={(e) => updateSetting('quietHoursEnd', e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Usuarios y Permisos */}
          {activeTab === 'users' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Usuarios y Permisos
                </CardTitle>
                <CardDescription>
                  Configure qué usuarios reciben notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <Label className="font-medium">{user.name}</Label>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.notifyUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserNotification(user.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Productos Especiales */}
          {activeTab === 'products' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos Especiales
                </CardTitle>
                <CardDescription>
                  Configure productos con reglas especiales de notificación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Productos Prioritarios</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="font-medium">{product.name}</Label>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <Switch
                          checked={settings.priorityProducts.includes(product.id)}
                          onCheckedChange={() => toggleProductPriority(product.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Productos Excluidos</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {mockProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="font-medium">{product.name}</Label>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <Switch
                          checked={settings.excludedProducts.includes(product.id)}
                          onCheckedChange={() => toggleProductExclusion(product.id)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 