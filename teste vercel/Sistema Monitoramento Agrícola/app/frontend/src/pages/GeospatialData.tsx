import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Globe, Droplets, Thermometer } from "lucide-react";

const ndviData = [
  { month: "Jan", ndvi: 0.65, evi: 0.42 },
  { month: "Fev", ndvi: 0.72, evi: 0.48 },
  { month: "Mar", ndvi: 0.78, evi: 0.53 },
  { month: "Abr", ndvi: 0.81, evi: 0.56 },
  { month: "Mai", ndvi: 0.76, evi: 0.51 },
  { month: "Jun", ndvi: 0.68, evi: 0.44 },
  { month: "Jul", ndvi: 0.55, evi: 0.35 },
  { month: "Ago", ndvi: 0.48, evi: 0.30 },
  { month: "Set", ndvi: 0.52, evi: 0.33 },
  { month: "Out", ndvi: 0.61, evi: 0.39 },
  { month: "Nov", ndvi: 0.70, evi: 0.46 },
  { month: "Dez", ndvi: 0.74, evi: 0.49 },
];

const climateData = [
  { month: "Jan", precipitacao: 220, temperatura: 28.5 },
  { month: "Fev", precipitacao: 195, temperatura: 28.2 },
  { month: "Mar", precipitacao: 160, temperatura: 27.8 },
  { month: "Abr", precipitacao: 85, temperatura: 25.4 },
  { month: "Mai", precipitacao: 45, temperatura: 22.1 },
  { month: "Jun", precipitacao: 25, temperatura: 19.8 },
  { month: "Jul", precipitacao: 18, temperatura: 19.2 },
  { month: "Ago", precipitacao: 22, temperatura: 21.5 },
  { month: "Set", precipitacao: 55, temperatura: 24.3 },
  { month: "Out", precipitacao: 110, temperatura: 26.1 },
  { month: "Nov", precipitacao: 170, temperatura: 27.4 },
  { month: "Dez", precipitacao: 210, temperatura: 28.0 },
];

const municipios = [
  "Ribeirão Preto",
  "Uberaba",
  "Dourados",
  "Sorriso",
  "Luís Eduardo Magalhães",
  "Cascavel",
  "Rio Verde",
  "Barreiras",
];

export default function GeospatialData() {
  const [selectedMunicipio, setSelectedMunicipio] = useState("Ribeirão Preto");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Dados Geoespaciais</h1>
          <p className="text-gray-400 text-sm mt-1">
            Séries temporais de índices vegetativos e dados climáticos por município
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-gray-300">Sentinel-2 / MODIS</span>
        </div>
      </div>

      {/* Municipality Selector */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardContent className="p-4">
          <p className="text-xs text-gray-400 mb-3">Selecionar Município</p>
          <div className="flex flex-wrap gap-2">
            {municipios.map((m) => (
              <Button
                key={m}
                size="sm"
                variant={selectedMunicipio === m ? "default" : "outline"}
                className={
                  selectedMunicipio === m
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "border-white/20 text-gray-300 hover:bg-white/10"
                }
                onClick={() => setSelectedMunicipio(m)}
              >
                {m}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* NDVI Time Series */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            Série Temporal NDVI/EVI — {selectedMunicipio}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ndviData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 1]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                  labelStyle={{ color: "#F8FAFC" }}
                />
                <Legend />
                <Line type="monotone" dataKey="ndvi" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} name="NDVI" />
                <Line type="monotone" dataKey="evi" stroke="#3B82F6" strokeWidth={2} dot={{ fill: "#3B82F6" }} name="EVI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Climate Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rainfall */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              Precipitação (mm)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={climateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#F8FAFC" }}
                  />
                  <Area type="monotone" dataKey="precipitacao" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Precipitação" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Temperature */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              Temperatura Média (°C)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={climateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} domain={[15, 35]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                    labelStyle={{ color: "#F8FAFC" }}
                  />
                  <Area type="monotone" dataKey="temperatura" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Temperatura" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}