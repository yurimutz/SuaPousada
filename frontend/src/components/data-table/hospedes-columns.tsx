import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

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

export function HospedeEditForm({ hospede, onSuccess }: { hospede: Hospede; onSuccess: () => void }) {
    return (
        <form className="grid gap-4" onSubmit={(e) => {
            e.preventDefault();
            
            // 1. Capturar os valores do formulário
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());

            // 2. Enviar o objeto `data` como body (segundo parâmetro do axios.patch)
            axios.patch(`http://localhost:8080/cliente/${hospede.id}/update`, data)
                .then((response) => {
                    console.log("Update feito com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao atualizar", error);
                });
        }}>
            <Field>
                <FieldLabel htmlFor={`nome-${hospede.id}`}>Nome</FieldLabel>
                <Input id={`nome-${hospede.id}`} name="nome" defaultValue={hospede.nome} />
            </Field>
            <Field>
                <FieldLabel htmlFor={`cpf-${hospede.id}`}>CPF</FieldLabel>
                <Input id={`cpf-${hospede.id}`} name="cpf" defaultValue={hospede.cpf} />
            </Field>
            <Field>
                <FieldLabel htmlFor={`telefone-${hospede.id}`}>Telefone</FieldLabel>
                <Input id={`telefone-${hospede.id}`} name="telefone" defaultValue={hospede.telefone} />
            </Field>
            <Field>
                <FieldLabel htmlFor={`nasc-${hospede.id}`}>Data de Nascimento</FieldLabel>
                <Input id={`nasc-${hospede.id}`} name="dtNascimento" type="date" defaultValue={hospede.dtNascimento} />
            </Field>
            <Field>
                <FieldLabel htmlFor={`genero-${hospede.id}`}>Gênero</FieldLabel>
                <Input id={`genero-${hospede.id}`} name="genero" defaultValue={hospede.genero} />
            </Field>
            <Field>
                <FieldLabel htmlFor={`email-${hospede.id}`}>E-mail</FieldLabel>
                <Input id={`email-${hospede.id}`} name="email" type="email" defaultValue={hospede.email} />
            </Field>
            <DialogFooter className="mt-4">
                <Button type="submit">Salvar alterações</Button>
            </DialogFooter>
        </form>
    );
}


export function HospedeActionsCell({ hospede, table }: { hospede: Hospede; table: any }) {
    const [open, setOpen] = useState(false);
    
    // Pega a função de recarregar do meta passado para a tabela
    const reloadData = table.options.meta?.reloadData;

    return (
        <ButtonGroup>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" title="Editar">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Hóspede</DialogTitle>
                    </DialogHeader>
                    <HospedeEditForm hospede={hospede} onSuccess={() => {
                        setOpen(false); // Fecha o modal
                        if (reloadData) reloadData(); // Recarrega a tabela
                    }} />
                </DialogContent>
            </Dialog>
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
    );
}

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
        cell: ({ row, table }) => {
            const hospede = row.original;
            return <HospedeActionsCell hospede={hospede} table={table} />;
        }
    },
]
