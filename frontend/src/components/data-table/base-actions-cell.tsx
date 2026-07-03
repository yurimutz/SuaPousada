import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface BaseActionsCellProps {
    id: string | number;
    table: any;
    entityName: string;
    renderEditForm: (onSuccess: () => void) => React.ReactNode;
}

export function BaseActionsCell({ id, table, entityName, renderEditForm }: BaseActionsCellProps) {
    const [open, setOpen] = useState(false);
    
    // Função de recarregamento
    const reloadData = table.options.meta?.reloadData;

    const handleSuccess = () => {
        setOpen(false);
        if (reloadData) reloadData();
    };

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
                        <DialogTitle>Editar {entityName}</DialogTitle>
                    </DialogHeader>
                    {renderEditForm(handleSuccess)}
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
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(id.toString())}>
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </ButtonGroup>
    );
}
