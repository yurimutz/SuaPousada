package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.EntidadeConflitoException;
import br.ufes.inf.SuaPousada.repository.ClienteRepository;
import org.springframework.stereotype.Service;

@Service
public class ClienteService
{
    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository)
    {
        this.repository = repository;
    }

    public ClienteResponseDTO create(ClienteCreateRequestDTO request)
    {
        if (repository.existsByCpfOrEmail(request.cpf(), request.email()))
        {
            throw new EntidadeConflitoException("Esse CPF ou Email já foram cadastrados no sistema.");
        }

        Cliente cliente = toEntity(request);
        repository.save(cliente);

        return toResponse(cliente);
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
}