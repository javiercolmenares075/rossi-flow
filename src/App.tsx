import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { MainLayout } from './components/Layout/MainLayout';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProductosView } from './components/Modules/ProductosView';
import { ProveedoresView } from './components/Modules/ProveedoresView';

// Import all the new components we'll create
import ProvidersPage from './pages/catalogs/ProvidersPage';
import ProductsPage from './pages/catalogs/ProductsPage';
import ProductTypesPage from './pages/catalogs/ProductTypesPage';
import StorageTypesPage from './pages/catalogs/StorageTypesPage';
import WarehousesPage from './pages/catalogs/WarehousesPage';
import WeighingTypesPage from './pages/catalogs/WeighingTypesPage';
import EmployeesPage from './pages/catalogs/EmployeesPage';
import StatesPage from './pages/catalogs/StatesPage';
import PaymentTypesPage from './pages/catalogs/PaymentTypesPage';
import PurchaseOrdersPage from './pages/purchase-orders/PurchaseOrdersPage';
import NewPurchaseOrderPage from './pages/purchase-orders/NewPurchaseOrderPage';
import PurchaseOrderHistoryPage from './pages/purchase-orders/PurchaseOrderHistoryPage';
import InventoryMovementsPage from './pages/inventory/InventoryMovementsPage';
import StockPage from './pages/inventory/StockPage';
import BatchesPage from './pages/inventory/BatchesPage';
import BulkEntryPage from './pages/inventory/BulkEntryPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import ProductionRecipesPage from './pages/production/ProductionRecipesPage';
import ProductionOrdersPage from './pages/production/ProductionOrdersPage';
import ProductionTrackingPage from './pages/production/ProductionTrackingPage';
import NotificationsPage from './pages/notifications/NotificationsPage';

// Placeholder components for pages not yet implemented
import { PlaceholderPage } from './components/ui/PlaceholderPage';

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              {/* Dashboard */}
              <Route path="/" element={<DashboardView />} />
              
              {/* Catalogs */}
              <Route path="/catalogs/providers" element={<ProvidersPage />} />
              <Route path="/catalogs/products" element={<ProductsPage />} />
              <Route path="/catalogs/product-types" element={<ProductTypesPage />} />
              <Route path="/catalogs/storage-types" element={<StorageTypesPage />} />
              <Route path="/catalogs/warehouses" element={<WarehousesPage />} />
              <Route path="/catalogs/weighing-types" element={<WeighingTypesPage />} />
              <Route path="/catalogs/employees" element={<EmployeesPage />} />
              <Route path="/catalogs/states" element={<StatesPage />} />
              <Route path="/catalogs/payment-types" element={<PaymentTypesPage />} />
              
              {/* Purchase Orders */}
              <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="/purchase-orders/new" element={<NewPurchaseOrderPage />} />
              <Route path="/purchase-orders/history" element={<PurchaseOrderHistoryPage />} />
              
              {/* Inventory */}
              <Route path="/inventory/movements" element={<InventoryMovementsPage />} />
              <Route path="/inventory/stock" element={<StockPage />} />
              <Route path="/inventory/batches" element={<BatchesPage />} />
              <Route path="/inventory/bulk-entry" element={<BulkEntryPage />} />
              
              {/* Payments */}
              <Route path="/payments" element={<PaymentsPage />} />
              
              {/* Production */}
              <Route path="/production/recipes" element={<ProductionRecipesPage />} />
              <Route path="/production/orders" element={<ProductionOrdersPage />} />
              <Route path="/production/tracking" element={<ProductionTrackingPage />} />
              
              {/* Notifications */}
              <Route path="/notifications" element={<NotificationsPage />} />
              
              {/* Admin */}
              <Route path="/admin/users" element={
                <PlaceholderPage
                  title="Gestión de Usuarios"
                  description="Administración de usuarios y roles del sistema"
                  priority="medium"
                  estimatedCompletion="Semana 6"
                  features={[
                    'Registro de usuarios con roles',
                    'Gestión de permisos y accesos',
                    'Auditoría de actividades',
                    'Configuración de seguridad'
                  ]}
                />
              } />
              <Route path="/admin/settings" element={
                <PlaceholderPage
                  title="Configuración del Sistema"
                  description="Configuración general y parámetros del sistema"
                  priority="low"
                  estimatedCompletion="Semana 6"
                  features={[
                    'Configuración general',
                    'Parámetros del sistema',
                    'Backup y restauración',
                    'Logs y auditoría'
                  ]}
                />
              } />
              
              {/* Reports */}
              <Route path="/reports" element={
                <PlaceholderPage
                  title="Reportes"
                  description="Generación de reportes y análisis de datos"
                  priority="medium"
                  estimatedCompletion="Semana 5"
                  features={[
                    'Reportes de inventario',
                    'Análisis de ventas',
                    'Reportes financieros',
                    'Exportación de datos'
                  ]}
                />
              } />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
