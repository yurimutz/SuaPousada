import type { ColumnDef } from "@tanstack/react-table";
import { HospedeForm } from "../forms/hospede-form";
import { BaseActionsCell } from "./base-actions-cell";
import { getBasePersonColumns, type BasePersonData } from "./base-person-columns";

export interface Hospede extends BasePersonData {
    id: number;
}

export const hospedesColumns: ColumnDef<Hospede>[] = [
    ...getBasePersonColumns<Hospede>(),
    {
        id: "actions",
        cell: ({ row, table }) => {
            const hospede = row.original;
            return (
                <BaseActionsCell
                    id={hospede.id}
                    table={table}
                    entityName="Hóspede"
                    deleteEndpoint={`http://localhost:8080/cliente/${hospede.id}/delete`}
                    renderEditForm={(onSuccess) => (
                        <HospedeForm hospede={hospede} onSuccess={onSuccess} />
                    )}
                />
            );
        }
    },
];
