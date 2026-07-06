package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "tb_pagamento")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Pagamento
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MetodoPagamento metodoPagamento;

    @NotNull
    @Column(nullable = false)
    private Double valor;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusPagamento status = StatusPagamento.AGUARDANDO;

}
