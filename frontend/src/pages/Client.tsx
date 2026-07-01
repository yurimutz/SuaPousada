import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function Client() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full overflow-y-auto bg-background text-foreground">
        <div className="p-4 md:p-8">
          <div className="mb-6 flex items-center">
            <SidebarTrigger className="mr-4" />
          </div>
          
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Olá, Cliente!</h1>
            <p className="text-muted-foreground mt-1">Acompanhe suas estadias e gerencie suas reservas.</p>
          </header>

          <div className="bg-card p-8 rounded-2xl shadow-sm border border-border mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">Próxima Reserva</h2>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">Confirmada</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </main>
    </SidebarProvider>
  );
}
