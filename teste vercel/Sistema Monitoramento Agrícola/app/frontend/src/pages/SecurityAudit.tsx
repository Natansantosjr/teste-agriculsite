import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ShieldAlert, Terminal, Clock, ShieldCheck } from "lucide-react";

// Dados fictícios de logs de segurança para renderizar na tabela
const initialLogs = [
  { id: 1, user: "natan@cambui.com.br", action: "Login efetuado com sucesso", role: "ADM", ip: "192.168.1.45", date: "22/05/2026 15:30", status: "Sucesso" },
  { id: 2, user: "fiscal_centro@gmail.com", action: "Exportação de relatório fiscal", role: "FISCAL", ip: "177.42.12.98", date: "22/05/2026 14:15", status: "Sucesso" },
  { id: 3, user: "desconhecido@anonimo.com", action: "Tentativa de login malsucedida", role: "Nenhum", ip: "45.230.12.4", date: "22/05/2026 11:02", status: "Bloqueado" },
  { id: 4, user: "gerente_oeste@cambui.com", action: "Alteração de limite de alertas", role: "GERENTE", ip: "189.55.23.11", date: "21/05/2026 18:44", status: "Sucesso" },
];

export default function SecurityAudit() {
  const [logs] = useState(initialLogs);

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC] flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-400" />
          Auditoria de Segurança
        </h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Histórico e monitoramento em tempo real de acessos, ações administrativas e logs críticos do sistema
        </p>
      </div>

      {/* Mini-Cards de Resumo - Grid Inteligente: 1 coluna no celular, 3 no PC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Status do Sistema</p>
              <p className="text-lg font-bold text-[#F8FAFC]">Protegido</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Última Varredura</p>
              <p className="text-sm font-semibold text-[#F8FAFC] font-mono">Hoje às 15:00</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Incidentes Retidos</p>
              <p className="text-lg font-bold text-[#F8FAFC] font-mono">1 Bloqueio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card da Tabela */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Logs de Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          
          {/* DIV PROTETORA CONTRA QUEBRAS NO MOBILE */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-[800px] md:min-w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0F172A] md:bg-transparent text-xs uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 md:px-6">Usuário</th>
                  <th className="px-4 py-3 md:px-6">Ação Realizada</th>
                  <th className="px-4 py-3 md:px-6">Cargo</th>
                  <th className="px-4 py-3 md:px-6">Endereço IP</th>
                  <th className="px-4 py-3 md:px-6">Data / Hora</th>
                  <th className="px-4 py-3 md:px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Coluna Usuário */}
                    <td className="px-4 py-4 md:px-6 font-sans font-medium text-[#F8FAFC]">
                      {log.user}
                    </td>

                    {/* Coluna Ação */}
                    <td className="px-4 py-4 md:px-6 font-sans text-gray-400">
                      {log.action}
                    </td>

                    {/* Coluna Cargo */}
                    <td className="px-4 py-4 md:px-6 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.role === "ADM" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                        log.role === "GERENTE" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        log.role === "FISCAL" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-slate-800 text-slate-400"
                      }`}>
                        {log.role}
                      </span>
                    </td>

                    {/* Coluna IP */}
                    <td className="px-4 py-4 md:px-6 text-slate-400">
                      {log.ip}
                    </td>

                    {/* Coluna Data */}
                    <td className="px-4 py-4 md:px-6 text-slate-400 whitespace-nowrap">
                      {log.date}
                    </td>

                    {/* Coluna Status */}
                    <td className="px-4 py-4 md:px-6 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        log.status === "Sucesso" 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-red-500/10 text-red-400"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* FIM DA DIV PROTETORA */}

        </CardContent>
      </Card>
    </div>
  );
}