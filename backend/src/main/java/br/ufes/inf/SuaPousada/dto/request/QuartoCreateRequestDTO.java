package br.ufes.inf.SuaPousada.dto.request;

import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record QuartoCreateRequestDTO(

        @NotNull
        @PositiveOrZero
        Integer numero,

        @NotNull
        @PositiveOrZero
        Integer andar,

        @NotNull
        TipoQuarto tipoQuarto
)
{
}
