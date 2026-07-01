import { Link } from "react-router";

export function Admin() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card border-r border-border text-card-foreground flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-border">
          SuaPousada Admin
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-2 bg-primary text-primary-foreground rounded-md">Dashboard</a>
          <a href="#" className="block px-4 py-2 hover:bg-accent rounded-md text-muted-foreground hover:text-accent-foreground transition-colors">Quartos</a>
          <a href="#" className="block px-4 py-2 hover:bg-accent rounded-md text-muted-foreground hover:text-accent-foreground transition-colors">Reservas</a>
          <a href="#" className="block px-4 py-2 hover:bg-accent rounded-md text-muted-foreground hover:text-accent-foreground transition-colors">Hóspedes</a>
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/" className="block px-4 py-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors">
            Sair
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo de volta, Administrador.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground">Reservas Hoje</h3>
            <p className="text-4xl font-bold text-primary mt-2">12</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground">Quartos Ocupados</h3>
            <p className="text-4xl font-bold text-primary mt-2">8/20</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
            <h3 className="text-lg font-semibold text-card-foreground">Receita do Dia</h3>
            <p className="text-4xl font-bold text-primary mt-2">R$ 3.450</p>
          </div>
        </div>
      </main>
    </div>
  );
}
