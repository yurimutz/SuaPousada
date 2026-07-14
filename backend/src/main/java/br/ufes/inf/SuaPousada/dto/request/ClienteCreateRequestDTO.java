package br.ufes.inf.SuaPousada.dto.request;

import br.ufes.inf.SuaPousada.domain.Genero;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record ClienteCreateRequestDTO(

        @NotBlank
        @Size(max = 80)
        String nome,

        @NotBlank
        @CPF
        String cpf,

        @NotNull
        LocalDate dtNascimento,

        @NotNull
        Genero genero,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Size(max = 11)
        String telefone,

        @NotBlank
        @Size(min = 6)
        String senha

){ }
