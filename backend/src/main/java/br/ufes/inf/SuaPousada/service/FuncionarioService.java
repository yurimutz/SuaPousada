package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Funcionario;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.FuncionarioResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
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

    public FuncionarioResponseDTO create(FuncionarioCreateRequestDTO request_dto) throws DataViolationException
    {
        if (!isOfAge(request_dto.dtNascimento()))
        {
            throw new DataViolationException("Funcionario deve ser maior de idade");
        }

        validateCpfAndEmailDuplication(request_dto.cpf(), request_dto.email());

        Funcionario funcionario = toEntity(request_dto);

        try
        {
            return toResponse(funcionarioRepository.save(funcionario));
        } catch (DataIntegrityViolationException e)
        {
            throw new DataViolationException(e, "Problema ao criar um funcionario");
        }

    }

    public FuncionarioResponseDTO update(long id, FuncionarioUpdateRequestDTO request_dto) throws EntityNotFoundException, DataViolationException
    {
        Funcionario funcionario = funcionarioRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Funcionario não encontrado"));

        Funcionario funcionario_atualizado = Funcionario.builder()
                .id(funcionario.getId())
                .nome(request_dto.nome() != null ? request_dto.nome() : funcionario.getNome())
                .cpf(request_dto.cpf() != null ? request_dto.cpf() : funcionario.getCpf())
                .dtNascimento(request_dto.dtNascimento() != null ? request_dto.dtNascimento() : funcionario.getDtNascimento())
                .genero(request_dto.genero() != null ? request_dto.genero() : funcionario.getGenero())
                .email(request_dto.email() != null ? request_dto.email() : funcionario.getEmail())
                .telefone(request_dto.telefone() != null ? request_dto.telefone() : funcionario.getTelefone())
                .build();

        try
        {
            return toResponse(funcionarioRepository.save(funcionario_atualizado));
        } catch (DataIntegrityViolationException e)
        {
            throw new DataViolationException(e, "Problema ao atualizar um funcionario");
        }
    }

    public void desligaFuncionario(long id) throws EntityNotFoundException
    {
        Funcionario funcionario = funcionarioRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Funcionario não encontrado"));

        funcionario.setDataDesligamento(LocalDate.now());
        funcionario.setAtivo(false);

        try
        {
            funcionarioRepository.save(funcionario);
        } catch (DataIntegrityViolationException e)
        {
            throw new DataViolationException(e, "Problema ao desligar um funcionario");
        }
    }

    public void activateFuncionario(long id) throws EntityNotFoundException
    {
        Funcionario funcionario = funcionarioRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Funcionario não encontrado"));

        funcionario.setDataDesligamento(null);
        funcionario.setAtivo(true);

        try
        {
            funcionarioRepository.save(funcionario);
        } catch (DataIntegrityViolationException e)
        {
            throw new DataViolationException(e, "Problema ao ativar um funcionario");
        }
    }

    public FuncionarioResponseDTO findById(Long id)
    {
        Funcionario funcionario = funcionarioRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Funcionario não encontrado"));

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

    public List<FuncionarioResponseDTO> findAllAtivos()
    {
        return funcionarioRepository
                .buscarTodosAtivos()
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
                funcionario.getTelefone(),
                funcionario.getAtivo(),
                funcionario.getDataDesligamento()
        );
    }

    private static boolean isOfAge(LocalDate birthDate)
    {
        return ChronoUnit.YEARS.between(birthDate, LocalDate.now()) >= 18;
    }

    private static boolean isEmployed(Funcionario f)
    {
        return f.getAtivo();
    }

    private void validateCpfAndEmailDuplication(String cpf, String email) throws DataViolationException
    {
        if (pessoaRepository.existsByCpfOrEmail(cpf, email))
        {
            throw new DataViolationException("Já existe um usuário com esse email ou CPF cadastrado");
        }
    }
}
