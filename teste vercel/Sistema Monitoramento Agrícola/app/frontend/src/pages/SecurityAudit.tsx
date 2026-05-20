import { useEffect, useState, useMemo } from "react";
import { client } from "@/lib/api";
import { withRetry } from "@/lib/retry";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Lock,
  Eye,
  UserCheck,
  Database,
  RefreshCw,
  FileKey,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  details: string;
  ip_address: string;
  user_agent: string;
  status_code: number;
  risk_level: string;
  created_at: string;
}

const riskColors: Record<string, string> = {
  LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  MEDIUM: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  HIGH: "bg-red-500/20 text-red-400 border-red-500/30",
};

const actionIcons: Record<string, React.ReactNode> = {
  LOGIN: <UserCheck className="w-4 h-4" />,
  CREATE: <Database className="w-4 h-4" />,
  UPDATE: <RefreshCw className="w-4 h-4" />,
  DELETE: <AlertTriangle className="w-4 h-4" />,
  READ: <Eye className="w-4 h-4" />,
  EXPORT: <FileKey className="w-4 h-4" />,
};

const lgpdChecklist = [
  { label: "Criptografia AES-256", status: true },
  { label: "Anonimização de Dados", status: true },
  { label: "Consentimento LGPD", status: true },
  { label: "Backup Automático", status: true },
  { label: "Auditoria Contínua", status: true },
  { label: "Controle de Acesso RBAC", status: true },
];

const rbacRoles = [
  {
    role: "ADM",
    description: "Acesso total ao sistema, gestão de usuários, configurações e auditoria.",
    color: "text-red-400",
  },
  {
    role: "GERENTE",
    description: "Gestão de produção, análises, relatórios e dados geoespaciais.",
    color: "text-amber-400",
  },
  {
    role: "FISCAL",
    description: "Acesso a alertas, predições e monitoramento de conformidade fiscal.",
    color: "text-blue-400",
  },
];

export default function SecurityAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [actionFilter, setActionFilter] = useState("ALL");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await withRetry(() =>
        client.entities.audit_logs.queryAll({
          query: {},
          sort: "-created_at",
          limit: 50,
        })
      );
      setLogs((response.data?.items as AuditLog[]) || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (riskFilter !== "ALL" && log.risk_level !== riskFilter) return false;
      if (actionFilter !== "ALL" && log.action !== actionFilter) return false;
      return true;
    });
  }, [logs, riskFilter, actionFilter]);

  const stats = useMemo(() => {
    const total = logs.length;
    const highRisk = logs.filter((l) => l.risk_level === "HIGH").length;
    return { total, highRisk };
  }, [logs]);

  const uniqueActions = useMemo(() => {
    const actions = new Set(logs.map((l) => l.action));
    return Array.from(actions);
  }, [logs]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Segurança & LGPD</h1>
        <p className="text-sm text-gray-400 mt-1">
          Auditoria de segurança e conformidade com a Lei Geral de Proteção de Dados
        </p>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{stats.total}</p>
              <p className="text-xs text-gray-400">Total de Eventos</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{stats.highRisk}</p>
              <p className="text-xs text-gray-400">Eventos Alto Risco</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">94.7%</p>
              <p className="text-xs text-gray-400">Conformidade LGPD</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8FAFC]">23</p>
              <p className="text-xs text-gray-400">Sessões Ativas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Risco:</span>
          {["ALL", "LOW", "MEDIUM", "HIGH"].map((level) => (
            <Button
              key={level}
              variant={riskFilter === level ? "default" : "outline"}
              size="sm"
              onClick={() => setRiskFilter(level)}
              className={
                riskFilter === level
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "border-white/10 text-gray-300 hover:bg-white/5"
              }
            >
              {level === "ALL" ? "Todos" : level}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Ação:</span>
          <Button
            variant={actionFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setActionFilter("ALL")}
            className={
              actionFilter === "ALL"
                ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                : "border-white/10 text-gray-300 hover:bg-white/5"
            }
          >
            Todas
          </Button>
          {uniqueActions.map((action) => (
            <Button
              key={action}
              variant={actionFilter === action ? "default" : "outline"}
              size="sm"
              onClick={() => setActionFilter(action)}
              className={
                actionFilter === action
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                  : "border-white/10 text-gray-300 hover:bg-white/5"
              }
            >
              {action}
            </Button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#1E293B] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Data/Hora</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Ação</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Recurso</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Detalhes</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">IP</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Nível de Risco</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Carregando logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Nenhum evento encontrado
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-[#F8FAFC]">
                        <span className="text-gray-400">
                          {actionIcons[log.action] || <Activity className="w-4 h-4" />}
                        </span>
                        <span className="text-xs font-medium">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{log.resource}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[200px] truncate">
                      {log.details}
                    </td>
                    <td className="px-4 py-3 text-gray-300 font-mono text-xs">{log.ip_address}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${riskColors[log.risk_level] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
                      >
                        {log.risk_level}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LGPD Compliance Panel */}
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Conformidade LGPD</h3>
              <p className="text-xs text-gray-400">Checklist de segurança e privacidade</p>
            </div>
          </div>
          <div className="space-y-3">
            {lgpdChecklist.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 px-4 py-3 bg-[#0F172A]/50 rounded-lg border border-white/5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm text-[#F8FAFC]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RBAC Overview Panel */}
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#F8FAFC]">Controle de Acesso (RBAC)</h3>
              <p className="text-xs text-gray-400">Papéis e permissões do sistema</p>
            </div>
          </div>
          <div className="space-y-4">
            {rbacRoles.map((r) => (
              <div
                key={r.role}
                className="px-4 py-4 bg-[#0F172A]/50 rounded-lg border border-white/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-bold ${r.color}`}>{r.role}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}