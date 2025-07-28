import { useState, useEffect } from 'react';
import { providerService } from '@/services/providerService';
import type { Provider, ProviderInsert, ProviderUpdate } from '@/lib/supabase';

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar todos los proveedores
  const loadProviders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await providerService.getAll();
      setProviders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error loading providers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo proveedor
  const createProvider = async (provider: ProviderInsert): Promise<Provider> => {
    try {
      setError(null);
      const newProvider = await providerService.create(provider);
      setProviders(prev => [...prev, newProvider]);
      return newProvider;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear proveedor';
      setError(errorMessage);
      console.error('Error creating provider:', err);
      throw err;
    }
  };

  // Actualizar proveedor
  const updateProvider = async (id: string, provider: ProviderUpdate): Promise<Provider> => {
    try {
      setError(null);
      const updatedProvider = await providerService.update(id, provider);
      setProviders(prev => prev.map(p => p.id === id ? updatedProvider : p));
      return updatedProvider;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar proveedor';
      setError(errorMessage);
      console.error('Error updating provider:', err);
      throw err;
    }
  };

  // Eliminar proveedor
  const deleteProvider = async (id: string): Promise<void> => {
    try {
      setError(null);
      await providerService.delete(id);
      setProviders(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar proveedor';
      setError(errorMessage);
      console.error('Error deleting provider:', err);
      throw err;
    }
  };

  // Buscar proveedores
  const searchProviders = async (query: string): Promise<Provider[]> => {
    try {
      setError(null);
      const results = await providerService.search(query);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar proveedores';
      setError(errorMessage);
      console.error('Error searching providers:', err);
      throw err;
    }
  };

  // Obtener proveedores por tipo
  const getProvidersByType = async (type: string): Promise<Provider[]> => {
    try {
      setError(null);
      const results = await providerService.getByType(type);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener proveedores por tipo';
      setError(errorMessage);
      console.error('Error getting providers by type:', err);
      throw err;
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProviders();
  }, []);

  return {
    providers,
    loading,
    error,
    createProvider,
    updateProvider,
    deleteProvider,
    searchProviders,
    getProvidersByType,
    refresh: loadProviders,
    clearError: () => setError(null)
  };
} 