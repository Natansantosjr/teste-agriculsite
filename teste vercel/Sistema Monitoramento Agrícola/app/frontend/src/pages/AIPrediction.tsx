import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle, Activity } from "lucide-react";
import { client } from "@/lib/api";
import { toast } from "sonner";

interface PredictionResult {
  producaoEstimada: number;
  anomalyScore: number;
  riskLevel: "ALTO" | "MÉDIO" | "BAIXO";
  confianca: number;
  analise?: string;
}

export default function AIPrediction() {
  const [formData, setFormData] = useState({
    ndvi: "0.72",
    precipitacao: "145",
    temperatura: "26.5",
    umidadeSolo: "38",
    area: "1200",
    producaoDeclarada: "4800",
    cultura: "Soja",
    municipio: "Cambuí",
    estado: "MG",
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const response = await client.apiCall.invoke({
        url: "/api/v1/prediction/analyze",
        method: "POST",
        data: {
          ndvi: parseFloat(formData.ndvi),
          precipitacao: parseFloat(formData.precipitacao),
          temperatura: parseFloat(formData.temperatura),
          umidade_solo: parseFloat(formData.umidadeSolo),
          area: parseFloat(formData.area),
          producao_declarada: parseFloat(formData.producaoDeclarada),
          cultura: formData.cultura,
          municipio: formData.municipio,
          estado: formData.estado,
        },
      });

      const data = response?.data;
      if (data) {
        setResult({
          producaoEstimada: data.producao_estimada ?? data.producaoEstimada ?? 0,
          anomalyScore: data.anomaly_score ?? data.anomalyScore ?? 0,
          riskLevel: data.risk_level ?? data.riskLevel ?? "BAIXO",
          confianca: data.confianca ?? data.confidence ?? 90,
          analise: data.analise ?? data.analysis ?? "",
        });
        toast.success("Predição realizada com sucesso!");
      } else {
        toast.error("Resposta inválida do servidor.");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao executar predição";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  function getRiskColor(level: string) {
    switch (level) {
      case "ALTO":
        return "text-red-400";
      case "MÉDIO":
        return "text-amber-400";
      default:
        return "text-emerald-400";
    }
  }

  function getRiskBg(level: string) {
    switch (level) {
      case "ALTO":
        return "bg-red-500/20 border-red-500/30";
      case "MÉDIO":
        return "bg-amber-500/20 border-amber-500/30";
      default:
        return "bg-emerald-500/20 border-emerald-500/30";
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">
          Predição por Inteligência Artificial
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Modelo de machine learning para estimativa de produção e detecção de
          anomalias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              Parâmetros de Entrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  NDVI (0-1)
                </label>
                <Input
                  value={formData.ndvi}
                  onChange={(e) => handleChange("ndvi", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC] font-mono"
                  type="number"
                  step="0.01"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Precipitação (mm)
                </label>
                <Input
                  value={formData.precipitacao}
                  onChange={(e) => handleChange("precipitacao", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC] font-mono"
                  type="number"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Temperatura (°C)
                </label>
                <Input
                  value={formData.temperatura}
                  onChange={(e) => handleChange("temperatura", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC] font-mono"
                  type="number"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Umidade do Solo (%)
                </label>
                <Input
                  value={formData.umidadeSolo}
                  onChange={(e) => handleChange("umidadeSolo", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC] font-mono"
                  type="number"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Área (hectares)
                </label>
                <Input
                  value={formData.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC] font-mono"
                  type="number"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Produção Declarada (ton)
                </label>
                <Input
                  value={formData.producaoDeclarada}
                  onChange={(e) =>
                    handleChange("producaoDeclarada", e.target.value)
                  }
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC] font-mono"
                  type="number"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Cultura
                </label>
                <Input
                  value={formData.cultura}
                  onChange={(e) => handleChange("cultura", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
                  placeholder="Ex: Soja, Milho, Café"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">
                  Município
                </label>
                <Input
                  value={formData.municipio}
                  onChange={(e) => handleChange("municipio", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
                  placeholder="Ex: Cambuí"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-gray-400 mb-1 block">
                  Estado
                </label>
                <Input
                  value={formData.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                  className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
                  placeholder="Ex: MG, SP, GO"
                />
              </div>
            </div>
            <Button
              onClick={handlePredict}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-spin" />
                  Processando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Executar Predição
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-[#F8FAFC] text-sm font-medium">
              Resultado da Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    Execute a predição para ver os resultados
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Estimated Production */}
                <div className="p-4 rounded-lg bg-[#0F172A] border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">
                    Produção Estimada (IA)
                  </p>
                  <p className="text-3xl font-bold text-emerald-400 font-mono">
                    {result.producaoEstimada.toLocaleString()} ton
                  </p>
                </div>

                {/* Anomaly Score Gauge */}
                <div className="p-4 rounded-lg bg-[#0F172A] border border-white/10">
                  <p className="text-xs text-gray-400 mb-3">Anomaly Score</p>
                  <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.anomalyScore > 70
                          ? "bg-red-500"
                          : result.anomalyScore > 40
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${result.anomalyScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">0</span>
                    <span
                      className={`text-lg font-bold font-mono ${getRiskColor(result.riskLevel)}`}
                    >
                      {result.anomalyScore}
                    </span>
                    <span className="text-xs text-gray-500">100</span>
                  </div>
                </div>

                {/* Risk Level & Confidence */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border ${getRiskBg(result.riskLevel)}`}
                  >
                    <p className="text-xs text-gray-400 mb-1">Nível de Risco</p>
                    <div className="flex items-center gap-2">
                      {result.riskLevel === "ALTO" ? (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      ) : (
                        <CheckCircle
                          className={`w-5 h-5 ${getRiskColor(result.riskLevel)}`}
                        />
                      )}
                      <Badge
                        className={`${getRiskBg(result.riskLevel)} ${getRiskColor(result.riskLevel)}`}
                      >
                        {result.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-xs text-gray-400 mb-1">Confiança</p>
                    <p className="text-2xl font-bold text-blue-400 font-mono">
                      {result.confianca}%
                    </p>
                  </div>
                </div>

                {/* AI Analysis Text */}
                {result.analise && (
                  <div className="p-4 rounded-lg bg-[#0F172A] border border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Análise IA</p>
                    <p className="text-sm text-[#F8FAFC] leading-relaxed whitespace-pre-wrap">
                      {result.analise}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}