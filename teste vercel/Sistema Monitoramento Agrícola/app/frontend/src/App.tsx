import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import Index from "@/pages/Index";
import ProductionAnalysis from "@/pages/ProductionAnalysis";
import Alerts from "@/pages/Alerts";
import AIPrediction from "@/pages/AIPrediction";
import GeospatialData from "@/pages/GeospatialData";
import Infrastructure from "@/pages/Infrastructure";
import UserProfile from "@/pages/UserProfile";
import AuthCallback from "./pages/AuthCallback";
import AuthError from "@/pages/AuthError";
import LogoutCallbackPage from "@/pages/LogoutCallbackPage";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import AdminClients from "@/pages/AdminClients";
import SecurityAudit from "@/pages/SecurityAudit";

function AppLayout({ children }: { children: JSX.Element | JSX.Element[] | string | number | null }) {
  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}

function ProtectedRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/dashboard" element={<Index />} />
        <Route path="/producao" element={<ProductionAnalysis />} />
        <Route path="/alertas" element={<Alerts />} />
        <Route path="/predicao" element={<AIPrediction />} />
        <Route path="/geoespacial" element={<GeospatialData />} />
        <Route path="/infraestrutura" element={<Infrastructure />} />
        <Route path="/perfil" element={<UserProfile />} />
        <Route path="/admin/clientes" element={<AdminClients />} />
        <Route path="/seguranca" element={<SecurityAudit />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Abre diretamente na Landing Page ao acessar a URL principal do sistema */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rota para seleção de perfil e autenticação do FirebaseUI */}
          <Route path="/login" element={<Login />} />
          
          {/* Rotas de Callback e utilitários de autenticação */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/error" element={<AuthError />} />
          <Route path="/logout/callback" element={<LogoutCallbackPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Captura todas as outras rotas e valida se o usuário está logado */}
          <Route path="*" element={<ProtectedRoutes />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;