import { ConstructionCard } from "@/components/construction-card";

export function ClientNewBooking() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Nova Reserva</h1>
        <p className="text-muted-foreground mt-1">Agende sua próxima estadia na SuaPousada.</p>
      </header>

      <ConstructionCard 
        description="O fluxo de agendamento está sendo desenvolvido."
        content="Em breve você poderá escolher as datas, ver a disponibilidade e reservar o seu quarto favorito."
      />
    </div>
  );
}
