import { ConstructionCard } from "@/components/construction-card";

export function ClientAccount() {
  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Minha Conta</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus dados pessoais.</p>
      </header>

      <ConstructionCard 
        description="Esta página está sendo desenvolvida."
        content="Em breve você poderá gerenciar seus dados e preferências de perfil por aqui."
      />
    </div>
  );
}
