import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  QrCode,
  AlertTriangle
} from "lucide-react";

export function ProductosView() {
  const productos = [
    { 
      id: "PRD-001", 
      nombre: "Leche en Polvo Premium", 
      codigo: "LPP-001",
      tipo: "Insumo",
      unidad: "kg",
      almacenamiento: "A granel",
      stockMinimo: 50,
      stockActual: 15,
      estado: "Activo",
      vencimiento: true
    },
    { 
      id: "PRD-002", 
      nombre: "Conservante Natural", 
      codigo: "CN-002",
      tipo: "Químico",
      unidad: "lt",
      almacenamiento: "Por lotes",
      stockMinimo: 20,
      stockActual: 8,
      estado: "Activo",
      vencimiento: true
    },
    { 
      id: "PRD-003", 
      nombre: "Envases 500ml", 
      codigo: "ENV-500",
      tipo: "Envase",
      unidad: "unidades",
      almacenamiento: "A granel",
      stockMinimo: 500,
      stockActual: 150,
      estado: "Activo",
      vencimiento: false
    },
    { 
      id: "PRD-004", 
      nombre: "Queso Fresco", 
      codigo: "QF-001",
      tipo: "Producto Terminado",
      unidad: "kg",
      almacenamiento: "Por lotes",
      stockMinimo: 10,
      stockActual: 45,
      estado: "Activo",
      vencimiento: true
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Productos</h1>
          <p className="text-muted-foreground">
            Gestión de productos, insumos y mercancías
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Producto
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
                  placeholder="Buscar por nombre, código o tipo..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => {
          const isLowStock = producto.stockActual < producto.stockMinimo;
          
          return (
            <Card key={producto.id} className={isLowStock ? "ring-2 ring-warning/20" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isLowStock ? "bg-warning/10" : "bg-primary/10"
                    }`}>
                      <Package className={`w-5 h-5 ${
                        isLowStock ? "text-warning" : "text-primary"
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{producto.nombre}</CardTitle>
                      <p className="text-sm text-muted-foreground">{producto.codigo}</p>
                    </div>
                  </div>
                  {isLowStock && (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Tipo</p>
                    <Badge variant="outline">{producto.tipo}</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Unidad</p>
                    <p className="font-medium">{producto.unidad}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Almacenamiento</p>
                    <p className="font-medium">{producto.almacenamiento}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Control Vencimiento</p>
                    <Badge variant={producto.vencimiento ? "default" : "secondary"}>
                      {producto.vencimiento ? "Sí" : "No"}
                    </Badge>
                  </div>
                </div>

                {/* Stock Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stock Actual</span>
                    <span className={`font-medium ${isLowStock ? "text-warning" : ""}`}>
                      {producto.stockActual} / {producto.stockMinimo} {producto.unidad}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        isLowStock ? "bg-warning" : "bg-primary"
                      }`}
                      style={{ 
                        width: `${Math.min((producto.stockActual / producto.stockMinimo) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  {isLowStock && (
                    <p className="text-xs text-warning font-medium">
                      ⚠️ Stock bajo mínimo recomendado
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Product Card */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Agregar Nuevo Producto</h3>
          <p className="text-muted-foreground text-center mb-4">
            Registra un nuevo producto, insumo o material en el catálogo
          </p>
          <Button>Crear Producto</Button>
        </CardContent>
      </Card>
    </div>
  );
}