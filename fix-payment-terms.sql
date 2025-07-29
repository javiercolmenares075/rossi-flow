-- =====================================================
-- CORRECCIÓN DEL CAMPO PAYMENT_TERMS
-- =====================================================

-- Cambiar el tipo de dato de payment_terms de INTEGER a VARCHAR
ALTER TABLE providers 
ALTER COLUMN payment_terms TYPE VARCHAR(50);

-- Verificar que el cambio se aplicó correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'providers' 
AND column_name = 'payment_terms';

-- Probar inserción con payment_terms como string
INSERT INTO providers (
  business_name, 
  ruc, 
  type, 
  contact_person, 
  phone, 
  email, 
  address, 
  payment_terms, 
  product_types, 
  status
) VALUES (
  'Proveedor de Prueba', 
  '12345678901', 
  'recurrent', 
  'Juan Pérez', 
  '0991234567', 
  'test@proveedor.com', 
  'Dirección de prueba', 
  '30 días', 
  ARRAY['1', '2'], 
  'active'
);

-- Verificar que se insertó correctamente
SELECT business_name, payment_terms, product_types 
FROM providers 
WHERE business_name = 'Proveedor de Prueba';

-- Limpiar datos de prueba
DELETE FROM providers WHERE business_name = 'Proveedor de Prueba';