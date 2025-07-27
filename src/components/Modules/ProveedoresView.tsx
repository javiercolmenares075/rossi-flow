import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Mail,
  Phone,
  FileText,
  Building
} from "lucide-react";

export function ProveedoresView() {
  const proveedores = [
    { 
      id: "PRV-001", 
      razonSocial: "Lácteos del Norte S.A.", 
      ruc: "20123456789",
      tipo: "Contrato",
      email: "ventas@lacteosn.com",
      telefono: "+1 234-567-8900",
      contacto: "María González",
      categoria: "Insumos Lácteos",
      productos: ["Leche en Polvo", "Conservantes"],
      estado: "Activo",
      contrato: "CONT-001",
      frecuencia: "Semanal"
    },
    { 
      id: "PRV-002", 
      razonSocial: "Insumos Industriales EIRL", 
      ruc: "10987654321",
      tipo: "Recurrente",
      email: "pedidos@insumos.com",
      telefono: "+1 234-567-8901",
      contacto: "Carlos Ramírez",
      categoria: "Químicos",
      productos: ["Conservantes", "Aditivos"],
      estado: "Activo",
      contrato: null,
      frecuencia: null
    },
    { 
      id: "PRV-003", 
      razonSocial: "Envases Premium Corp.", 
      ruc: "20456789123",
      tipo: "Contrato",
      email: "comercial@envases.com",
      telefono: "+1 234-567-8902",
      contacto: "Ana Torres",
      categoria: "Envases",
      productos: ["Envases 500ml", "Tapas", "Etiquetas"],
      estado: "Activo",
      contrato: "CONT-002",
      frecuencia: "Quincenal"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
          <p className="text-muted-foreground">
            Administra proveedores, contratos y contactos
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Buscar por nombre, RUC o categoría..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <Badge variant="outline" className="h-10 px-4 flex items-center">
              <Building className="w-4 h-4 mr-2" />
              {proveedores.length} Proveedores
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      <div className="space-y-4">
        {proveedores.map((proveedor) => (
          <Card key={proveedor.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{proveedor.razonSocial}</h3>
                        <Badge variant={proveedor.tipo === "Contrato" ? "default" : "secondary"}>
                          {proveedor.tipo}
                        </Badge>
                        {proveedor.contrato && (
                          <Badge variant="outline" className="gap-1">
                            <FileText className="w-3 h-3" />
                            {proveedor.contrato}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">RUC: {proveedor.ruc}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Contacto</p>
                        <p className="font-medium">{proveedor.contacto}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{proveedor.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs">{proveedor.telefono}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">Categoría</p>
                        <Badge variant="outline">{proveedor.categoria}</Badge>
                        {proveedor.frecuencia && (
                          <div className="mt-2">
                            <p className="text-muted-foreground mb-1">Frecuencia</p>
                            <p className="text-xs font-medium">{proveedor.frecuencia}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-muted-foreground mb-1">Productos</p>
                        <div className="flex flex-wrap gap-1">
                          {proveedor.productos.slice(0, 2).map((producto, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {producto}
                            </Badge>
                          ))}
                          {proveedor.productos.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{proveedor.productos.length - 2} más
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                  {proveedor.contrato && (
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Supplier Card */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Agregar Nuevo Proveedor</h3>
          <p className="text-muted-foreground text-center mb-4">
            Registra un nuevo proveedor con sus datos de contacto y productos
          </p>
          <Button>Crear Proveedor</Button>
        </CardContent>
      </Card>
    </div>
  );
}