package br.ufes.inf.SuaPousada.dto.response;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TipoQuartoResponseDTO(

        @NotNull
        Long id,

        @NotBlank
        String nome,

        @NotNull
        Integer qtdCamasSolteiro,

        @NotNull
        Integer qtdCamasCasal,

        @NotNull
        Integer qtdBanheiros,

        @NotNull
        Double valor_diaria,

        @NotNull
        Boolean existe_ArCondicionado

)
{
}
