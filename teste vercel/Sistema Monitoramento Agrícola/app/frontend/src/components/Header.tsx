import { useAuth } from "@/contexts/AuthContext";
import { LocationFilter } from "@/components/LocationFilter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  const { user, role, isAuthenticated, login, logout } = useAuth();

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
    <header className="h-14 bg-[#1E293B]/60 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6">
      <LocationFilter />

      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-[#F8FAFC] hover:bg-white/5 px-3 h-9"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-medium max-w-[120px] truncate">
                  {user.name || user.email}
                </span>
                <Badge className={`text-[10px] px-1.5 py-0 ${getRoleBadgeColor(role)}`}>
                  {role}
                </Badge>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1E293B] border-white/10 w-48">
              <DropdownMenuItem asChild className="text-[#F8FAFC] text-xs cursor-pointer hover:bg-white/5">
                <Link to="/perfil" className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5" />
                  Meu Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                className="text-red-400 text-xs cursor-pointer hover:bg-white/5"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={login}
            variant="ghost"
            className="flex items-center gap-2 text-emerald-400 hover:bg-emerald-500/10 h-9 text-xs"
          >
            <LogIn className="w-4 h-4" />
            Entrar
          </Button>
        )}
      </div>
    </header>
  );
}