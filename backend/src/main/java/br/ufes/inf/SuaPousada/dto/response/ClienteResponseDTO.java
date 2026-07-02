package br.ufes.inf.SuaPousada.dto.response;

import br.ufes.inf.SuaPousada.domain.Genero;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ClienteResponseDTO(

        Long id,

        String nome,

        String cpf,

        LocalDate dtNascimento,

        Genero genero,

        String email,

        String telefone

) {
}
