package br.ufes.inf.SuaPousada.dto.request;

import br.ufes.inf.SuaPousada.domain.Genero;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

public record FuncionarioUpdateRequestDTO(

        @Size(max = 80)
        String nome,

        @CPF
        String cpf,

        LocalDate dtNascimento,

        Genero genero,

        @Email
        String email,

        @Size(max = 11)
        String telefone

)
{
}
