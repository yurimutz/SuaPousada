import quartoImg2 from "@/assets/point3d-commercial-imaging-ltd-oxeCZrodz78-unsplash.jpg";
import quartoImg1 from "@/assets/sasha-kaunas-67-sOi7mVIk-unsplash.jpg";
import quartoImg3 from "@/assets/vojtech-bruzek-Yrxr3bsPdS0-unsplash.jpg";
import { DatePickerWithRange } from "@/components/range-picker";
import { Button } from "@/components/ui/button";
import { api as axios } from "@/lib/api";
import { format } from "date-fns";
import { Bath, BedDouble, BedSingle, Fan, Snowflake } from "lucide-react";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

export function Room() {
  const { id } = useParams();
  const [tipoQuarto, setTipoQuarto] = useState<any>(null);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [mainImage, setMainImage] = useState(quartoImg1);
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const quartoImgs = [quartoImg1, quartoImg2, quartoImg3];

  useEffect(() => {
    if (id) {
      axios.get(`/tipoQuarto/${id}/get`)
        .then((resposta) => {
          setTipoQuarto(resposta.data);
          // Define a imagem baseada no ID para variar entre os quartos mockados
          setMainImage(quartoImgs[Number(id) % quartoImgs.length]);
        })
        .catch((error) => {
          console.error("Erro ao buscar tipo de quarto:", error);
          toast.error("Erro ao carregar detalhes do quarto.");
        });
    }
  }, [id]);

  const checkAvailability = () => {
    if (!date?.from || !date?.to) {
      toast.warning("Selecione um período válido (data de início e fim).");
      return;
    }

    setIsChecking(true);
    setAvailabilityMessage({ type: null, message: '' });

    const inicio = format(date.from, "yyyy-MM-dd");
    const fim = format(date.to, "yyyy-MM-dd");

    axios.get(`/reservas/findQuartosDisponiveis?inicio=${inicio}&fim=${fim}`)
      .then((resposta) => {
        const quartosDisponiveis = resposta.data;
        // Verifica se existe algum quarto cujo tipoQuarto.id seja igual ao id desta página
        const hasAvailability = quartosDisponiveis.some((q: any) => String(q.tipoQuarto.id) === String(id));
        
        if (hasAvailability) {
          setAvailabilityMessage({
            type: 'success',
            message: 'Temos acomodações deste tipo disponíveis para o período selecionado!'
          });
        } else {
          setAvailabilityMessage({
            type: 'error',
            message: 'Infelizmente não há disponibilidade para este tipo de quarto no período selecionado.'
          });
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar disponibilidade:", error);
        toast.error("Erro ao consultar a disponibilidade.");
      })
      .finally(() => {
        setIsChecking(false);
      });
  };

  if (!tipoQuarto) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-8">
        <p className="text-xl text-muted-foreground">Carregando dados do quarto...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-start px-4 py-13 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
        
        {/* Lado Esquerdo - Galeria de Imagens */}
        <div className="flex flex-col gap-4">
          <div className="overflow-hidden rounded-xl border border-border shadow-sm">
            <img 
              src={mainImage} 
              alt="Imagem Principal do Quarto" 
              className="w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="flex gap-4">
            {quartoImgs.map((img, index) => (
              <button 
                key={index} 
                onClick={() => setMainImage(img)}
                className={`flex-1 h-24 overflow-hidden rounded-lg border-2 transition-all ${mainImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-primary/50'}`}
              >
                <img src={img} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Lado Direito - Detalhes e Disponibilidade */}
        <div className="flex flex-col gap-8">
          
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground mb-4">
              {tipoQuarto.nome}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Aproveite a sua estadia com conforto e tranquilidade. Essa acomodação oferece tudo que você precisa para relaxar após um longo dia.
            </p>
            
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-6 rounded-xl border border-border">
              <div>
                <p className="text-sm text-muted-foreground">Valor da Diária</p>
                <p className="text-2xl font-bold text-primary">R$ {Number(tipoQuarto.valor_diaria).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Capacidade</p>
                <p className="text-lg font-medium text-foreground">Até {tipoQuarto.qtdCamasCasal * 2 + tipoQuarto.qtdCamasSolteiro} pessoas</p>
              </div>
              <div className="col-span-2 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                <span className="flex items-center gap-2 font-medium">
                  <BedDouble className="w-5 h-5 text-muted-foreground" />
                  {tipoQuarto.qtdCamasCasal} Cama(s) de Casal
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <BedSingle className="w-5 h-5 text-muted-foreground" />
                  {tipoQuarto.qtdCamasSolteiro} Cama(s) de Solteiro
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <Bath className="w-5 h-5 text-muted-foreground" />
                  {tipoQuarto.qtdBanheiros} Banheiro(s)
                </span>
                <span className="flex items-center gap-2 font-medium">
                  {tipoQuarto.existe_ArCondicionado ? (
                    <Snowflake className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Fan className="w-5 h-5 text-muted-foreground" />
                  )}
                  {tipoQuarto.existe_ArCondicionado ? 'Ar Condicionado' : 'Ventilador'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-foreground">Verificar Disponibilidade</h3>
            <p className="text-sm text-muted-foreground">Selecione o período desejado para descobrir se este tipo de quarto está disponível.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <DatePickerWithRange 
                  date={date} 
                  setDate={setDate} 
                  className="w-full"
                />
              </div>
              <Button 
                onClick={checkAvailability} 
                disabled={isChecking || !date?.from}
                size="lg"
                className="w-full sm:w-auto"
              >
                {isChecking ? 'Verificando...' : 'Consultar'}
              </Button>
            </div>
            
            {availabilityMessage.type && (
              <div className={`mt-4 p-4 rounded-lg border flex flex-col sm:items-center justify-between gap-4 ${
                availabilityMessage.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
              }`}>
                <p className="font-medium">{availabilityMessage.message}</p>
                {availabilityMessage.type === 'success' && (
                  <Button asChild variant="outline" className="shrink-0 bg-background/50 hover:bg-background text-foreground">
                    <Link to="/login" state={{ 
                      redirect: '/cliente/nova-reserva', 
                      bookingState: { tipoQuartoId: id, from: date?.from, to: date?.to } 
                    }}>
                      Clique aqui para fazer login/cadastro
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
