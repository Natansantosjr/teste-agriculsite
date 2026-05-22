import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sprout, 
  AlertTriangle, 
  CloudSun, 
  TrendingUp, 
  BarChart3, 
  Map as MapIcon 
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

// Dados para o mini-gráfico de saúde da lavoura
const overviewData = [
  { name: "Sem 1", ndvi: 0.72 },
  { name: "Sem 2", ndvi: 0.75 },
  { name: "Sem 3", ndvi: 0.78 },
  { name: "Sem 4", ndvi: 0.82 },
  { name: "Sem 5", ndvi: 0.81 },
  { name: "Sem 6", ndvi: 0.85 },
];

const kpis = [
  { title: "Área Monitorada", value: "204.3K m²", desc: "Fazenda Cambuí", icon: Sprout, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { title: "Alertas Ativos", value: "3 Críticos", desc: "Necessitam atenção", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  { title: "Clima Atual", value: "28°C", desc: "Ensolarado / Umidade 45%", icon: CloudSun, color: "text-blue-400", bg: "bg-blue-500/10" },
  { title: "Índice NDVI Médio", value: "0.82", desc: "+4.2% esta semana", icon: TrendingUp, color: "text-indigo-400", bg: "bg-indigo-500/10" },
];

export default function Index() {
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Mensagem de Boas-Vindas */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">Painel de Monitoramento</h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Visão geral da saúde vegetativa, anomalias climáticas e análise preditiva das lavouras
        </p>
      </div>

      {/* KPIS GRID: 1 coluna no celular, 2 em tablets, 4 em telas grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="bg-[#1E293B]/80 backdrop-blur border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg ${kpi.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 truncate">{kpi.title}</p>
                  <p className="text-lg md:text-xl font-bold text-[#F8FAFC] font-mono mt-0.5">{kpi.value}</p>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">{kpi.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráficos e Seções Principais - Empilha no celular (1 coluna), lado a lado no PC (2 colunas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bloco do Gráfico NDVI (Ocupa 2 colunas no PC) */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Evolução do Índice de Vegetação (NDVI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Altura adaptativa: h-64 no celular para não sumir com o espaço, h-80 no PC */}
            <div className="h-64 md:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overviewData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorNdvi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 1]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#F8FAFC" }}
                  />
                  <Area type="monotone" dataKey="ndvi" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorNdvi)" name="NDVI Médio" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bloco Lateral de Status das Regiões (Ocupa 1 coluna no PC) */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-emerald-400" />
              Status de Talhões / Setores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between p-2.5 bg-[#0F172A]/60 rounded-lg border border-white/5">
                <span className="text-xs text-gray-300">Setor Norte (Pivô 01)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">Excelente</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#0F172A]/60 rounded-lg border border-white/5">
                <span className="text-xs text-gray-300">Setor Sul (Pivô 02)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400">Estresse Hídrico</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-[#0F172A]/60 rounded-lg border border-white/5">
                <span className="text-xs text-gray-300">Setor Leste (Cana)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400">Excelente</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}