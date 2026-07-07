import type { ColumnDef } from "@tanstack/react-table";
import { FuncionarioForm } from "../forms/funcionario-form";
import { BaseActionsCell } from "./base-actions-cell";
import { getBasePersonColumns, type BasePersonData } from "./base-person-columns";

export interface Funcionario extends BasePersonData {
    id: number;
    ativo: boolean;
    dtDesligamento: string;
}

export const columns: ColumnDef<Funcionario>[] = [
    ...getBasePersonColumns<Funcionario>(),
    {
        id: "actions",
        cell: ({ row, table }) => {
            const funcionario = row.original;
            return (
                <BaseActionsCell
                    id={funcionario.id}
                    table={table}
                    entityName="Funcionário"
                    deleteEndpoint={`http://localhost:8080/funcionario/${funcionario.id}/delete`}
                    renderEditForm={(onSuccess) => (
                        <FuncionarioForm funcionario={funcionario} onSuccess={onSuccess} />
                    )}
                />
            );
        }
    },
];