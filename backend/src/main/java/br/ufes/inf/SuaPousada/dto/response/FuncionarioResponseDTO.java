package br.ufes.inf.SuaPousada.dto.response;

import br.ufes.inf.SuaPousada.domain.Genero;

import java.time.LocalDate;

public record FuncionarioResponseDTO(

        Long id,

        String nome,

        String cpf,

        LocalDate dtNascimento,

        Genero genero,

        String email,

        String telefone

        )
{
}
