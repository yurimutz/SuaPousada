import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { type Hospede } from "../data-table/hospedes-columns";
import { DatePickerSimple } from "../date-picker-birthday";

interface HospedeFormProps {
    hospede?: Hospede;
    onSuccess: () => void;
}

export function HospedeForm({ hospede, onSuccess }: HospedeFormProps) {
    const isEditing = !!hospede;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        if (isEditing) {
            axios.patch(`http://localhost:8080/cliente/${hospede.id}/update`, data)
                .then((response) => {
                    console.log("Update feito com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao atualizar", error);
                });
        } else {
            axios.post(`http://localhost:8080/cliente/create`, data)
                .then((response) => {
                    console.log("Criado com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao criar", error);
                });
        }
    };

    const idPrefix = isEditing ? hospede.id : "new";

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor={`nome-${idPrefix}`}>Nome</FieldLabel>
                    <Input id={`nome-${idPrefix}`} name="nome" defaultValue={hospede?.nome} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`cpf-${idPrefix}`}>CPF</FieldLabel>
                    <Input id={`cpf-${idPrefix}`} name="cpf" defaultValue={hospede?.cpf} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`telefone-${idPrefix}`}>Telefone</FieldLabel>
                    <Input id={`telefone-${idPrefix}`} name="telefone" defaultValue={hospede?.telefone} required />
                </Field>
                <DatePickerSimple 
                    id={`nasc-${idPrefix}`} 
                    name="dtNascimento" 
                    defaultValue={hospede?.dtNascimento} 
                    required 
                />
                <Field>
                    <FieldLabel htmlFor={`genero-${idPrefix}`}>Gênero</FieldLabel>
                    <Input id={`genero-${idPrefix}`} name="genero" defaultValue={hospede?.genero} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`email-${idPrefix}`}>E-mail</FieldLabel>
                    <Input id={`email-${idPrefix}`} name="email" type="email" defaultValue={hospede?.email} required />
                </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Hóspede"}</Button>
            </DialogFooter>
        </form>
    );
}
