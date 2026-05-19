import { useEffect, useState, useMemo } from "react";
import { client } from "@/lib/api";
import { withRetry } from "@/lib/retry";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClientData {
  id: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  plano: string;
  status: string;
  regiao: string;
  estado: string;
  email_contato: string;
  telefone: string;
  responsavel: string;
  area_monitorada_ha: number;
  data_contrato: string;
}

const emptyClient: Omit<ClientData, "id"> = {
  cnpj: "",
  razao_social: "",
  nome_fantasia: "",
  plano: "Básico",
  status: "Ativo",
  regiao: "",
  estado: "",
  email_contato: "",
  telefone: "",
  responsavel: "",
  area_monitorada_ha: 0,
  data_contrato: "",
};

const planColors: Record<string, string> = {
  Básico: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Profissional: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Enterprise: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const statusColors: Record<string, string> = {
  Ativo: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Inativo: "bg-red-500/20 text-red-400 border-red-500/30",
  Suspenso: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

export default function AdminClients() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  const [formData, setFormData] = useState<Omit<ClientData, "id">>(emptyClient);
  const [deleteTarget, setDeleteTarget] = useState<ClientData | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await withRetry(() =>
        client.entities.clients.query({
          query: {},
          sort: "-created_at",
          limit: 100,
        })
      );
      setClients((response.data?.items as ClientData[]) || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      (c) =>
        c.razao_social?.toLowerCase().includes(term) ||
        c.cnpj?.toLowerCase().includes(term) ||
        c.nome_fantasia?.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const stats = useMemo(() => {
    const total = clients.length;
    const ativos = clients.filter((c) => c.status === "Ativo").length;
    const areaTotal = clients.reduce((sum, c) => sum + (c.area_monitorada_ha || 0), 0);
    const enterprise = clients.filter((c) => c.plano === "Enterprise").length;
    return { total, ativos, areaTotal, enterprise };
  }, [clients]);

  const handleOpenCreate = () => {
    setEditingClient(null);
    setFormData(emptyClient);
    setDialogOpen(true);
  };

  const handleOpenEdit = (c: ClientData) => {
    setEditingClient(c);
    setFormData({
      cnpj: c.cnpj || "",
      razao_social: c.razao_social || "",
      nome_fantasia: c.nome_fantasia || "",
      plano: c.plano || "Básico",
      status: c.status || "Ativo",
      regiao: c.regiao || "",
      estado: c.estado || "",
      email_contato: c.email_contato || "",
      telefone: c.telefone || "",
      responsavel: c.responsavel || "",
      area_monitorada_ha: c.area_monitorada_ha || 0,
      data_contrato: c.data_contrato || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingClient) {
        await client.entities.clients.update({
          id: editingClient.id,
          data: formData,
        });
      } else {
        await client.entities.clients.create({ data: formData });
      }
      setDialogOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await client.entities.clients.delete({ id: deleteTarget.id });
      setDeleteTarget(null);
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F8FAFC]">Gestão de Clientes</h1>
          <p className="text-sm text-gray-400 mt-1">
            Gerenciamento de clientes PJ no modelo SaaS
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{stats.total}</p>
              <p className="text-xs text-gray-400">Total Clientes</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{stats.ativos}</p>
              <p className="text-xs text-gray-400">Clientes Ativos</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8FAFC]">
                {stats.areaTotal.toLocaleString("pt-BR")}
              </p>
              <p className="text-xs text-gray-400">Área Total (ha)</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1E293B] border border-white/10 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#F8FAFC]">{stats.enterprise}</p>
              <p className="text-xs text-gray-400">Planos Enterprise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou CNPJ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-[#1E293B] border-white/10 text-[#F8FAFC] placeholder:text-gray-500"
        />
      </div>

      {/* Clients Table */}
      <div className="bg-[#1E293B] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-3 text-gray-400 font-medium">CNPJ</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Razão Social</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Plano</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Região</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Área (ha)</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Responsável</th>
                <th className="text-left px-4 py-3 text-gray-400 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    Carregando...
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                filteredClients.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors"
                    onClick={() => handleOpenEdit(c)}
                  >
                    <td className="px-4 py-3 text-[#F8FAFC] font-mono text-xs">
                      {c.cnpj}
                    </td>
                    <td className="px-4 py-3 text-[#F8FAFC]">{c.razao_social}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${planColors[c.plano] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
                      >
                        {c.plano}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[c.status] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{c.regiao}</td>
                    <td className="px-4 py-3 text-gray-300">
                      {c.area_monitorada_ha?.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{c.responsavel}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEdit(c);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-emerald-400 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(c);
                          }}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1E293B] border-white/10 text-[#F8FAFC] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingClient ? "Editar Cliente" : "Novo Cliente"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label className="text-gray-300">CNPJ</Label>
              <Input
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Razão Social</Label>
              <Input
                value={formData.razao_social}
                onChange={(e) => setFormData({ ...formData, razao_social: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Nome Fantasia</Label>
              <Input
                value={formData.nome_fantasia}
                onChange={(e) => setFormData({ ...formData, nome_fantasia: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Plano</Label>
              <Select
                value={formData.plano}
                onValueChange={(v) => setFormData({ ...formData, plano: v })}
              >
                <SelectTrigger className="bg-[#0F172A] border-white/10 text-[#F8FAFC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-white/10">
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Profissional">Profissional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => setFormData({ ...formData, status: v })}
              >
                <SelectTrigger className="bg-[#0F172A] border-white/10 text-[#F8FAFC]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1E293B] border-white/10">
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Inativo">Inativo</SelectItem>
                  <SelectItem value="Suspenso">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Região</Label>
              <Input
                value={formData.regiao}
                onChange={(e) => setFormData({ ...formData, regiao: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Estado</Label>
              <Input
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email de Contato</Label>
              <Input
                value={formData.email_contato}
                onChange={(e) => setFormData({ ...formData, email_contato: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Telefone</Label>
              <Input
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Responsável</Label>
              <Input
                value={formData.responsavel}
                onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Área Monitorada (ha)</Label>
              <Input
                value={formData.area_monitorada_ha}
                onChange={(e) =>
                  setFormData({ ...formData, area_monitorada_ha: Number(e.target.value) || 0 })
                }
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
                type="number"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Data do Contrato</Label>
              <Input
                value={formData.data_contrato}
                onChange={(e) => setFormData({ ...formData, data_contrato: e.target.value })}
                className="bg-[#0F172A] border-white/10 text-[#F8FAFC]"
                type="date"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-white/10 text-gray-300 hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {editingClient ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#1E293B] border-white/10 text-[#F8FAFC]">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o cliente{" "}
              <strong className="text-[#F8FAFC]">{deleteTarget?.razao_social}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-gray-300 hover:bg-white/5">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}