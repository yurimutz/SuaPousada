import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { hospedesColumns, type Hospede } from "../../components/data-table/hospedes-columns";

const initialHospedes: Hospede[] = [
  {
    id: 1,
    nome: "Maria Silva",
    cpf: "12345678901",
    telefone: "11987654321",
    dtNascimento: "1990-05-20",
    genero: "Feminino",
    email: "maria.silva@email.com"
  },
  {
    id: 2,
    nome: "João Pereira",
    cpf: "98765432100",
    telefone: "21999998888",
    dtNascimento: "1985-11-10",
    genero: "Masculino",
    email: "joao.pereira@email.com"
  }
];

export function AdminHospedes() {
  
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();


  return (
    <div>
      <header className="mb-8 flex justify-between">

        <div className="">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Hóspedes</h1>
          <p className="text-muted-foreground mt-1">Visualize e gerencie os hóspedes da pousada.</p>
        </div>

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
                {/* {FuncionarioForm} */}
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
                Adicionar Hóspede
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Hóspede</DialogTitle>
              </DialogHeader>
              {/* {FuncionarioForm} */}
            </DialogContent>
          </Dialog>
        )}
      </header>

      <DataTable columns={hospedesColumns} data={initialHospedes} />
      
    </div>
  );
}
