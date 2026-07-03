package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Quarto;
import br.ufes.inf.SuaPousada.dto.request.QuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.QuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.QuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.QuartoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuartoService
{
    private final QuartoRepository quartoRepository;

    public QuartoService(QuartoRepository quartoRepository)
    {
        this.quartoRepository = quartoRepository;
    }

    public QuartoResponseDTO create(QuartoCreateRequestDTO request_dto)
    {
        numeroQuartoValidation(request_dto.numero());

        Quarto quarto = toEntity(request_dto);

        return toResponse(quartoRepository.save(quarto));
    }

    public QuartoResponseDTO update(Long id, QuartoUpdateRequestDTO request_dto)
    {
        Quarto quarto = quartoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tipo Quarto não encontrado"));

        Quarto quarto_atualizado = Quarto.builder()
                .id(quarto.getId())
                .numero(request_dto.numero() != null ? request_dto.numero() : quarto.getNumero())
                .andar(request_dto.andar() != null ? request_dto.andar() : quarto.getAndar())
                .tipoQuarto(request_dto.tipoQuarto() != null ? request_dto.tipoQuarto() : quarto.getTipoQuarto())
                .build();

        numeroQuartoValidation(quarto_atualizado.getNumero());

        return toResponse(quartoRepository.save(quarto));
    }

    public void delete(Long id)
    {
        Quarto quarto = quartoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Esse Quarto não foi encontrado"));

        quartoRepository.deleteById(id);
    }

    public QuartoResponseDTO findById(Long id)
    {
        return toResponse(quartoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Esse Quarto não foi encontrado")));
    }

    public List<QuartoResponseDTO> findAll()
    {
        return quartoRepository.findAll()
                .stream()
                .map(QuartoService::toResponse)
                .toList();
    }

    public static Quarto toEntity(QuartoCreateRequestDTO dto)
    {
        return Quarto.builder()
                .numero(dto.numero())
                .andar(dto.andar())
                .tipoQuarto(dto.tipoQuarto())
                .build();
    }

    public static QuartoResponseDTO toResponse(Quarto entity)
    {
        return new QuartoResponseDTO(
                entity.getId(),
                entity.getNumero(),
                entity.getAndar(),
                entity.getTipoQuarto()
        );
    }

    private void numeroQuartoValidation(Integer numeroQuarto)
    {
        if (quartoRepository.existsByNumero(numeroQuarto))
            throw new DataViolationException("Já existe um Quarto cadastrado com este numero");
    }
}
