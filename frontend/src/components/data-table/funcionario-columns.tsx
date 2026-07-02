import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Checkbox } from "../ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";


export type Funcionario = {
    id: number;
    nome: string;
    cpf: string;
    telefone: string;
    dtNascimento: string;
    genero: string;
    email: string;
};

export const columns: ColumnDef<Funcionario>[] = [

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
    },
    {
        accessorKey: "email",
        header: "E-mail",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const funcionario = row.original;

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
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(funcionario.id.toString())}
                            >
                                Copiar ID do funcionário
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Ver detalhes do funcionário</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ButtonGroup>
            )
        }
    },
]