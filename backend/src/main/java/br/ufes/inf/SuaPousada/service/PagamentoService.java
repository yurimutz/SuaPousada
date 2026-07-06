package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Pagamento;
import br.ufes.inf.SuaPousada.dto.request.PagamentoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.PagamentoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.PagamentoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.PagamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PagamentoService
{
    private final PagamentoRepository pagamentoRepository;

    public PagamentoService(PagamentoRepository pagamentoRepository)
    {
        this.pagamentoRepository = pagamentoRepository;
    }

    public PagamentoResponseDTO create(PagamentoCreateRequestDTO requestDTO)
    {
        if(requestDTO.valor() <= 0)
            throw new DataViolationException("Valor do pagamento não pode ser menor ou igual a zero");

        Pagamento pagamento = Pagamento.builder()
                .metodoPagamento(requestDTO.metodoPagamento())
                .valor(requestDTO.valor())
                .status(requestDTO.status())
                .build();

        return toResponse(pagamentoRepository.save(pagamento));
    }

    public PagamentoResponseDTO update(Long id,  PagamentoUpdateRequestDTO requestDTO)
    {
        Pagamento pagamento = pagamentoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado no banco de dados"));

        Pagamento pagamento_atualizado = Pagamento.builder()
                .id(id)
                .metodoPagamento(requestDTO.metodoPagamento() != null ? requestDTO.metodoPagamento() : pagamento.getMetodoPagamento())
                .valor(requestDTO.valor() != null ? requestDTO.valor() : pagamento.getValor())
                .status(requestDTO.status() != null ? requestDTO.status() : pagamento.getStatus())
                .build();

        if(pagamento_atualizado.getValor() <= 0)
            throw new DataViolationException("Valor do pagamento não pode ser menor ou igual a zero");

        return toResponse(pagamentoRepository.save(pagamento_atualizado));

    }

    public PagamentoResponseDTO findById(Long id)
    {
        Pagamento p = pagamentoRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Pagamento não encontrado no banco de dados"));

        return toResponse(p);
    }

    public List<PagamentoResponseDTO> findAll()
    {
        return pagamentoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public PagamentoResponseDTO toResponse(Pagamento pagamento)
    {
        return new PagamentoResponseDTO(
                pagamento.getId(),
                pagamento.getMetodoPagamento(),
                pagamento.getValor(),
                pagamento.getStatus()
        );
    }

}
