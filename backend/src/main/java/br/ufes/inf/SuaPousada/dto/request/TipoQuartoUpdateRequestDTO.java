package br.ufes.inf.SuaPousada.dto.request;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record TipoQuartoUpdateRequestDTO(

        String nome,

        @PositiveOrZero(message = "A quantidade de camas de solteiro não pode ser negativa")
        Integer qtdCamasSolteiro,

        @PositiveOrZero(message = "A quantidade de camas de casal não pode ser negativa")
        Integer qtdCamasCasal,

        @PositiveOrZero(message = "A quantidade de banheiros não pode ser negativa")
        Integer qtdBanheiros,

        @Positive(message = "Valor da diária deve ser maior que zero")
        Double valor_diaria,

        Boolean existe_ArCondicionado

)
{
}
