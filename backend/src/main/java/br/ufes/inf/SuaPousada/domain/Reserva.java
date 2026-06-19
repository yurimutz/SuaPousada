package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_reserva")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Reserva
{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dtCheckIn;

    private LocalDateTime dtCheckOut;

    @NotNull
    private int qtdNoites;

    private LocalDateTime dtReservaInicio;

    private LocalDateTime dtReservaFim;

}
