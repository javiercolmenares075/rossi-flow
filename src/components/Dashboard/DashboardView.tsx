import { StatsCard } from "./StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Warehouse, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Calendar,
  ArrowRight,
  Clock
} from "lucide-react";

export function DashboardView() {
  const recentOrders = [
    { id: "ORD-001", supplier: "Lácteos del Norte", status: "Emitida", amount: "$2,450.00", date: "2024-01-20" },
    { id: "ORD-002", supplier: "Insumos Industriales", status: "Recibida", amount: "$1,830.50", date: "2024-01-19" },
    { id: "ORD-003", supplier: "Envases Premium", status: "Pagada", amount: "$3,200.00", date: "2024-01-18" },
  ];

  const lowStockProducts = [
    { name: "Leche en Polvo", current: 15, minimum: 50, unit: "kg" },
    { name: "Conservante Natural", current: 8, minimum: 20, unit: "lt" },
    { name: "Envases 500ml", current: 150, minimum: 500, unit: "unidades" },
  ];

  const upcomingProduction = [
    { product: "Queso Fresco", quantity: "200 kg", date: "2024-01-21", status: "Programada" },
    { product: "Yogurt Natural", quantity: "500 lt", date: "2024-01-22", status: "En Proceso" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen general del sistema de inventario y producción
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Productos en Stock"
          value="1,247"
          change="+12%"
          changeType="positive"
          icon={Package}
          description="En 8 almacenes"
        />
        <StatsCard
          title="Productos Bajo Stock"
          value="23"
          change="3 críticos"
          changeType="negative"
          icon={AlertTriangle}
          description="Requieren atención"
          alert
        />
        <StatsCard
          title="Órdenes Pendientes"
          value="8"
          change="$12,450"
          changeType="neutral"
          icon={TrendingUp}
          description="Total pendiente"
        />
        <StatsCard
          title="Producción Activa"
          value="5"
          change="2 hoy"
          changeType="positive"
          icon={Warehouse}
          description="Procesos en curso"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Órdenes de Compra Recientes</CardTitle>
            <Button variant="outline" size="sm">
              Ver todas
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.supplier}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={
                        order.status === "Pagada" ? "default" : 
                        order.status === "Recibida" ? "secondary" : 
                        "outline"
                      }
                      className="mb-1"
                    >
                      {order.status}
                    </Badge>
                    <p className="text-sm font-medium">{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Bajo Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-muted-foreground">
                      {product.current}/{product.minimum} {product.unit}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full"
                      style={{ width: `${(product.current / product.minimum) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4">
              Generar Orden de Compra
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Production */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent-green" />
              Producción Programada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingProduction.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-green/10 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-accent-green" />
                    </div>
                    <div>
                      <p className="font-medium">{item.product}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={item.status === "En Proceso" ? "default" : "outline"}
                      className="mb-1"
                    >
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-12 justify-start gap-3" variant="outline">
              <Package className="w-5 h-5" />
              Nuevo Producto
            </Button>
            <Button className="h-12 justify-start gap-3" variant="outline">
              <TrendingUp className="w-5 h-5" />
              Nueva Orden
            </Button>
            <Button className="h-12 justify-start gap-3" variant="outline">
              <Warehouse className="w-5 h-5" />
              Ingreso de Mercancía
            </Button>
            <Button className="h-12 justify-start gap-3" variant="outline">
              <DollarSign className="w-5 h-5" />
              Registrar Pago
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}