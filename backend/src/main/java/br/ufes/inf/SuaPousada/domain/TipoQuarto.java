package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_tipo_quarto")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TipoQuarto
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 50)
    private String nome;

    @NotNull
    @Column(nullable = false)
    private Integer qtdCamasSolteiro;

    @NotNull
    @Column(nullable = false)
    private Integer qtdCamasCasal;

    @NotNull
    @Column(nullable = false)
    private Integer qtdBanheiros;

    @NotNull
    @Column(nullable = false)
    private Double valor_diaria;

    @NotNull
    @Column(nullable = false)
    private boolean existe_ArCondicionado;
}
