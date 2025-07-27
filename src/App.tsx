import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { MainLayout } from './components/Layout/MainLayout';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ProductosView } from './components/Modules/ProductosView';
import { ProveedoresView } from './components/Modules/ProveedoresView';

// Import all the new components we'll create
import { ProvidersPage } from './pages/catalogs/ProvidersPage';
import { ProductsPage } from './pages/catalogs/ProductsPage';
import { ProductTypesPage } from './pages/catalogs/ProductTypesPage';
import { StorageTypesPage } from './pages/catalogs/StorageTypesPage';
import { WarehousesPage } from './pages/catalogs/WarehousesPage';
import { WeighingTypesPage } from './pages/catalogs/WeighingTypesPage';
import { EmployeesPage } from './pages/catalogs/EmployeesPage';
import { StatesPage } from './pages/catalogs/StatesPage';
import { PaymentTypesPage } from './pages/catalogs/PaymentTypesPage';
import { PurchaseOrdersPage } from './pages/purchase-orders/PurchaseOrdersPage';
import { NewPurchaseOrderPage } from './pages/purchase-orders/NewPurchaseOrderPage';
import { PurchaseOrderHistoryPage } from './pages/purchase-orders/PurchaseOrderHistoryPage';
import { InventoryMovementsPage } from './pages/inventory/InventoryMovementsPage';
import { StockPage } from './pages/inventory/StockPage';
import { BatchesPage } from './pages/inventory/BatchesPage';
import { BulkEntryPage } from './pages/inventory/BulkEntryPage';
import { PaymentsPage } from './pages/payments/PaymentsPage';
import { NewPaymentPage } from './pages/payments/NewPaymentPage';
import { PaymentHistoryPage } from './pages/payments/PaymentHistoryPage';
import { ProductionRecipesPage } from './pages/production/ProductionRecipesPage';
import { ProductionOrdersPage } from './pages/production/ProductionOrdersPage';
import { NewProductionOrderPage } from './pages/production/NewProductionOrderPage';
import { ProductionTrackingPage } from './pages/production/ProductionTrackingPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { AlertsPage } from './pages/notifications/AlertsPage';
import { RemindersPage } from './pages/notifications/RemindersPage';
import { NotificationSettingsPage } from './pages/notifications/NotificationSettingsPage';
import { ReportsDashboardPage } from './pages/reports/ReportsDashboardPage';
import { InventoryReportsPage } from './pages/reports/InventoryReportsPage';
import { PurchaseReportsPage } from './pages/reports/PurchaseReportsPage';
import { ProductionReportsPage } from './pages/reports/ProductionReportsPage';
import { PaymentReportsPage } from './pages/reports/PaymentReportsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { RolesPage } from './pages/admin/RolesPage';
import { AuditPage } from './pages/admin/AuditPage';
import { SettingsPage } from './pages/admin/SettingsPage';

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
              <Route path="/payments/new" element={<NewPaymentPage />} />
              <Route path="/payments/pending" element={<PaymentsPage />} />
              <Route path="/payments/history" element={<PaymentHistoryPage />} />
              
              {/* Production */}
              <Route path="/production/recipes" element={<ProductionRecipesPage />} />
              <Route path="/production/orders" element={<ProductionOrdersPage />} />
              <Route path="/production/new" element={<NewProductionOrderPage />} />
              <Route path="/production/tracking" element={<ProductionTrackingPage />} />
              
              {/* Notifications */}
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/notifications/alerts" element={<AlertsPage />} />
              <Route path="/notifications/reminders" element={<RemindersPage />} />
              <Route path="/notifications/settings" element={<NotificationSettingsPage />} />
              
              {/* Reports */}
              <Route path="/reports/dashboard" element={<ReportsDashboardPage />} />
              <Route path="/reports/inventory" element={<InventoryReportsPage />} />
              <Route path="/reports/purchases" element={<PurchaseReportsPage />} />
              <Route path="/reports/production" element={<ProductionReportsPage />} />
              <Route path="/reports/payments" element={<PaymentReportsPage />} />
              
              {/* Admin */}
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/roles" element={<RolesPage />} />
              <Route path="/admin/audit" element={<AuditPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
              
              {/* Legacy routes for backward compatibility */}
              <Route path="/productos" element={<ProductosView />} />
              <Route path="/proveedores" element={<ProveedoresView />} />
              
              {/* Fallback */}
              <Route path="*" element={<DashboardView />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
