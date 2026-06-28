package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ClienteUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.repository.ClienteRepository;
import br.ufes.inf.SuaPousada.repository.PessoaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;


@Service
public class ClienteService
{
    private final ClienteRepository clienteRepository;
    private final PessoaRepository pessoaRepository;

    public ClienteService(ClienteRepository clienteRepository, PessoaRepository pessoaRepository)
    {
        this.clienteRepository = clienteRepository;
        this.pessoaRepository = pessoaRepository;
    }

    public ClienteResponseDTO create(ClienteCreateRequestDTO request_dto) throws DataViolationException
    {
        if (!isOfAge(request_dto.dtNascimento()))
        {
            throw new DataViolationException("Cliente deve ser maior de idade");
        }

        validateCpfAndEmailDuplication(request_dto.cpf(), request_dto.email());

        Cliente cliente = toEntity(request_dto);

        try
        {
            return toResponse(clienteRepository.save(cliente));
        } catch (DataIntegrityViolationException e)
        {
            throw new DataViolationException(e, "Problema ao criar um cliente");
        }

    }

    public ClienteResponseDTO update(long id, ClienteUpdateRequestDTO request_dto) throws EntityNotFoundException, DataViolationException
    {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        Cliente cliente_atualizado = Cliente.builder()
                .id(cliente.getId())
                .nome(request_dto.nome() != null ? request_dto.nome() : cliente.getNome())
                .cpf(request_dto.cpf() != null ? request_dto.cpf() : cliente.getCpf())
                .dtNascimento(request_dto.dtNascimento() != null ? request_dto.dtNascimento() : cliente.getDtNascimento())
                .genero(request_dto.genero() != null ? request_dto.genero() : cliente.getGenero())
                .email(request_dto.email() != null ? request_dto.email() : cliente.getEmail())
                .telefone(request_dto.telefone() != null ? request_dto.telefone() : cliente.getTelefone())
                .build();

        try
        {
            return toResponse(clienteRepository.save(cliente_atualizado));
        } catch (DataIntegrityViolationException e)
        {
            throw new DataViolationException(e, "Problema ao atualizar um cliente");
        }
    }

    // Verificar esse metodo, um cliente pode ser excluido do banco de dados?
    public void delete(long id) throws EntityNotFoundException
    {
        var cliente = clienteRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        clienteRepository.delete(cliente);
    }

    public ClienteResponseDTO findById(Long id)
    {
        var cliente = clienteRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Cliente não encontrado"));

        return toResponse(cliente);
    }

    public List<ClienteResponseDTO> findAll()
    {
        return clienteRepository
                .findAll()
                .stream()
                .map(ClienteService::toResponse)
                .toList();
    }

    private static Cliente toEntity(ClienteCreateRequestDTO dto)
    {
        return Cliente.builder()
                .nome(dto.nome())
                .cpf(dto.cpf())
                .dtNascimento(dto.dtNascimento())
                .genero(dto.genero())
                .email(dto.email())
                .telefone(dto.telefone())
                .build();
    }

    private static ClienteResponseDTO toResponse(Cliente cliente)
    {
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpf(),
                cliente.getDtNascimento(),
                cliente.getGenero(),
                cliente.getEmail(),
                cliente.getTelefone()
        );
    }

    private static boolean isOfAge(LocalDate birthDate)
    {
        return ChronoUnit.YEARS.between(birthDate, LocalDate.now()) >= 18;
    }

    private void validateCpfAndEmailDuplication(String cpf, String email) throws DataViolationException
    {
        if (pessoaRepository.existsByCpfOrEmail(cpf, email))
        {
            throw new DataViolationException("Já existe um usuário com esse email ou CPF cadastrado");
        }
    }
}