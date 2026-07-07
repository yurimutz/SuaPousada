import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BaseActionsCell } from "./base-actions-cell";
import { Checkbox } from "@/components/ui/checkbox";

export interface Reserva {
    id: number;
    dtCheckIn: string | null;
    dtCheckOut: string | null;
    dtReservaInicio: string;
    dtReservaFim: string;
    qtd_noites: number;
    quarto: {
        id: number;
        numero: string;
        tipoQuarto: {
            titulo: string;
        };
    };
    pagamento: {
        id: number;
        status: string;
        valorTotal: number;
    };
    cliente: {
        id: number;
        nome: string;
        cpf: string;
    };
}

export const columns: ColumnDef<Reserva>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Selecionar todos"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Selecionar linha"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "cliente.nome",
        header: "Hóspede",
    },
    {
        accessorKey: "quarto.numero",
        header: "Quarto",
    },
    {
        accessorKey: "dtReservaInicio",
        header: "Entrada",
        cell: ({ row }) => {
            const date = new Date(row.getValue("dtReservaInicio") + "T00:00:00");
            return format(date, "dd/MM/yyyy", { locale: ptBR });
        }
    },
    {
        accessorKey: "dtReservaFim",
        header: "Saída",
        cell: ({ row }) => {
            const date = new Date(row.getValue("dtReservaFim") + "T00:00:00");
            return format(date, "dd/MM/yyyy", { locale: ptBR });
        }
    },
    {
        accessorKey: "pagamento.status",
        header: "Status Pgto",
        cell: ({ row }) => {
            const status: string = row.getValue("pagamento_status") || row.original.pagamento?.status || "N/A";
            return (
                <div className="capitalize">{status.toLowerCase()}</div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row, table }) => {
            const reserva = row.original;
            return (
                <BaseActionsCell
                    id={reserva.id}
                    table={table}
                    entityName="Reserva"
                    renderEditForm={(onSuccess) => (
                        <div className="p-4 text-center text-muted-foreground">Formulário de edição de reserva em construção...</div>
                    )}
                />
            );
        }
    },
];
