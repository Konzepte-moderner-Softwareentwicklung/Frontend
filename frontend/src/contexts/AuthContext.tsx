import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies";

const TOKEN_COOKIE_NAME = "auth_token";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getCookie(TOKEN_COOKIE_NAME));

  // Update cookie when token changes
  useEffect(() => {
    if (token) {
      setCookie(TOKEN_COOKIE_NAME, token);
    } else {
      deleteCookie(TOKEN_COOKIE_NAME);
    }
  }, [token]);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
  };

  const logout = () => {
    // First delete the cookie
    deleteCookie(TOKEN_COOKIE_NAME);
    // Then clear the state
    setTokenState(null);
  };

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 