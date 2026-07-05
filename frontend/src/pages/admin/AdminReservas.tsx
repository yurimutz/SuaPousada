import { ConstructionCard } from "@/components/construction-card";

export function AdminReservas() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Reservas</h1>
        <p className="text-muted-foreground mt-1">Visualize e gerencie as reservas da pousada.</p>
      </header>
      <ConstructionCard
        description="Esta página está sendo desenvolvida."
        content="Em breve você poderá gerenciar as reservas da Pousada por aqui."
      />
    </div>
  );
}
