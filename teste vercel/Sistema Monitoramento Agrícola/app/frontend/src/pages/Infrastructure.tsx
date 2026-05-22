import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Cpu, Database, Signal, Activity, Server, Zap, HardDrive } from "lucide-react";

// Dados fictícios da infraestrutura tecnológica da fazenda
const devices = [
  { id: "G-01", name: "Gateway Central", type: "Roteador LoraWAN", status: "Online", signal: 92, uptime: "14d 5h" },
  { id: "S-102", name: "Sensor de Solo NPK", type: "Sonda IoT", status: "Online", signal: 78, uptime: "42d 1h" },
  { id: "S-105", name: "Estação Meteorológica", type: "Davis Vantage", status: "Manutenção", signal: 45, uptime: "0d 0h" },
  { id: "C-08", name: "Câmera Monitoramento", type: "IP Cam 4K", status: "Online", signal: 85, uptime: "3d 12h" },
];

export default function Infrastructure() {
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-400" />
          Infraestrutura & Dispositivos IoT
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Monitoramento de telemetria, integridade de hardware e latência de rede em tempo real.
        </p>
      </div>

      {/* Grid de Status Geral - 1 coluna no celular, 4 no PC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Servidores</p>
              <p className="text-sm font-bold text-[#F8FAFC]">100% Estável</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Nós Ativos</p>
              <p className="text-sm font-bold text-[#F8FAFC]">128 Online</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Cobertura</p>
              <p className="text-sm font-bold text-[#F8FAFC]">94% da Área</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Armazenamento</p>
              <p className="text-sm font-bold text-[#F8FAFC]">1.2 TB livre</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Dispositivos - Tabela Responsiva */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 overflow-hidden">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            Inventário de Dispositivos de Campo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          
          {/* DIV DE CONTROLE DE ROLAGEM PARA TEBELA TÉCNICA */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-[650px] md:min-w-full text-left text-xs text-gray-300">
              <thead className="bg-[#0F172A] text-gray-400">
                <tr>
                  <th className="px-4 py-3 md:px-6">ID / Nome</th>
                  <th className="px-4 py-3 md:px-6">Tipo</th>
                  <th className="px-4 py-3 md:px-6">Sinal</th>
                  <th className="px-4 py-3 md:px-6">Uptime</th>
                  <th className="px-4 py-3 md:px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {devices.map((device) => (
                  <tr key={device.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-4 md:px-6">
                      <p className="font-bold text-[#F8FAFC] font-sans">{device.name}</p>
                      <span className="text-[10px] text-gray-600">{device.id}</span>
                    </td>
                    <td className="px-4 py-4 md:px-6 text-gray-400 font-sans">{device.type}</td>
                    <td className="px-4 py-4 md:px-6">
                      <div className="flex items-center gap-2">
                        <Signal className={`w-3 h-3 ${device.signal > 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <span>{device.signal}%</span>
                        <div className="w-12 h-1 bg-slate-800 rounded-full hidden xs:block">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${device.signal}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 md:px-6 text-gray-500">{device.uptime}</td>
                    <td className="px-4 py-4 md:px-6 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        device.status === "Online" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"
                      }`}>
                        <Activity className="w-3 h-3" />
                        {device.status}
                      </span>
                    </td>
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