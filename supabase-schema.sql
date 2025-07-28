-- =====================================================
-- ESQUEMA DE BASE DE DATOS PARA ROSSI FLOW
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLAS DE CATÁLOGOS
-- =====================================================

-- Tipos de Productos
CREATE TABLE IF NOT EXISTS product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  unit VARCHAR(20) NOT NULL,
  product_type_id UUID REFERENCES product_types(id),
  storage_type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proveedores
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name VARCHAR(200) NOT NULL,
  ruc VARCHAR(20) UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('contract', 'spot')),
  contact_person VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  payment_terms INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relación Proveedores-Tipos de Producto
CREATE TABLE IF NOT EXISTS provider_product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  product_type_id UUID REFERENCES product_types(id) ON DELETE CASCADE,
  UNIQUE(provider_id, product_type_id)
);

-- Almacenes
CREATE TABLE IF NOT EXISTS warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  capacity DECIMAL(10,2),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tipos de Almacenamiento
CREATE TABLE IF NOT EXISTS storage_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  temperature_range VARCHAR(50),
  humidity_range VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Empleados
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  hire_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Estados del Sistema
CREATE TABLE IF NOT EXISTS system_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  module VARCHAR(50) NOT NULL,
  color VARCHAR(7),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE COMPRAS Y PAGOS
-- =====================================================

-- Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  provider_id UUID REFERENCES providers(id),
  employee_id UUID REFERENCES employees(id),
  order_date DATE NOT NULL,
  delivery_date DATE,
  total_amount DECIMAL(12,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detalles de Órdenes de Compra
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity DECIMAL(10,2) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  received_quantity DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pagos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  amount DECIMAL(12,2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_type VARCHAR(20) NOT NULL CHECK (payment_type IN ('cash', 'transfer', 'check', 'card', 'digital')),
  reference VARCHAR(100),
  description TEXT,
  receipt_file VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE INVENTARIO
-- =====================================================

-- Lotes
CREATE TABLE IF NOT EXISTS batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(100) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  quantity DECIMAL(10,2) NOT NULL,
  unit_cost DECIMAL(10,2),
  expiry_date DATE,
  production_date DATE,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Movimientos de Inventario
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('in', 'out', 'transfer', 'adjustment')),
  product_id UUID REFERENCES products(id),
  warehouse_id UUID REFERENCES warehouses(id),
  batch_id UUID REFERENCES batches(id),
  quantity DECIMAL(10,2) NOT NULL,
  reference VARCHAR(100),
  notes TEXT,
  employee_id UUID REFERENCES employees(id),
  movement_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE PRODUCCIÓN
-- =====================================================

-- Recetas
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  product_id UUID REFERENCES products(id),
  description TEXT,
  yield_quantity DECIMAL(10,2),
  yield_unit VARCHAR(20),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ingredientes de Recetas
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity DECIMAL(10,2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Órdenes de Producción
CREATE TABLE IF NOT EXISTS production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  recipe_id UUID REFERENCES recipes(id),
  planned_quantity DECIMAL(10,2) NOT NULL,
  actual_quantity DECIMAL(10,2),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'planned',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLAS DE NOTIFICACIONES
-- =====================================================

-- Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success')),
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuración de Notificaciones
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  low_stock_alerts BOOLEAN DEFAULT TRUE,
  payment_reminders BOOLEAN DEFAULT TRUE,
  expiry_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(product_type_id);

CREATE INDEX IF NOT EXISTS idx_providers_business_name ON providers(business_name);
CREATE INDEX IF NOT EXISTS idx_providers_ruc ON providers(ruc);
CREATE INDEX IF NOT EXISTS idx_providers_type ON providers(type);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_number ON purchase_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_date ON purchase_orders(order_date);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_batches_code ON batches(code);
CREATE INDEX IF NOT EXISTS idx_batches_product ON batches(product_id);
CREATE INDEX IF NOT EXISTS idx_batches_warehouse ON batches(warehouse_id);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_warehouse ON inventory_movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_date ON inventory_movements(movement_date);

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de Inventario Actual
CREATE OR REPLACE VIEW current_inventory AS
SELECT 
  p.id,
  p.code,
  p.name,
  pt.name as product_type,
  w.name as warehouse,
  COALESCE(SUM(b.quantity), 0) as total_quantity,
  COALESCE(SUM(b.quantity * b.unit_cost), 0) as total_value
FROM products p
LEFT JOIN product_types pt ON p.product_type_id = pt.id
LEFT JOIN batches b ON p.id = b.product_id AND b.status = 'active'
LEFT JOIN warehouses w ON b.warehouse_id = w.id
GROUP BY p.id, p.code, p.name, pt.name, w.name;

-- Vista de Pagos Pendientes
CREATE OR REPLACE VIEW pending_payments AS
SELECT 
  po.id,
  po.order_number,
  p.business_name as provider_name,
  po.total_amount,
  COALESCE(SUM(pay.amount), 0) as paid_amount,
  (po.total_amount - COALESCE(SUM(pay.amount), 0)) as pending_amount,
  po.delivery_date,
  po.status
FROM purchase_orders po
JOIN providers p ON po.provider_id = p.id
LEFT JOIN payments pay ON po.id = pay.purchase_order_id
WHERE po.status IN ('pending', 'partial')
GROUP BY po.id, po.order_number, p.business_name, po.total_amount, po.delivery_date, po.status;

-- Vista de Productos con Stock Bajo
CREATE OR REPLACE VIEW low_stock_products AS
SELECT 
  p.id,
  p.code,
  p.name,
  pt.name as product_type,
  w.name as warehouse,
  COALESCE(SUM(b.quantity), 0) as current_stock,
  p.unit
FROM products p
LEFT JOIN product_types pt ON p.product_type_id = pt.id
LEFT JOIN batches b ON p.id = b.product_id AND b.status = 'active'
LEFT JOIN warehouses w ON b.warehouse_id = w.id
WHERE p.status = 'active'
GROUP BY p.id, p.code, p.name, pt.name, w.name, p.unit
HAVING COALESCE(SUM(b.quantity), 0) < 10; -- Umbral de stock bajo

-- =====================================================
-- FUNCIONES ÚTILES
-- =====================================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_states_updated_at BEFORE UPDATE ON system_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_order_items_updated_at BEFORE UPDATE ON purchase_order_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_production_orders_updated_at BEFORE UPDATE ON production_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar tipos de productos básicos
INSERT INTO product_types (name, description) VALUES
('Lácteos', 'Productos derivados de la leche'),
('Cárnicos', 'Productos de carne y embutidos'),
('Granos', 'Cereales y legumbres'),
('Frutas y Verduras', 'Productos frescos'),
('Bebidas', 'Jugos, refrescos y otras bebidas'),
('Enlatados', 'Productos en conserva');

-- Insertar tipos de almacenamiento
INSERT INTO storage_types (name, description, temperature_range, humidity_range) VALUES
('Refrigeración', 'Almacenamiento en frío', '2-8°C', '85-95%'),
('Congelación', 'Almacenamiento congelado', '-18°C', 'N/A'),
('Seco', 'Almacenamiento a temperatura ambiente', '15-25°C', '50-70%'),
('Fresco', 'Almacenamiento fresco', '8-15°C', '80-90%');

-- Insertar estados del sistema
INSERT INTO system_states (name, module, color, description) VALUES
('Activo', 'general', '#10B981', 'Estado activo'),
('Inactivo', 'general', '#6B7280', 'Estado inactivo'),
('Pendiente', 'orders', '#F59E0B', 'Orden pendiente'),
('Aprobado', 'orders', '#10B981', 'Orden aprobada'),
('Rechazado', 'orders', '#EF4444', 'Orden rechazada'),
('En Proceso', 'production', '#3B82F6', 'En proceso de producción'),
('Completado', 'production', '#10B981', 'Producción completada'),
('Cancelado', 'production', '#EF4444', 'Producción cancelada');

-- =====================================================
-- POLÍTICAS DE SEGURIDAD (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según roles de usuario)
-- Por ahora, permitir acceso completo para desarrollo
CREATE POLICY "Enable all access for authenticated users" ON product_types FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON products FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON providers FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON provider_product_types FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON warehouses FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON storage_types FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON employees FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON system_states FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON purchase_orders FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON purchase_order_items FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON payments FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON batches FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON inventory_movements FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON recipes FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON recipe_ingredients FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON production_orders FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON notifications FOR ALL USING (true);
CREATE POLICY "Enable all access for authenticated users" ON notification_settings FOR ALL USING (true); 