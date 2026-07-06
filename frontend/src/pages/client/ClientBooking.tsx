import { ConstructionCard } from "@/components/construction-card";

export function ClientBooking() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Minhas Reservas</h1>
        <p className="text-muted-foreground mt-1">Visualize seu histórico de estadias.</p>
      </header>

      <ConstructionCard 
        description="Esta funcionalidade está sendo desenvolvida."
        content="Em breve você poderá ver o histórico completo das suas reservas."
      />
    </div>
  );
}
