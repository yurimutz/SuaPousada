import { CalendarIcon } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface DatePickerSimpleProps {
    id: string;
    name?: string;
    label?: string;
    defaultValue?: string;
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
}

export function DatePickerSimple({ id, name, label = "Data de Nascimento", defaultValue, value, onChange, required }: DatePickerSimpleProps) {
    const [open, setOpen] = React.useState(false)
    
    // Converte defaultValue ou value
    const initialDateStr = value || defaultValue;
    const initialDate = initialDateStr ? new Date(initialDateStr + "T00:00:00") : undefined;
    const [date, setDate] = React.useState<Date | undefined>(initialDate)

    // Se receber value externo, atualiza o estado interno
    React.useEffect(() => {
        if (value !== undefined) {
            setDate(value ? new Date(value + "T00:00:00") : undefined);
        }
    }, [value])

    // Formata de volta para YYYY-MM-DD para o FormData enviar ao banco corretamente (seguro para qualquer fuso horário)
    const formattedValue = date ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : "";

    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            
            {/* Input escondido para o FormData capturar o valor selecionado */}
            <input type="hidden" name={name} value={formattedValue} required={required} />
            
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button 
                        variant="outline" 
                        id={id} 
                        className={cn("justify-start font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon data-icon="inline-start" />
                        {date ? date.toLocaleDateString('pt-BR') : "Selecione uma data"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        defaultMonth={date}
                        captionLayout="dropdown"
                        onSelect={(newDate) => {
                            setDate(newDate)
                            setOpen(false)
                            if (onChange) {
                                if (newDate) {
                                    const formatted = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, '0')}-${String(newDate.getDate()).padStart(2, '0')}`;
                                    onChange(formatted);
                                } else {
                                    onChange("");
                                }
                            }
                        }}
                    />
                </PopoverContent>
            </Popover>
        </Field>
    )
}
