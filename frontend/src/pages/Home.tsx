import quartoImg1 from "@/assets/sasha-kaunas-67-sOi7mVIk-unsplash.jpg";
import quartoImg2 from "@/assets/point3d-commercial-imaging-ltd-oxeCZrodz78-unsplash.jpg";
import quartoImg3 from "@/assets/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg";
import { Button } from "@/components/ui/button";
import { CardImage } from "@/components/ui/card-image";
import { api as axios } from "@/lib/api";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export function Home() {
  const [tiposQuarto, setTiposQuarto] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/tipoQuarto")
      .then((resposta) => {
        setTiposQuarto(resposta.data);
      })
      .catch((error) => {
        console.error("Erro ao buscar tipos de quarto:", error);
      });
  }, []);

  const quartoImgs = [quartoImg1, quartoImg2, quartoImg3];

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
          {tiposQuarto.map((tipo, index) => (
            <CardImage
              key={tipo.id}
              imageSrc={quartoImgs[index % quartoImgs.length]}
              imageAlt={`Foto do Quarto ${tipo.nome}`}
              quarto={{
                numero: tipo.id,
                tipo: tipo.nome,
                diaria: tipo.valor_diaria,
                camasCasal: tipo.qtdCamasCasal,
                camasSolteiro: tipo.qtdCamasSolteiro,
                banheiros: tipo.qtdBanheiros,
                arCondicionado: tipo.existe_ArCondicionado
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}