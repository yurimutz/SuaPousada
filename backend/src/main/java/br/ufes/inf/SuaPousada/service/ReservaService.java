package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.domain.Quarto;
import br.ufes.inf.SuaPousada.domain.Reserva;
import br.ufes.inf.SuaPousada.domain.Pagamento;
import br.ufes.inf.SuaPousada.dto.request.ReservaCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ReservaUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.QuartoResponseDTO;
import br.ufes.inf.SuaPousada.dto.response.ReservaResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.ClienteRepository;
import br.ufes.inf.SuaPousada.repository.PagamentoRepository;
import br.ufes.inf.SuaPousada.repository.QuartoRepository;
import br.ufes.inf.SuaPousada.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ReservaService
{
    private final ReservaRepository reservaRepository;
    private final QuartoRepository quartoRepository;
    private final ClienteRepository clienteRepository;
    private final PagamentoRepository pagamentoRepository;

    public ReservaService(ReservaRepository reservaRepository, QuartoRepository quartoRepository, ClienteRepository clienteRepository, PagamentoRepository pagamentoRepository)
    {
        this.reservaRepository = reservaRepository;
        this.quartoRepository = quartoRepository;
        this.clienteRepository = clienteRepository;
        this.pagamentoRepository = pagamentoRepository;
    }

    public ReservaResponseDTO create(ReservaCreateRequestDTO request_dto)
    {
        if (request_dto.dtReservaInicio().isAfter(request_dto.dtReservaFim()))
        {
            throw new DataViolationException("A data de início deve ser anterior à data de fim da reserva.");
        }

        boolean isOverlapping = reservaRepository.existsOverlappingReserva(
                request_dto.quartoId(),
                request_dto.dtReservaInicio(),
                request_dto.dtReservaFim()
        );

        if (isOverlapping)
        {
            throw new DataViolationException("O quarto não está disponível no período selecionado.");
        }

        Quarto quarto = quartoRepository.findById(request_dto.quartoId())
                .orElseThrow(() -> new DataViolationException("Quarto não encontrado."));

        Cliente cliente = clienteRepository.findById(request_dto.clienteId())
                .orElseThrow(() -> new DataViolationException("Cliente não encontrado."));

        int qtdNoites = (int) ChronoUnit.DAYS.between(request_dto.dtReservaInicio(), request_dto.dtReservaFim());

        Reserva reserva = Reserva.builder()
                .dtReservaInicio(request_dto.dtReservaInicio())
                .dtReservaFim(request_dto.dtReservaFim())
                .quarto(quarto)
                .cliente(cliente)
                .qtd_noites(qtdNoites > 0 ? qtdNoites : 1) // Garante pelo menos 1 noite se for o mesmo dia
                .build();

        reserva = reservaRepository.save(reserva);

        return toResponse(reserva);
    }

    public ReservaResponseDTO update(Long id, ReservaUpdateRequestDTO request_dto)
    {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new DataViolationException("Reserva não encontrada."));

        LocalDate dtInicio = request_dto.dtReservaInicio() != null ? request_dto.dtReservaInicio() : reserva.getDtReservaInicio();
        LocalDate dtFim = request_dto.dtReservaFim() != null ? request_dto.dtReservaFim() : reserva.getDtReservaFim();
        Long quartoId = request_dto.quartoId() != null ? request_dto.quartoId() : reserva.getQuarto().getId();

        if (dtInicio.isAfter(dtFim))
        {
            throw new DataViolationException("A data de início deve ser anterior à data de fim da reserva.");
        }

        boolean isOverlapping = reservaRepository.existsOverlappingReservaIgnoringId(
                quartoId,
                dtInicio,
                dtFim,
                id
        );

        if (isOverlapping)
        {
            throw new DataViolationException("O quarto não está disponível no período selecionado.");
        }

        if (request_dto.dtReservaInicio() != null) reserva.setDtReservaInicio(request_dto.dtReservaInicio());
        if (request_dto.dtReservaFim() != null) reserva.setDtReservaFim(request_dto.dtReservaFim());

        if (request_dto.dtCheckIn() != null) reserva.setDtCheckIn(request_dto.dtCheckIn());
        if (request_dto.dtCheckOut() != null) reserva.setDtCheckOut(request_dto.dtCheckOut());

        if (request_dto.quartoId() != null)
        {
            Quarto quarto = quartoRepository.findById(request_dto.quartoId())
                    .orElseThrow(() -> new DataViolationException("Quarto não encontrado."));
            reserva.setQuarto(quarto);
        }

        if (request_dto.clienteId() != null)
        {
            Cliente cliente = clienteRepository.findById(request_dto.clienteId())
                    .orElseThrow(() -> new DataViolationException("Cliente não encontrado."));
            reserva.setCliente(cliente);
        }

        if (request_dto.pagamentoId() != null)
        {
            Pagamento pagamento = pagamentoRepository.findById(request_dto.pagamentoId())
                    .orElseThrow(() -> new DataViolationException("Pagamento não encontrado."));
            reserva.setPagamento(pagamento);
        }

        int qtdNoites = (int) ChronoUnit.DAYS.between(reserva.getDtReservaInicio(), reserva.getDtReservaFim());
        reserva.setQtd_noites(qtdNoites > 0 ? qtdNoites : 1);

        reserva = reservaRepository.save(reserva);

        return toResponse(reserva);
    }

    public void delete(Long id)
    {
        Reserva r = reservaRepository.findById(id)
                .orElseThrow(() -> new DataViolationException("Reserva não encontrada."));

        reservaRepository.deleteById(id);
    }

    private static ReservaResponseDTO toResponse(Reserva entity)
    {
        return new ReservaResponseDTO(
                entity.getId(),
                entity.getDtCheckIn(),
                entity.getDtCheckOut(),
                entity.getDtReservaInicio(),
                entity.getDtReservaFim(),
                entity.getQtd_noites(),
                entity.getQuarto(),
                entity.getPagamento(),
                entity.getCliente()
        );
    }

    public ReservaResponseDTO findById(Long id)
    {
        Reserva r = reservaRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada"));
        return toResponse(r);
    }

    public List<ReservaResponseDTO> findAllReservasFromCliente(Long idCliente)
    {
        return reservaRepository.findAllByClienteIdOrderByDtReservaInicioAsc(idCliente)
                .stream()
                .map(ReservaService::toResponse)
                .toList();
    }

    public List<ReservaResponseDTO> findAllReservasFromQuarto(Long idQuarto)
    {
        return reservaRepository.findAllByQuartoId(idQuarto)
                .stream()
                .map(ReservaService::toResponse)
                .toList();
    }

    public List<ReservaResponseDTO> findAllReservasFromPeriodo(LocalDate inicio, LocalDate fim)
    {
        return reservaRepository.findReservasByPeriodo(inicio, fim)
                .stream()
                .map(ReservaService::toResponse)
                .toList();
    }

    public List<QuartoResponseDTO> findQuartosDisponiveis(LocalDate inicio, LocalDate fim)
    {
        if (inicio.isAfter(fim))
        {
            throw new DataViolationException("A data de início deve ser anterior à data de fim.");
        }

        return quartoRepository.findQuartosDisponiveisNoPeriodo(inicio, fim)
                .stream()
                .map(QuartoService::toResponse)
                .toList();
    }
}
