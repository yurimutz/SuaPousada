import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: ("admin" | "cliente" | "funcionario")[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();

  // O AuthContext tenta carregar do localStorage no primeiro render,
  // mas aqui assumimos que se não há usuário, ele não está logado.
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role as any)) {
    // Se o usuário não tem a role necessária, manda de volta pra raiz ou login
    return <Navigate to="/login" replace />;
  }

  // Se passou nas validações, renderiza a rota filha
  return <Outlet />;
}
