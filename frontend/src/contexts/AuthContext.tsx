import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

type Role = "admin" | "cliente" | "funcionario" | null;

interface User {
  id: number;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem("suapousada_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        return {
          id: decoded.id,
          email: decoded.sub,
          role: decoded.role?.replace('ROLE_', '').toLowerCase() as Role,
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const navigate = useNavigate();

  const login = (token: string) => {
    localStorage.setItem("suapousada_token", token);
    const decoded: any = jwtDecode(token);
    const newUser: User = {
      id: decoded.id,
      email: decoded.sub,
      role: decoded.role?.replace('ROLE_', '').toLowerCase() as Role,
    };
    setUser(newUser);
    
    if (newUser.role === "admin" || newUser.role === "funcionario") {
      navigate("/admin");
    } else {
      navigate("/cliente");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("suapousada_token");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
