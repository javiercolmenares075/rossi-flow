import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard,
  Archive,
  Building2,
  Package,
  Tag,
  Warehouse,
  MapPin,
  Scale,
  Users,
  CheckCircle,
  CreditCard,
  ShoppingCart,
  Plus,
  ClipboardList,
  FileText,
  Truck,
  QrCode,
  Upload,
  Factory,
  Activity,
  Bell,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
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
        href: '/payments',
        icon: ClipboardList,
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
        href: '/production/orders',
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
  },
  {
    title: 'Reportes',
    href: '/reports',
    icon: BarChart3,
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
        title: 'Configuración',
        href: '/admin/settings',
        icon: Settings,
      },
    ],
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const renderMenuItem = (item: MenuItem) => {
    const isExpanded = expandedItems.includes(item.title);
    const hasChildren = item.children && item.children.length > 0;
    const active = isActive(item.href);

    return (
      <div key={item.title}>
        <Link to={item.href}>
          <Button
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              isCollapsed ? "px-2" : "px-4",
              active && "bg-secondary"
            )}
            onClick={() => {
              if (hasChildren) {
                toggleExpanded(item.title);
              }
            }}
          >
            <item.icon className={cn("h-4 w-4", isCollapsed ? "mr-0" : "mr-2")} />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-left">{item.title}</span>
                {hasChildren && (
                  <ChevronRight className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")} />
                )}
              </>
            )}
          </Button>
        </Link>
        
        {hasChildren && !isCollapsed && isExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children!.map((child) => (
              <Link key={child.href} to={child.href}>
                <Button
                  variant={isActive(child.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    "px-4 py-1 h-8 text-sm"
                  )}
                >
                  <child.icon className="h-3 w-3 mr-2" />
                  {child.title}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Inventarios Rossi</h2>
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
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-2">
          {menuItems.map(renderMenuItem)}
        </nav>
      </ScrollArea>
    </div>
  );
}