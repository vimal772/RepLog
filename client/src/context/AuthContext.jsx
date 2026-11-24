
import { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function validateToken() {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        if (isMounted) {
          setToken(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me");

        if (isMounted) {
          setToken(storedToken);
          setUser(data?.user ?? null);
          setIsAuthenticated(true);
          setAuthError(null);
        }
      } catch (error) {
        if (!isMounted) return;

        if (error.status === 401 || error.status === 403) {
          logout();
        } else {
          // Network/server error: retain token and allow retry.
          setAuthError(error.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    validateToken();

    return () => {
      isMounted = false;
    };
  }, []);

  function login(newToken, userData = null) {
    localStorage.setItem("token", newToken);

    setToken(newToken);
    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(null);
  }

  function logout() {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  }

  async function retryAuth() {
    setIsLoading(true);
    setAuthError(null);

    try {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        logout();
        return;
      }

      const data = await apiRequest("/api/auth/me");

      setToken(storedToken);
      setUser(data?.user ?? null);
      setIsAuthenticated(true);
    } catch (error) {
      if (error.status === 401 || error.status === 403) {
        logout();
      } else {
        setAuthError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  const value = {
    token,
    user,
    isAuthenticated,
    isLoading,
    authError,
    login,
    logout,
    retryAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
