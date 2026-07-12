import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { type TipoQuarto } from "../data-table/quartos-columns";
import { toast } from "sonner";

interface TipoQuartoFormProps {
    tipoQuarto?: TipoQuarto;
    onSuccess: () => void;
}

const requiredNumber = (min: number, errorMsg: string) => 
    z.union([z.string(), z.number()])
    .refine(v => v !== "" && v !== null && v !== undefined && !Number.isNaN(Number(v)), "Campo obrigatório")
    .transform(Number)
    .pipe(z.number().min(min, errorMsg));

const createTipoQuartoFormSchema = z.object({
    nome: z.string().nonempty("O nome é obrigatório"),
    qtdCamasSolteiro: requiredNumber(0, "Não pode ser negativo"),
    qtdCamasCasal: requiredNumber(0, "Não pode ser negativo"),
    qtdBanheiros: requiredNumber(0, "Não pode ser negativo"),
    valor_diaria: requiredNumber(0.01, "A diária deve ser maior que zero"),
    existe_ArCondicionado: z.boolean(),
});

type TipoQuartoFormValues = z.infer<typeof createTipoQuartoFormSchema>;

export function TipoQuartoForm({ tipoQuarto, onSuccess }: TipoQuartoFormProps) {
    const isEditing = !!tipoQuarto;

    const form = useForm<TipoQuartoFormValues>({
        resolver: zodResolver(createTipoQuartoFormSchema),
        defaultValues: {
            nome: tipoQuarto?.nome || "",
            qtdCamasSolteiro: tipoQuarto?.qtdCamasSolteiro ?? ("" as unknown as number),
            qtdCamasCasal: tipoQuarto?.qtdCamasCasal ?? ("" as unknown as number),
            qtdBanheiros: tipoQuarto?.qtdBanheiros ?? ("" as unknown as number),
            valor_diaria: tipoQuarto?.valor_diaria ?? ("" as unknown as number),
            existe_ArCondicionado: tipoQuarto?.existe_ArCondicionado ?? false,
        }
    });

    const onSubmit = (data: TipoQuartoFormValues) => {
        if (isEditing) {
            axios.patch(`http://localhost:8080/tipoQuarto/${tipoQuarto.id}/update`, data)
                .then((response) => {
                    toast.success("Tipo de quarto atualizado com sucesso!");
                    onSuccess();
                })
                .catch((error) => {
                    toast.error("Erro ao atualizar tipo de quarto. Tente novamente.");
                    console.error("Erro ao atualizar", error);
                });
        } else {
            axios.post(`http://localhost:8080/tipoQuarto/create`, data)
                .then((response) => {
                    toast.success("Tipo de quarto cadastrado com sucesso!");
                    onSuccess();
                })
                .catch((error) => {
                    toast.error("Erro ao cadastrar tipo de quarto. Tente novamente.");
                    console.error("Erro ao criar", error);
                });
        }
    };

    const idPrefix = isEditing ? tipoQuarto.id : "new";

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="nome"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`nome-${idPrefix}`}>Nome do Tipo</FieldLabel>
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
                
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="qtdCamasSolteiro"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`solteiro-${idPrefix}`}>Camas de Solteiro</FieldLabel>
                                <Input
                                    {...field}
                                    id={`solteiro-${idPrefix}`}
                                    type="number"
                                    min="0"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    
                    <Controller
                        name="qtdCamasCasal"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`casal-${idPrefix}`}>Camas de Casal</FieldLabel>
                                <Input
                                    {...field}
                                    id={`casal-${idPrefix}`}
                                    type="number"
                                    min="0"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <Controller
                        name="qtdBanheiros"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`banheiros-${idPrefix}`}>Banheiros</FieldLabel>
                                <Input
                                    {...field}
                                    id={`banheiros-${idPrefix}`}
                                    type="number"
                                    min="0"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="valor_diaria"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={`diaria-${idPrefix}`}>Valor Diária (R$)</FieldLabel>
                                <Input
                                    {...field}
                                    id={`diaria-${idPrefix}`}
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
                
                <Controller
                    name="existe_ArCondicionado"
                    control={form.control}
                    render={({ field: { value, onChange, ...rest }, fieldState }) => (
                        <Field data-invalid={fieldState.invalid} className="mt-2 flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`ar-${idPrefix}`} 
                                    checked={value} 
                                    onCheckedChange={onChange} 
                                    {...rest}
                                />
                                <label
                                    htmlFor={`ar-${idPrefix}`}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Possui Ar-Condicionado
                                </label>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>
            <DialogFooter className="mt-6">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Tipo"}</Button>
            </DialogFooter>
        </form>
    );
}
