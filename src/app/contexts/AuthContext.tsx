import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService, tokenStorage } from "../services/authService";
import type { RegisterPayload, LoginPayload } from "../services/authService";

interface User {
  id: string;
  full_name: string;
  email: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  setError: (e: string | null) => void;
  register: (payload: RegisterPayload) => Promise<void>;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // При старте — восстанови юзера из localStorage если токен есть
  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored && tokenStorage.get()) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }
  }, []);

  const register = async (payload: RegisterPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register(payload);
      tokenStorage.set(data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(payload);
      tokenStorage.set(data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      setUser(data.user);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenStorage.remove();
    localStorage.removeItem("auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        setError,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
