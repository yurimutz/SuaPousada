package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.TipoQuartoResponseDTO;
import br.ufes.inf.SuaPousada.repository.TipoQuartoRepository;
import org.springframework.stereotype.Service;

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
        TipoQuarto tipoQuarto = toEntity(request_dto);

        return toResponse(tipoQuartoRepository.save(tipoQuarto));
    }

    public TipoQuarto toEntity(TipoQuartoCreateRequestDTO dto)
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

    public TipoQuartoResponseDTO toResponse(TipoQuarto entity)
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
