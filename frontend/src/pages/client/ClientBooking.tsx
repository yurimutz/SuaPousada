import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BedDouble, Calendar, Moon } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export function ClientBooking() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      api.get(`/reservas/${user.id}/findAllByClientId`)
        .then((response) => {
          setReservas(response.data);
        })
        .catch((error) => {
          console.error("Erro ao carregar reservas:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);

  const formatBookingRange = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return "";
    const startDate = parseISO(startStr);
    const endDate = parseISO(endStr);
    
    const startStrFmt = format(startDate, "d 'de' MMM'.'", { locale: ptBR });
    const endStrFmt = format(endDate, "d 'de' MMM'.'", { locale: ptBR });
    const endYear = format(endDate, "yyyy");

    if (startDate.getFullYear() === endDate.getFullYear()) {
      if (startDate.getMonth() === endDate.getMonth()) {
        // Mesmo ano e mesmo mês: 15 – 18 de mar. de 2026
        const startDay = format(startDate, "d");
        return `${startDay} – ${endStrFmt} de ${endYear}`;
      } else {
        // Mesmo ano, meses diferentes: 15 de mar. – 2 de abr. de 2026
        return `${startStrFmt} – ${endStrFmt} de ${endYear}`;
      }
    } else {
      // Anos diferentes: 28 de dez. de 2025 – 3 de jan. de 2026
      const startYear = format(startDate, "yyyy");
      return `${startStrFmt} de ${startYear} – ${endStrFmt} de ${endYear}`;
    }
  };

  const isReservaPassada = (dataFim: string) => {
    return new Date(dataFim) < new Date();
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Minhas Reservas</h1>
        <p className="text-muted-foreground mt-1">Visualize seu histórico de estadias.</p>
      </header>

      {isLoading ? (
        <div className="flex justify-center p-8 text-muted-foreground animate-pulse">
          Carregando suas reservas...
        </div>
      ) : reservas.length > 0 ? (
        <ItemGroup className="max-w-5xl">
          {reservas.map((reserva) => {
            const isPassada = isReservaPassada(reserva.dtReservaFim);
            
            return (
              <Item key={reserva.id} className="p-4" variant={isPassada ? "muted" : "outline"}>
                <ItemMedia variant="icon" className="bg-primary/10 text-primary p-3 rounded-full mr-2">
                  <Calendar className="w-6 h-6" />
                </ItemMedia>
                
                <ItemContent>
                  <ItemHeader>
                    <ItemTitle className="text-lg">
                      {reserva.quarto.tipoQuarto.nome} - Quarto {reserva.quarto.numero}
                    </ItemTitle>
                    <Badge variant={isPassada ? "secondary" : "default"}>
                      {isPassada ? "Concluída" : "Agendada"}
                    </Badge>
                  </ItemHeader>
                  
                  <ItemDescription className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-1">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {formatBookingRange(reserva.dtReservaInicio, reserva.dtReservaFim)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Moon className="w-4 h-4 text-muted-foreground" />
                      {reserva.qtd_noites} {reserva.qtd_noites === 1 ? 'noite' : 'noites'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-muted-foreground" />
                      Andar {reserva.quarto.andar}
                    </span>
                  </ItemDescription>
                </ItemContent>
              </Item>
            );
          })}
        </ItemGroup>
      ) : (
        <div className="text-center p-12 border rounded-xl bg-card text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-foreground">Nenhuma reserva encontrada</h3>
          <p>Você ainda não fez nenhuma reserva conosco.</p>
        </div>
      )}
    </div>
  );
}
