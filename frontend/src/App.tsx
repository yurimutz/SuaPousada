import { Route, Routes } from "react-router";
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Admin } from "./pages/Admin";
import { Client } from "./pages/Client";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/admin" element={<Admin />} />
      <Route path="/cliente" element={<Client />} />
    </Routes>
  );
}

export default App
