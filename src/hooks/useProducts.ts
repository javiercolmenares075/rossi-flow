import { useState, useEffect } from 'react';
import { productService } from '@/services/productService';
import type { Product, ProductInsert, ProductUpdate } from '@/lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (product: ProductInsert): Promise<Product> => {
    try {
      setError(null);
      const newProduct = await productService.create(product);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear producto';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateProduct = async (id: string, product: ProductUpdate): Promise<Product> => {
    try {
      setError(null);
      const updatedProduct = await productService.update(id, product);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar producto';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      setError(null);
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar producto';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const searchProducts = async (query: string): Promise<Product[]> => {
    try {
      setError(null);
      return await productService.search(query);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar productos';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getProductsByType = async (productTypeId: string): Promise<Product[]> => {
    try {
      setError(null);
      return await productService.getByType(productTypeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener productos por tipo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const getProductsByStatus = async (status: string): Promise<Product[]> => {
    try {
      setError(null);
      return await productService.getByStatus(status);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener productos por estado';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const checkCodeExists = async (code: string, excludeId?: string): Promise<boolean> => {
    try {
      setError(null);
      return await productService.checkCodeExists(code, excludeId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar código';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByType,
    getProductsByStatus,
    checkCodeExists,
    refresh: loadProducts,
    clearError: () => setError(null)
  };
}