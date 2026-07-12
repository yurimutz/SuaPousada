import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BaseActionsCellProps {
    id: string | number;
    table: any;
    entityName: string;
    renderEditForm: (onSuccess: () => void) => React.ReactNode;
    deleteEndpoint: string;
}

export function BaseActionsCell({ id, table, entityName, renderEditForm, deleteEndpoint }: BaseActionsCellProps) {
    const [open, setOpen] = useState(false);
    const isMobile = useIsMobile();
    
    // Função de recarregamento
    const reloadData = table.options.meta?.reloadData;

    const handleSuccess = () => {
        setOpen(false);
        if (reloadData) reloadData();
    };

    const handleDelete = () => {
        axios.delete(deleteEndpoint)
            .then(() => {
                toast.success(`${entityName} excluído com sucesso!`);
                if (reloadData) reloadData();
            })
            .catch((error) => {
                console.error("❌ Erro ao excluir. Detalhes:", error.response?.data || error);
                toast.error("Erro ao excluir");
            });
    };

    return (
        <ButtonGroup>
            {isMobile ? (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary" title="Editar">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Editar {entityName}</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 pb-0">
                            {renderEditForm(handleSuccess)}
                        </div>
                        <DrawerFooter className="pt-2">
                            <DrawerClose asChild>
                                <Button variant="outline">Cancelar</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            ) : (
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
            )}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive" title="Excluir">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir {entityName}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir? Esta ação não poderá ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Sim, excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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
