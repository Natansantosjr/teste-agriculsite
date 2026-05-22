import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Sparkles, Calendar, Target, AlertCircle } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

// Dados simulados da inteligência artificial para previsão de safra (Sacas por Hectare)
const predictionData = [
  { ano: "2021", real: 58, predito: 56 },
  { ano: "2022", real: 62, predito: 60 },
  { ano: "2023", real: 59, predito: 61 },
  { ano: "2024", real: 65, predito: 64 },
  { ano: "2025", real: 68, predito: 67 },
  { ano: "2026 (Prev)", real: null, predito: 72 }, // Ano atual/futuro
];

export default function AIPrediction() {
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-400" />
          Previsão Preditiva por IA
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Análise de machine learning cruzando dados históricos de colheita, telemetria de satélite e tendências climáticas
        </p>
      </div>

      {/* Grid de Métricas de Confiança da IA - 1 coluna no celular, 3 no PC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Acurácia do Modelo</p>
              <p className="text-lg font-bold text-[#F8FAFC] font-mono">94.8%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Produtividade Estimada</p>
              <p className="text-lg font-bold text-[#F8FAFC] font-mono">72 sc/ha</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Janela Ideal de Colheita</p>
              <p className="text-sm font-semibold text-[#F8FAFC]">05 a 18 de Junho</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seção do Gráfico e Insights - Empilha no mobile (1 coluna) e divide no PC */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico de Tendência (Ocupa 2 colunas no PC) */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Projeção de Rendimento Histórico vs Futuro (Sacas/Hectare)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Div protetora contra esmagamento de gráficos no mobile */}
            <div className="h-64 md:h-80 overflow-x-auto w-full">
              <div className="h-full min-w-[450px] md:min-w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={predictionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="ano" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} domain={[40, 80]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                      labelStyle={{ color: "#F8FAFC" }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="real" stroke="#10B981" strokeWidth={2} name="Rendimento Real" dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="predito" stroke="#6366F1" strokeWidth={2} strokeDasharray="5 5" name="Previsão da IA" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Insights de IA (Ocupa 1 coluna no PC) */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Insights Cognitivos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col justify-center">
            <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/10 space-y-1">
              <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Tendência de Alta
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                O modelo indica um aumento de 5.8% na produtividade do Talhão Norte devido aos índices de umidade acumulados e estabilidade climática.
              </p>
            </div>

            <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/10 space-y-1">
              <p className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Recomendação Operacional
              </p>
              <p className="text-xs text-gray-300 leading-relaxed">
                Antecipar a aplicação de nutrientes em 3 dias reduz o risco de perda foliar projetado pelos modelos de estresse térmico para o final do mês.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}