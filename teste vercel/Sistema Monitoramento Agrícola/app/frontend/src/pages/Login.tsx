import { useEffect, useState } from "react";
import { Shield, Users, ClipboardCheck, ArrowLeft, Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Imports do Firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

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
  
  // Estados do formulário
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ESTADO CHAVE: Define se a tela está em modo LOGIN ou modo CADASTRO
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  const handleRoleSelect = (role: string) => {
    localStorage.setItem("selected_role", role);
    setSelectedRole(role);
    setAuthError(null);
    setIsSignUpMode(false); // Sempre inicia em modo login ao escolher o perfil
  };

  // Processa o envio do formulário baseado no modo atual
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (isSignUpMode) {
        // ==========================================
        // FLUXO DE CRIAÇÃO DE CONTA (CADASTRO)
        // ==========================================
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = (userCredential.user as any).accessToken;
        localStorage.setItem("token", token);

        // Injeta a função selecionada no perfil do usuário
        await updateProfile(userCredential.user, {
          displayName: selectedRole
        });

        navigate("/dashboard");
      } else {
        // ==========================================
        // FLUXO DE LOGIN TRADICIONAL
        // ==========================================
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const token = (userCredential.user as any).accessToken;
        localStorage.setItem("token", token);

        if (userCredential.user && (!userCredential.user.displayName || userCredential.user.displayName !== selectedRole)) {
          await updateProfile(userCredential.user, {
            displayName: selectedRole
          });
        }

        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error.code);
      
      // Tratamento customizado de mensagens de erro
      if (error.code === "auth/email-already-in-use") {
        setAuthError("Este e-mail já está cadastrado. Tente fazer login.");
      } else if (error.code === "auth/weak-password") {
        setAuthError("A senha precisa ter pelo menos 6 caracteres.");
      } else if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        setAuthError("E-mail ou senha inválidos.");
      } else {
        setAuthError("Ocorreu um erro operacional. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
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

      {/* FORMULÁRIO CONTROLADO (LOGIN OU CADASTRO) */}
      {selectedRole ? (
        <div className="flex flex-col items-center w-full max-w-md animate-fade-in">
          <h1 className="text-2xl font-bold mb-2 text-center">
            {isSignUpMode ? `Criar Conta - ${selectedRole}` : `Acesso como ${selectedRole}`}
          </h1>
          <p className="text-gray-400 mb-6 text-center text-sm">
            {isSignUpMode 
              ? "Defina suas credenciais para registrar um novo acesso." 
              : "Insira suas credenciais cadastradas para continuar."}
          </p>

          <form onSubmit={handleAuthSubmit} className="w-full space-y-4 bg-[#1E293B]/60 p-6 rounded-2xl border border-white/10 shadow-xl">
            
            {authError && (
              <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-400 rounded-lg text-xs font-medium text-center">
                {authError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">E-mail</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0F172A]/80 border border-white/10 rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Senha</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#0F172A]/80 border border-white/10 rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-emerald-500/50 transition-colors"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 mt-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white font-medium text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              {isSignUpMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  {isSubmitting ? "Criando Conta..." : "Cadastrar e Entrar"}
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {isSubmitting ? "Autenticando..." : "Entrar"}
                </>
              )}
            </button>

            {/* O BOTÃO ALTERNADOR DE MODELO DE LOGIN / CRIAÇÃO DE CONTA */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setAuthError(null);
                }}
                className="text-xs text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer underline underline-offset-4"
              >
                {isSignUpMode 
                  ? "Já possui uma conta? Faça login aqui" 
                  : "Não possui uma conta? Cadastre-se aqui"}
              </button>
            </div>
          </form>

          <button
            onClick={() => setSelectedRole(null)}
            className="mt-6 flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para perfis
          </button>
        </div>
      ) : (
        /* TELA DOS 3 CARDS ORIGINAIS */
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