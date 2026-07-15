import { Link } from "react-router";
import { Button } from "./button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

export interface QuartoInfo {
  numero: number;
  tipo: string;
  diaria: number;
  camasCasal: number;
  camasSolteiro: number;
  banheiros: number;
  arCondicionado: boolean;
}

export function CardImage({
  imageSrc,
  imageAlt,
  quarto,
  className
}: {
  imageSrc: string
  imageAlt: string
  quarto: QuartoInfo
  className?: string
}) {
  return (
    <Card className={`overflow-hidden flex flex-col ${className || ""}`}>
      {/* Imagem como primeiro elemento direto para ativar o pt-0 do Card */}
      <img src={imageSrc} alt={imageAlt} className="w-full h-48 object-cover" />
      
      {/* Descrição do quarto dentro do CardHeader */}
      <CardHeader className="flex-1">
        <CardTitle>{quarto.tipo}</CardTitle>
        <CardAction>
          <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">R${quarto.diaria.toFixed(2)}</span>
        </CardAction>
        <CardDescription className="mt-2 space-y-1">
          {/* <span className="block font-medium text-foreground">Diária: R$ {quarto.diaria.toFixed(2)}</span> */}
          {/* <span className="block">Quarto nº {quarto.numero}</span> */}
          <span className="block">{quarto.camasCasal} Camas de casal</span>
          <span className="block">{quarto.camasSolteiro} Camas de solteiro</span>
          <span className="block">{quarto.banheiros} Banheiro(s)</span>
          <span className="block">{quarto.arCondicionado ? "Com Ar-Condicionado" : "Sem Ar-Condicionado"}</span>
        </CardDescription>
      </CardHeader>

      {/* Botão de ver mais dentro do CardFooter */}
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/quarto/${quarto.numero}`}>Ver mais</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
