-- =====================================================
-- ACTUALIZACIÓN DE ESQUEMA DE PROVEEDORES PARA MVP
-- =====================================================

-- Agregar campos adicionales para proveedores
ALTER TABLE providers 
ADD COLUMN IF NOT EXISTS product_types TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS contract_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS contract_start_date DATE,
ADD COLUMN IF NOT EXISTS delivery_frequency VARCHAR(20),
ADD COLUMN IF NOT EXISTS contract_file_url TEXT,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Actualizar la restricción de tipo para incluir los valores del MVP
ALTER TABLE providers 
DROP CONSTRAINT IF EXISTS providers_type_check;

ALTER TABLE providers 
ADD CONSTRAINT providers_type_check 
CHECK (type IN ('contract', 'recurrent'));

-- Crear índices para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_providers_product_types ON providers USING GIN (product_types);
CREATE INDEX IF NOT EXISTS idx_providers_contract_number ON providers(contract_number);
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);

-- Comentarios para documentar los campos
COMMENT ON COLUMN providers.product_types IS 'Array de IDs de tipos de productos que suministra el proveedor';
COMMENT ON COLUMN providers.contract_number IS 'Número de contrato (autoincremental)';
COMMENT ON COLUMN providers.contract_start_date IS 'Fecha de inicio del contrato';
COMMENT ON COLUMN providers.delivery_frequency IS 'Frecuencia de entrega: weekly, biweekly, monthly';
COMMENT ON COLUMN providers.contract_file_url IS 'URL del archivo PDF del contrato';
COMMENT ON COLUMN providers.status IS 'Estado del proveedor: active, inactive, suspended';