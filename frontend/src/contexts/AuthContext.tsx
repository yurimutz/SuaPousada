import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

type Role = "admin" | "cliente" | null;

interface User {
  email: string;
  role: Role;
  clienteId?: number; // Adicionado para simular um cliente real do banco
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("suapousada_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("suapousada_user", JSON.stringify(newUser));
    
    // Redireciona com base no papel
    if (newUser.role === "admin") {
      navigate("/admin");
    } else if (newUser.role === "cliente") {
      navigate("/cliente");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("suapousada_user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook customizado para facilitar o uso do contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
