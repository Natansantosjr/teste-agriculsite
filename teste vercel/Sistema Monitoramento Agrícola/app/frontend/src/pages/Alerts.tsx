import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Bell, Clock, MapPin, CheckCircle2, Eye } from "lucide-react";

// Dados fictícios de alertas do sistema agrícola
const initialAlerts = [
  { id: 1, type: "Crítico", title: "Estresse Hídrico Detetado", location: "Talhão 04 - Setor Sul", time: "Há 10 min", desc: "Índice de umidade do solo abaixo do limite crítico estipulado para a cultura de Soja." },
  { id: 2, type: "Aviso", title: "Anomalia de NDVI (Queda Bruta)", location: "Talhão 02 - Pivô Central", time: "Há 2 horas", desc: "Queda repentina de -12% no índice de vegetação detetada via satélite." },
  { id: 3, type: "Informativo", title: "Previsão de Geada Atualizada", location: "Geral - Zona Oeste", time: "Há 5 horas", desc: "Modelos meteorológicos indicam queda abrupta de temperatura para a próxima madrugada." },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState(initialAlerts);

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400 animate-pulse" />
            Central de Alertas
          </h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Notificações em tempo real geradas por IA e sensoriamento remoto para prevenção de perdas
          </p>
        </div>

        {/* Botão Responsivo */}
        <button className="w-full sm:w-auto px-4 py-2 bg-slate-850 hover:bg-slate-800 text-gray-300 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          Marcar todos como lidos
        </button>
      </div>

      {/* Lista de Alertas Vertical - Se adapta a qualquer largura de telemóvel */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card 
            key={alert.id} 
            className={`bg-[#1E293B]/80 backdrop-blur border transition-all ${
              alert.type === "Crítico" ? "border-red-500/30 hover:border-red-500/50" :
              alert.type === "Aviso" ? "border-amber-500/30 hover:border-amber-500/50" :
              "border-white/10 hover:border-white/20"
            }`}
          >
            <CardContent className="p-4 md:p-5 flex flex-col sm:flex-row items-start gap-4">
              {/* Ícone de Destaque do Tipo de Alerta */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                alert.type === "Crítico" ? "bg-red-500/10 text-red-400" :
                alert.type === "Aviso" ? "bg-amber-500/10 text-amber-400" :
                "bg-blue-500/10 text-blue-400"
              }`}>
                <AlertTriangle className="w-6 h-6" />
              </div>

              {/* Informações do Alerta */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm md:text-base font-semibold text-[#F8FAFC] truncate">
                      {alert.title}
                    </h2>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      alert.type === "Crítico" ? "bg-red-500/20 text-red-400" :
                      alert.type === "Aviso" ? "bg-amber-500/20 text-amber-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {alert.type}
                    </span>
                  </div>
                  
                  {/* Tempo do Alerta */}
                  <span className="text-gray-500 text-xs flex items-center gap-1 shrink-0 font-mono">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </span>
                </div>

                {/* Localização */}
                <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                  <MapPin className="w-3 h-3" />
                  {alert.location}
                </p>

                {/* Descrição Detalhada */}
                <p className="text-gray-400 text-xs md:text-sm leading-relaxed pt-1">
                  {alert.desc}
                </p>

                {/* Ações Rápidas no Rodapé do Card (Empilha no celular, lado a lado no PC) */}
                <div className="flex flex-col xs:flex-row items-center gap-2 pt-3">
                  <button className="w-full xs:w-auto px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-white/5 text-gray-300 text-xs rounded font-medium flex items-center justify-center gap-1.5 transition-colors">
                    <Eye className="w-3.5 h-3.5" />
                    Ver no Mapa
                  </button>
                  <button className="w-full xs:w-auto px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 text-xs rounded font-medium flex items-center justify-center gap-1.5 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Dispensar Alerta
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}