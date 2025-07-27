import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Building2,
  Phone,
  Mail,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Provider } from '@/types';

// Mock data for development
const mockProviders: Provider[] = [
  {
    id: '1',
    type: 'contract',
    businessName: 'Lácteos del Sur S.A.',
    ruc: '80012345-1',
    address: 'Ruta 2 Km 45, San Lorenzo',
    email: 'contacto@lacteosdelsur.com.py',
    phones: ['021-123-456', '0981-123-456'],
    contacts: [
      {
        name: 'Juan Pérez',
        position: 'Gerente Comercial',
        phone: '0981-123-456',
        email: 'juan.perez@lacteosdelsur.com.py'
      }
    ],
    categories: ['Leche', 'Queso'],
    associatedProducts: ['Leche entera', 'Queso paraguay'],
    contractFile: 'contrato_lacteos_sur.pdf',
    contractNumber: 'CON-2024-001',
    contractStartDate: new Date('2024-01-15'),
    deliveryFrequency: 'weekly',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'recurrent',
    businessName: 'Granja San Miguel',
    ruc: '80023456-2',
    address: 'Ruta 1 Km 30, Luque',
    email: 'info@granjasanmiguel.com.py',
    phones: ['021-234-567', '0982-234-567'],
    contacts: [
      {
        name: 'María González',
        position: 'Encargada de Ventas',
        phone: '0982-234-567',
        email: 'maria.gonzalez@granjasanmiguel.com.py'
      }
    ],
    categories: ['Huevos', 'Pollo'],
    associatedProducts: ['Huevos frescos', 'Pollo entero'],
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  }
];

export function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = provider.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.ruc.includes(searchTerm) ||
                         provider.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || provider.type === filterType;
    const matchesStatus = filterStatus === 'all' || provider.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteProvider = (id: string) => {
    setProviders(providers.filter(provider => provider.id !== id));
  };

  const openEditDialog = (provider: Provider) => {
    setSelectedProvider(provider);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proveedores</h1>
          <p className="text-muted-foreground">
            Gestión de proveedores, contratos y asociaciones de productos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Proveedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
              <DialogDescription>
                Complete la información del proveedor. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="type">Tipo de Proveedor *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurrent">Recurrente</SelectItem>
                      <SelectItem value="contract">Por Contrato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select defaultValue="active">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="businessName">Razón Social *</Label>
                  <Input
                    id="businessName"
                    placeholder="Nombre de la empresa"
                  />
                </div>

                <div>
                  <Label htmlFor="ruc">RUC *</Label>
                  <Input
                    id="ruc"
                    placeholder="80012345-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Textarea
                    id="address"
                    placeholder="Dirección completa"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contacto@empresa.com.py"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    placeholder="021-123-456"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear Proveedor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, RUC o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="contract">Por contrato</SelectItem>
                <SelectItem value="recurrent">Recurrente</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredProviders.length} proveedores
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Providers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Proveedores</CardTitle>
          <CardDescription>
            Gestione todos los proveedores registrados en el sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Proveedor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Categorías</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{provider.businessName}</div>
                        <div className="text-sm text-muted-foreground">
                          RUC: {provider.ruc}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={provider.type === 'contract' ? 'default' : 'secondary'}>
                        {provider.type === 'contract' ? 'Contrato' : 'Recurrente'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {provider.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {provider.phones[0]}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {provider.categories.slice(0, 2).map((category) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        {provider.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={provider.status === 'active' ? 'default' : 'destructive'}>
                        {provider.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(provider)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProvider(provider.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>
              Modifique la información del proveedor seleccionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-type">Tipo de Proveedor</Label>
                <Select defaultValue={selectedProvider?.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recurrent">Recurrente</SelectItem>
                    <SelectItem value="contract">Por Contrato</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select defaultValue={selectedProvider?.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-businessName">Razón Social</Label>
                <Input
                  id="edit-businessName"
                  defaultValue={selectedProvider?.businessName}
                />
              </div>

              <div>
                <Label htmlFor="edit-ruc">RUC</Label>
                <Input
                  id="edit-ruc"
                  defaultValue={selectedProvider?.ruc}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="edit-address">Dirección</Label>
                <Textarea
                  id="edit-address"
                  defaultValue={selectedProvider?.address}
                />
              </div>

              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedProvider?.email}
                />
              </div>

              <div>
                <Label htmlFor="edit-phone">Teléfono</Label>
                <Input
                  id="edit-phone"
                  defaultValue={selectedProvider?.phones[0]}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Actualizar Proveedor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 