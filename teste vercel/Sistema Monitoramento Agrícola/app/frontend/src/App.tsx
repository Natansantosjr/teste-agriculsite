import { useState } from "react";
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
import { Menu, X } from "lucide-react"; // Importa ícones para o botão do menu

function AppLayout({ children }: { children: JSX.Element | JSX.Element[] | string | number | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col md:flex-row overflow-x-hidden relative">
      
      {/* BOTÃO FLUTUANTE PARA ABRIR O MENU NO CELULAR */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-lg focus:outline-none"
        aria-label="Abrir menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* SIDEBAR PARA PC (Fica fixa na esquerda) */}
      <div className="hidden md:block md:w-64 md:fixed md:top-0 md:bottom-0 md:left-0 z-30">
        <Sidebar />
      </div>

      {/* SIDEBAR PARA CELULAR (Flutua vindo da esquerda quando aberta) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Fundo escurecido que fecha o menu ao clicar fora */}
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div 
            className="relative w-64 max-w-xs bg-[#1E293B] h-full animate-in slide-in-from-left duration-200 pt-16"
            onClick={() => setIsMobileMenuOpen(false)} // Fecha ao clicar em qualquer link interno
          >
            <Sidebar />
          </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="w-full md:ml-64 min-h-screen flex flex-col transition-all duration-300">
        <Header />
        
        {/* Adicionada uma margem superior no mobile (pt-14) para o conteúdo não ficar embaixo do botão hambúrguer */}
        <div className="flex-1 p-4 md:p-6 text-white overflow-x-hidden pt-16 md:pt-6">
          {children}
        </div>
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