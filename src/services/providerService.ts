import { supabase } from '@/lib/supabase';
import type { Provider, ProviderInsert, ProviderUpdate } from '@/lib/supabase';

export const providerService = {
  // Obtener todos los proveedores
  async getAll(): Promise<Provider[]> {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('business_name');
    
    if (error) {
      console.error('Error fetching providers:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  // Obtener proveedor por ID
  async getById(id: string): Promise<Provider | null> {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching provider:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  // Crear nuevo proveedor
  async create(provider: ProviderInsert): Promise<Provider> {
    const { data, error } = await supabase
      .from('providers')
      .insert(provider)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating provider:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  // Actualizar proveedor
  async update(id: string, provider: ProviderUpdate): Promise<Provider> {
    const { data, error } = await supabase
      .from('providers')
      .update(provider)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating provider:', error);
      throw new Error(error.message);
    }
    
    return data;
  },

  // Eliminar proveedor
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('providers')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting provider:', error);
      throw new Error(error.message);
    }
  },

  // Buscar proveedores
  async search(query: string): Promise<Provider[]> {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .or(`business_name.ilike.%${query}%,ruc.ilike.%${query}%,contact_person.ilike.%${query}%`)
      .order('business_name');
    
    if (error) {
      console.error('Error searching providers:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  },

  // Obtener proveedores por tipo
  async getByType(type: string): Promise<Provider[]> {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('type', type)
      .order('business_name');
    
    if (error) {
      console.error('Error fetching providers by type:', error);
      throw new Error(error.message);
    }
    
    return data || [];
  }
}; 