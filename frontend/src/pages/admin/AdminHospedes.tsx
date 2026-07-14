import { DataTable } from "@/components/data-table/data-table";
import { HospedeForm } from "@/components/forms/hospede-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { api } from "@/lib/api";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { hospedesColumns, type Hospede } from "../../components/data-table/hospedes-columns";

export function AdminHospedes() {
  
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  
  const fetchHospedes = () => {
    api.get("/cliente")
    .then( (resposta) => {
      setHospedes(resposta.data);
    })
    .catch( (error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    fetchHospedes();
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

      <DataTable columns={hospedesColumns} data={hospedes} meta={{ reloadData: fetchHospedes }} />
      
    </div>
  );
}
