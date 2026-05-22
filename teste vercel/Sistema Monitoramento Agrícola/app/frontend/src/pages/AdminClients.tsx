import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Building2, Mail, MapPin, User, Shield } from "lucide-react";

// Dados fictícios para renderização da tabela
const initialClients = [
  { id: 1, name: "Fazenda Cambuí", owner: "Natan Silva", email: "contato@cambui.com.br", region: "Luís Eduardo Magalhães - BA", status: "Ativo", culture: "Soja/Milho" },
  { id: 2, name: "Agropecuária Vale Verde", owner: "Carlos Henrique", email: "carlos@valeverde.agro", region: "Sorriso - MT", status: "Ativo", culture: "Algodão" },
  { id: 3, name: "Usina Santa Helena", owner: "Mariana Costa", email: "mariana@shele.com", region: "Ribeirão Preto - SP", status: "Em Análise", culture: "Cana-de-açúcar" },
];

export default function AdminClients() {
  const [clients] = useState(initialClients);

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-hidden">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#F8FAFC]">Gestão de Clientes</h1>
          <p className="text-gray-400 text-xs md:text-sm mt-1">
            Administração, monitoramento de status e controle de acessos das empresas agrícolas integradas
          </p>
        </div>
        
        {/* Botão que se adapta: largura total no celular, tamanho normal no PC */}
        <button className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg shadow-emerald-500/10">
          <Plus className="w-4 h-4" />
          Novo Cliente
        </button>
      </div>

      {/* Tabela de Clientes dentro do Card */}
      <Card className="bg-[#1E293B]/80 backdrop-blur border-white/10 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-[#F8FAFC] text-sm font-medium flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Empresas Parceiras Cadastradas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
          
          {/* AQUI ESTÁ O SEGREDO: Div de controle que blinda a tabela no telemóvel */}
          <div className="overflow-x-auto w-full">
            <table className="min-w-[700px] md:min-w-full text-left text-sm text-gray-300">
              <thead className="bg-[#0F172A] md:bg-transparent text-xs uppercase text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 md:px-6">Empresa / Produtor</th>
                  <th className="px-4 py-3 md:px-6">Contacto</th>
                  <th className="px-4 py-3 md:px-6">Região</th>
                  <th className="px-4 py-3 md:px-6">Cultura Principal</th>
                  <th className="px-4 py-3 md:px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Coluna Empresa */}
                    <td className="px-4 py-4 md:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-medium text-[#F8FAFC]">{client.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3" /> {client.owner}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Coluna Contacto */}
                    <td className="px-4 py-4 md:px-6">
                      <span className="flex items-center gap-1.5 text-gray-400 text-xs md:text-sm">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        {client.email}
                      </span>
                    </td>

                    {/* Coluna Região */}
                    <td className="px-4 py-4 md:px-6">
                      <span className="flex items-center gap-1.5 text-gray-400 text-xs md:text-sm">
                        <MapPin className="w-3.5 h-3.5 text-gray-500" />
                        {client.region}
                      </span>
                    </td>

                    {/* Coluna Cultura */}
                    <td className="px-4 py-4 md:px-6">
                      <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs border border-slate-700">
                        {client.culture}
                      </span>
                    </td>

                    {/* Coluna Status */}
                    <td className="px-4 py-4 md:px-6 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        client.status === "Ativo" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* FIM DA DIV DE CONTROLE RESPONSIVO */}

        </CardContent>
      </Card>
    </div>
  );
}