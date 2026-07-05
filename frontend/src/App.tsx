import { Route, Routes } from "react-router";
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

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/admin" element={<Admin />}>
        <Route index element={<AdminDashboard />} />
        <Route path="quartos" element={<AdminQuartos />} />
        <Route path="reservas" element={<AdminReservas />} />
        <Route path="hospedes" element={<AdminHospedes />} />
      </Route>
      <Route path="/cliente" element={<Client />}>
        <Route index element={<ClientDashboard />} />
        <Route path="conta" element={<ClientAccount />} />
        <Route path="minhas-reservas" element={<ClientBooking />} />
        <Route path="nova-reserva" element={<ClientNewBooking />} />
        <Route path="perfil" element={<ClientAccount />} />
      </Route>
    </Routes>
  );
}

export default App
