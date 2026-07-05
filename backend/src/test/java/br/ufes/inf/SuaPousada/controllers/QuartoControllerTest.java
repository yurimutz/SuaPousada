package br.ufes.inf.SuaPousada.controllers;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import br.ufes.inf.SuaPousada.dto.request.QuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.QuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.QuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.service.QuartoService;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(QuartoController.class)
class QuartoControllerTest {

    @Autowired
    private MockMvc mockMvc; // Atua como o postman

    @Autowired
    private ObjectMapper objectMapper; // Transforma Objetos em Json

    @MockitoBean
    private QuartoService quartoService; // Mock da service

    private TipoQuarto criarTipoQuarto() {
        return TipoQuarto.builder()
                .id(1L)
                .nome("Luxo")
                .qtdCamasSolteiro(0)
                .qtdCamasCasal(1)
                .qtdBanheiros(1)
                .valor_diaria(250.0)
                .existe_ArCondicionado(true)
                .build();
    }

    @Test
    void deveCriarQuartoComSucesso() throws Exception {
        QuartoCreateRequestDTO request = new QuartoCreateRequestDTO(101, 1, 1L);
        QuartoResponseDTO response = new QuartoResponseDTO(1L, 101, 1, criarTipoQuarto());

        when(quartoService.create(any(QuartoCreateRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/quarto/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.numero").value(101))
                .andExpect(jsonPath("$.andar").value(1))
                .andExpect(jsonPath("$.tipoQuarto.nome").value("Luxo"));
    }

    @Test
    void deveRetornarErro409QuandoCriarQuartoComNumeroJaExistente() throws Exception {
        QuartoCreateRequestDTO request = new QuartoCreateRequestDTO(101, 1, 1L);

        when(quartoService.create(any(QuartoCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("Já existe um Quarto cadastrado com este numero"));

        mockMvc.perform(post("/quarto/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarErro404QuandoCriarQuartoComTipoQuartoNaoExistente() throws Exception {
        QuartoCreateRequestDTO request = new QuartoCreateRequestDTO(101, 1, 999L);

        when(quartoService.create(any(QuartoCreateRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Tipo de Quarto não encontrado"));

        mockMvc.perform(post("/quarto/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarOkAoAtualizarQuarto() throws Exception {
        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(102, 2, 1L);
        QuartoResponseDTO response = new QuartoResponseDTO(1L, 102, 2, criarTipoQuarto());

        when(quartoService.update(eq(1L), any(QuartoUpdateRequestDTO.class))).thenReturn(response);

        mockMvc.perform(patch("/quarto/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numero").value(102))
                .andExpect(jsonPath("$.andar").value(2));
    }

    @Test
    void deveRetornarErro404AoAtualizarQuartoNaoExistente() throws Exception {
        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(102, 2, 1L);

        when(quartoService.update(eq(1L), any(QuartoUpdateRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Quarto não encontrado"));

        mockMvc.perform(patch("/quarto/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarErro404AoAtualizarQuartoComTipoQuartoNaoExistente() throws Exception {
        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(102, 2, 999L);

        when(quartoService.update(eq(1L), any(QuartoUpdateRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Tipo de Quarto não encontrado"));

        mockMvc.perform(patch("/quarto/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarErro409AoAtualizarQuartoComNumeroJaExistente() throws Exception {
        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(102, 2, 1L);

        when(quartoService.update(eq(1L), any(QuartoUpdateRequestDTO.class)))
                .thenThrow(new DataViolationException("Já existe um Quarto cadastrado com este numero"));

        mockMvc.perform(patch("/quarto/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void deveRetornarOkAoDeletarQuarto() throws Exception {
        Long id = 1L;

        mockMvc.perform(delete("/quarto/1/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isOk());
    }

    @Test
    void deveRetornarErro404AoDeletarQuartoNaoExistente() throws Exception {
        Long id = 1L;

        doThrow(new ResourceNotFoundException("Esse Quarto não foi encontrado"))
                .when(quartoService).delete(eq(id));

        mockMvc.perform(delete("/quarto/1/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarOkAoProcurarQuartoPeloId() throws Exception {
        Long id = 1L;
        QuartoResponseDTO response = new QuartoResponseDTO(1L, 101, 1, criarTipoQuarto());

        when(quartoService.findById(eq(id))).thenReturn(response);

        mockMvc.perform(get("/quarto/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.numero").value(101));
    }

    @Test
    void deveRetornarErro404AoProcurarQuartoNaoExistente() throws Exception {
        Long id = 1L;

        when(quartoService.findById(eq(id)))
                .thenThrow(new ResourceNotFoundException("Esse Quarto não foi encontrado"));

        mockMvc.perform(get("/quarto/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarOkAoProcurarTodosQuartos() throws Exception {
        List<QuartoResponseDTO> list = new ArrayList<>();

        when(quartoService.findAll()).thenReturn(list);

        mockMvc.perform(get("/quarto")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
