import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { type Quarto } from "../data-table/quartos-columns";

interface QuartoFormProps {
    quarto?: Quarto;
    onSuccess: () => void;
}

export function QuartoForm({ quarto, onSuccess }: QuartoFormProps) {
    const isEditing = !!quarto;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // Parse strings to integers since the backend expects numbers
        const payload = {
            ...data,
            numero: data.numero ? parseInt(data.numero as string, 10) : null,
            andar: data.andar ? parseInt(data.andar as string, 10) : null,
            tipoQuartoId: data.tipoQuartoId ? parseInt(data.tipoQuartoId as string, 10) : null,
        };

        if (isEditing) {
            axios.patch(`http://localhost:8080/quarto/${quarto.id}/update`, payload)
                .then((response) => {
                    console.log("Update feito com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao atualizar", error);
                });
        } else {
            axios.post(`http://localhost:8080/quarto/create`, payload)
                .then((response) => {
                    console.log("Criado com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao criar", error);
                });
        }
    };

    const idPrefix = isEditing ? quarto.id : "new";

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor={`numero-${idPrefix}`}>Número</FieldLabel>
                    <Input id={`numero-${idPrefix}`} name="numero" type="number" defaultValue={quarto?.numero} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`andar-${idPrefix}`}>Andar</FieldLabel>
                    <Input id={`andar-${idPrefix}`} name="andar" type="number" defaultValue={quarto?.andar} required />
                </Field>
                <Field>
                    <FieldLabel htmlFor={`tipoQuartoId-${idPrefix}`}>ID do Tipo de Quarto</FieldLabel>
                    <Input id={`tipoQuartoId-${idPrefix}`} name="tipoQuartoId" type="number" defaultValue={quarto?.tipoQuarto?.id} required />
                </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Quarto"}</Button>
            </DialogFooter>
        </form>
    );
}
