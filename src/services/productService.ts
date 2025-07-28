import { supabase } from '@/lib/supabase';
import type { Product, ProductInsert, ProductUpdate } from '@/lib/supabase';

export const productService = {
  // Obtener todos los productos
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_types (
          id,
          name,
          description
        )
      `)
      .order('name');
    
    if (error) {
      console.error('Error fetching products:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  // Obtener producto por ID
  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_types (
          id,
          name,
          description
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  // Crear nuevo producto
  async create(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select(`
        *,
        product_types (
          id,
          name,
          description
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  // Actualizar producto
  async update(id: string, product: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select(`
        *,
        product_types (
          id,
          name,
          description
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating product:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  // Eliminar producto
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting product:', error);
      throw new Error(error.message);
    }
  },

  // Buscar productos
  async search(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_types (
          id,
          name,
          description
        )
      `)
      .or(`name.ilike.%${query}%,code.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    
    if (error) {
      console.error('Error searching products:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  // Obtener productos por tipo
  async getByType(productTypeId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_types (
          id,
          name,
          description
        )
      `)
      .eq('product_type_id', productTypeId)
      .order('name');
    
    if (error) {
      console.error('Error fetching products by type:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  // Obtener productos por estado
  async getByStatus(status: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_types (
          id,
          name,
          description
        )
      `)
      .eq('status', status)
      .order('name');
    
    if (error) {
      console.error('Error fetching products by status:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  // Verificar si existe un código de producto
  async checkCodeExists(code: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('products')
      .select('id')
      .eq('code', code);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error checking product code:', error);
      throw new Error(error.message);
    }
    
    return (data?.length || 0) > 0;
  }
}; 