import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { hospedesColumns, type Hospede } from "../../components/data-table/hospedes-columns";
import { HospedeForm } from "@/components/forms/hospede-form";

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

  const [hospedes, setHospedes] = useState<Hospede[]>([]);


  useEffect(() => {
    axios.get("http://localhost:8080/cliente")
    .then( (resposta) => {
      console.log(resposta.data);
      setHospedes(resposta.data);
    })
    .catch( (error) => {
      console.log(error);
    })
  }, []);

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
                <PlusCircle data-icon="inline-start" />
                Adicionar
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Novo Hóspede</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <HospedeForm onSuccess={() => {
                  setIsOpen(false);
                  fetchHospedes();
                }} />
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
                <PlusCircle data-icon="inline-start" />
                Adicionar Hóspede
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Hóspede</DialogTitle>
              </DialogHeader>
              <HospedeForm onSuccess={() => {
                setIsOpen(false);
                fetchHospedes();
              }} />
            </DialogContent>
          </Dialog>
        )}
      </header>

      <DataTable columns={hospedesColumns} data={hospedes} />
      
    </div>
  );
}
