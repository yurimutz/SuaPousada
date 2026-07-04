import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { type TipoQuarto } from "../data-table/quartos-columns";

interface TipoQuartoFormProps {
    tipoQuarto?: TipoQuarto;
    onSuccess: () => void;
}

export function TipoQuartoForm({ tipoQuarto, onSuccess }: TipoQuartoFormProps) {
    const isEditing = !!tipoQuarto;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            nome: data.nome as string,
            qtdCamasSolteiro: data.qtdCamasSolteiro ? parseInt(data.qtdCamasSolteiro as string, 10) : 0,
            qtdCamasCasal: data.qtdCamasCasal ? parseInt(data.qtdCamasCasal as string, 10) : 0,
            qtdBanheiros: data.qtdBanheiros ? parseInt(data.qtdBanheiros as string, 10) : 0,
            valor_diaria: data.valor_diaria ? parseFloat(data.valor_diaria as string) : 0,
            // Checkbox HTML sends "on" se tem name attribute e checked. Mas Radix Checkbox pode funcionar diferente se não usar name.
            // Para garantir que o FormData receba o valor com Radix Checkbox precisamos de um hidden input ou value.
            // O Shadcn Checkbox aceita `name` e `value` no form, então deve funcionar.
            existe_ArCondicionado: data.existe_ArCondicionado === "on",
        };

        if (isEditing) {
            axios.patch(`http://localhost:8080/tipoQuarto/${tipoQuarto.id}/update`, payload)
                .then((response) => {
                    console.log("Update feito com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao atualizar", error);
                });
        } else {
            axios.post(`http://localhost:8080/tipoQuarto/create`, payload)
                .then((response) => {
                    console.log("Criado com sucesso!", response.data);
                    onSuccess();
                })
                .catch((error) => {
                    console.log("Erro ao criar", error);
                });
        }
    };

    const idPrefix = isEditing ? tipoQuarto.id : "new";

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor={`nome-${idPrefix}`}>Nome do Tipo</FieldLabel>
                    <Input id={`nome-${idPrefix}`} name="nome" defaultValue={tipoQuarto?.nome} required />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor={`solteiro-${idPrefix}`}>Camas de Solteiro</FieldLabel>
                        <Input id={`solteiro-${idPrefix}`} name="qtdCamasSolteiro" type="number" min="0" defaultValue={tipoQuarto?.qtdCamasSolteiro} required />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={`casal-${idPrefix}`}>Camas de Casal</FieldLabel>
                        <Input id={`casal-${idPrefix}`} name="qtdCamasCasal" type="number" min="0" defaultValue={tipoQuarto?.qtdCamasCasal} required />
                    </Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor={`banheiros-${idPrefix}`}>Banheiros</FieldLabel>
                        <Input id={`banheiros-${idPrefix}`} name="qtdBanheiros" type="number" min="0" defaultValue={tipoQuarto?.qtdBanheiros} required />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor={`diaria-${idPrefix}`}>Valor Diária (R$)</FieldLabel>
                        <Input id={`diaria-${idPrefix}`} name="valor_diaria" type="number" step="0.01" min="0.01" defaultValue={tipoQuarto?.valor_diaria} required />
                    </Field>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                    <Checkbox id={`ar-${idPrefix}`} name="existe_ArCondicionado" defaultChecked={tipoQuarto?.existe_ArCondicionado} />
                    <label
                        htmlFor={`ar-${idPrefix}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Possui Ar-Condicionado
                    </label>
                </div>
            </FieldGroup>
            <DialogFooter className="mt-6">
                <Button type="submit">{isEditing ? "Salvar alterações" : "Adicionar Tipo"}</Button>
            </DialogFooter>
        </form>
    );
}
