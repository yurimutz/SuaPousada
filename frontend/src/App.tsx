import { Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/protected-route";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./Layout";
import { Admin } from "./pages/admin/Admin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminHospedes } from "./pages/admin/AdminHospedes";
import { AdminQuartos } from "./pages/admin/AdminQuartos";
import { AdminReservas } from "./pages/admin/AdminReservas";
import { Client } from "./pages/client/Client";
import { ClientAccount } from "./pages/client/ClientAccount";
import { ClientBooking } from "./pages/client/ClientBooking";
import { ClientDashboard } from "./pages/client/ClientDashboard";
import { ClientNewBooking } from "./pages/client/ClientNewBooking";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";

import { Register } from "./pages/Register";
import { Sobre } from "./pages/Sobre";

import { Toaster } from "@/components/ui/sonner";

export function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        
        {/* Rotas Protegidas - Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin", "funcionario"]} />}>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<AdminDashboard />} />
            <Route path="quartos" element={<AdminQuartos />} />
            <Route path="reservas" element={<AdminReservas />} />
            <Route path="hospedes" element={<AdminHospedes />} />
          </Route>
        </Route>

        {/* Rotas Protegidas - Cliente */}
        <Route element={<ProtectedRoute allowedRoles={["cliente"]} />}>
          <Route path="/cliente" element={<Client />}>
            <Route index element={<ClientDashboard />} />
            <Route path="conta" element={<ClientAccount />} />
            <Route path="minhas-reservas" element={<ClientBooking />} />
            <Route path="nova-reserva" element={<ClientNewBooking />} />
            <Route path="perfil" element={<ClientAccount />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App
