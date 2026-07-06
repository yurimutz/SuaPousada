package br.ufes.inf.SuaPousada.dto.request;

import br.ufes.inf.SuaPousada.domain.MetodoPagamento;
import br.ufes.inf.SuaPousada.domain.StatusPagamento;

public record PagamentoUpdateRequestDTO(

        MetodoPagamento metodoPagamento,

        Double valor,

        StatusPagamento status

)
{
}
