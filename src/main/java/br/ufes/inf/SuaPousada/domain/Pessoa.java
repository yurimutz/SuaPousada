package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
public abstract class Pessoa
{
    @NotNull
    private String nome;

    @NotNull
    @Column(unique = true)
    private String cpf;

    @NotNull
    private LocalDate dtNascimento;

    private Genero genero;

    @NotNull
    @Column(unique = true)
    private String email;

    @NotNull
    private String telefone;
}
