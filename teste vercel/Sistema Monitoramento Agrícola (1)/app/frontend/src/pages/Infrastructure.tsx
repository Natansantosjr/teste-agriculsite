import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Cpu, Cloud, Satellite, BarChart3, Shield, Zap } from "lucide-react";

interface ComponentStatus {
  name: string;
  status: "online" | "degraded" | "offline";
  uptime: string;
  icon: React.ElementType;
}

const systemComponents: ComponentStatus[] = [
  { name: "Ingestão Satelital", status: "online", uptime: "99.97%", icon: Satellite },
  { name: "Pipeline ETL", status: "online", uptime: "99.84%", icon: Zap },
  { name: "Banco de Dados", status: "online", uptime: "99.99%", icon: Database },
  { name: "Motor de IA/ML", status: "degraded", uptime: "98.2%", icon: Cpu },
  { name: "API Gateway", status: "online", uptime: "99.95%", icon: Cloud },
  { name: "Dashboard Frontend", status: "online", uptime: "99.99%", icon: BarChart3 },
  { name: "Módulo de Segurança", status: "online", uptime: "99.99%", icon: Shield },
  { name: "Serviço de Alertas", status: "online", uptime: "99.91%", icon: Server },
];

const techStack = [
  { category: "Dados Satelitais", items: ["Sentinel-2", "MODIS", "Landsat-8", "CBERS-4A"] },
  { category: "Processamento", items: ["Apache Spark", "Dask", "GDAL", "Rasterio"] },
  { category: "Machine Learning", items: ["TensorFlow", "XGBoost", "Scikit-learn", "PyTorch"] },
  { category: "Infraestrutura", items: ["Kubernetes", "PostgreSQL/PostGIS", "Redis", "MinIO"] },
  { category: "Monitoramento", items: ["Grafana", "Prometheus", "ELK Stack", "Jaeger"] },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "online":
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Online</Badge>;
    case "degraded":
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">Degradado</Badge>;
    default:
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">Offline</Badge>;
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "online":
      return "bg-emerald-400";
    case "degraded":
      return "bg-amber-400";
    default:
      return "bg-red-400";
  }
}

export default function Infrastructure() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Infraestrutura do Sistema</h1>
        <p className="text-gray-400 text-sm mt-1">
          Arquitetura, status dos componentes e stack tecnológico
        </p>
      </div>

      {/* Architecture Diagram */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium">
            Arquitetura do Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-2 py-6">
            {/* Pipeline Steps */}
            <div className="flex flex-col items-center p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 w-32">
              <Satellite className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-xs text-blue-300 text-center">Satélites</span>
              <span className="text-[10px] text-gray-500">Sentinel/MODIS</span>
            </div>
            <div className="text-emerald-400 text-xl">→</div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-32">
              <Zap className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="text-xs text-emerald-300 text-center">ETL Pipeline</span>
              <span className="text-[10px] text-gray-500">Spark/Dask</span>
            </div>
            <div className="text-emerald-400 text-xl">→</div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 w-32">
              <Database className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-xs text-purple-300 text-center">Data Lake</span>
              <span className="text-[10px] text-gray-500">PostGIS/MinIO</span>
            </div>
            <div className="text-emerald-400 text-xl">→</div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 w-32">
              <Cpu className="w-8 h-8 text-amber-400 mb-2" />
              <span className="text-xs text-amber-300 text-center">Motor IA/ML</span>
              <span className="text-[10px] text-gray-500">TensorFlow</span>
            </div>
            <div className="text-emerald-400 text-xl">→</div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-red-500/10 border border-red-500/20 w-32">
              <Shield className="w-8 h-8 text-red-400 mb-2" />
              <span className="text-xs text-red-300 text-center">Análise Fiscal</span>
              <span className="text-[10px] text-gray-500">Cruzamento</span>
            </div>
            <div className="text-emerald-400 text-xl">→</div>
            <div className="flex flex-col items-center p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 w-32">
              <BarChart3 className="w-8 h-8 text-cyan-400 mb-2" />
              <span className="text-xs text-cyan-300 text-center">Dashboard</span>
              <span className="text-[10px] text-gray-500">React/Recharts</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Status */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium">
            Status dos Componentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {systemComponents.map((comp) => {
              const Icon = comp.icon;
              return (
                <div
                  key={comp.name}
                  className="p-3 rounded-lg bg-[#0F172A] border border-white/5 flex items-center gap-3"
                >
                  <div className="relative">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${getStatusDot(comp.status)} animate-pulse`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#F8FAFC] truncate">{comp.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {getStatusBadge(comp.status)}
                      <span className="text-[10px] text-gray-500 font-mono">{comp.uptime}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium">
            Stack Tecnológico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {techStack.map((tech) => (
              <div key={tech.category} className="p-3 rounded-lg bg-[#0F172A] border border-white/5">
                <p className="text-xs text-emerald-400 font-medium mb-2">{tech.category}</p>
                <div className="space-y-1">
                  {tech.items.map((item) => (
                    <p key={item} className="text-xs text-gray-300">{item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}