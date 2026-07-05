package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Funcionario;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.FuncionarioResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.FuncionarioRepository;
import br.ufes.inf.SuaPousada.repository.PessoaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class FuncionarioService
{
    private final FuncionarioRepository funcionarioRepository;
    private final PessoaRepository pessoaRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository, PessoaRepository pessoaRepository)
    {
        this.funcionarioRepository = funcionarioRepository;
        this.pessoaRepository = pessoaRepository;
    }

    // VERIFICAR ESSE METODO TAMBEM
    public FuncionarioResponseDTO create(FuncionarioCreateRequestDTO request_dto)
    {
        if (!isOfAge(request_dto.dtNascimento()))
        {
            throw new DataViolationException("Funcionário deve ser maior de idade");
        }

        if (pessoaRepository.existsByCpfOrEmail(request_dto.cpf(), request_dto.email()))
        {
            throw new DataViolationException("Já existe um funcionário com esse email ou CPF cadastrado");
        }

        Funcionario funcionario = toEntity(request_dto);

        return toResponse(funcionarioRepository.save(funcionario));

    }

    // ANALISAR ESSE METODO AQUI E O DTO DO FUNCIONARIO UPDATE REQUEST
    public FuncionarioResponseDTO update(Long id, FuncionarioUpdateRequestDTO request_dto)
    {
        Funcionario funcionario = funcionarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        Funcionario funcionario_atualizado = Funcionario.builder()
                .id(funcionario.getId())
                .nome(request_dto.nome() != null ? request_dto.nome() : funcionario.getNome())
                .cpf(request_dto.cpf() != null ? request_dto.cpf() : funcionario.getCpf())
                .dtNascimento(request_dto.dtNascimento() != null ? request_dto.dtNascimento() : funcionario.getDtNascimento())
                .genero(request_dto.genero() != null ? request_dto.genero() : funcionario.getGenero())
                .email(request_dto.email() != null ? request_dto.email() : funcionario.getEmail())
                .telefone(request_dto.telefone() != null ? request_dto.telefone() : funcionario.getTelefone())
                .build();

        if (!isOfAge(funcionario_atualizado.getDtNascimento()))
        {
            throw new DataViolationException("Funcionário deve ser maior de idade");
        }

        if (pessoaRepository.existsByCpfOrEmailAndIdNot(funcionario_atualizado.getCpf(), funcionario_atualizado.getEmail(), id))
        {
            throw new DataViolationException("Já existe um funcionário com esse email ou CPF cadastrado");
        }

        return toResponse(funcionarioRepository.save(funcionario_atualizado));

    }

    public void delete(Long id)
    {
        if(!funcionarioRepository.existsById(id))
        {
            throw new ResourceNotFoundException("Funcionário não encontrado");
        }

        funcionarioRepository.deleteById(id);
    }

    public FuncionarioResponseDTO findById(Long id)
    {
        Funcionario funcionario = funcionarioRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado"));

        return toResponse(funcionario);
    }

    public List<FuncionarioResponseDTO> findAll()
    {
        return funcionarioRepository
                .findAll()
                .stream()
                .map(FuncionarioService::toResponse)
                .toList();
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

    private static boolean isOfAge(LocalDate birthDate)
    {
        return ChronoUnit.YEARS.between(birthDate, LocalDate.now()) >= 18;
    }
}
