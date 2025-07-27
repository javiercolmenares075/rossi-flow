import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Validation schema for employee
const employeeSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
  position: z.string().min(2, 'El cargo debe tener al menos 2 caracteres'),
  department: z.enum(['production', 'warehouse', 'quality', 'admin', 'sales']),
  address: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  hireDate: z.string().min(1, 'La fecha de contratación es obligatoria'),
  salary: z.number().min(0, 'El salario debe ser mayor o igual a 0'),
  status: z.enum(['active', 'inactive']).default('active')
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

// Mock data for development
const mockEmployees = [
  {
    id: '1',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@rossi.com.py',
    phone: '0981-123-456',
    position: 'Gerente de Producción',
    department: 'production',
    address: 'Ruta 2 Km 45, San Lorenzo',
    hireDate: new Date('2023-01-15'),
    salary: 2500000,
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@rossi.com.py',
    phone: '0982-234-567',
    position: 'Encargada de Almacén',
    department: 'warehouse',
    address: 'Ruta 1 Km 30, Luque',
    hireDate: new Date('2023-03-20'),
    salary: 1800000,
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'López',
    email: 'carlos.lopez@rossi.com.py',
    phone: '0983-345-678',
    position: 'Control de Calidad',
    department: 'quality',
    address: 'Ruta 2 Km 45, San Lorenzo',
    hireDate: new Date('2023-06-10'),
    salary: 2000000,
    status: 'active',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  }
];

const departments = [
  { value: 'production', label: 'Producción' },
  { value: 'warehouse', label: 'Almacén' },
  { value: 'quality', label: 'Control de Calidad' },
  { value: 'admin', label: 'Administración' },
  { value: 'sales', label: 'Ventas' }
];

