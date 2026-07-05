package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.TipoQuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.TipoQuartoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoQuartoService
{
    private final TipoQuartoRepository tipoQuartoRepository;

    public TipoQuartoService(TipoQuartoRepository tipoQuartoRepository)
    {
        this.tipoQuartoRepository = tipoQuartoRepository;
    }

    public TipoQuartoResponseDTO create(TipoQuartoCreateRequestDTO request_dto)
    {
        if (tipoQuartoRepository.existsByNome(request_dto.nome()))
            throw new DataViolationException("Já existe um tipo de quarto cadastrado com esse nome.");

        TipoQuarto tipoQuarto = toEntity(request_dto);

        return toResponse(tipoQuartoRepository.save(tipoQuarto));
    }

    public TipoQuartoResponseDTO update(Long id, TipoQuartoUpdateRequestDTO request_dto)
    {
        TipoQuarto tipoQuarto = tipoQuartoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tipo Quarto não encontrado"));

        if (request_dto.nome() != null)
        {
            if (tipoQuartoRepository.existsByNomeAndIdNot(request_dto.nome(), id))
                throw new DataViolationException("Já existe um tipo de quarto cadastrado com esse nome.");
        }

        TipoQuarto tipoQuarto_atualizado = TipoQuarto.builder()
                .id(tipoQuarto.getId())
                .nome(request_dto.nome() != null ? request_dto.nome() : tipoQuarto.getNome())
                .qtdCamasSolteiro(request_dto.qtdCamasSolteiro() != null ? request_dto.qtdCamasSolteiro() : tipoQuarto.getQtdCamasSolteiro())
                .qtdCamasCasal(request_dto.qtdCamasCasal() != null ? request_dto.qtdCamasCasal() : tipoQuarto.getQtdCamasCasal())
                .qtdBanheiros(request_dto.qtdBanheiros() != null ? request_dto.qtdBanheiros() : tipoQuarto.getQtdBanheiros())
                .valor_diaria(request_dto.valor_diaria() != null ? request_dto.valor_diaria() : tipoQuarto.getValor_diaria())
                .existe_ArCondicionado(request_dto.existe_ArCondicionado() != null ? request_dto.existe_ArCondicionado() : tipoQuarto.getExiste_ArCondicionado())
                .build();

        return toResponse(tipoQuartoRepository.save(tipoQuarto_atualizado));
    }

    public void delete(Long id)
    {
        TipoQuarto tipoQuarto = tipoQuartoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Esse TipoQuarto não foi encontrado"));

        tipoQuartoRepository.deleteById(id);
    }

    public TipoQuartoResponseDTO findById(Long id)
    {
        return toResponse(tipoQuartoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Esse TipoQuarto não foi encontrado")));
    }

    public List<TipoQuartoResponseDTO> findAll()
    {
        return tipoQuartoRepository.findAll()
                .stream()
                .map(TipoQuartoService::toResponse)
                .toList();
    }

    public static TipoQuarto toEntity(TipoQuartoCreateRequestDTO dto)
    {
        return TipoQuarto.builder()
                .nome(dto.nome())
                .qtdCamasSolteiro(dto.qtdCamasSolteiro())
                .qtdCamasCasal(dto.qtdCamasCasal())
                .qtdBanheiros(dto.qtdBanheiros())
                .valor_diaria(dto.valor_diaria())
                .existe_ArCondicionado(dto.existe_ArCondicionado())
                .build();
    }

    public static TipoQuartoResponseDTO toResponse(TipoQuarto entity)
    {
        return new TipoQuartoResponseDTO(
                entity.getId(),
                entity.getNome(),
                entity.getQtdCamasSolteiro(),
                entity.getQtdCamasCasal(),
                entity.getQtdBanheiros(),
                entity.getValor_diaria(),
                entity.getExiste_ArCondicionado()
        );
    }
}
