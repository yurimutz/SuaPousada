package br.ufes.inf.SuaPousada.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record TipoQuartoCreateRequestDTO(

        @NotBlank
        String nome,

        @NotNull
        @PositiveOrZero(message = "A quantidade de camas de solteiro não pode ser negativa")
        Integer qtdCamasSolteiro,

        @NotNull
        @PositiveOrZero(message = "A quantidade de camas de casal não pode ser negativa")
        Integer qtdCamasCasal,

        @NotNull
        @PositiveOrZero(message = "A quantidade de banheiros não pode ser negativa")
        Integer qtdBanheiros,

        @NotNull
        @Positive(message = "Valor da diária deve ser maior que zero")
        Double valor_diaria,

        @NotNull
        Boolean existe_ArCondicionado

)
{
}
