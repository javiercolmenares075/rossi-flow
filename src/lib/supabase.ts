import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan las variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Tipos de datos para la base de datos
export interface Database {
  public: {
    Tables: {
      // Catálogos
      product_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      products: {
        Row: {
          id: string;
          code: string;
          name: string;
          description: string | null;
          unit: string;
          product_type_id: string | null;
          storage_type: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          name: string;
          description?: string | null;
          unit: string;
          product_type_id?: string | null;
          storage_type?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          name?: string;
          description?: string | null;
          unit?: string;
          product_type_id?: string | null;
          storage_type?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      providers: {
        Row: {
          id: string;
          business_name: string;
          ruc: string | null;
          type: string;
          contact_person: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          payment_terms: number;
          product_types: string[] | null;
          contract_number: string | null;
          contract_start_date: string | null;
          delivery_frequency: string | null;
          contract_file_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_name: string;
          ruc?: string | null;
          type: string;
          contact_person?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          payment_terms?: number;
          product_types?: string[] | null;
          contract_number?: string | null;
          contract_start_date?: string | null;
          delivery_frequency?: string | null;
          contract_file_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string;
          ruc?: string | null;
          type?: string;
          contact_person?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          payment_terms?: number;
          product_types?: string[] | null;
          contract_number?: string | null;
          contract_start_date?: string | null;
          delivery_frequency?: string | null;
          contract_file_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      provider_product_types: {
        Row: {
          id: string;
          provider_id: string;
          product_type_id: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          product_type_id: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          product_type_id?: string;
        };
      };

      warehouses: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          capacity: number | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          capacity?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          capacity?: number | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      storage_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          temperature_range: string | null;
          humidity_range: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          temperature_range?: string | null;
          humidity_range?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          temperature_range?: string | null;
          humidity_range?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      employees: {
        Row: {
          id: string;
          employee_code: string;
          first_name: string;
          last_name: string;
          position: string | null;
          department: string | null;
          phone: string | null;
          email: string | null;
          hire_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          employee_code: string;
          first_name: string;
          last_name: string;
          position?: string | null;
          department?: string | null;
          phone?: string | null;
          email?: string | null;
          hire_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          employee_code?: string;
          first_name?: string;
          last_name?: string;
          position?: string | null;
          department?: string | null;
          phone?: string | null;
          email?: string | null;
          hire_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      system_states: {
        Row: {
          id: string;
          name: string;
          module: string;
          color: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          module: string;
          color?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          module?: string;
          color?: string | null;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Compras y Pagos
      purchase_orders: {
        Row: {
          id: string;
          order_number: string;
          provider_id: string;
          employee_id: string;
          order_date: string;
          delivery_date: string | null;
          total_amount: number;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          provider_id: string;
          employee_id: string;
          order_date: string;
          delivery_date?: string | null;
          total_amount?: number;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          provider_id?: string;
          employee_id?: string;
          order_date?: string;
          delivery_date?: string | null;
          total_amount?: number;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          received_quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          total_price?: number;
          received_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          purchase_order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          received_quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      payments: {
        Row: {
          id: string;
          purchase_order_id: string;
          amount: number;
          payment_date: string;
          payment_type: string;
          reference: string | null;
          description: string | null;
          receipt_file: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          purchase_order_id: string;
          amount: number;
          payment_date: string;
          payment_type: string;
          reference?: string | null;
          description?: string | null;
          receipt_file?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          purchase_order_id?: string;
          amount?: number;
          payment_date?: string;
          payment_type?: string;
          reference?: string | null;
          description?: string | null;
          receipt_file?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Inventario
      batches: {
        Row: {
          id: string;
          code: string;
          product_id: string;
          warehouse_id: string;
          quantity: number;
          unit_cost: number | null;
          expiry_date: string | null;
          production_date: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          product_id: string;
          warehouse_id: string;
          quantity: number;
          unit_cost?: number | null;
          expiry_date?: string | null;
          production_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          product_id?: string;
          warehouse_id?: string;
          quantity?: number;
          unit_cost?: number | null;
          expiry_date?: string | null;
          production_date?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      inventory_movements: {
        Row: {
          id: string;
          movement_type: string;
          product_id: string;
          warehouse_id: string;
          batch_id: string | null;
          quantity: number;
          reference: string | null;
          notes: string | null;
          employee_id: string;
          movement_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          movement_type: string;
          product_id: string;
          warehouse_id: string;
          batch_id?: string | null;
          quantity: number;
          reference?: string | null;
          notes?: string | null;
          employee_id: string;
          movement_date?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          movement_type?: string;
          product_id?: string;
          warehouse_id?: string;
          batch_id?: string | null;
          quantity?: number;
          reference?: string | null;
          notes?: string | null;
          employee_id?: string;
          movement_date?: string;
          created_at?: string;
        };
      };

      // Producción
      recipes: {
        Row: {
          id: string;
          name: string;
          product_id: string;
          description: string | null;
          yield_quantity: number | null;
          yield_unit: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          product_id: string;
          description?: string | null;
          yield_quantity?: number | null;
          yield_unit?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          product_id?: string;
          description?: string | null;
          yield_quantity?: number | null;
          yield_unit?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      recipe_ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          product_id: string;
          quantity: number;
          unit: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipe_id: string;
          product_id: string;
          quantity: number;
          unit: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipe_id?: string;
          product_id?: string;
          quantity?: number;
          unit?: string;
          created_at?: string;
        };
      };

      production_orders: {
        Row: {
          id: string;
          order_number: string;
          recipe_id: string;
          planned_quantity: number;
          actual_quantity: number | null;
          start_date: string | null;
          end_date: string | null;
          status: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          recipe_id: string;
          planned_quantity: number;
          actual_quantity?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          recipe_id?: string;
          planned_quantity?: number;
          actual_quantity?: number | null;
          start_date?: string | null;
          end_date?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // Notificaciones
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: string;
          priority: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          type: string;
          priority?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: string;
          priority?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };

      notification_settings: {
        Row: {
          id: string;
          user_id: string | null;
          email_notifications: boolean;
          push_notifications: boolean;
          low_stock_alerts: boolean;
          payment_reminders: boolean;
          expiry_alerts: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          email_notifications?: boolean;
          push_notifications?: boolean;
          low_stock_alerts?: boolean;
          payment_reminders?: boolean;
          expiry_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          email_notifications?: boolean;
          push_notifications?: boolean;
          low_stock_alerts?: boolean;
          payment_reminders?: boolean;
          expiry_alerts?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Tipos exportados para uso en componentes
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type Provider = Database['public']['Tables']['providers']['Row'];
export type ProviderInsert = Database['public']['Tables']['providers']['Insert'];
export type ProviderUpdate = Database['public']['Tables']['providers']['Update'];

export type PurchaseOrder = Database['public']['Tables']['purchase_orders']['Row'];
export type PurchaseOrderInsert = Database['public']['Tables']['purchase_orders']['Insert'];
export type PurchaseOrderUpdate = Database['public']['Tables']['purchase_orders']['Update'];

export type Payment = Database['public']['Tables']['payments']['Row'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type PaymentUpdate = Database['public']['Tables']['payments']['Update'];

export type Employee = Database['public']['Tables']['employees']['Row'];
export type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
export type EmployeeUpdate = Database['public']['Tables']['employees']['Update'];

export type Warehouse = Database['public']['Tables']['warehouses']['Row'];
export type WarehouseInsert = Database['public']['Tables']['warehouses']['Insert'];
export type WarehouseUpdate = Database['public']['Tables']['warehouses']['Update'];

export type Batch = Database['public']['Tables']['batches']['Row'];
export type BatchInsert = Database['public']['Tables']['batches']['Insert'];
export type BatchUpdate = Database['public']['Tables']['batches']['Update'];

export type InventoryMovement = Database['public']['Tables']['inventory_movements']['Row'];
export type InventoryMovementInsert = Database['public']['Tables']['inventory_movements']['Insert'];
export type InventoryMovementUpdate = Database['public']['Tables']['inventory_movements']['Update'];

export type Recipe = Database['public']['Tables']['recipes']['Row'];
export type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];
export type RecipeUpdate = Database['public']['Tables']['recipes']['Update'];

export type ProductionOrder = Database['public']['Tables']['production_orders']['Row'];
export type ProductionOrderInsert = Database['public']['Tables']['production_orders']['Insert'];
export type ProductionOrderUpdate = Database['public']['Tables']['production_orders']['Update'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update']; 