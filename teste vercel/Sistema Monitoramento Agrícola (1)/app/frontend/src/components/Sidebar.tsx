import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Brain,
  Globe,
  Server,
  Leaf,
  User,
  Users,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const navItems: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["ADM", "GERENTE", "FISCAL"] },
  { path: "/producao", label: "Análise de Produção", icon: BarChart3, roles: ["ADM", "GERENTE"] },
  { path: "/alertas", label: "Alertas", icon: AlertTriangle, roles: ["ADM", "GERENTE", "FISCAL"] },
  { path: "/predicao", label: "Predição IA", icon: Brain, roles: ["ADM", "GERENTE", "FISCAL"] },
  { path: "/geoespacial", label: "Dados Geoespaciais", icon: Globe, roles: ["ADM", "GERENTE"] },
  { path: "/infraestrutura", label: "Infraestrutura", icon: Server, roles: ["ADM"] },
  { path: "/admin/clientes", label: "Gestão de Clientes", icon: Users, roles: ["ADM"] },
  { path: "/seguranca", label: "Segurança & LGPD", icon: Shield, roles: ["ADM"] },
];

export function Sidebar() {
  const location = useLocation();
  const { role } = useAuth();

  const filteredItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#1E293B]/80 backdrop-blur-xl border-r border-white/10 flex flex-col z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#F8FAFC]">CAMBUÍ</h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Monitoramento Agrícola
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-[#F8FAFC] hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Profile link at bottom of nav */}
        <div className="pt-4 mt-4 border-t border-white/10">
          <Link
            to="/perfil"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              location.pathname === "/perfil"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-gray-400 hover:text-[#F8FAFC] hover:bg-white/5"
            }`}
          >
            <User className="w-5 h-5" />
            <span>Meu Perfil</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-[10px] text-gray-500 text-center">
          <p>Secretaria da Fazenda</p>
          <p>Governo do Estado v2.4.1</p>
        </div>
      </div>
    </aside>
  );
}