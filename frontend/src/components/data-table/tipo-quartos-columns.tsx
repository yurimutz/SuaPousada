import type { ColumnDef } from "@tanstack/react-table";
import { TipoQuartoForm } from "../forms/tipo-quarto-form";
import { Checkbox } from "../ui/checkbox";
import { BaseActionsCell } from "./base-actions-cell";
import { type TipoQuarto } from "./quartos-columns";

export const tipoQuartosColumns: ColumnDef<TipoQuarto>[] = [
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
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "qtdCamasSolteiro",
        header: "Camas Solteiro",
    },
    {
        accessorKey: "qtdCamasCasal",
        header: "Camas Casal",
    },
    {
        accessorKey: "qtdBanheiros",
        header: "Banheiros",
    },
    {
        accessorKey: "valor_diaria",
        header: "Diária (R$)",
        cell: ({ row }) => {
            const valor = parseFloat(row.getValue("valor_diaria"));
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(valor);
        },
    },
    {
        accessorKey: "existe_ArCondicionado",
        header: "Ar-Condicionado",
        cell: ({ row }) => {
            return row.getValue("existe_ArCondicionado") ? "Sim" : "Não";
        }
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row, table }) => {
            const tipoQuarto = row.original;
            return (
                <BaseActionsCell
                    id={tipoQuarto.id}
                    table={table}
                    entityName="Tipo de Quarto"
                    renderEditForm={(onSuccess) => (
                        <TipoQuartoForm tipoQuarto={tipoQuarto} onSuccess={onSuccess} />
                    )}
                />
            );
        }
    },
];
