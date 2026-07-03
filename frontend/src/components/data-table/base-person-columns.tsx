import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";

export interface BasePersonData {
    nome: string;
    cpf: string;
    telefone: string;
    dtNascimento: string;
    genero: string;
    email: string;
}

export function getBasePersonColumns<T extends BasePersonData>(): ColumnDef<T>[] {
    return [
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
            accessorKey: "cpf",
            header: "CPF",
            cell: ({ row }) => {
                const cpf: string = row.getValue("cpf");
                return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }
        },
        {
            accessorKey: "telefone",
            header: "Telefone",
            cell: ({ row }) => {
                const telefone: string = row.getValue("telefone");
                return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            }
        },
        {
            accessorKey: "dtNascimento",
            header: "Data de Nascimento",
        },
        {
            accessorKey: "genero",
            header: "Gênero",
            cell: ({ row }) => {
                const genero: string = row.getValue("genero");
                const lower = genero.toLowerCase();
                return lower.replace(/^./, lower[0].toUpperCase());
            }
        },
        {
            accessorKey: "email",
            header: "E-mail",
        },
    ];
}
