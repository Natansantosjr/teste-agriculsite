import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map as MapIcon, Layers, Eye, Info, Maximize2 } from "lucide-react";

const talhoes = [
  { id: "T1", name: "Talhão Norte (Soja)", area: "45.2 ha", status: "Excelente", ndvi: "0.84" },
  { id: "T2", name: "Talhão Sul (Milho)", area: "38.1 ha", status: "Atenção", ndvi: "0.62" },
  { id: "T3", name: "Talhão Leste (Cana)", area: "62.5 ha", status: "Excelente", ndvi: "0.81" },
];

export default function GeospatialData() {
  const [selectedLayer, setSelectedLayer] = useState("ndvi");

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] flex items-center gap-2">
          <MapIcon className="w-6 h-6 text-emerald-400" />
          Análise Geoespacial via Satélite
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Visualização de mapas de calor de biomassa, índices de refletância foliar e delimitação de talhões.
        </p>
      </div>

      {/* Grid Principal: No PC divide em Mapa (2/3) e Painel (1/3). No celular empilha na vertical */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Container do Mapa (Ocupa 2 colunas no PC) */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 lg:col-span-2 overflow-hidden flex flex-col">
          <CardHeader className="pb-3 p-4 bg-[#0F172A]/40 border-b border-white/5 flex flex-row items-center justify-between">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Visualizador Dinâmico (Camada atual: {selectedLayer.toUpperCase()})
            </CardTitle>
            <Maximize2 className="w-4 h-4 text-gray-500 cursor-pointer hover:text-white hidden sm:block" />
          </CardHeader>
          <CardContent className="p-0 relative flex-1">
            
            {/* SIMULAÇÃO DO MAPA GEORREFERENCIADO */}
            {/* Altura adaptada: h-[300px] no celular para caber na tela, h-[450px] no PC */}
            <div className="h-[300px] md:h-[450px] w-full bg-[#0B132B] flex items-center justify-center relative overflow-hidden">
              
              {/* Elementos visuais simulando o mapa de satélite */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              {/* Polígonos fictícios simulando os talhões na fazenda */}
              <div className="absolute w-32 h-24 bg-emerald-500/20 border-2 border-emerald-400 rounded-md rotate-12 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                Talhão 01
              </div>
              <div className="absolute w-40 h-28 bg-amber-500/20 border-2 border-amber-400 rounded-md -bottom-4 -left-4 -rotate-12 flex items-center justify-center text-[10px] font-bold text-amber-300">
                Talhão 02
              </div>
              
              {/* Painel Flutuante de Legenda (Se move para baixo e fica menor no celular) */}
              <div className="absolute bottom-3 right-3 bg-[#1E293B]/90 backdrop-blur p-2.5 rounded-lg border border-white/10 text-[10px] space-y-1.5 shadow-xl">
                <p className="font-semibold text-gray-300">Escala de Vigor (NDVI)</p>
                <div className="w-28 h-2.5 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 rounded"></div>
                <div className="flex justify-between text-gray-500 font-mono">
                  <span>0.0 (Baixo)</span>
                  <span>1.0 (Alto)</span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Painel de Controle e Seleção de Talhões (1 coluna) */}
        <div className="space-y-4">
          {/* Seletor de Camadas */}
          <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-[#F8FAFC] text-xs uppercase tracking-wider text-gray-400">Selecionar Camada</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setSelectedLayer("ndvi")}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    selectedLayer === "ndvi" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                      : "bg-[#0F172A]/50 text-gray-400 border-white/5 hover:border-white/10"
                  }`}
                >
                  Índice NDVI
                </button>
                <button 
                  onClick={() => setSelectedLayer("satelite")}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    selectedLayer === "satelite" 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                      : "bg-[#0F172A]/50 text-gray-400 border-white/5 hover:border-white/10"
                  }`}
                >
                  Cor Real
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Setores Rápidos */}
          <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-[#F8FAFC] text-xs uppercase tracking-wider text-gray-400">Resumo por Talhão</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              {talhoes.map((t) => (
                <div key={t.id} className="p-2.5 bg-[#0F172A]/40 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-medium text-[#F8FAFC]">{t.name}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Área: {t.area}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      t.status === "Excelente" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                    }`}>
                      NDVI: {t.ndvi}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}