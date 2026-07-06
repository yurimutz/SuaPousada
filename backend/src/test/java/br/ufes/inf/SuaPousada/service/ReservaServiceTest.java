package br.ufes.inf.SuaPousada.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.domain.Quarto;
import br.ufes.inf.SuaPousada.domain.Reserva;
import br.ufes.inf.SuaPousada.domain.Pagamento;
import br.ufes.inf.SuaPousada.dto.request.ReservaCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ReservaUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ReservaResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.ClienteRepository;
import br.ufes.inf.SuaPousada.repository.PagamentoRepository;
import br.ufes.inf.SuaPousada.repository.QuartoRepository;
import br.ufes.inf.SuaPousada.repository.ReservaRepository;

@ExtendWith(MockitoExtension.class)
public class ReservaServiceTest {

    @InjectMocks
    private ReservaService reservaService;

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private QuartoRepository quartoRepository;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private PagamentoRepository pagamentoRepository;

    @Test
    void deveCriarReservaComSucesso() {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);

        Quarto quarto = Quarto.builder().id(1L).numero(101).build();
        Cliente cliente = Cliente.builder().id(1L).nome("Yuri").build();
        Reserva reservaSalva = Reserva.builder()
                .id(1L)
                .dtReservaInicio(inicio)
                .dtReservaFim(fim)
                .quarto(quarto)
                .cliente(cliente)
                .qtd_noites(3)
                .build();

