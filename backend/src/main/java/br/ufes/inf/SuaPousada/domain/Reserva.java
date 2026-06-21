package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_reserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reserva
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //dtCheckIn e dtCheckOut podem ser nulos pois existe a possibilidade do cliente nao comparecer no dia
    private LocalDateTime dtCheckIn;

    private LocalDateTime dtCheckOut;

    @NotNull
    @Column(nullable = false)
    private Integer qtd_noites;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dtReservaInicio;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime dtReservaFim;
}
