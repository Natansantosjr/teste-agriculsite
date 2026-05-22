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

  useEffect(() => {
    // Escuta em tempo real o login/logout do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Usuário está logado no Firebase!
        const authUser: AuthUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || firebaseUser.email || "Usuário",
        };
        
        setUser(authUser);
        
        // Configura o token nas requisições do seu backend antigo se necessário
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("token", token);
        
        // Carrega o perfil (ADM, GERENTE, FISCAL)
        await loadProfile(authUser);
      } else {
        // Usuário deslogado
        setUser(null);
        setProfile(null);
        localStorage.removeItem("token");
      }
      setIsLoading(false);
    });

    // Remove o listener ao desmontar o componente
    return () => unsubscribe();
  }, []);

 async function loadProfile(authUser: AuthUser) {
    try {
      // Forçamos o TypeScript a entender o retorno adicionando 'as any' no final da chamada
      const response = await withRetry(() =>
        client.entities.user_profiles.query({})
      ) as any;
      
      const items = response?.data?.items || [];
      if (items.length > 0) {
        setProfile(items[0] as UserProfile);
      } else {
        const selectedRole = localStorage.getItem("selected_role") || "FISCAL";
        
        // Adicionamos 'as any' aqui também para liberar o acesso ao createResponse.data
        const createResponse = await withRetry(() =>
          client.entities.user_profiles.create({
            data: {
              role: selectedRole,
              full_name: authUser.name || authUser.email || "Usuário",
            },
          })
        ) as any;
        
        if (createResponse?.data) {
          setProfile(createResponse.data as UserProfile);
          localStorage.removeItem("selected_role");
        }
      }
    } catch {
      setProfile(null);
    }
  }

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