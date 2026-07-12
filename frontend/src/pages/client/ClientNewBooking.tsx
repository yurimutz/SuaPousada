import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { DatePickerWithRange } from "@/components/range-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useAuth } from "@/contexts/AuthContext";
import { Bath, BedDouble, BedSingle, CircleDollarSign, Wind } from "lucide-react";
import { toast } from "sonner";

interface TipoQuarto {
  id: number;
  nome: string;
  qtdCamasSolteiro: number;
  qtdCamasCasal: number;
  qtdBanheiros: number;
  valor_diaria: number;
  existe_ArCondicionado: boolean;
}

interface Quarto {
  id: number;
  numero: number;
  andar: number;
  tipoQuarto: TipoQuarto;
}

const bookingSchema = z.object({
  dateRange: z.object({
    from: z.date({ required_error: "Data de check-in obrigatória" }),
    to: z.date({ required_error: "Data de check-out obrigatória" })
  }),
  quartoId: z.string().min(1, "Selecione um quarto")
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function ClientNewBooking() {
  const { user } = useAuth();
  const [quartosDisponiveis, setQuartosDisponiveis] = useState<Quarto[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      quartoId: ""
    }
  });

  const dateRange = form.watch("dateRange");

  // Fetch quartos when date range is fully selected
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setIsSearching(true);
      const inicio = format(dateRange.from, "yyyy-MM-dd");
      const fim = format(dateRange.to, "yyyy-MM-dd");
      
      axios.get(`http://localhost:8080/reservas/findQuartosDisponiveis?inicio=${inicio}&fim=${fim}`)
        .then(response => {
          setQuartosDisponiveis(response.data);
        })
        .catch(error => {
          console.error("Erro ao buscar quartos", error);
        })
        .finally(() => {
          setIsSearching(false);
          // Reseta a seleção de quarto quando a data muda
          form.setValue("quartoId", "");
        });
    } else {
      setQuartosDisponiveis([]);
      form.setValue("quartoId", "");
    }
  }, [dateRange?.from, dateRange?.to, form]);

  // Agrupar quartos por tipo para exibição
  const quartosPorTipo = quartosDisponiveis.reduce((acc, quarto) => {
    if (!acc[quarto.tipoQuarto.id]) {
      acc[quarto.tipoQuarto.id] = {
        tipo: quarto.tipoQuarto,
        quartos: []
      };
    }
    acc[quarto.tipoQuarto.id].quartos.push(quarto);
    return acc;
  }, {} as Record<number, { tipo: TipoQuarto; quartos: Quarto[] }>);

  const tiposDisponiveis = Object.values(quartosPorTipo);

  const onSubmit = (data: BookingFormValues) => {
    if (!user?.clienteId) {
      toast.error("Erro: Você precisa estar logado como cliente para reservar.");
      return;
    }

    const payload = {
      dtReservaInicio: format(data.dateRange.from, "yyyy-MM-dd"),
      dtReservaFim: format(data.dateRange.to, "yyyy-MM-dd"),
      quartoId: Number(data.quartoId),
      clienteId: user.clienteId
    };

    console.log("🚀 Payload de Reserva:", payload);

    axios.post("http://localhost:8080/reservas/create", payload)
      .then(response => {
        toast.success("Reserva criada com sucesso!");
        setSuccessMessage("Reserva criada com sucesso! Verifique suas reservas.");
        form.reset();
      })
      .catch(error => {
        toast.error("Erro ao criar reserva. Tente novamente.");
        console.error("❌ Erro ao criar reserva", error.response?.data || error);
      });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Nova Reserva</h1>
        <p className="text-muted-foreground mt-1">Agende sua próxima estadia na SuaPousada.</p>
      </header>

      {successMessage ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="text-green-700 font-medium text-lg text-center">{successMessage}</div>
            <div className="mt-6 text-center">
              <Button onClick={() => setSuccessMessage("")} variant="outline">Fazer outra reserva</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Estadia</CardTitle>
              <CardDescription>Escolha o período da sua viagem para ver os quartos disponíveis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <FieldGroup>
                <Controller
                  name="dateRange"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Período da Reserva</FieldLabel>
                      <DatePickerWithRange 
                        date={field.value as DateRange} 
                        setDate={field.onChange} 
                        className="w-full sm:w-[350px]"
                        disabled={{ before: new Date() }}
                      />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FieldGroup>

              {isSearching && (
                <div className="text-sm text-muted-foreground animate-pulse">Buscando quartos disponíveis...</div>
              )}

              {tiposDisponiveis.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Quartos Disponíveis</h3>
                  
                  <Controller
                    name="quartoId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {tiposDisponiveis.map(({ tipo, quartos }) => {
                            // Pega o ID do primeiro quarto disponível deste tipo
                            const primeiroQuartoId = quartos[0].id.toString();
                            const isSelected = field.value === primeiroQuartoId;

                            return (
                              <div 
                                key={tipo.id}
                                onClick={() => field.onChange(primeiroQuartoId)}
                                className={`relative cursor-pointer rounded-xl border p-4 transition-all hover:border-primary/50 ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'bg-card'}`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <h4 className="font-bold text-base">{tipo.nome}</h4>
                                  <span className="font-bold text-primary flex items-center gap-1">
                                    <CircleDollarSign className="w-4 h-4" />
                                    R$ {tipo.valor_diaria.toFixed(2)}
                                  </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-4">
                                  <span className="flex items-center gap-1" title="Camas de Casal">
                                    <BedDouble className="w-4 h-4" /> {tipo.qtdCamasCasal}
                                  </span>
                                  <span className="flex items-center gap-1" title="Camas de Solteiro">
                                    <BedSingle className="w-4 h-4" /> {tipo.qtdCamasSolteiro}
                                  </span>
                                  <span className="flex items-center gap-1" title="Banheiros">
                                    <Bath className="w-4 h-4" /> {tipo.qtdBanheiros}
                                  </span>
                                  {tipo.existe_ArCondicionado && (
                                    <span className="flex items-center gap-1" title="Ar Condicionado">
                                      <Wind className="w-4 h-4" />
                                    </span>
                                  )}
                                </div>
                                <div className="mt-3 text-xs text-muted-foreground">
                                  {quartos.length} unidade(s) disponível(is)
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              )}

              {dateRange?.from && dateRange?.to && tiposDisponiveis.length === 0 && !isSearching && (
                <div className="p-4 bg-muted rounded-lg text-sm text-center">
                  Infelizmente não há quartos disponíveis neste período. Tente outras datas!
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button type="submit" disabled={!form.watch("quartoId") || isSearching} size="lg">
                Confirmar Reserva
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
}
