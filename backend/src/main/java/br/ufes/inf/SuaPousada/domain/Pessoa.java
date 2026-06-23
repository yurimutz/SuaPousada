package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

@Entity
@Table(name = "tb_pessoa")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public abstract class Pessoa
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String nome;

    @NotBlank
    @CPF
    @Column(nullable = false, length = 12)
    private String cpf;

    @NotNull
    @Column(nullable = false)
    private LocalDate dtNascimento;

    @NotNull
    @Column(nullable = false)
    private Genero genero;

    @NotBlank
    @Email
    @Column(nullable = false)
    private String email;

    @NotBlank
    @Size(max = 11)
    @Column(nullable = false, length = 11)
    private String telefone;
}
