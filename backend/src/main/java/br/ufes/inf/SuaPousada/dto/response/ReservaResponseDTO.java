package br.ufes.inf.SuaPousada.dto.response;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.domain.Pagamento;
import br.ufes.inf.SuaPousada.domain.Quarto;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservaResponseDTO(

        @NotNull
        Long id,

        LocalDateTime dtCheckIn,

        LocalDateTime dtCheckOut,

        @NotNull
        @FutureOrPresent
        LocalDate dtReservaInicio,

        @NotNull
        @Future
        LocalDate dtReservaFim,

        @NotNull
        @Positive
        Integer qtd_noites,

        @NotNull
        Quarto quarto,

        Pagamento pagamento,

        @NotNull
        Cliente cliente
)
{
}
