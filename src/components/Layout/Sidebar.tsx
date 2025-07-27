import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Warehouse, 
  Factory, 
  DollarSign, 
  Bell, 
  Settings, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Milk,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const modules = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, notifications: 0 },
  { id: "productos", label: "Productos", icon: Package, notifications: 0 },
  { id: "proveedores", label: "Proveedores", icon: Users, notifications: 0 },
  { id: "ordenes", label: "Órdenes de Compra", icon: ShoppingCart, notifications: 3 },
  { id: "inventario", label: "Inventario", icon: Warehouse, notifications: 5 },
  { id: "produccion", label: "Producción", icon: Factory, notifications: 1 },
  { id: "pagos", label: "Pagos", icon: DollarSign, notifications: 2 },
  { id: "notificaciones", label: "Notificaciones", icon: Bell, notifications: 8 },
];

const adminModules = [
  { id: "empleados", label: "Empleados", icon: User, notifications: 0 },
  { id: "configuracion", label: "Configuración", icon: Settings, notifications: 0 },
];

export function Sidebar({ currentModule, onModuleChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "h-screen bg-sidebar border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
            <Milk className="w-5 h-5 text-sidebar-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-sidebar-foreground">Inventarios Rossi</h1>
              <p className="text-xs text-sidebar-foreground/70">Sistema de Gestión</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-2 space-y-1">
        <div className={cn("px-2 py-2", collapsed && "px-1")}>
          {!collapsed && (
            <h2 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
              Módulos Principales
            </h2>
          )}
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = currentModule === module.id;
            
            return (
              <Button
                key={module.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1 h-10 relative",
                  collapsed ? "px-2" : "px-3",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                onClick={() => onModuleChange(module.id)}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate">{module.label}</span>
                    {module.notifications > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto h-5 min-w-[20px] text-xs px-1"
                      >
                        {module.notifications}
                      </Badge>
                    )}
                  </>
                )}
                {collapsed && module.notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {module.notifications}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        {/* Admin Section */}
        <div className={cn("px-2 py-2 border-t border-sidebar-border", collapsed && "px-1")}>
          {!collapsed && (
            <h2 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
              Administración
            </h2>
          )}
          {adminModules.map((module) => {
            const Icon = module.icon;
            const isActive = currentModule === module.id;
            
            return (
              <Button
                key={module.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1 h-10",
                  collapsed ? "px-2" : "px-3",
                  isActive 
                    ? "bg-sidebar-accent text-sidebar-foreground" 
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
                onClick={() => onModuleChange(module.id)}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="truncate">{module.label}</span>}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border">
        <div className={cn("flex items-center gap-3 px-2 py-2", collapsed && "justify-center")}>
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-sidebar-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
              <p className="text-xs text-sidebar-foreground/70">admin@rossi.com</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "sm"}
          className={cn(
            "w-full text-sidebar-foreground/80 hover:bg-sidebar-accent/50",
            collapsed ? "px-2" : "justify-start gap-3"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Cerrar Sesión"}
        </Button>
      </div>
    </div>
  );
}