        when(reservaRepository.existsOverlappingReserva(1L, inicio, fim)).thenReturn(false);
        when(quartoRepository.findById(1L)).thenReturn(Optional.of(quarto));
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));
        when(reservaRepository.save(any(Reserva.class))).thenReturn(reservaSalva);

        ReservaResponseDTO response = reservaService.create(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(inicio, response.dtReservaInicio());
        assertEquals(fim, response.dtReservaFim());
        assertEquals(3, response.qtd_noites());
        assertEquals(quarto, response.quarto());
        assertEquals(cliente, response.cliente());

        verify(reservaRepository, times(1)).save(any(Reserva.class));
    }

    @Test
    void deveLancarExcecaoQuandoCriarReservaComDataInicioDepoisDeFim() {
        LocalDate inicio = LocalDate.now().plusDays(5);
        LocalDate fim = LocalDate.now().plusDays(2);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.create(request);
        });

        assertEquals("A data de início deve ser anterior à data de fim da reserva.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoCriarReservaComQuartoIndisponivel() {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);

        when(reservaRepository.existsOverlappingReserva(1L, inicio, fim)).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.create(request);
        });

        assertEquals("O quarto não está disponível no período selecionado.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoCriarReservaComQuartoInexistente() {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);

        when(reservaRepository.existsOverlappingReserva(1L, inicio, fim)).thenReturn(false);
        when(quartoRepository.findById(1L)).thenReturn(Optional.empty());

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.create(request);
        });

        assertEquals("Quarto não encontrado.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoCriarReservaComClienteInexistente() {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);

        Quarto quarto = Quarto.builder().id(1L).numero(101).build();

        when(reservaRepository.existsOverlappingReserva(1L, inicio, fim)).thenReturn(false);
        when(quartoRepository.findById(1L)).thenReturn(Optional.of(quarto));
        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.create(request);
        });

        assertEquals("Cliente não encontrado.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveBuscarReservaPorIdComSucesso() {
        Quarto quarto = Quarto.builder().id(1L).numero(101).build();
        Cliente cliente = Cliente.builder().id(1L).nome("Yuri").build();
        Reserva reserva = Reserva.builder()
                .id(1L)
                .dtReservaInicio(LocalDate.now().plusDays(1))
                .dtReservaFim(LocalDate.now().plusDays(2))
                .quarto(quarto)
                .cliente(cliente)
                .build();

        when(reservaRepository.findById(1L)).thenReturn(Optional.of(reserva));

        ReservaResponseDTO response = reservaService.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(quarto, response.quarto());
        assertEquals(cliente, response.cliente());
    }

    @Test
    void deveLancarExcecaoQuandoBuscarReservaInexistente() {
        when(reservaRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            reservaService.findById(99L);
        });

        assertEquals("Reserva não encontrada", excecao.getMessage());
    }

    @Test
    void deveAtualizarReservaComSucessoTotal() {
        Long id = 1L;
        LocalDate originalInicio = LocalDate.now().plusDays(1);
        LocalDate originalFim = LocalDate.now().plusDays(2);
        Quarto originalQuarto = Quarto.builder().id(1L).build();
        Cliente originalCliente = Cliente.builder().id(1L).build();

        Reserva reservaExistente = Reserva.builder()
                .id(id)
                .dtReservaInicio(originalInicio)
                .dtReservaFim(originalFim)
                .quarto(originalQuarto)
                .cliente(originalCliente)
                .build();

        LocalDate novoInicio = LocalDate.now().plusDays(3);
        LocalDate novoFim = LocalDate.now().plusDays(6);
        LocalDateTime checkIn = LocalDateTime.now().plusDays(3).plusHours(14);
        LocalDateTime checkOut = LocalDateTime.now().plusDays(6).plusHours(12);
        Quarto novoQuarto = Quarto.builder().id(2L).build();
        Cliente novoCliente = Cliente.builder().id(2L).build();
        Pagamento pagamento = Pagamento.builder().id(10L).build();

        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(
                checkIn, checkOut, novoInicio, novoFim, 2L, 10L, 2L
        );

        when(reservaRepository.findById(id)).thenReturn(Optional.of(reservaExistente));
        when(reservaRepository.existsOverlappingReservaIgnoringId(2L, novoInicio, novoFim, id)).thenReturn(false);
        when(quartoRepository.findById(2L)).thenReturn(Optional.of(novoQuarto));
        when(clienteRepository.findById(2L)).thenReturn(Optional.of(novoCliente));
        when(pagamentoRepository.findById(10L)).thenReturn(Optional.of(pagamento));
        when(reservaRepository.save(any(Reserva.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReservaResponseDTO response = reservaService.update(id, request);

        assertNotNull(response);
        assertEquals(novoInicio, response.dtReservaInicio());
        assertEquals(novoFim, response.dtReservaFim());
        assertEquals(3, response.qtd_noites());
        assertEquals(novoQuarto, response.quarto());
        assertEquals(novoCliente, response.cliente());
        assertEquals(pagamento, response.pagamento());
        assertEquals(checkIn, response.dtCheckIn());
        assertEquals(checkOut, response.dtCheckOut());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarReservaInexistente() {
        Long id = 99L;
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(
                null, null, null, null, null, null, null
        );

        when(reservaRepository.findById(id)).thenReturn(Optional.empty());

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.update(id, request);
        });

        assertEquals("Reserva não encontrada.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarReservaComDataInicioDepoisDeFim() {
        Long id = 1L;
        Reserva reservaExistente = Reserva.builder()
                .id(id)
                .dtReservaInicio(LocalDate.now().plusDays(1))
                .dtReservaFim(LocalDate.now().plusDays(2))
                .quarto(Quarto.builder().id(1L).build())
                .build();

        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(
                null, null, LocalDate.now().plusDays(5), LocalDate.now().plusDays(2), null, null, null
        );

        when(reservaRepository.findById(id)).thenReturn(Optional.of(reservaExistente));

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.update(id, request);
        });

        assertEquals("A data de início deve ser anterior à data de fim da reserva.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarReservaComQuartoIndisponivel() {
        Long id = 1L;
        Reserva reservaExistente = Reserva.builder()
                .id(id)
                .dtReservaInicio(LocalDate.now().plusDays(1))
                .dtReservaFim(LocalDate.now().plusDays(2))
                .quarto(Quarto.builder().id(1L).build())
                .build();

        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(
                null, null, LocalDate.now().plusDays(2), LocalDate.now().plusDays(5), null, null, null
        );

        when(reservaRepository.findById(id)).thenReturn(Optional.of(reservaExistente));
        when(reservaRepository.existsOverlappingReservaIgnoringId(1L, LocalDate.now().plusDays(2), LocalDate.now().plusDays(5), id)).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.update(id, request);
        });

        assertEquals("O quarto não está disponível no período selecionado.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarReservaComQuartoInexistente() {
        Long id = 1L;
        Reserva reservaExistente = Reserva.builder()
                .id(id)
                .dtReservaInicio(LocalDate.now().plusDays(1))
                .dtReservaFim(LocalDate.now().plusDays(2))
                .quarto(Quarto.builder().id(1L).build())
                .build();

        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(
                null, null, null, null, 2L, null, null
        );

        when(reservaRepository.findById(id)).thenReturn(Optional.of(reservaExistente));
        when(reservaRepository.existsOverlappingReservaIgnoringId(2L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(2), id)).thenReturn(false);
        when(quartoRepository.findById(2L)).thenReturn(Optional.empty());

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.update(id, request);
        });

        assertEquals("Quarto não encontrado.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarReservaComClienteInexistente() {
        Long id = 1L;
        Reserva reservaExistente = Reserva.builder()
                .id(id)
                .dtReservaInicio(LocalDate.now().plusDays(1))
                .dtReservaFim(LocalDate.now().plusDays(2))
                .quarto(Quarto.builder().id(1L).build())
                .build();

        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(
                null, null, null, null, null, null, 2L
        );

        when(reservaRepository.findById(id)).thenReturn(Optional.of(reservaExistente));
        when(reservaRepository.existsOverlappingReservaIgnoringId(1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(2), id)).thenReturn(false);
        when(clienteRepository.findById(2L)).thenReturn(Optional.empty());

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.update(id, request);
        });

        assertEquals("Cliente não encontrado.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarReservaComPagamentoInexistente() {
        Long id = 1L;
        Reserva reservaExistente = Reserva.builder()
                .id(id)
                .dtReservaInicio(LocalDate.now().plusDays(1))
                .dtReservaFim(LocalDate.now().plusDays(2))
                .quarto(Quarto.builder().id(1L).build())
                .build();

        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(
                null, null, null, null, null, 10L, null
        );

        when(reservaRepository.findById(id)).thenReturn(Optional.of(reservaExistente));
        when(reservaRepository.existsOverlappingReservaIgnoringId(1L, LocalDate.now().plusDays(1), LocalDate.now().plusDays(2), id)).thenReturn(false);
        when(pagamentoRepository.findById(10L)).thenReturn(Optional.empty());

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            reservaService.update(id, request);
        });

        assertEquals("Pagamento não encontrado.", excecao.getMessage());
        verify(reservaRepository, never()).save(any());
    }

    @Test
    void deveRetornarTodasReservasDeUmCliente() {
        Cliente cliente = Cliente.builder().id(1L).build();
        Reserva r1 = Reserva.builder().id(1L).cliente(cliente).quarto(Quarto.builder().build()).build();
        Reserva r2 = Reserva.builder().id(2L).cliente(cliente).quarto(Quarto.builder().build()).build();

        when(reservaRepository.findAllByClienteId(1L)).thenReturn(List.of(r1, r2));

        List<ReservaResponseDTO> response = reservaService.findAllReservasFromCliente(1L);

        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals(1L, response.get(0).id());
        assertEquals(2L, response.get(1).id());
    }

    @Test
    void deveRetornarTodasReservasDeUmQuarto() {
        Quarto quarto = Quarto.builder().id(1L).build();
        Reserva r1 = Reserva.builder().id(1L).quarto(quarto).cliente(Cliente.builder().build()).build();
        Reserva r2 = Reserva.builder().id(2L).quarto(quarto).cliente(Cliente.builder().build()).build();

        when(reservaRepository.findAllByQuartoId(1L)).thenReturn(List.of(r1, r2));

        List<ReservaResponseDTO> response = reservaService.findAllReservasFromQuarto(1L);

        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals(1L, response.get(0).id());
        assertEquals(2L, response.get(1).id());
    }

    @Test
    void deveRetornarTodasReservasDeUmPeriodo() {
        LocalDate inicio = LocalDate.now();
        LocalDate fim = LocalDate.now().plusDays(10);

        Reserva r1 = Reserva.builder().id(1L).dtReservaInicio(inicio).dtReservaFim(fim).quarto(Quarto.builder().build()).cliente(Cliente.builder().build()).build();

        when(reservaRepository.findReservasByPeriodo(inicio, fim)).thenReturn(List.of(r1));

        List<ReservaResponseDTO> response = reservaService.findAllReservasFromPeriodo(inicio, fim);

        assertNotNull(response);
        assertEquals(1, response.size());
        assertEquals(1L, response.get(0).id());
    }
}
