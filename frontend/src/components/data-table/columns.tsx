import type { ColumnDef } from "@tanstack/react-table";


export type Funcionario = {
    nome: string;
    cpf: string;
    telefone: string;
    dtNascimento: string;
    genero: string;
    email: string;
};

export const columns: ColumnDef<Funcionario>[] = [
    {
        accessorKey: "nome",
        header: "Nome",
    },
    {
        accessorKey: "cpf",
        header: "CPF",
        cell: ({ row }) => {
            const cpf:string = row.getValue("cpf");
            return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
    },
    {
        accessorKey: "telefone",
        header: "Telefone",
        cell: ({ row }) => {
            const telefone:string = row.getValue("telefone");
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
]