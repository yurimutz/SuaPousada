import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table/data-table";
import { columns, type Funcionario } from "./data-table/funcionario-columns";
import { FuncionarioForm } from "./forms/funcionario-form";

export function FuncionariosSection() {
    const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    const fetchFuncionarios = () => {
        axios.get("http://localhost:8080/funcionario/getAll")
            .then((response) => setFuncionarios(response.data))
            .catch((error) => console.error("Erro ao buscar funcionários:", error));
    };

    useEffect(() => {
        fetchFuncionarios();
    }, []);

    const handleSuccess = () => {
        setIsOpen(false);
        fetchFuncionarios();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Gestão de Funcionários</h2>

                {isMobile ? (
                    <Drawer open={isOpen} onOpenChange={setIsOpen}>
                        <DrawerTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <DrawerHeader>
                                <DrawerTitle>Novo Funcionário</DrawerTitle>
                            </DrawerHeader>
                            <div className="p-4 pb-0">
                                <FuncionarioForm onSuccess={handleSuccess} />
                            </div>
                            <DrawerFooter className="pt-2">
                                <DrawerClose asChild>
                                    <Button variant="outline">Cancelar</Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Adicionar Funcionário
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Novo Funcionário</DialogTitle>
                            </DialogHeader>
                            <FuncionarioForm onSuccess={handleSuccess} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <DataTable 
                columns={columns} 
                data={funcionarios} 
                meta={{ reloadData: fetchFuncionarios }}
            />
        </div>
    );
}
