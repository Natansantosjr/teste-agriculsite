import { Shield, Users, ClipboardCheck, ArrowLeft } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { client } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface RoleCard {
  role: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const roles: RoleCard[] = [
  {
    role: "ADM",
    title: "Administrador",
    description: "Acesso completo ao sistema, gestão de usuários e configurações",
    icon: <Shield className="w-8 h-8 text-emerald-400" />,
  },
  {
    role: "GERENTE",
    title: "Gerente Regional",
    description: "Gestão de equipes, relatórios regionais e supervisão operacional",
    icon: <Users className="w-8 h-8 text-emerald-400" />,
  },
  {
    role: "FISCAL",
    title: "Fiscal de Campo",
    description: "Monitoramento de campo, coleta de dados e inspeções",
    icon: <ClipboardCheck className="w-8 h-8 text-emerald-400" />,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const handleRoleSelect = (role: string) => {
    localStorage.setItem("selected_role", role);
    client.auth.toLogin();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <img
        src="/assets/cambui-logo.png"
        alt="Cambuí Online"
        className="w-16 h-16 rounded-2xl shadow-lg shadow-emerald-500/20 mb-8"
      />

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
        Selecione seu Perfil de Acesso
      </h1>
      <p className="text-gray-400 mb-10 text-center max-w-md">
        Escolha o perfil que melhor corresponde à sua função na plataforma.
      </p>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {roles.map((card) => (
          <button
            key={card.role}
            onClick={() => handleRoleSelect(card.role)}
            className="group flex flex-col items-center text-center p-8 bg-[#1E293B]/60 border border-white/10 rounded-2xl transition-all duration-300 hover:border-emerald-500/50 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer"
          >
            <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/30 transition-colors">
              {card.icon}
            </div>
            <h2 className="text-lg font-semibold mb-1">{card.role}</h2>
            <p className="text-sm text-emerald-400 font-medium mb-3">
              {card.title}
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {card.description}
            </p>
          </button>
        ))}
      </div>

      {/* Back link */}
      <button
        onClick={() => navigate("/landing")}
        className="mt-10 flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>
    </div>
  );
}