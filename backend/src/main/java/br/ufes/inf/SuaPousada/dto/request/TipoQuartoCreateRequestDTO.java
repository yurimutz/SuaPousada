package br.ufes.inf.SuaPousada.dto.request;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TipoQuartoCreateRequestDTO(

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
