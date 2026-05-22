import { useEffect, useState } from "react";
import { Shield, Users, ClipboardCheck, ArrowLeft } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Imports do Firebase e FirebaseUI
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";


// 1. Substitua aqui com as credenciais que o console do Firebase te deu:
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};


// Inicializa o Firebase garantindo que não vai duplicar a instância
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

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
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    // Força o salvamento imediato no navegador
    localStorage.setItem("selected_role", role);
    setSelectedRole(role);
  };

 useEffect(() => {
    const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);

    if (!selectedRole) {
      ui.reset(); 
      return;
    }

    // Salva no localStorage por garantia
    localStorage.setItem("selected_role", selectedRole);

 const uiConfig = {
      callbacks: {
        signInSuccessWithAuthResult: function (authResult: any, redirectUrl: string) {
          const token = authResult.user.accessToken;
          localStorage.setItem("token", token);
          
          if (authResult.user && (!authResult.user.displayName || authResult.user.displayName !== selectedRole)) {
            authResult.user.updateProfile({
              displayName: selectedRole
            }).then(() => {
              navigate("/dashboard");
            });
            return false;
          }

          navigate("/dashboard");
          return false; 
        },
      },
      // 1. Desativa completamente o gerenciador de credenciais do Chrome / Firebase
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      
      // 2. Força o FirebaseUI a aceitar o e-mail sem tentar vincular com Google/Facebook antigos
      signInOptions: [
        {
          provider: 'password', // Certifique-se de que está com aspas simples ou duplas padrão
          requireDisplayName: false,
          // Evita que o FirebaseUI tente buscar contas existentes no cache local:
          disableSignUp: {
            status: false
          }
        },
      ],
    };
   

    ui.reset();
    ui.start("#firebaseui-auth-container", uiConfig);
  }, [selectedRole, navigate]);

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

      {/* TELA DE FORMULÁRIO DO FIREBASE (Se o perfil foi selecionado) */}
      {selectedRole ? (
        <div className="flex flex-col items-center w-full max-w-md animate-fade-in">
          <h1 className="text-2xl font-bold mb-2 text-center">
            Acesso como {selectedRole}
          </h1>
          <p className="text-gray-400 mb-6 text-center text-sm">
            Insira suas credenciais cadastradas para continuar.
          </p>

          {/* O FirebaseUI vai renderizar o painel pronto dentro daqui */}
          <div id="firebaseui-auth-container" className="w-full text-black"></div>

          <button
            onClick={() => setSelectedRole(null)}
            className="mt-6 flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para perfis
          </button>
        </div>
      ) : (
        /* TELA DOS 3 CARDS ORIGINAIS (Se nenhum perfil foi selecionado) */
        <div className="flex flex-col items-center w-full max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
            Selecione seu Perfil de Acesso
          </h1>
          <p className="text-gray-400 mb-10 text-center max-w-md">
            Escolha o perfil que melhor corresponde à sua função na plataforma.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
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

          <button
            onClick={() => navigate("/landing")}
            className="mt-10 flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
        </div>
      )}
    </div>
  );
}