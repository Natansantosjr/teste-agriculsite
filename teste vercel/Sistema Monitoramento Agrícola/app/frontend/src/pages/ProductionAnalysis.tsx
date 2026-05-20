import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";

const monthlyData = [
  { month: "Jan", estimada: 4200, declarada: 3800 },
  { month: "Fev", estimada: 3900, declarada: 3600 },
  { month: "Mar", estimada: 5100, declarada: 4200 },
  { month: "Abr", estimada: 4800, declarada: 4500 },
  { month: "Mai", estimada: 5500, declarada: 4100 },
  { month: "Jun", estimada: 4600, declarada: 4400 },
  { month: "Jul", estimada: 5200, declarada: 4700 },
  { month: "Ago", estimada: 5800, declarada: 5000 },
  { month: "Set", estimada: 6100, declarada: 5200 },
  { month: "Out", estimada: 5400, declarada: 4900 },
  { month: "Nov", estimada: 4900, declarada: 4600 },
  { month: "Dez", estimada: 4300, declarada: 4100 },
];

const cropData = [
  { cultura: "Soja", estimada: 32000, declarada: 26000 },
  { cultura: "Milho", estimada: 28000, declarada: 24500 },
  { cultura: "Cana", estimada: 45000, declarada: 42000 },
  { cultura: "Algodão", estimada: 12000, declarada: 9800 },
  { cultura: "Café", estimada: 8500, declarada: 7200 },
];

const stats = [
  { label: "Gap Total Estimado", value: "R$ 1.2B", icon: TrendingDown, color: "text-red-400", bg: "bg-red-500/10" },
  { label: "Produção Estimada Total", value: "125.5K ton", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Desvio Médio", value: "18.3%", icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10" },
];

export default function ProductionAnalysis() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Análise de Produção</h1>
        <p className="text-gray-400 text-sm mt-1">
          Comparação entre produção estimada por satélite e produção declarada fiscalmente
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-[#1E293B]/80 backdrop-blur border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-[#F8FAFC] font-mono">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Line Chart - Monthly Comparison */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium">
            Produção Mensal: Estimada vs Declarada (toneladas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#F8FAFC" }}
                />
                <Legend />
                <Line type="monotone" dataKey="estimada" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} name="Estimada (satélite)" />
                <Line type="monotone" dataKey="declarada" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} name="Declarada (fiscal)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart - By Crop */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium">
            Produção por Cultura (toneladas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="cultura" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#F8FAFC" }}
                />
                <Legend />
                <Bar dataKey="estimada" fill="#10B981" radius={[4, 4, 0, 0]} name="Estimada" />
                <Bar dataKey="declarada" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Declarada" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}