import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
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
    email: z.email("E-mail inválido"),
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

                <Controller
                    name="nome"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`nome-${idPrefix}`}>Nome</FieldLabel>
                            <Input  
                                {...field}
                                id={`nome-${idPrefix}`}
                                type="text"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="cpf"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`cpf-${idPrefix}`}>CPF</FieldLabel>
                            <Input  
                                {...field}
                                id={`cpf-${idPrefix}`}
                                type="text"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                
                <Controller
                    name="telefone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`telefone-${idPrefix}`}>Telefone</FieldLabel>
                            <Input  
                                {...field}
                                id={`telefone-${idPrefix}`}
                                type="text"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="dtNascimento"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <DatePickerSimple
                                id={`nasc-${idPrefix}`}
                                name={field.name}
                                value={field.value}
                                onChange={field.onChange}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="genero"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`genero-${idPrefix}`}>Gênero</FieldLabel>
                            <Input  
                                {...field}
                                id={`genero-${idPrefix}`}
                                type="text"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`email-${idPrefix}`}>E-mail</FieldLabel>
                            <Input  
                                {...field}
                                id={`email-${idPrefix}`}
                                type="email"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>
            <DialogFooter className="mt-6">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Funcionário"}</Button>
            </DialogFooter>
        </form>
    );
}
