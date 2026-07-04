import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { type Funcionario } from "../data-table/funcionario-columns";

interface FuncionarioFormProps {
    funcionario?: Funcionario;
    onSuccess: () => void;
}

export function FuncionarioForm({ funcionario, onSuccess }: FuncionarioFormProps) {
    const isEditing = !!funcionario;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (isEditing) {
            axios.patch(`http://localhost:8080/funcionario/${funcionario.id}/update`, data)
                .then((response) => {
                    console.log("Update feito com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao atualizar", error);
                });
        } else {
            axios.post(`http://localhost:8080/funcionario/create`, data)
                .then((response) => {
                    console.log("Criado com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao criar", error);
                });
        }
    };

    const idPrefix = isEditing ? funcionario.id : "new";

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor={`nome-${idPrefix}`}>Nome</FieldLabel>
                    <Input id={`nome-${idPrefix}`} name="nome" defaultValue={funcionario?.nome} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`cpf-${idPrefix}`}>CPF</FieldLabel>
                    <Input id={`cpf-${idPrefix}`} name="cpf" defaultValue={funcionario?.cpf} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`telefone-${idPrefix}`}>Telefone</FieldLabel>
                    <Input id={`telefone-${idPrefix}`} name="telefone" defaultValue={funcionario?.telefone} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`nasc-${idPrefix}`}>Data de Nascimento</FieldLabel>
                    <Input id={`nasc-${idPrefix}`} name="dtNascimento" type="date" defaultValue={funcionario?.dtNascimento} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`genero-${idPrefix}`}>Gênero</FieldLabel>
                    <Input id={`genero-${idPrefix}`} name="genero" defaultValue={funcionario?.genero} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`email-${idPrefix}`}>E-mail</FieldLabel>
                    <Input id={`email-${idPrefix}`} name="email" type="email" defaultValue={funcionario?.email} required />
                </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Funcionário"}</Button>
            </DialogFooter>
        </form>
    );
}
