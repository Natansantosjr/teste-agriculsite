import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, Filter } from "lucide-react";

interface Alert {
  id: number;
  municipio: string;
  regiao: string;
  cultura: string;
  risco: "ALTO" | "MÉDIO" | "BAIXO";
  score: number;
  descricao: string;
  data: string;
}

const allAlerts: Alert[] = [
  { id: 1, municipio: "Ribeirão Preto", regiao: "Sudeste", cultura: "Soja", risco: "ALTO", score: 92, descricao: "Produção declarada 40% abaixo da estimativa satelital", data: "2026-05-04" },
  { id: 2, municipio: "Uberaba", regiao: "Sudeste", cultura: "Milho", risco: "ALTO", score: 87, descricao: "Inconsistência em área plantada vs área colhida declarada", data: "2026-05-03" },
  { id: 3, municipio: "Dourados", regiao: "Centro-Oeste", cultura: "Cana", risco: "MÉDIO", score: 65, descricao: "Variação atípica no NDVI do período de safra", data: "2026-05-03" },
  { id: 4, municipio: "Sorriso", regiao: "Centro-Oeste", cultura: "Algodão", risco: "MÉDIO", score: 58, descricao: "Divergência entre produtividade regional e declarada", data: "2026-05-02" },
  { id: 5, municipio: "Luís Eduardo Magalhães", regiao: "Nordeste", cultura: "Soja", risco: "BAIXO", score: 34, descricao: "Leve desvio na declaração fiscal trimestral", data: "2026-05-01" },
  { id: 6, municipio: "Cascavel", regiao: "Sul", cultura: "Milho", risco: "ALTO", score: 89, descricao: "Área declarada incompatível com imagem de satélite", data: "2026-05-01" },
  { id: 7, municipio: "Rio Verde", regiao: "Centro-Oeste", cultura: "Soja", risco: "MÉDIO", score: 62, descricao: "Produtividade declarada abaixo da média regional", data: "2026-04-30" },
  { id: 8, municipio: "Barreiras", regiao: "Nordeste", cultura: "Algodão", risco: "BAIXO", score: 28, descricao: "Variação sazonal dentro do esperado", data: "2026-04-29" },
];

function getRiskBadge(risco: string) {
  switch (risco) {
    case "ALTO":
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">ALTO</Badge>;
    case "MÉDIO":
      return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">MÉDIO</Badge>;
    default:
      return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">BAIXO</Badge>;
  }
}

function getScoreColor(score: number) {
  if (score >= 80) return "text-red-400";
  if (score >= 50) return "text-amber-400";
  return "text-emerald-400";
}

export default function Alerts() {
  const [filterRisco, setFilterRisco] = useState<string>("TODOS");
  const [filterRegiao, setFilterRegiao] = useState<string>("TODOS");
  const [filterCultura, setFilterCultura] = useState<string>("TODOS");

  const filtered = allAlerts.filter((a) => {
    if (filterRisco !== "TODOS" && a.risco !== filterRisco) return false;
    if (filterRegiao !== "TODOS" && a.regiao !== filterRegiao) return false;
    if (filterCultura !== "TODOS" && a.cultura !== filterCultura) return false;
    return true;
  });

  const altoCount = allAlerts.filter((a) => a.risco === "ALTO").length;
  const medioCount = allAlerts.filter((a) => a.risco === "MÉDIO").length;
  const baixoCount = allAlerts.filter((a) => a.risco === "BAIXO").length;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Alertas & Detecção de Anomalias</h1>
        <p className="text-gray-400 text-sm mt-1">
          Monitoramento de inconsistências entre dados satelitais e declarações fiscais
        </p>
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-red-500/10 border-red-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <p className="text-xs text-red-300">Risco Alto</p>
              <p className="text-2xl font-bold text-red-400 font-mono">{altoCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-400" />
            <div>
              <p className="text-xs text-amber-300">Risco Médio</p>
              <p className="text-2xl font-bold text-amber-400 font-mono">{medioCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/10 border-emerald-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-xs text-emerald-300">Risco Baixo</p>
              <p className="text-2xl font-bold text-emerald-400 font-mono">{baixoCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <div className="flex gap-2">
              {["TODOS", "ALTO", "MÉDIO", "BAIXO"].map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={filterRisco === r ? "default" : "outline"}
                  className={filterRisco === r ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border-white/20 text-gray-300 hover:bg-white/10"}
                  onClick={() => setFilterRisco(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {["TODOS", "Sudeste", "Centro-Oeste", "Nordeste", "Sul"].map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={filterRegiao === r ? "default" : "outline"}
                  className={filterRegiao === r ? "bg-blue-600 hover:bg-blue-700 text-white" : "border-white/20 text-gray-300 hover:bg-white/10"}
                  onClick={() => setFilterRegiao(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              {["TODOS", "Soja", "Milho", "Cana", "Algodão"].map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={filterCultura === c ? "default" : "outline"}
                  className={filterCultura === c ? "bg-amber-600 hover:bg-amber-700 text-white" : "border-white/20 text-gray-300 hover:bg-white/10"}
                  onClick={() => setFilterCultura(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <Card key={alert.id} className="bg-[#1E293B]/80 backdrop-blur border-white/10 hover:border-white/20 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[#F8FAFC] font-medium">{alert.municipio}</h3>
                    {getRiskBadge(alert.risco)}
                    <Badge variant="outline" className="border-white/20 text-gray-300 text-xs">
                      {alert.cultura}
                    </Badge>
                    <span className="text-xs text-gray-500">{alert.regiao}</span>
                  </div>
                  <p className="text-sm text-gray-400">{alert.descricao}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.data}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-xs text-gray-400">Score</p>
                  <p className={`text-2xl font-bold font-mono ${getScoreColor(alert.score)}`}>
                    {alert.score}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}