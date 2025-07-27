import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Users,
  Building2,
  Package,
  ShoppingCart,
  Truck,
  CreditCard,
  Bell,
  Settings,
  FileText,
  BarChart3,
  Factory,
  Warehouse,
  ClipboardList,
  QrCode,
  AlertTriangle,
  Calendar,
  Archive,
  Tag,
  Scale,
  MapPin,
  Shield,
  Activity,
  TrendingUp,
  PieChart,
  Upload,
  Plus,
  CheckCircle,
  Clock,
  User,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Catálogos',
    href: '/catalogs',
    icon: Archive,
    children: [
      {
        title: 'Proveedores',
        href: '/catalogs/providers',
        icon: Building2,
      },
      {
        title: 'Productos',
        href: '/catalogs/products',
        icon: Package,
      },
      {
        title: 'Tipos de Producto',
        href: '/catalogs/product-types',
        icon: Tag,
      },
      {
        title: 'Tipos de Almacenamiento',
        href: '/catalogs/storage-types',
        icon: Warehouse,
      },
      {
        title: 'Almacenes',
        href: '/catalogs/warehouses',
        icon: MapPin,
      },
      {
        title: 'Tipos de Pesaje',
        href: '/catalogs/weighing-types',
        icon: Scale,
      },
      {
        title: 'Empleados',
        href: '/catalogs/employees',
        icon: Users,
      },
      {
        title: 'Estados',
        href: '/catalogs/states',
        icon: CheckCircle,
      },
      {
        title: 'Tipos de Pago',
        href: '/catalogs/payment-types',
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Órdenes de Compra',
    href: '/purchase-orders',
    icon: ShoppingCart,
    children: [
      {
        title: 'Nueva Orden',
        href: '/purchase-orders/new',
        icon: Plus,
      },
      {
        title: 'Listado',
        href: '/purchase-orders',
        icon: ClipboardList,
      },
      {
        title: 'Historial',
        href: '/purchase-orders/history',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Inventario',
    href: '/inventory',
    icon: Warehouse,
    children: [
      {
        title: 'Movimientos',
        href: '/inventory/movements',
        icon: Truck,
      },
      {
        title: 'Stock',
        href: '/inventory/stock',
        icon: Package,
      },
      {
        title: 'Lotes',
        href: '/inventory/batches',
        icon: QrCode,
      },
      {
        title: 'Ingreso Masivo',
        href: '/inventory/bulk-entry',
        icon: Upload,
      },
    ],
  },
  {
    title: 'Pagos',
    href: '/payments',
    icon: CreditCard,
    children: [
      {
        title: 'Registrar Pago',
        href: '/payments/new',
        icon: Plus,
      },
      {
        title: 'Pendientes',
        href: '/payments/pending',
        icon: Clock,
      },
      {
        title: 'Historial',
        href: '/payments/history',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Producción',
    href: '/production',
    icon: Factory,
    children: [
      {
        title: 'Recetas',
        href: '/production/recipes',
        icon: FileText,
      },
      {
        title: 'Nueva Orden',
        href: '/production/new',
        icon: Plus,
      },
      {
        title: 'Órdenes',
        href: '/production/orders',
        icon: ClipboardList,
      },
      {
        title: 'Seguimiento',
        href: '/production/tracking',
        icon: Activity,
      },
    ],
  },
  {
    title: 'Notificaciones',
    href: '/notifications',
    icon: Bell,
    badge: '3',
    children: [
      {
        title: 'Alertas',
        href: '/notifications/alerts',
        icon: AlertTriangle,
      },
      {
        title: 'Recordatorios',
        href: '/notifications/reminders',
        icon: Calendar,
      },
      {
        title: 'Configuración',
        href: '/notifications/settings',
        icon: Settings,
      },
    ],
  },
  {
    title: 'Reportes',
    href: '/reports',
    icon: BarChart3,
    children: [
      {
        title: 'Dashboard',
        href: '/reports/dashboard',
        icon: TrendingUp,
      },
      {
        title: 'Inventario',
        href: '/reports/inventory',
        icon: PieChart,
      },
      {
        title: 'Compras',
        href: '/reports/purchases',
        icon: ShoppingCart,
      },
      {
        title: 'Producción',
        href: '/reports/production',
        icon: Factory,
      },
      {
        title: 'Pagos',
        href: '/reports/payments',
        icon: CreditCard,
      },
    ],
  },
  {
    title: 'Administración',
    href: '/admin',
    icon: Settings,
    children: [
      {
        title: 'Usuarios',
        href: '/admin/users',
        icon: Users,
      },
      {
        title: 'Roles',
        href: '/admin/roles',
        icon: Shield,
      },
      {
        title: 'Auditoría',
        href: '/admin/audit',
        icon: FileText,
      },
      {
        title: 'Configuración',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isActive = location.pathname === item.href;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = hasChildren && location.pathname.startsWith(item.href);

    return (
      <div key={item.href}>
        <Link
          to={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground',
            level > 0 && 'ml-4',
            isCollapsed && level === 0 && 'justify-center'
          )}
        >
          <item.icon className={cn('h-4 w-4', isCollapsed && level === 0 && 'h-5 w-5')} />
          {!isCollapsed && (
            <>
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </>
          )}
        </Link>
        
        {hasChildren && !isCollapsed && (
          <div className={cn('ml-4 mt-1 space-y-1', isExpanded ? 'block' : 'hidden')}>
            {item.children.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      'flex h-full flex-col border-r bg-background',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Factory className="h-6 w-6 text-primary" />
            <span className="font-semibold">Rossi</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="h-8 w-8 p-0"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Usuario Actual</span>
          </div>
        </div>
      )}
    </div>
  );
}