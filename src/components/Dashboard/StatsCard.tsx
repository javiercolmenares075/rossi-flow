import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
  alert?: boolean;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  description,
  alert = false 
}: StatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden",
      alert && "ring-2 ring-warning/20 border-warning/20"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          alert ? "bg-warning/10" : "bg-primary/10"
        )}>
          <Icon className={cn(
            "h-4 w-4",
            alert ? "text-warning" : "text-primary"
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{value}</div>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
          {change && (
            <Badge 
              variant={
                changeType === "positive" ? "default" : 
                changeType === "negative" ? "destructive" : 
                "secondary"
              }
              className="ml-auto"
            >
              {change}
            </Badge>
          )}
        </div>
        {alert && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}