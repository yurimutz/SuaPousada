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
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { type Hospede } from "../data-table/hospedes-columns";
import { DatePickerSimple } from "../date-picker-birthday";
import { toast } from "sonner";

interface HospedeFormProps {
    hospede?: Hospede;
    submitLabel?: string;
    onSuccess: () => void;
}

const createHospedeFormSchema = z.object({
    nome: z.string().nonempty("O nome é obrigatório").max(80, "Máximo de 80 caracteres"),
    cpf: z.string().min(11, "CPF deve ter no mínimo 11 números").max(14, "CPF inválido"),
    telefone: z.string().min(10, "Telefone inválido").max(11, "Telefone muito grande"),
    dtNascimento: z.string().nonempty("Data de nascimento é obrigatória"),
    genero: z.string().min(1, "Gênero é obrigatório"),
    email: z.email("E-mail inválido"),
});

type HospedeFormValues = z.infer<typeof createHospedeFormSchema>;

export function HospedeForm({ hospede, submitLabel, onSuccess }: HospedeFormProps) {
    const isEditing = !!hospede;

    const form = useForm<HospedeFormValues>({
        resolver: zodResolver(createHospedeFormSchema),
        defaultValues: {
            nome: hospede?.nome || "",
            cpf: hospede?.cpf || "",
            telefone: hospede?.telefone || "",
            dtNascimento: hospede?.dtNascimento || "",
            genero: hospede?.genero || "",
            email: hospede?.email || "",
        }
    });

    const onSubmit = (data: HospedeFormValues) => {
        if (isEditing) {
            axios.patch(`http://localhost:8080/cliente/${hospede.id}/update`, data)
                .then((response) => {
                    toast.success("Hóspede atualizado com sucesso!");
                    onSuccess();
                })
                .catch((error) => {
                    toast.error("Erro ao atualizar hóspede. Tente novamente.");
                    console.error("❌ Erro ao atualizar. Detalhes:", error.response?.data || error);
                });
        } else {
            axios.post(`http://localhost:8080/cliente/create`, data)
                .then((response) => {
                    toast.success("Hóspede cadastrado com sucesso!");
                    onSuccess();
                })
                .catch((error) => {
                    toast.error("Erro ao cadastrar hóspede. Tente novamente.");
                    console.error("❌ Erro ao criar. Detalhes:", error.response?.data || error);
                });
        }
    };

    const idPrefix = isEditing ? hospede.id : "new";

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
                                value={field.value || ''}
                            >
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
            </FieldGroup>
            
            <div className="mt-6 flex flex-col sm:flex-row sm:justify-end">
                <Button type="submit" className="w-full sm:w-auto">
                    {isEditing ? "Salvar alterações" : (submitLabel || "Adicionar Hóspede")}
                </Button>
            </div>
        </form>
    );
}
