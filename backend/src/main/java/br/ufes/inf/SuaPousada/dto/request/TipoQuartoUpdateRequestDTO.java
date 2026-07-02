package br.ufes.inf.SuaPousada.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TipoQuartoUpdateRequestDTO(

        String nome,

        Integer qtdCamasSolteiro,

        Integer qtdCamasCasal,

        Integer qtdBanheiros,

        Double valor_diaria,

        Boolean existe_ArCondicionado

)
{
}
