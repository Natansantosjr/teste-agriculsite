import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Shield, Save, Building2, BellRing } from "lucide-react";

export default function UserProfile() {
  const [name, setName] = useState("Natan Silva");
  const [email, setEmail] = useState("natan@cambui.com.br");
  const [role, setRole] = useState("Administrador Master");
  const [company, setCompany] = useState("Fazenda Cambuí");

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">Meu Perfil</h1>
        <p className="text-gray-400 text-xs md:text-sm mt-1">
          Gerencie suas informações cadastrais, credenciais de acesso e preferências do sistema Cambuí
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel do Formulário de Dados (Ocupa 2 colunas no PC, 1 no celular) */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 lg:col-span-2">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-400" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            
            {/* GRID DO FORMULÁRIO: 1 coluna no telemóvel, 2 colunas no PC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#0F172A]/60 border border-white/10 rounded-lg text-sm text-[#F8FAFC] focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  E-mail Corporativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="email" 
                    value={email} 
                    disabled
                    className="w-full pl-9 pr-3 py-2 bg-[#0F172A]/30 border border-white/5 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  Empresa / Organização
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    value={company} 
                    disabled
                    className="w-full pl-9 pr-3 py-2 bg-[#0F172A]/30 border border-white/5 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                  Nível de Acesso
                </label>
                <div className="relative">
                  <Shield className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    value={role} 
                    disabled
                    className="w-full pl-9 pr-3 py-2 bg-[#0F172A]/30 border border-white/5 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Linha divisória interna */}
            <div className="border-t border-white/5 pt-4 flex justify-end">
              <button className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10">
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </div>

          </CardContent>
        </Card>

        {/* Card Lateral de Preferências (1 coluna no PC, empilha no celular) */}
        <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10">
          <CardHeader className="pb-3 border-b border-white/5">
            <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
              <BellRing className="w-4 h-4 text-emerald-400" />
              Preferências do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4 text-sm">
            <div className="flex items-center justify-between p-2 bg-[#0F172A]/40 rounded-lg border border-white/5">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-gray-300">Alertas Críticos no WhatsApp</p>
                <p className="text-[10px] text-gray-500">Notificar estresse hídrico grave</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 h-4 w-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-2 bg-[#0F172A]/40 rounded-lg border border-white/5">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-gray-300">Relatórios Mensais</p>
                <p className="text-[10px] text-gray-500">Enviar sumário de NDVI por e-mail</p>
              </div>
              <input type="checkbox" defaultChecked className="accent-emerald-500 h-4 w-4 cursor-pointer" />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}