export function EmployeesPage() {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'active',
      department: 'production',
      salary: 0
    }
  });

  const editForm = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema)
  });

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  const handleCreateEmployee = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    try {
      const newEmployee = {
        id: Date.now().toString(),
        ...data,
        hireDate: new Date(data.hireDate),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setEmployees([...employees, newEmployee]);
      setIsCreateDialogOpen(false);
      createForm.reset();
    } catch (error) {
      console.error('Error creating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEmployee = async (data: EmployeeFormData) => {
    if (!selectedEmployee) return;
    
    setIsSubmitting(true);
    try {
      const updatedEmployee = {
        ...selectedEmployee,
        ...data,
        hireDate: new Date(data.hireDate),
        updatedAt: new Date()
      };
      setEmployees(employees.map(e => e.id === selectedEmployee.id ? updatedEmployee : e));
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
      editForm.reset();
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee);
    editForm.reset({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      address: employee.address,
      hireDate: employee.hireDate.toISOString().split('T')[0],
      salary: employee.salary,
      status: employee.status
    });
    setIsEditDialogOpen(true);
  };

  const getDepartmentBadge = (department: string) => {
    const departmentData = departments.find(d => d.value === department);
    return (
      <Badge variant="outline">
        {departmentData?.label || department}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === 'active' ? 'default' : 'destructive'}>
        {status === 'active' ? 'Activo' : 'Inactivo'}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PY', {
      style: 'currency',
      currency: 'PYG'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empleados</h1>
          <p className="text-muted-foreground">
            Gestión del personal y recursos humanos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Empleado</DialogTitle>
              <DialogDescription>
                Complete la información del empleado. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={createForm.handleSubmit(handleCreateEmployee)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    {...createForm.register('firstName')}
                    placeholder="Juan"
                  />
                  {createForm.formState.errors.firstName && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    {...createForm.register('lastName')}
                    placeholder="Pérez"
                  />
                  {createForm.formState.errors.lastName && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    {...createForm.register('email')}
                    type="email"
                    placeholder="juan.perez@rossi.com.py"
                  />
                  {createForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    {...createForm.register('phone')}
                    placeholder="0981-123-456"
                  />
                  {createForm.formState.errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="position">Cargo *</Label>
                  <Input
                    {...createForm.register('position')}
                    placeholder="Gerente de Producción"
                  />
                  {createForm.formState.errors.position && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.position.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="department">Departamento *</Label>
                  <Select 
                    value={createForm.watch('department')} 
                    onValueChange={(value) => createForm.setValue('department', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {createForm.formState.errors.department && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.department.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="hireDate">Fecha de Contratación *</Label>
                  <Input
                    {...createForm.register('hireDate')}
                    type="date"
                  />
                  {createForm.formState.errors.hireDate && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.hireDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="salary">Salario (₲) *</Label>
                  <Input
                    {...createForm.register('salary', { valueAsNumber: true })}
                    type="number"
                    placeholder="2000000"
                  />
                  {createForm.formState.errors.salary && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.salary.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select 
                    value={createForm.watch('status')} 
                    onValueChange={(value) => createForm.setValue('status', value as 'active' | 'inactive')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Dirección *</Label>
                  <Textarea
                    {...createForm.register('address')}
                    placeholder="Dirección completa"
                  />
                  {createForm.formState.errors.address && (
                    <p className="text-sm text-destructive mt-1">
                      {createForm.formState.errors.address.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creando...' : 'Crear Empleado'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por nombre, email o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="filterDepartment">Departamento</Label>
              <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="filterStatus">Estado</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Empleados</CardTitle>
          <CardDescription>
            {filteredEmployees.length} empleados encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Salario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{`${employee.firstName} ${employee.lastName}`}</div>
                      <div className="text-sm text-muted-foreground">
                        Contratado: {employee.hireDate.toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{employee.position}</div>
                  </TableCell>
                  <TableCell>
                    {getDepartmentBadge(employee.department)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{employee.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {formatCurrency(employee.salary)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(employee.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(employee)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Empleado</DialogTitle>
            <DialogDescription>
              Modifique la información del empleado seleccionado.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleEditEmployee)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="edit-firstName">Nombre *</Label>
                <Input
                  {...editForm.register('firstName')}
                  placeholder="Juan"
                />
                {editForm.formState.errors.firstName && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-lastName">Apellido *</Label>
                <Input
                  {...editForm.register('lastName')}
                  placeholder="Pérez"
                />
                {editForm.formState.errors.lastName && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  {...editForm.register('email')}
                  type="email"
                  placeholder="juan.perez@rossi.com.py"
                />
                {editForm.formState.errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-phone">Teléfono *</Label>
                <Input
                  {...editForm.register('phone')}
                  placeholder="0981-123-456"
                />
                {editForm.formState.errors.phone && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-position">Cargo *</Label>
                <Input
                  {...editForm.register('position')}
                  placeholder="Gerente de Producción"
                />
                {editForm.formState.errors.position && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.position.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-department">Departamento *</Label>
                <Select 
                  value={editForm.watch('department')} 
                  onValueChange={(value) => editForm.setValue('department', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editForm.formState.errors.department && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.department.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-hireDate">Fecha de Contratación *</Label>
                <Input
                  {...editForm.register('hireDate')}
                  type="date"
                />
                {editForm.formState.errors.hireDate && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.hireDate.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-salary">Salario (₲) *</Label>
                <Input
                  {...editForm.register('salary', { valueAsNumber: true })}
                  type="number"
                  placeholder="2000000"
                />
                {editForm.formState.errors.salary && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.salary.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-status">Estado</Label>
                <Select 
                  value={editForm.watch('status')} 
                  onValueChange={(value) => editForm.setValue('status', value as 'active' | 'inactive')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="edit-address">Dirección *</Label>
                <Textarea
                  {...editForm.register('address')}
                  placeholder="Dirección completa"
                />
                {editForm.formState.errors.address && (
                  <p className="text-sm text-destructive mt-1">
                    {editForm.formState.errors.address.message}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 