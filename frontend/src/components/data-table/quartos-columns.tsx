import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";


export interface Quarto {
    id: number;
    numero: number;
    andar: number;
    tipoQuartoId: number;
}

export const quartosColumns: ColumnDef<Quarto>[] = [
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
        accessorKey: "numero",
        header: "Numero",
    },
    {
        accessorKey: "andar",
        header: "Andar",
    },
    {
        accessorKey: "tipoQuartoId",
        header: "Id do TipoQuarto"
    }
];