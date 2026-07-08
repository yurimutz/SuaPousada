import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { type Quarto } from "../data-table/quartos-columns";

interface QuartoFormProps {
    quarto?: Quarto;
    onSuccess: () => void;
}

const requiredNumber = (min: number, errorMsg: string) => 
    z.union([z.string(), z.number()])
    .refine(v => v !== "" && v !== null && v !== undefined && !Number.isNaN(Number(v)), "Campo obrigatório")
    .transform(Number)
    .pipe(z.number().min(min, errorMsg));

const createQuartoFormSchema = z.object({
    numero: requiredNumber(0, "O número do quarto não pode ser negativo"),
    andar: requiredNumber(0, "O andar não pode ser negativo"),
    tipoQuartoId: requiredNumber(1, "Selecione um tipo de quarto válido"),
});

type QuartoFormValues = z.infer<typeof createQuartoFormSchema>;

export function QuartoForm({ quarto, onSuccess }: QuartoFormProps) {
    const isEditing = !!quarto;
    const [tiposQuarto, setTiposQuarto] = useState<any[]>([]);

    const form = useForm<QuartoFormValues>({
        resolver: zodResolver(createQuartoFormSchema),
        defaultValues: {
            numero: quarto?.numero ?? ("" as unknown as number),
            andar: quarto?.andar ?? ("" as unknown as number),
            tipoQuartoId: quarto?.tipoQuarto?.id ?? ("" as unknown as number),
        }
    });

    useEffect(() => {
        // Busca a lista atualizada de Tipos de Quarto sempre que o formulário abrir
        axios.get("http://localhost:8080/tipoQuarto")
            .then((response) => {
                setTiposQuarto(response.data);
            })
            .catch((error) => console.error("Erro ao buscar tipos de quarto:", error));
    }, []);

    const onSubmit = (data: QuartoFormValues) => {
        if (isEditing) {
            axios.patch(`http://localhost:8080/quarto/${quarto.id}/update`, data)
                .then((response) => {
                    console.log("Update feito com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.error("Erro ao atualizar", error);
                });
        } else {
            axios.post(`http://localhost:8080/quarto/create`, data)
                .then((response) => {
                    console.log("Criado com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.error("Erro ao criar", error);
                });
        }
    };

    const idPrefix = isEditing ? quarto.id : "new";

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
                <Controller
                    name="numero"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`numero-${idPrefix}`}>Número</FieldLabel>
                            <Input
                                {...field}
                                id={`numero-${idPrefix}`}
                                type="number"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                
                <Controller
                    name="andar"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={`andar-${idPrefix}`}>Andar</FieldLabel>
                            <Input
                                {...field}
                                id={`andar-${idPrefix}`}
                                type="number"
                                aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="tipoQuartoId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldContent>
                                <FieldLabel htmlFor={`tipoQuartoId-${idPrefix}`}>Tipo de Quarto</FieldLabel>
                            </FieldContent>
                            <Select 
                                onValueChange={(val) => field.onChange(Number(val))} 
                                value={field.value ? String(field.value) : ""}
                            >
                                <SelectTrigger id={`tipoQuartoId-${idPrefix}`} aria-invalid={fieldState.invalid}>
                                    <SelectValue placeholder="Selecione um tipo de quarto..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {tiposQuarto.map((tipo) => (
                                        <SelectItem key={tipo.id} value={tipo.id.toString()}>
                                            {tipo.nome} (R$ {tipo.valor_diaria?.toFixed(2)})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>
            <DialogFooter className="mt-4">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Quarto"}</Button>
            </DialogFooter>
        </form>
    );
}
