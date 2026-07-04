package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Quarto;
import br.ufes.inf.SuaPousada.dto.request.QuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.QuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.QuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.QuartoRepository;
import br.ufes.inf.SuaPousada.repository.TipoQuartoRepository;
import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuartoService
{
    private final QuartoRepository quartoRepository;
    private final TipoQuartoRepository tipoQuartoRepository;

    public QuartoService(QuartoRepository quartoRepository, TipoQuartoRepository tipoQuartoRepository)
    {
        this.quartoRepository = quartoRepository;
        this.tipoQuartoRepository = tipoQuartoRepository;
    }

    public QuartoResponseDTO create(QuartoCreateRequestDTO request_dto)
    {
        if (quartoRepository.existsByNumero(request_dto.numero()))
            throw new DataViolationException("Já existe um Quarto cadastrado com este numero");

        // Busca o TipoQuarto completo no banco de dados a partir do ID fornecido
        TipoQuarto tipoQuarto = tipoQuartoRepository.findById(request_dto.tipoQuartoId())
                .orElseThrow(() -> new ResourceNotFoundException("Tipo de Quarto não encontrado"));

        Quarto quarto = Quarto.builder()
                .numero(request_dto.numero())
                .andar(request_dto.andar())
                .tipoQuarto(tipoQuarto)
                .build();

        return toResponse(quartoRepository.save(quarto));
    }

    public QuartoResponseDTO update(Long id, QuartoUpdateRequestDTO request_dto)
    {
        Quarto quarto = quartoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Quarto não encontrado"));

        // Se um novo tipoQuartoId for fornecido, busca ele completo; senão, mantém o atual
        TipoQuarto tipoQuarto = quarto.getTipoQuarto();
        if (request_dto.tipoQuartoId() != null) {
            tipoQuarto = tipoQuartoRepository.findById(request_dto.tipoQuartoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tipo de Quarto não encontrado"));
        }

        Quarto quarto_atualizado = Quarto.builder()
                .id(quarto.getId())
                .numero(request_dto.numero() != null ? request_dto.numero() : quarto.getNumero())
                .andar(request_dto.andar() != null ? request_dto.andar() : quarto.getAndar())
                .tipoQuarto(tipoQuarto)
                .build();

        if(quartoRepository.existsByNumeroAndIdNot(quarto_atualizado.getNumero(), id))
        {
            throw new DataViolationException("Já existe um Quarto cadastrado com este numero");
        }

        return toResponse(quartoRepository.save(quarto_atualizado));
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
