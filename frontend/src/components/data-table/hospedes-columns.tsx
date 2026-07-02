import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

// Baseado na classe Pessoa/Cliente
export type Hospede = {
    id: number;
    nome: string;
    cpf: string;
    telefone: string;
    dtNascimento: string;
    genero: string;
    email: string;
};

export const hospedesColumns: ColumnDef<Hospede>[] = [
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
    {
        id: "actions",
        cell: ({ row }) => {
            const hospede = row.original;

            return (
                <ButtonGroup>
                    <Button variant="outline" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" title="Editar">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                    <Button variant="outline" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(hospede.id.toString())}
                            >
                                Copiar ID do Hóspede
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Ver histórico de reservas</DropdownMenuItem>
                            <DropdownMenuItem>Editar hóspede</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
            )
        }
    },
]
