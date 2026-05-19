import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MapPin, Wheat, AlertTriangle, DollarSign } from "lucide-react";

const productionData = [
  { month: "Jan", estimada: 4200, declarada: 3800 },
  { month: "Fev", estimada: 3900, declarada: 3600 },
  { month: "Mar", estimada: 5100, declarada: 4200 },
  { month: "Abr", estimada: 4800, declarada: 4500 },
  { month: "Mai", estimada: 5500, declarada: 4100 },
  { month: "Jun", estimada: 4600, declarada: 4400 },
];

const alertsData = [
  { id: 1, municipio: "Ribeirão Preto", cultura: "Soja", risco: "ALTO", score: 92, descricao: "Produção declarada 40% abaixo da estimativa" },
  { id: 2, municipio: "Uberaba", cultura: "Milho", risco: "ALTO", score: 87, descricao: "Inconsistência em área plantada vs colhida" },
  { id: 3, municipio: "Dourados", cultura: "Cana", risco: "MÉDIO", score: 65, descricao: "Variação atípica no NDVI do período" },
  { id: 4, municipio: "Sorriso", cultura: "Algodão", risco: "MÉDIO", score: 58, descricao: "Divergência entre produtividade regional" },
  { id: 5, municipio: "Luís Eduardo Magalhães", cultura: "Soja", risco: "BAIXO", score: 34, descricao: "Leve desvio na declaração fiscal" },
];

const kpis = [
  { label: "Área Monitorada", value: "2.4M ha", icon: MapPin, color: "text-emerald-400" },
  { label: "Culturas Identificadas", value: "12", icon: Wheat, color: "text-blue-400" },
  { label: "Inconsistências", value: "847", icon: AlertTriangle, color: "text-amber-400" },
  { label: "Recuperação Fiscal", value: "R$ 312M", icon: DollarSign, color: "text-emerald-400" },
];

function getRiskBadge(risco: string) {
  switch (risco) {
    case "ALTO":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">ALTO</Badge>;
    case "MÉDIO":
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">MÉDIO</Badge>;
    default:
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">BAIXO</Badge>;
  }
}

export default function Index() {
  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div
        className="relative rounded-xl overflow-hidden h-48 flex items-end"
        style={{
          backgroundImage: `url(https://mgx-backend-cdn.metadl.com/generate/images/1190109/2026-05-05/n5ucowaaafnq/hero-satellite-agriculture.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
        <div className="relative p-6">
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            Sistema de Monitoramento Agrícola
          </h1>
          <p className="text-gray-300 text-sm mt-1">
            Monitoramento via satélite • Detecção de anomalias • Inteligência fiscal
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="bg-[#1E293B]/80 backdrop-blur border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{kpi.label}</p>
                  <p className="text-xl font-bold text-[#F8FAFC] font-mono">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Map and Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Placeholder */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium">
              Mapa de Cobertura Agrícola
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative rounded-lg overflow-hidden h-64">
              <img
                src="https://mgx-backend-cdn.metadl.com/generate/images/1190109/2026-05-05/n5ucm2qaafmq/map-brazil-agriculture.png"
                alt="Mapa agrícola do Brasil"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B]/80 to-transparent" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                <span className="text-[10px] px-2 py-1 rounded bg-emerald-500/30 text-emerald-300">NDVI Alto</span>
                <span className="text-[10px] px-2 py-1 rounded bg-amber-500/30 text-amber-300">NDVI Médio</span>
                <span className="text-[10px] px-2 py-1 rounded bg-red-500/30 text-red-300">NDVI Baixo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Chart */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium">
              Produção: Estimada vs Declarada (ton)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#F8FAFC" }}
                  />
                  <Bar dataKey="estimada" fill="#10B981" radius={[4, 4, 0, 0]} name="Estimada" />
                  <Bar dataKey="declarada" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Declarada" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium">
            Alertas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Município</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Cultura</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Risco</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Score</th>
                  <th className="text-left py-3 px-2 text-gray-400 font-medium">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {alertsData.map((alert) => (
                  <tr key={alert.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 text-[#F8FAFC]">{alert.municipio}</td>
                    <td className="py-3 px-2 text-gray-300">{alert.cultura}</td>
                    <td className="py-3 px-2">{getRiskBadge(alert.risco)}</td>
                    <td className="py-3 px-2 text-[#F8FAFC] font-mono">{alert.score}</td>
                    <td className="py-3 px-2 text-gray-400 text-xs">{alert.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}