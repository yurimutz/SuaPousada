package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ClienteUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.ClienteRepository;
import br.ufes.inf.SuaPousada.repository.PessoaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import br.ufes.inf.SuaPousada.domain.UserRole;

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

    public ClienteResponseDTO create(ClienteCreateRequestDTO request_dto)
    {
        if (!isOfAge(request_dto.dtNascimento()))
        {
            throw new DataViolationException("Cliente deve ser maior de idade");
        }

        if (pessoaRepository.existsByCpfOrEmail(request_dto.cpf(), request_dto.email()))
        {
            throw new DataViolationException("Já existe um usuário com esse email ou CPF cadastrado");
        }

        Cliente cliente = toEntity(request_dto);

        return toResponse(clienteRepository.save(cliente));

    }

    public ClienteResponseDTO update(Long id, ClienteUpdateRequestDTO request_dto)
    {
        Cliente cliente = clienteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        Cliente cliente_atualizado = Cliente.builder()
                .id(cliente.getId())
                .nome(request_dto.nome() != null ? request_dto.nome() : cliente.getNome())
                .cpf(request_dto.cpf() != null ? request_dto.cpf() : cliente.getCpf())
                .dtNascimento(request_dto.dtNascimento() != null ? request_dto.dtNascimento() : cliente.getDtNascimento())
                .genero(request_dto.genero() != null ? request_dto.genero() : cliente.getGenero())
                .email(request_dto.email() != null ? request_dto.email() : cliente.getEmail())
                .telefone(request_dto.telefone() != null ? request_dto.telefone() : cliente.getTelefone())
                .senha(cliente.getSenha())
                .role(cliente.getRole())
                .build();

        if (!isOfAge(cliente_atualizado.getDtNascimento()))
        {
            throw new DataViolationException("Cliente deve ser maior de idade");
        }

        if (pessoaRepository.existsByCpfOrEmailAndIdNot(cliente_atualizado.getCpf(), cliente_atualizado.getEmail(), id))
        {
            throw new DataViolationException("Já existe um usuário com esse email ou CPF cadastrado");
        }

        return toResponse(clienteRepository.save(cliente_atualizado));

    }

    public void delete(Long id)
    {
        Cliente c = clienteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

        clienteRepository.deleteById(id);
    }

    public ClienteResponseDTO findById(Long id)
    {
        var cliente = clienteRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado"));

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
                .senha(new BCryptPasswordEncoder().encode(dto.senha()))
                .role(UserRole.ROLE_CLIENTE)
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


}