import { DataTable } from "@/components/data-table/data-table";
import { quartosColumns } from "@/components/data-table/quartos-columns";
import { HospedeForm } from "@/components/forms/hospede-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { type Hospede } from "../../components/data-table/hospedes-columns";


export function AdminQuartos() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const [quartos, setQuartos] = useState<Hospede[]>([]);

  const fetchquartos = () => {
    axios.get("http://localhost:8080/quarto")
      .then((resposta) => {
        console.log(resposta.data);
        setQuartos(resposta.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    fetchquartos();
  }, []);

  return (
    <div>
      <header className="mb-8 flex justify-between">

        <div className="">
          <h1 className="text-3xl font-bold text-foreground">Gestão de Quartos</h1>
          <p className="text-muted-foreground mt-1">Visualize e gerencie os quartos da pousada.</p>
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
                <DrawerTitle>Novo Quarto</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 pb-0">
                <HospedeForm onSuccess={() => {
                  setIsOpen(false);
                  fetchquartos();
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
                Adicionar Quarto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Novo Quarto</DialogTitle>
              </DialogHeader>
              <HospedeForm onSuccess={() => {
                setIsOpen(false);
                fetchquartos();
              }} />
            </DialogContent>
          </Dialog>
        )}
      </header>

      <DataTable columns={quartosColumns} data={quartos} meta={{ reloadData: fetchquartos }} />

    </div>
  );
}
