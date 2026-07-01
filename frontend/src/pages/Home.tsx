import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-4">
      <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
        Bem-vindo à <span className="text-primary">SuaPousada</span>
      </h1>
      <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
        O lugar perfeito para relaxar e aproveitar momentos inesquecíveis. 
        Faça seu agendamento agora mesmo e garanta sua estadia!
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg">
          <Link to="/login">
            Fazer Login / Agendar
          </Link>
        </Button>
      </div>
    </div>
  );
}