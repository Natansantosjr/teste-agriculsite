import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Eye } from "lucide-react";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADM: [
    "Dashboard",
    "Análise de Produção",
    "Alertas",
    "Predição IA",
    "Dados Geoespaciais",
    "Infraestrutura",
    "Gerenciamento de Usuários",
  ],
  GERENTE: [
    "Dashboard",
    "Análise de Produção",
    "Alertas",
    "Predição IA",
    "Dados Geoespaciais",
  ],
  FISCAL: ["Dashboard", "Alertas", "Predição IA"],
};

export default function UserProfile() {
  const { user, role, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <User className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              Faça login para visualizar seu perfil.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS["FISCAL"];

  function getRoleBadgeColor(r: string) {
    switch (r) {
      case "ADM":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "GERENTE":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Meu Perfil</h1>
        <p className="text-gray-400 text-sm mt-1">
          Informações da conta e permissões de acesso
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Informações do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <User className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <p className="text-[#F8FAFC] font-medium">
                  {user.name || "Usuário"}
                </p>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Função</span>
                <Badge className={`${getRoleBadgeColor(role)}`}>{role}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">ID</span>
                <span className="text-xs text-gray-300 font-mono">
                  {user.id.slice(0, 8)}...
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Permissões de Acesso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {permissions.map((perm) => (
                <div
                  key={perm}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0F172A] border border-white/5"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs text-[#F8FAFC]">{perm}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}