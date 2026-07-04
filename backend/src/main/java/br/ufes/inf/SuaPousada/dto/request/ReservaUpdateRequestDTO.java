package br.ufes.inf.SuaPousada.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReservaUpdateRequestDTO(

        LocalDateTime dtCheckIn,

        LocalDateTime dtCheckOut,

        @FutureOrPresent
        LocalDate dtReservaInicio,

        @Future
        LocalDate dtReservaFim,

        Long quartoId,

        Long pagamentoId,

        Long clienteId

)
{
}
