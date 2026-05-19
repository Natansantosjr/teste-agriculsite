import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { client } from "@/lib/api";
import { withRetry } from "@/lib/retry";

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
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await client.auth.me();
      if (response?.data) {
        const authUser: AuthUser = {
          id: response.data.id || response.data.sub || "",
          email: response.data.email || "",
          name: response.data.name || response.data.email || "",
        };
        setUser(authUser);
        await loadProfile(authUser);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadProfile(authUser: AuthUser) {
    try {
      const response = await withRetry(() =>
        client.entities.user_profiles.query({})
      );
      const items = response?.data?.items || [];
      if (items.length > 0) {
        setProfile(items[0] as UserProfile);
      } else {
        // Create profile with selected role from login page or default to FISCAL
        const selectedRole = localStorage.getItem("selected_role") || "FISCAL";
        const createResponse = await withRetry(() =>
          client.entities.user_profiles.create({
            data: {
              role: selectedRole,
              full_name: authUser.name || authUser.email || "Usuário",
            },
          })
        );
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
    client.auth.toLogin();
  }

  async function logout() {
    await client.auth.logout();
    setUser(null);
    setProfile(null);
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