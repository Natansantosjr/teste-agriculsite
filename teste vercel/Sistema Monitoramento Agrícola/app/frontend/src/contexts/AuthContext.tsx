import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { client } from "@/lib/api";
import { withRetry } from "@/lib/retry";

// Imports necessários do Firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD5G5KJneEy3nL1Yn6mjKItxnM_OaYFe2M",
  authDomain: "agriculsite.firebaseapp.com",
  projectId: "agriculsite",
  storageBucket: "agriculsite.firebasestorage.app",
  messagingSenderId: "963600091219",
  appId: "1:963600091219:web:becda787ba4117b081dea6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

interface UserProfile {
  id: string;
  user_id: string;
  role: string;
  full_name: string;
  department?: string;
  region?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  role: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: "FISCAL",
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

 // ... resto dos seus states (user, profile, isLoading) acima

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        const authUser: AuthUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email || "Usuário",
        };
        
        setUser(authUser);
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("token", token);
        
        // Aqui é a linha 81 que deu o erro. Ela vai achar a função logo abaixo!
        await loadProfile(authUser); 
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem("token");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // COLE A FUNÇÃO EXATAMENTE AQUI (Logo após o término do useEffect):
 async function loadProfile(authUser: AuthUser) {
    try {
      const response = await withRetry(() =>
        client.entities.user_profiles.query({})
      ) as any;
      
      const items = response?.data?.items || [];
      
      // Pegamos o cargo selecionado IMEDIATAMENTE
      const cachedRole = localStorage.getItem("selected_role");
      console.log("Cargo detectado no localStorage durante o loadProfile:", cachedRole);

      if (items.length > 0) {
        console.log("Usuário já existente no banco. Carregando dados:", items[0]);
        setProfile(items[0] as UserProfile);
      } else {
        // Se for nulo por falha de render do FirebaseUI, tentamos não usar "FISCAL" direto se clicamos em algo
        const roleParaSalvar = cachedRole || "ADM"; // Mudamos o padrão temporariamente para testar se é o fallback

        console.log(`Criando novo perfil no banco. Cargo enviado: ${roleParaSalvar}`);

        const createResponse = await withRetry(() =>
          client.entities.user_profiles.create({
            data: {
              role: roleParaSalvar,
              full_name: authUser.name || authUser.email || "Usuário",
            },
          })
        ) as any;
        
        if (createResponse?.data) {
          console.log("Perfil criado com sucesso:", createResponse.data);
          setProfile(createResponse.data as UserProfile);
          // NÃO vamos remover o selected_role agora. Deixe ele salvo para o painel ler!
        }
      }
    } catch (error) {
      console.error("Erro no loadProfile:", error);
      setProfile(null);
    }
  }
  // ... abaixo continua com a function login(), logout(), etc.
 

  function login() {
    window.location.href = "/login";
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    localStorage.removeItem("token");
    localStorage.removeItem("selected_role");
  }

  const role = profile?.role || "FISCAL";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}