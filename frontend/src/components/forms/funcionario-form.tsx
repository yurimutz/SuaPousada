import { Button } from "@/components/ui/button";

import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { type Funcionario } from "../data-table/funcionario-columns";
import { DatePickerSimple } from "../date-picker-birthday";
import { toast } from "sonner";

interface FuncionarioFormProps {
    funcionario?: Funcionario;
    onSuccess: () => void;
}

const createFuncionarioFormSchema = z.object({
    nome: z.string().nonempty("O nome é obrigatório").max(80, "Máximo de 80 caracteres"),
    cpf: z.string().min(11, "CPF deve ter no mínimo 11 números").max(14, "CPF inválido"),
    telefone: z.string().min(10, "Telefone inválido").max(11, "Telefone muito grande"),
    dtNascimento: z.string().nonempty("Data de nascimento é obrigatória"),
    genero: z.string().min(1, "Gênero é obrigatório"),
    email: z.email("E-mail inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").optional().or(z.literal('')),
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
            senha: "",
        }
    })

    const onSubmit = (data: FuncionarioFormValues) => {
        if (isEditing) {
            const { senha, ...updateData } = data;
            api.patch(`/funcionario/${funcionario.id}/update`, updateData)
                .then((response) => {
                    toast.success("Funcionário atualizado com sucesso!");
                    onSuccess();
                })
                .catch((error) => {
                    toast.error("Erro ao atualizar funcionário. Tente novamente.");
                    console.error("❌ Erro ao atualizar. Detalhes:", error.response?.data || error);
                });
        } else {
            api.post(`/funcionario/create`, data)
                .then((response) => {
                    toast.success("Funcionário cadastrado com sucesso!");
                    onSuccess();
                })
                .catch((error) => {
                    toast.error("Erro ao cadastrar funcionário. Tente novamente.");
                    console.error("❌ Erro ao criar. Detalhes:", error.response?.data || error);
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
                    render={({ field: { onChange, value, ...rest }, fieldState }) => {
                        // Máscara de CPF visual (ex: 111.222.333-44)
                        const displayValue = value
                            .replace(/\D/g, '')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

                        return (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`cpf-${idPrefix}`}>CPF</FieldLabel>
                                <Input
                                    {...rest}
                                    value={displayValue}
                                    onChange={(e) => {
                                        // Salva apenas os números no estado interno
                                        onChange(e.target.value.replace(/\D/g, ''));
                                    }}
                                    id={`cpf-${idPrefix}`}
                                    type="text"
                                    maxLength={14}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )
                    }}
                />

                <Controller
                    name="telefone"
                    control={form.control}
                    render={({ field: { onChange, value, ...rest }, fieldState }) => {
                        // Máscara de Telefone visual (ex: (11) 99999-8888)
                        const displayValue = value
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '($1) $2')
                            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');

                        return (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`telefone-${idPrefix}`}>Telefone</FieldLabel>
                                <Input
                                    {...rest}
                                    value={displayValue}
                                    onChange={(e) => {
                                        // Salva apenas os números no estado interno
                                        onChange(e.target.value.replace(/\D/g, ''));
                                    }}
                                    id={`telefone-${idPrefix}`}
                                    type="text"
                                    maxLength={15}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )
                    }}
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
                        <Field orientation="responsive" data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={`genero-${idPrefix}`}>Gênero</FieldLabel>
                            </FieldContent>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            <Select 
                            onValueChange={field.onChange}
                            value={field.value || ''}>
                                <SelectTrigger id={`genero-${idPrefix}`} aria-invalid={fieldState.invalid} className="min-w-30">
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent position="item-aligned">
                                    <SelectItem value="MASCULINO">Masculino</SelectItem>
                                    <SelectItem value="FEMININO">Feminino</SelectItem>
                                </SelectContent>
                            </Select>
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

                {!isEditing && (
                    <Controller
                        name="senha"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`senha-${idPrefix}`}>Senha</FieldLabel>
                                <Input
                                    {...field}
                                    id={`senha-${idPrefix}`}
                                    type="password"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                )}
            </FieldGroup>
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                    {isEditing ? "Salvar alterações" : "Adicionar Funcionário"}
                </Button>
            </div>
        </form>
    );
}
