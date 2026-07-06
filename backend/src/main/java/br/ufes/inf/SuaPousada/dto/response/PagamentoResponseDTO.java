package br.ufes.inf.SuaPousada.dto.response;

import br.ufes.inf.SuaPousada.domain.MetodoPagamento;
import br.ufes.inf.SuaPousada.domain.StatusPagamento;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PagamentoResponseDTO(

        @NotNull
        Long id,

        @NotNull
        MetodoPagamento metodoPagamento,

        @NotNull
        @Positive
        Double valor,

        @NotNull
        StatusPagamento status

)
{
}
