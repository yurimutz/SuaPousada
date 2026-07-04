package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_reserva")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reserva
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //dtCheckIn e dtCheckOut podem ser nulos pois sao realizados muito tempo depois da criacao de uma reserva
    private LocalDateTime dtCheckIn;

    private LocalDateTime dtCheckOut;

    private Integer qtd_noites;

    @NotNull
    @Column(nullable = false)
    private LocalDate dtReservaInicio;

    @NotNull
    @Column(nullable = false)
    private LocalDate dtReservaFim;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "id_quarto", nullable = false)
    private Quarto quarto;

    @OneToOne
    @JoinColumn(name = "id_pagamento")
    // Pode ser nulo pois na hora de reservar um quarto o pagamento nao precisa ser realizado
    private Pagamento pagamento;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;
}
