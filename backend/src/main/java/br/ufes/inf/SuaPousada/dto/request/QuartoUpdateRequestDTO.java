package br.ufes.inf.SuaPousada.dto.request;

import br.ufes.inf.SuaPousada.domain.TipoQuarto;

public record QuartoUpdateRequestDTO(

        Integer numero,

        Integer andar,

        TipoQuarto tipoQuarto

)
{
}
