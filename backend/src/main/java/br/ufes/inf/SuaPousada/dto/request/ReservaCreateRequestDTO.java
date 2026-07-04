package br.ufes.inf.SuaPousada.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ReservaCreateRequestDTO(

        @NotNull
        @FutureOrPresent
        LocalDate dtReservaInicio,

        @NotNull
        @Future
        LocalDate dtReservaFim,

        @NotNull
        Long quartoId,

        @NotNull
        Long clienteId

)
{
}
