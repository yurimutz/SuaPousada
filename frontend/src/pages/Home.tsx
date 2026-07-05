import quartoImg from "@/assets/sasha-kaunas-67-sOi7mVIk-unsplash.jpg";
import { Button } from "@/components/ui/button";
import { CardImage } from "@/components/ui/card-image";
import { Link } from "react-router";

export function Home() {
  const fakeQuartos = [
    {
      numero: 101,
      tipo: "Suíte Presidencial",
      diaria: 350.50,
      camasCasal: 1,
      camasSolteiro: 0,
      banheiros: 1,
      arCondicionado: true
    },
    {
      numero: 102,
      tipo: "Quarto Duplo",
      diaria: 180.00,
      camasCasal: 0,
      camasSolteiro: 2,
      banheiros: 1,
      arCondicionado: true
    },
    {
      numero: 103,
      tipo: "Quarto Família",
      diaria: 450.00,
      camasCasal: 2,
      camasSolteiro: 2,
      banheiros: 2,
      arCondicionado: true
    }
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-start px-4 py-13">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
          Bem-vindo à <span className="text-primary">SuaPousada</span>
        </h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          O lugar perfeito para relaxar e aproveitar momentos inesquecíveis. 
          Faça seu agendamento agora mesmo e garanta sua estadia!
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/login">
              Fazer Login / Agendar
            </Link>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-6xl">
        <h2 className="text-3xl font-bold mb-8 text-left">Nossas Acomodações</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fakeQuartos.map((quarto) => (
            <CardImage
              key={quarto.numero}
              imageSrc={quartoImg}
              imageAlt={`Foto do Quarto ${quarto.numero}`}
              quarto={quarto}
            />
          ))}
        </div>
      </div>
    </div>
  );
}