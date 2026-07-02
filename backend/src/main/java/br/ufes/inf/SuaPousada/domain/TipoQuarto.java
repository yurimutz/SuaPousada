package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Entity
@Table(name = "tb_tipo_quarto")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TipoQuarto
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nome;

    @NotNull
    @PositiveOrZero(message = "A quantidade de camas de solteiro não pode ser negativa")
    @Column(nullable = false)
    private Integer qtdCamasSolteiro;

    @NotNull
    @PositiveOrZero(message = "A quantidade de camas de casal não pode ser negativa")
    @Column(nullable = false)
    private Integer qtdCamasCasal;

    @NotNull
    @PositiveOrZero(message = "A quantidade de banheiros não pode ser negativa")
    @Column(nullable = false)
    private Integer qtdBanheiros;

    @NotNull
    @Positive(message = "Valor da diária deve ser maior que zero")
    @Column(nullable = false)
    private Double valor_diaria;

    @NotNull
    @Column(nullable = false)
    private Boolean existe_ArCondicionado;
}
