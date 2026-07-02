import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FuncionariosSection } from "@/components/FuncionariosSection";

export function AdminDashboard() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Painel de Administração</h1>
        <p className="text-muted-foreground mt-1">Bem-vindo de volta, Administrador.</p>
      </header>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
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
        </TabsContent>

        <TabsContent value="funcionarios">
          <FuncionariosSection />
        </TabsContent>
      </Tabs>
    </>
  );
}
