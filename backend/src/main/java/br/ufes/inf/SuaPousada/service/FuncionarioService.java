package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.domain.Funcionario;
import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.dto.response.FuncionarioResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.EntidadeConflitoException;
import br.ufes.inf.SuaPousada.repository.FuncionarioRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class FuncionarioService
{
    private final FuncionarioRepository repository;

    public FuncionarioService(FuncionarioRepository repository)
    {
        this.repository = repository;
    }

    public FuncionarioResponseDTO create(FuncionarioCreateRequestDTO request)
    {
        if (repository.existsByCpfOrEmail(request.cpf(), request.email()))
        {
            throw new EntidadeConflitoException("Esse CPF ou Email já foi cadastrado no sistema.");
        }

        if(ChronoUnit.YEARS.between(request.dtNascimento(), LocalDate.now()) < 18)
        {
            throw new EntidadeConflitoException("Funcionário não pode ser menor de idade");
        }

        Funcionario funcionario = toEntity(request);
        repository.save(funcionario);

        return toResponse(funcionario);
    }

    private static Funcionario toEntity(FuncionarioCreateRequestDTO dto)
    {
        return Funcionario.builder()
                .nome(dto.nome())
                .cpf(dto.cpf())
                .dtNascimento(dto.dtNascimento())
                .genero(dto.genero())
                .email(dto.email())
                .telefone(dto.telefone())
                .build();
    }

    private static FuncionarioResponseDTO toResponse(Funcionario funcionario)
    {
        return new FuncionarioResponseDTO(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getCpf(),
                funcionario.getDtNascimento(),
                funcionario.getGenero(),
                funcionario.getEmail(),
                funcionario.getTelefone()
        );
    }
}
