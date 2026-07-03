import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Field, FieldContent, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/funcionario-columns";

type Funcionario = {
  id?: number;
  nome: string;
  cpf: string;
  telefone: string;
  dtNascimento: string;
  genero: string;
  email: string;
};

const initialFuncionarios: Funcionario[] = [
  {
    id: 1,
    nome: "Rafael Rodrigues",
    cpf: "16443762703",
    telefone: "27997550259",
    dtNascimento: "2004-09-13",
    genero: "Masculino",
    email: "rafael@gmail.com"
  },
  {
    id: 2,
    nome: "Bruno Vale",
    cpf: "16443762701",
    telefone: "27997550259",
    dtNascimento: "2004-09-13",
    genero: "Masculino",
    email: "bruno@gmail.com"
  },
];

export function FuncionariosSection() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(initialFuncionarios);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    dtNascimento: "",
    genero: "",
    email: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.cpf) return;

    setFuncionarios([...funcionarios, { id: Date.now(), ...formData }]);
    setFormData({ nome: "", cpf: "", telefone: "", dtNascimento: "", genero: "", email: "" });
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
          <FieldLabel htmlFor="cpf">CPF</FieldLabel>
          <FieldContent>
            <Input id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="telefone">Telefone</FieldLabel>
          <FieldContent>
            <Input id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} placeholder="(00) 00000-0000" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="dtNascimento">Data de Nascimento</FieldLabel>
          <FieldContent>
            <Input id="dtNascimento" type="date" name="dtNascimento" value={formData.dtNascimento} onChange={handleChange} required />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="genero">Gênero</FieldLabel>
          <FieldContent>
            <Input id="genero" name="genero" value={formData.genero} onChange={handleChange} placeholder="Ex: Feminino" />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <FieldContent>
            <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="exemplo@email.com" />
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

      {/* <div className="rounded-lg overflow-hidden bg-card text-card-foreground">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>E-mail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {funcionarios.length > 0 ? (
              funcionarios.map((func) => (
                <TableRow key={func.id}>
                  <TableCell className="font-medium">{func.nome}</TableCell>
                  <TableCell>{func.cpf}</TableCell>
                  <TableCell>{func.telefone}</TableCell>
                  <TableCell>{func.dtNascimento}</TableCell>
                  <TableCell>{func.genero}</TableCell>
                  <TableCell>{func.email}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum funcionário cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

      </div> */}
        <DataTable columns={columns} data={initialFuncionarios}/>
    </div>
  );
}
