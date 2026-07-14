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
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"

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

    // A data válida selecionada (como objeto Date) para o Calendário
    const initialDateStr = value || defaultValue;
    const initialDate = initialDateStr ? new Date(initialDateStr + "T00:00:00") : undefined;
    
    const [date, setDate] = React.useState<Date | undefined>(initialDate)
    
    // O valor exibido no Input em formato DD/MM/YYYY
    const [inputValue, setInputValue] = React.useState<string>("");

    // Converte de YYYY-MM-DD para DD/MM/YYYY
    const toBrFormat = (isoDate: string) => {
        if (!isoDate) return "";
        const [y, m, d] = isoDate.split("-");
        if (y && m && d) return `${d}/${m}/${y}`;
        return "";
    }

    // Se receber value externo (via react-hook-form), atualiza o estado interno
    React.useEffect(() => {
        if (value) {
            setDate(new Date(value + "T00:00:00"));
            setInputValue(toBrFormat(value));
        } else {
            setDate(undefined);
            setInputValue("");
        }
    }, [value])

    // Lida com a digitação do usuário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ""); // Remove tudo que não é número
        
        // Aplica a máscara DD/MM/YYYY
        if (val.length > 8) val = val.slice(0, 8);
        if (val.length > 4) {
            val = val.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
        } else if (val.length > 2) {
            val = val.replace(/(\d{2})(\d{1,2})/, "$1/$2");
        }
        
        setInputValue(val);

        // Se tiver 10 caracteres (DD/MM/YYYY), tenta converter para YYYY-MM-DD e notificar o onChange
        if (val.length === 10) {
            const [d, m, y] = val.split("/");
            // Verifica se ano, mês e dia parecem ser válidos minimamente antes de jogar pro Date
            if (Number(d) > 0 && Number(d) <= 31 && Number(m) > 0 && Number(m) <= 12) {
                const parsedDate = new Date(`${y}-${m}-${d}T00:00:00`);
                if (!isNaN(parsedDate.getTime())) {
                    setDate(parsedDate);
                    if (onChange) {
                        onChange(`${y}-${m}-${d}`);
                    }
                }
            }
        }
    }

    return (
        <Field>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <InputGroup>
                <InputGroupInput
                    id={id}
                    value={inputValue}
                    placeholder="DD/MM/YYYY"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault()
                            setOpen(true)
                        }
                    }}
                />

                <InputGroupAddon align="inline-end">
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                type="button"
                                className="text-muted-foreground hover:bg-transparent hover:text-foreground"
                                aria-label="Abrir calendário"
                            >
                                <CalendarIcon className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
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
                                            const y = newDate.getFullYear();
                                            const m = String(newDate.getMonth() + 1).padStart(2, '0');
                                            const d = String(newDate.getDate()).padStart(2, '0');
                                            const isoDate = `${y}-${m}-${d}`;
                                            onChange(isoDate);
                                            setInputValue(`${d}/${m}/${y}`);
                                        } else {
                                            onChange("");
                                            setInputValue("");
                                        }
                                    }
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </InputGroupAddon>
            </InputGroup>
        </Field>
    )
}
