import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { type Funcionario } from "../data-table/funcionario-columns";
import { DatePickerSimple } from "../date-picker-birthday";

interface FuncionarioFormProps {
    funcionario?: Funcionario;
    onSuccess: () => void;
}

const createFuncionarioFormSchema = z.object({
    nome: z.string().min(1, "O nome é obrigatório").max(80, "Máximo de 80 caracteres"),
    cpf: z.string().min(11, "CPF deve ter no mínimo 11 números").max(14, "CPF inválido"),
    telefone: z.string().min(10, "Telefone inválido").max(15, "Telefone muito grande"),
    dtNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
    genero: z.string().min(1, "Gênero é obrigatório"),
    email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
})

type FuncionarioFormValues = z.infer<typeof createFuncionarioFormSchema>;

export function FuncionarioForm({ funcionario, onSuccess }: FuncionarioFormProps) {
    const isEditing = !!funcionario;

    const form = useForm<FuncionarioFormValues>({
        resolver: zodResolver(createFuncionarioFormSchema),
        defaultValues: {
            nome: funcionario?.nome || "",
            cpf: funcionario?.cpf || "",
            telefone: funcionario?.telefone || "",
            dtNascimento: funcionario?.dtNascimento || "",
            genero: funcionario?.genero || "",
            email: funcionario?.email || "",
        }
    })

    const onSubmit = (data: FuncionarioFormValues) => {
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor={`nome-${idPrefix}`}>Nome</FieldLabel>
                    <Input id={`nome-${idPrefix}`} {...form.register("nome")} />
                    {form.formState.errors.nome && <span className="text-sm text-destructive">{form.formState.errors.nome.message}</span>}
                </Field>
                <Field>
                    <FieldLabel htmlFor={`cpf-${idPrefix}`}>CPF</FieldLabel>
                    <Input id={`cpf-${idPrefix}`} {...form.register("cpf")} />
                    {form.formState.errors.cpf && <span className="text-sm text-destructive">{form.formState.errors.cpf.message}</span>}
                </Field>
                <Field>
                    <FieldLabel htmlFor={`telefone-${idPrefix}`}>Telefone</FieldLabel>
                    <Input id={`telefone-${idPrefix}`} {...form.register("telefone")} />
                    {form.formState.errors.telefone && <span className="text-sm text-destructive">{form.formState.errors.telefone.message}</span>}
                </Field>

                <Controller 
                    name="dtNascimento"
                    control={form.control}
                    render={({ field }) => (
                        <DatePickerSimple
                            id={`nasc-${idPrefix}`}
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
                {form.formState.errors.dtNascimento && <span className="text-sm text-destructive mt-[-10px] block">{form.formState.errors.dtNascimento.message}</span>}

                <Field>
                    <FieldLabel htmlFor={`genero-${idPrefix}`}>Gênero</FieldLabel>
                    <Input id={`genero-${idPrefix}`} {...form.register("genero")} />
                    {form.formState.errors.genero && <span className="text-sm text-destructive">{form.formState.errors.genero.message}</span>}
                </Field>
                <Field>
                    <FieldLabel htmlFor={`email-${idPrefix}`}>E-mail</FieldLabel>
                    <Input id={`email-${idPrefix}`} type="email" {...form.register("email")} />
                    {form.formState.errors.email && <span className="text-sm text-destructive">{form.formState.errors.email.message}</span>}
                </Field>
            </FieldGroup>
            <DialogFooter className="mt-6">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Funcionário"}</Button>
            </DialogFooter>
        </form>
    );
}
