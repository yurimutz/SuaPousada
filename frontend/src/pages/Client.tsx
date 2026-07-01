import { Link } from "react-router";

export function Client() {
  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 text-xl font-bold text-blue-600 border-b border-slate-100">
          SuaPousada
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-2 bg-blue-50 rounded-md text-blue-700 font-medium">Minha Conta</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-50 rounded-md text-slate-600 hover:text-slate-900 transition-colors">Minhas Reservas</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-50 rounded-md text-slate-600 hover:text-slate-900 transition-colors">Fazer Nova Reserva</a>
          <a href="#" className="block px-4 py-2 hover:bg-slate-50 rounded-md text-slate-600 hover:text-slate-900 transition-colors">Perfil</a>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Link to="/" className="block px-4 py-2 hover:bg-red-50 rounded-md text-slate-600 hover:text-red-600 transition-colors">
            Sair
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Olá, Cliente!</h1>
          <p className="text-slate-500 mt-1">Acompanhe suas estadias e gerencie suas reservas.</p>
        </header>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Próxima Reserva</h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Confirmada</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Check-in</p>
              <p className="font-semibold text-slate-900">15 de Julho, 2026 - 14:00</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Check-out</p>
              <p className="font-semibold text-slate-900">20 de Julho, 2026 - 12:00</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Quarto</p>
              <p className="font-semibold text-slate-900">Suíte Master com Vista para o Mar</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Hóspedes</p>
              <p className="font-semibold text-slate-900">2 Adultos, 1 Criança</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
