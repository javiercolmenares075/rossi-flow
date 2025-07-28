# 🗄️ Configuración de Supabase para Rossi Flow

## 📋 Pasos para Configurar Supabase

### **1. 🚀 Crear Proyecto en Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión o crea una cuenta
3. Haz clic en "New Project"
4. Completa la información:
   - **Name**: `rossi-flow`
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Selecciona la más cercana
5. Haz clic en "Create new project"

### **2. 🔑 Obtener Credenciales**

1. Ve a **Settings** → **API**
2. Copia las siguientes credenciales:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **3. 📝 Configurar Variables de Entorno**

1. Crea un archivo `.env` en la raíz del proyecto:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. Reemplaza con tus credenciales reales

### **4. 🗃️ Ejecutar Script SQL**

1. Ve a **SQL Editor** en Supabase
2. Copia y pega el contenido de `supabase-schema.sql`
3. Ejecuta el script completo
4. Verifica que todas las tablas se crearon correctamente

### **5. 🔐 Configurar Autenticación (Opcional)**

Si quieres usar autenticación:

1. Ve a **Authentication** → **Settings**
2. Configura los proveedores que necesites
3. Ajusta las políticas RLS según tus necesidades

## 📊 Estructura de la Base de Datos

### **Tablas Principales:**

| Tabla | Descripción | Registros |
|-------|-------------|-----------|
| `product_types` | Tipos de productos | 6 |
| `products` | Productos | - |
| `providers` | Proveedores | - |
| `warehouses` | Almacenes | - |
| `employees` | Empleados | - |
| `purchase_orders` | Órdenes de compra | - |
| `payments` | Pagos | - |
| `batches` | Lotes de inventario | - |
| `inventory_movements` | Movimientos de inventario | - |
| `recipes` | Recetas de producción | - |
| `production_orders` | Órdenes de producción | - |

### **Vistas Útiles:**

- `current_inventory`: Inventario actual
- `pending_payments`: Pagos pendientes
- `low_stock_products`: Productos con stock bajo

## 🛠️ Servicios Implementados

### **Servicios Disponibles:**

- ✅ `providerService`: CRUD de proveedores
- ✅ `productService`: CRUD de productos
- 🔄 `purchaseOrderService`: CRUD de órdenes de compra
- 🔄 `paymentService`: CRUD de pagos
- 🔄 `inventoryService`: CRUD de inventario
- 🔄 `productionService`: CRUD de producción

### **Hooks Disponibles:**

- ✅ `useProviders`: Hook para proveedores
- 🔄 `useProducts`: Hook para productos
- 🔄 `usePurchaseOrders`: Hook para órdenes de compra
- 🔄 `usePayments`: Hook para pagos

## 🔧 Configuración del Frontend

### **1. Verificar Configuración**

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### **2. Usar en Componentes**

```typescript
// Ejemplo de uso en un componente
import { useProviders } from '@/hooks/useProviders';

function ProvidersPage() {
  const { providers, loading, error, createProvider } = useProviders();
  
  // Tu lógica aquí
}
```

## 🚨 Solución de Problemas

### **Error: "Faltan las variables de entorno"**
- Verifica que el archivo `.env` existe
- Asegúrate de que las variables están correctas
- Reinicia el servidor de desarrollo

### **Error: "Cannot connect to Supabase"**
- Verifica la URL del proyecto
- Confirma que la clave anónima es correcta
- Revisa la conectividad de red

### **Error: "Table does not exist"**
- Ejecuta el script SQL completo
- Verifica que todas las tablas se crearon
- Revisa los permisos RLS

## 📈 Próximos Pasos

### **1. Migrar Datos Mock**
```typescript
// Crear script de migración
const mockData = {
  providers: [...],
  products: [...],
  // etc.
};

// Migrar a Supabase
for (const provider of mockData.providers) {
  await providerService.create(provider);
}
```

### **2. Implementar Autenticación**
```typescript
// Configurar autenticación
const { user, session } = await supabase.auth.getUser();
```

### **3. Configurar Políticas RLS**
```sql
-- Ejemplo de política por usuario
CREATE POLICY "Users can only see their own data" 
ON providers FOR ALL 
USING (auth.uid() = user_id);
```

### **4. Implementar Tiempo Real**
```typescript
// Suscribirse a cambios
const subscription = supabase
  .channel('providers')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'providers' }, payload => {
    console.log('Change received!', payload);
  })
  .subscribe();
```

## 📞 Soporte

Si tienes problemas:

1. **Revisa la consola** del navegador para errores
2. **Verifica la configuración** de Supabase
3. **Consulta la documentación** de Supabase
4. **Revisa los logs** en el dashboard de Supabase

---

**¡Listo! Tu proyecto Rossi Flow ahora está conectado a Supabase. 🎉** 