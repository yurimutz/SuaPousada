

import { api } from "@/lib/api";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

import { DataTable } from "@/components/data-table/data-table";
import { columns, type Reserva } from "@/components/data-table/reserva-columns";
import { DatePickerWithRange } from "@/components/range-picker";

export function AdminReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 30)),
  });

  const fetchReservas = () => {
    if (date?.from && date?.to) {
      const inicio = format(date.from, "yyyy-MM-dd");
      const fim = format(date.to, "yyyy-MM-dd");
      api
        .get(`/reservas/findAllByPeriodo?inicio=${inicio}&fim=${fim}`)
        .then((response) => setReservas(response.data))
        .catch((error) => console.error("Erro ao buscar reservas:", error));
    }
  };

  useEffect(() => {
    fetchReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gestão de Reservas</h1>
        <p className="text-muted-foreground mt-1">Visualize e gerencie as reservas da pousada.</p>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <DatePickerWithRange date={date} setDate={setDate} />
      </div>

      <DataTable 
        columns={columns} 
        data={reservas} 
        meta={{ reloadData: fetchReservas }}
      />
    </div>
  );
}
