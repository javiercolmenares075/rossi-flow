import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isExpired(date: Date | string): boolean {
  return new Date(date) < new Date();
}

export function daysUntilExpiry(date: Date | string): number {
  const expiryDate = new Date(date);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Number utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PY', {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-PY', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function calculateIVA(subtotal: number, ivaRate: number = 0.15): number {
  return subtotal * ivaRate;
}

export function calculateTotal(subtotal: number, ivaRate: number = 0.15): number {
  return subtotal + calculateIVA(subtotal, ivaRate);
}

// String utilities
export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function generateCode(prefix: string, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${year}${month}${day}${random}`;
}

export function generateBatchCode(productCode: string, date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${productCode}${year}${month}${day}${random}`;
}

// Status utilities
export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
    case 'completed':
    case 'paid':
      return 'text-green-600 bg-green-100';
    case 'inactive':
    case 'cancelled':
      return 'text-red-600 bg-red-100';
    case 'pending':
    case 'pre_order':
    case 'pre_production':
      return 'text-yellow-600 bg-yellow-100';
    case 'in_progress':
    case 'in_production':
    case 'issued':
      return 'text-blue-600 bg-blue-100';
    case 'expired':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
    pre_order: 'Pre-orden',
    issued: 'Emitida',
    received: 'Recibida',
    paid: 'Pagado',
    unpaid: 'No pagado',
    pre_production: 'Pre-producción',
    in_production: 'En producción',
    expired: 'Vencido',
    depleted: 'Agotado',
  };
  return statusMap[status] || status;
}

// Priority utilities
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
}

export function getPriorityText(priority: string): string {
  const priorityMap: Record<string, string> = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };
  return priorityMap[priority] || priority;
}

// Type utilities
export function getProviderTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    contract: 'Por Contrato',
    recurrent: 'Recurrente',
  };
  return typeMap[type] || type;
}

export function getStorageTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    bulk: 'A Granel',
    batch: 'Por Lotes',
  };
  return typeMap[type] || type;
}

export function getDeliveryFrequencyText(frequency: string): string {
  const frequencyMap: Record<string, string> = {
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
  };
  return frequencyMap[frequency] || frequency;
}

// Validation utilities
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRUC(ruc: string): boolean {
  // Basic RUC validation for Paraguay (8 digits)
  const rucRegex = /^\d{8}$/;
  return rucRegex.test(ruc);
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation for Paraguay
  const phoneRegex = /^(\+595|0)?[9][0-9]{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isImageFile(filename: string): boolean {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  return imageExtensions.includes(getFileExtension(filename));
}

export function isPDFFile(filename: string): boolean {
  return getFileExtension(filename) === 'pdf';
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Local storage utilities
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// QR Code utilities
export function generateQRData(batch: any): string {
  return JSON.stringify({
    code: batch.code,
    product: batch.product.name,
    batchNumber: batch.code.split('-').pop(),
    description: batch.description || '',
  });
}

// Export utilities
export function exportToCSV(data: any[], filename: string): void {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ];
  
  return csvRows.join('\n');
}
