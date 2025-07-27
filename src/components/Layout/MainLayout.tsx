import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardView } from "../Dashboard/DashboardView";
import { ProductosView } from "../Modules/ProductosView";
import { ProveedoresView } from "../Modules/ProveedoresView";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [currentModule, setCurrentModule] = useState("dashboard");

  const renderCurrentView = () => {
    switch (currentModule) {
      case "dashboard":
        return <DashboardView />;
      case "productos":
        return <ProductosView />;
      case "proveedores":
        return <ProveedoresView />;
      case "ordenes":
        return <PlaceholderView title="Órdenes de Compra" description="Gestión de órdenes de compra y proveedores" />;
      case "inventario":
        return <PlaceholderView title="Inventario" description="Control de stock, lotes y movimientos" />;
      case "produccion":
        return <PlaceholderView title="Producción" description="Gestión de recetas y órdenes de producción" />;
      case "pagos":
        return <PlaceholderView title="Pagos" description="Administración de pagos y estados financieros" />;
      case "notificaciones":
        return <PlaceholderView title="Notificaciones" description="Alertas de stock, vencimientos y pagos" />;
      case "empleados":
        return <PlaceholderView title="Empleados" description="Gestión de usuarios y personal" />;
      case "configuracion":
        return <PlaceholderView title="Configuración" description="Configuración del sistema y catálogos" />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderCurrentView()}
        </div>
      </main>
    </div>
  );
}

function PlaceholderView({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted rounded-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Módulo en Desarrollo</h3>
          <p className="text-muted-foreground">
            Este módulo será implementado en las próximas iteraciones
          </p>
        </div>
      </div>
    </div>
  );
}