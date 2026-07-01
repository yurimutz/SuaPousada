import { Link } from "react-router";

export function Admin() {
  return (
    <div className="flex h-screen bg-slate-100">
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-slate-800">
          SuaPousada Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-2 bg-slate-800 rounded-md text-slate-200">Dashboard</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors">Quartos</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors">Reservas</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition-colors">Hóspedes</a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link to="/" className="block px-4 py-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-red-400 transition-colors">
            Sair
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Painel de Administração</h1>
          <p className="text-slate-500 mt-1">Bem-vindo de volta, Administrador.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700">Reservas Hoje</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">12</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700">Quartos Ocupados</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">8/20</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700">Receita do Dia</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">R$ 3.450</p>
          </div>
        </div>
      </main>
    </div>
  );
}
