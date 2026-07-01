import { Link } from "react-router";

export function Client() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 text-xl font-bold text-primary border-b border-border">
          SuaPousada
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium">Minha Conta</a>
          <a href="#" className="block px-4 py-2 hover:bg-accent rounded-md text-muted-foreground hover:text-accent-foreground transition-colors">Minhas Reservas</a>
          <a href="#" className="block px-4 py-2 hover:bg-accent rounded-md text-muted-foreground hover:text-accent-foreground transition-colors">Fazer Nova Reserva</a>
          <a href="#" className="block px-4 py-2 hover:bg-accent rounded-md text-muted-foreground hover:text-accent-foreground transition-colors">Perfil</a>
        </nav>
        <div className="p-4 border-t border-border">
          <Link to="/" className="block px-4 py-2 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors">
            Sair
          </Link>
        </div>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Olá, Cliente!</h1>
          <p className="text-muted-foreground mt-1">Acompanhe suas estadias e gerencie suas reservas.</p>
        </header>

        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-card-foreground">Próxima Reserva</h2>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Confirmada</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Check-in</p>
              <p className="font-semibold text-foreground">15 de Julho, 2026 - 14:00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Check-out</p>
              <p className="font-semibold text-foreground">20 de Julho, 2026 - 12:00</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quarto</p>
              <p className="font-semibold text-foreground">Suíte Master com Vista para o Mar</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hóspedes</p>
              <p className="font-semibold text-foreground">2 Adultos, 1 Criança</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
