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

import br.ufes.inf.SuaPousada.dto.request.TipoQuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.TipoQuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.service.TipoQuartoService;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(TipoQuartoController.class)
class TipoQuartoControllerTest {

    @Autowired
    private MockMvc mockMvc; // Atua como o postman

    @Autowired
    private ObjectMapper objectMapper; // Transforma Objetos em Json

    @MockitoBean
    private TipoQuartoService tipoQuartoService; // Mock da service

    @MockitoBean
    private br.ufes.inf.SuaPousada.config.TokenService tokenService;

    @MockitoBean
    private br.ufes.inf.SuaPousada.repository.PessoaRepository pessoaRepository;

    @Test
    void deveCriarTipoQuartoComSucesso() throws Exception {
        TipoQuartoCreateRequestDTO request = new TipoQuartoCreateRequestDTO("Luxo", 0, 1, 1, 250.0, true);
        TipoQuartoResponseDTO response = new TipoQuartoResponseDTO(1L, "Luxo", 0, 1, 1, 250.0, true);

        when(tipoQuartoService.create(any(TipoQuartoCreateRequestDTO.class))).thenReturn(response);

        mockMvc.perform(post("/tipoQuarto/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("Luxo"))
                .andExpect(jsonPath("$.qtdCamasSolteiro").value(0))
                .andExpect(jsonPath("$.qtdCamasCasal").value(1))
                .andExpect(jsonPath("$.qtdBanheiros").value(1))
                .andExpect(jsonPath("$.valor_diaria").value(250.0))
                .andExpect(jsonPath("$.existe_ArCondicionado").value(true));
    }

    @Test
    void deveRetornarOkAoAtualizarTipoQuarto() throws Exception {
        TipoQuartoUpdateRequestDTO request = new TipoQuartoUpdateRequestDTO("Luxo Master", 1, 1, 2, 350.0, true);
        TipoQuartoResponseDTO response = new TipoQuartoResponseDTO(1L, "Luxo Master", 1, 1, 2, 350.0, true);

        when(tipoQuartoService.update(eq(1L), any(TipoQuartoUpdateRequestDTO.class))).thenReturn(response);

        mockMvc.perform(patch("/tipoQuarto/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Luxo Master"))
                .andExpect(jsonPath("$.qtdBanheiros").value(2))
                .andExpect(jsonPath("$.valor_diaria").value(350.0));
    }

    @Test
    void deveRetornarErro404AoAtualizarTipoQuartoNaoExistente() throws Exception {
        TipoQuartoUpdateRequestDTO request = new TipoQuartoUpdateRequestDTO("Luxo Master", 1, 1, 2, 350.0, true);

        when(tipoQuartoService.update(eq(1L), any(TipoQuartoUpdateRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Tipo Quarto não encontrado"));

        mockMvc.perform(patch("/tipoQuarto/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarOkAoDeletarTipoQuarto() throws Exception {
        Long id = 1L;

        mockMvc.perform(delete("/tipoQuarto/1/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isOk());
    }

    @Test
    void deveRetornarErro404AoDeletarTipoQuartoNaoExistente() throws Exception {
        Long id = 1L;

        doThrow(new ResourceNotFoundException("Esse TipoQuarto não foi encontrado"))
                .when(tipoQuartoService).delete(eq(id));

        mockMvc.perform(delete("/tipoQuarto/1/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarOkAoProcurarTipoQuartoPeloId() throws Exception {
        Long id = 1L;
        TipoQuartoResponseDTO response = new TipoQuartoResponseDTO(1L, "Luxo", 0, 1, 1, 250.0, true);

        when(tipoQuartoService.findById(eq(id))).thenReturn(response);

        mockMvc.perform(get("/tipoQuarto/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("Luxo"));
    }

    @Test
    void deveRetornarErro404AoProcurarTipoQuartoNaoExistente() throws Exception {
        Long id = 1L;

        when(tipoQuartoService.findById(eq(id)))
                .thenThrow(new ResourceNotFoundException("Esse TipoQuarto não foi encontrado"));

        mockMvc.perform(get("/tipoQuarto/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deveRetornarOkAoProcurarTodosTipoQuartos() throws Exception {
        List<TipoQuartoResponseDTO> list = new ArrayList<>();

        when(tipoQuartoService.findAll()).thenReturn(list);

        mockMvc.perform(get("/tipoQuarto")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }
}
