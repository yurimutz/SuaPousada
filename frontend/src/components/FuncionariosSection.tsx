import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldContent, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

type Funcionario = {
  id: number;
  nome: string;
  cargo: string;
  telefone: string;
};

const initialFuncionarios: Funcionario[] = [
  { id: 1, nome: "João Silva", cargo: "Recepcionista", telefone: "(11) 98765-4321" },
  { id: 2, nome: "Maria Souza", cargo: "Camareira", telefone: "(11) 91234-5678" },
];

export function FuncionariosSection() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({ nome: "", cargo: "", telefone: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.cargo) return;
    
    setFuncionarios([...funcionarios, { id: Date.now(), ...formData }]);
    setFormData({ nome: "", cargo: "", telefone: "" });
    setIsOpen(false);
  };

  const FuncionarioForm = (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="nome">Nome Completo</FieldLabel>
          <FieldContent>
            <Input id="nome" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Ana Clara" required />
          </FieldContent>
        </Field>
        
        <Field>
          <FieldLabel htmlFor="cargo">Cargo</FieldLabel>
          <FieldContent>
            <Input id="cargo" name="cargo" value={formData.cargo} onChange={handleChange} placeholder="Ex: Gerente" required />
          </FieldContent>
        </Field>
        
        <Field>
          <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
          <FieldContent>
            <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
          </FieldContent>
        </Field>
      </FieldSet>
      <Button type="submit" className="w-full mt-4">Salvar Funcionário</Button>
    </form>
  );

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
                {FuncionarioForm}
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
              {FuncionarioForm}
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden bg-card text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Telefone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funcionarios.length > 0 ? (
              funcionarios.map((func) => (
                <TableRow key={func.id}>
                  <TableCell className="font-medium">{func.nome}</TableCell>
                  <TableCell>{func.cargo}</TableCell>
                  <TableCell>{func.telefone}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                  Nenhum funcionário cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
