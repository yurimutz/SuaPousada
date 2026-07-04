import { DataTable } from "@/components/data-table/data-table";
import { quartosColumns } from "@/components/data-table/quartos-columns";
import { tipoQuartosColumns } from "@/components/data-table/tipo-quartos-columns";
import { QuartoForm } from "@/components/forms/quarto-form";
import { TipoQuartoForm } from "@/components/forms/tipo-quarto-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { type Quarto, type TipoQuarto } from "../../components/data-table/quartos-columns";


export function AdminQuartos() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const [quartos, setQuartos] = useState<Quarto[]>([]);

  const [isTipoQuartoOpen, setIsTipoQuartoOpen] = useState(false);
  const [tipoQuartos, setTipoQuartos] = useState<TipoQuarto[]>([]);

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

  const fetchTipoQuartos = () => {
    axios.get("http://localhost:8080/tipoQuarto")
      .then((resposta) => {
        console.log(resposta.data);
        setTipoQuartos(resposta.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }

  useEffect(() => {
    fetchquartos();
    fetchTipoQuartos();
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
                <QuartoForm onSuccess={() => {
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
              <QuartoForm onSuccess={() => {
                setIsOpen(false);
                fetchquartos();
              }} />
            </DialogContent>
          </Dialog>
        )}
      </header>

      <DataTable columns={quartosColumns} data={quartos} meta={{ reloadData: fetchquartos }} />

      <div className="mt-16">
        <header className="mb-8 flex justify-between">
          <div className="">
            <h2 className="text-3xl font-bold text-foreground">Tipos de Quartos</h2>
            <p className="text-muted-foreground mt-1">Gerencie as categorias e especificações dos quartos.</p>
          </div>

          {isMobile ? (
            <Drawer open={isTipoQuartoOpen} onOpenChange={setIsTipoQuartoOpen}>
              <DrawerTrigger asChild>
                <Button>
                  <PlusCircle data-icon="inline-start" />
                  Adicionar
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Novo Tipo de Quarto</DrawerTitle>
                </DrawerHeader>
                <div className="p-4 pb-0">
                  <TipoQuartoForm onSuccess={() => {
                    setIsTipoQuartoOpen(false);
                    fetchTipoQuartos();
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
            <Dialog open={isTipoQuartoOpen} onOpenChange={setIsTipoQuartoOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle data-icon="inline-start" />
                  Adicionar Tipo
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Novo Tipo de Quarto</DialogTitle>
                </DialogHeader>
                <TipoQuartoForm onSuccess={() => {
                  setIsTipoQuartoOpen(false);
                  fetchTipoQuartos();
                }} />
              </DialogContent>
            </Dialog>
          )}
        </header>

        <DataTable columns={tipoQuartosColumns} data={tipoQuartos} meta={{ reloadData: fetchTipoQuartos }} />
      </div>

    </div>
  );
}
