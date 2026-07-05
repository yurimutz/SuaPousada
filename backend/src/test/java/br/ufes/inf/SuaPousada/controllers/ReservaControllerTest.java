package br.ufes.inf.SuaPousada.controllers;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.domain.Genero;
import br.ufes.inf.SuaPousada.domain.Quarto;
import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import br.ufes.inf.SuaPousada.dto.request.ReservaCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ReservaUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ReservaResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.service.ReservaService;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(ReservaController.class)
class ReservaControllerTest {

    @Autowired
    private MockMvc mockMvc; // Atua como o postman

    @Autowired
    private ObjectMapper objectMapper; // Transforma Objetos em Json

    @MockitoBean
    private ReservaService reservaService; // Mock da service

    private Cliente criarCliente() {
        return Cliente.builder()
                .id(1L)
                .nome("yuri")
                .cpf("19089723")
                .dtNascimento(LocalDate.of(2002, 7, 19))
                .genero(Genero.MASCULINO)
                .email("oi@gmail.com")
                .telefone("990892873")
                .build();
    }

    private Quarto criarQuarto() {
        TipoQuarto tipo = TipoQuarto.builder()
                .id(1L)
                .nome("Luxo")
                .qtdCamasSolteiro(0)
                .qtdCamasCasal(1)
                .qtdBanheiros(1)
                .valor_diaria(250.0)
                .existe_ArCondicionado(true)
                .build();

        return Quarto.builder()
                .id(1L)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipo)
                .build();
    }

    @Test
    void deveCriarReservaComSucesso() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(1);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);
        ReservaResponseDTO response = new ReservaResponseDTO(1L, null, null, inicio, fim, 4, criarQuarto(), null, criarCliente());

        when(reservaService.create(any(ReservaCreateRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/reservas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.qtd_noites").value(4))
                .andExpect(jsonPath("$.quarto.numero").value(101))
                .andExpect(jsonPath("$.cliente.nome").value("yuri"));
    }

    @Test
    void deveRetornarErro409QuandoDataFimForAnteriorADataInicio() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(5);
        LocalDate fim = LocalDate.now().plusDays(1);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);

        when(reservaService.create(any(ReservaCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("A data de início deve ser anterior à data de fim da reserva."));

        mockMvc.perform(post("/reservas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409QuandoQuartoNaoDisponivel() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(1);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 1L);

        when(reservaService.create(any(ReservaCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("O quarto não está disponível no período selecionado."));

        mockMvc.perform(post("/reservas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409QuandoQuartoNaoEncontrado() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(1);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 999L, 1L);

        when(reservaService.create(any(ReservaCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("Quarto não encontrado."));

        mockMvc.perform(post("/reservas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409QuandoClienteNaoEncontrado() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(1);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaCreateRequestDTO request = new ReservaCreateRequestDTO(inicio, fim, 1L, 999L);

        when(reservaService.create(any(ReservaCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("Cliente não encontrado."));

        mockMvc.perform(post("/reservas/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarOkAoAtualizarReserva() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(6);
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(null, null, inicio, fim, 1L, null, 1L);
        ReservaResponseDTO response = new ReservaResponseDTO(1L, null, null, inicio, fim, 4, criarQuarto(), null, criarCliente());

        when(reservaService.update(eq(1L), any(ReservaUpdateRequestDTO.class))).thenReturn(response);

        mockMvc.perform(put("/reservas/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.qtd_noites").value(4));
    }

    @Test
    void deveRetornarErro409AoAtualizarReservaNaoExistente() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(6);
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(null, null, inicio, fim, 1L, null, 1L);

        when(reservaService.update(eq(1L), any(ReservaUpdateRequestDTO.class)))
                .thenThrow(new DataViolationException("Reserva não encontrada."));

        mockMvc.perform(put("/reservas/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409AoAtualizarComDataFimAnteriorADataInicio() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(5);
        LocalDate fim = LocalDate.now().plusDays(1);
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(null, null, inicio, fim, 1L, null, 1L);

        when(reservaService.update(eq(1L), any(ReservaUpdateRequestDTO.class)))
                .thenThrow(new DataViolationException("A data de início deve ser anterior à data de fim da reserva."));

        mockMvc.perform(put("/reservas/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409AoAtualizarComQuartoNaoDisponivel() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(6);
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(null, null, inicio, fim, 1L, null, 1L);

        when(reservaService.update(eq(1L), any(ReservaUpdateRequestDTO.class)))
                .thenThrow(new DataViolationException("O quarto não está disponível no período selecionado."));

        mockMvc.perform(put("/reservas/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409AoAtualizarComQuartoNaoEncontrado() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(6);
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(null, null, inicio, fim, 999L, null, 1L);

        when(reservaService.update(eq(1L), any(ReservaUpdateRequestDTO.class)))
                .thenThrow(new DataViolationException("Quarto não encontrado."));

        mockMvc.perform(put("/reservas/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409AoAtualizarComClienteNaoEncontrado() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(6);
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(null, null, inicio, fim, 1L, null, 999L);

        when(reservaService.update(eq(1L), any(ReservaUpdateRequestDTO.class)))
                .thenThrow(new DataViolationException("Cliente não encontrado."));

        mockMvc.perform(put("/reservas/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro409AoAtualizarComPagamentoNaoEncontrado() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(2);
        LocalDate fim = LocalDate.now().plusDays(6);
        ReservaUpdateRequestDTO request = new ReservaUpdateRequestDTO(null, null, inicio, fim, 1L, 999L, 1L);

        when(reservaService.update(eq(1L), any(ReservaUpdateRequestDTO.class)))
                .thenThrow(new DataViolationException("Pagamento não encontrado."));

        mockMvc.perform(put("/reservas/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarOkAoProcurarReservaPeloId() throws Exception {
        Long id = 1L;
        LocalDate inicio = LocalDate.now().plusDays(1);
        LocalDate fim = LocalDate.now().plusDays(5);
        ReservaResponseDTO response = new ReservaResponseDTO(1L, null, null, inicio, fim, 4, criarQuarto(), null, criarCliente());

        when(reservaService.findById(eq(id))).thenReturn(response);

        mockMvc.perform(get("/reservas/1/getById")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L));
    }

    @Test
    void deveRetornarErro404AoProcurarReservaNaoExistente() throws Exception {
        Long id = 1L;

        when(reservaService.findById(eq(id)))
                .thenThrow(new ResourceNotFoundException("Reserva não encontrada"));

        mockMvc.perform(get("/reservas/1/getById")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarOkAoProcurarTodasReservasDoCliente() throws Exception {
        Long idCliente = 1L;
        List<ReservaResponseDTO> list = new ArrayList<>();

        when(reservaService.findAllReservasFromCliente(eq(idCliente))).thenReturn(list);

        mockMvc.perform(get("/reservas/1/findAllByClientId")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void deveRetornarOkAoProcurarTodasReservasDoQuarto() throws Exception {
        Long idQuarto = 1L;
        List<ReservaResponseDTO> list = new ArrayList<>();

        when(reservaService.findAllReservasFromQuarto(eq(idQuarto))).thenReturn(list);

        mockMvc.perform(get("/reservas/1/findAllByQuartoId")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void deveRetornarOkAoProcurarReservasPorPeriodo() throws Exception {
        LocalDate inicio = LocalDate.now().plusDays(1);
        LocalDate fim = LocalDate.now().plusDays(10);
        List<ReservaResponseDTO> list = new ArrayList<>();

        when(reservaService.findAllReservasFromPeriodo(eq(inicio), eq(fim))).thenReturn(list);

        mockMvc.perform(get("/reservas/findAllByPeriodo")
                .param("inicio", inicio.toString())
                .param("fim", fim.toString())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
