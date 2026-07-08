import type { ColumnDef } from "@tanstack/react-table";
import { QuartoForm } from "../forms/quarto-form";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { BaseActionsCell } from "./base-actions-cell";
import { DataTableColumnHeader } from "./data-table-header";

export interface TipoQuarto {
    id: number;
    nome: string;
    qtdCamasSolteiro: number;
    qtdCamasCasal: number;
    qtdBanheiros: number;
    valor_diaria: number;
    existe_ArCondicionado: boolean;
}

export interface Quarto {
    id: number;
    numero: number;
    andar: number;
    tipoQuarto: TipoQuarto;
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
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Numero" />
        )
    },
    {
        accessorKey: "andar",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Andar" />
        )
    },
    {
        accessorKey: "tipoQuarto",
        header: "Tipo de Quarto",
        cell: ({ row }) => {
            const tipo = row.getValue("tipoQuarto") as TipoQuarto;
            if (!tipo) return null;

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="link" className="p-0 h-auto font-medium text-primary">
                            {tipo.nome}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">{tipo.nome}</h4>
                                <p className="text-sm text-muted-foreground">Detalhes do tipo de quarto</p>
                            </div>
                            <div className="grid gap-2 text-sm">
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <span className="font-medium text-muted-foreground">Diária:</span>
                                    <span>R$ {tipo.valor_diaria?.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <span className="font-medium text-muted-foreground">Camas Solteiro:</span>
                                    <span>{tipo.qtdCamasSolteiro}</span>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <span className="font-medium text-muted-foreground">Camas Casal:</span>
                                    <span>{tipo.qtdCamasCasal}</span>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <span className="font-medium text-muted-foreground">Banheiros:</span>
                                    <span>{tipo.qtdBanheiros}</span>
                                </div>
                                <div className="grid grid-cols-2 items-center gap-4">
                                    <span className="font-medium text-muted-foreground">Ar Cond.:</span>
                                    <span>{tipo.existe_ArCondicionado ? "Sim" : "Não"}</span>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            );
        }
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row, table }) => {
            const quarto = row.original;
            return (
                <BaseActionsCell
                    id={quarto.id}
                    table={table}
                    entityName="Quarto"
                    renderEditForm={(onSuccess) => (
                        <QuartoForm quarto={quarto} onSuccess={onSuccess} />
                    )}
                />
            );
        }
    },
];