import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export function Admin() {
  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <main className="flex-1 w-full overflow-y-auto bg-background text-foreground">
        <div className="p-4 md:p-8">
          <div className="mb-6 flex items-center">
            <SidebarTrigger className="mr-4" />
          </div>
          
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
        </div>
      </main>
    </SidebarProvider>
  );
}
