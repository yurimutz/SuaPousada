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
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufes.inf.SuaPousada.domain.Genero;
import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ClienteUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.service.ClienteService;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(ClienteController.class)
@AutoConfigureMockMvc(addFilters = false)
class ClienteControllerTest{

    @Autowired
    private MockMvc mockMvc; // Atua como o postman

    @Autowired
    private ObjectMapper objectMapper; // Transforma Objetos em Json

    @MockitoBean
    private ClienteService clienteService; // Mock da service

    @MockitoBean
    private br.ufes.inf.SuaPousada.config.TokenService tokenService;

    @MockitoBean
    private br.ufes.inf.SuaPousada.repository.PessoaRepository pessoaRepository;

    @Test
    void deveCriarClienteComSucesso() throws Exception{

        ClienteCreateRequestDTO cliente = new ClienteCreateRequestDTO("yuri", "18871809742", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi@gmail.com", "990892873", "123456");

        ClienteResponseDTO responseDTO = new ClienteResponseDTO(1L, "yuri", "18871809742", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi@gmail.com", "990892873");

        // Define o comportamento do mock
        when(clienteService.create(any(ClienteCreateRequestDTO.class))).thenReturn(responseDTO);

        // Act
        mockMvc.perform(post("/cliente/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cliente))) // Transforma o DTO em JSON
                
                // Verificações
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("yuri"));

    }

    @Test
    void deveRetornarErro409QuandoCriarMenorDeIdade() throws Exception {
        
        ClienteCreateRequestDTO request = new ClienteCreateRequestDTO("yuri", "18871809742", LocalDate.of(2015, 1, 1), Genero.MASCULINO, "oi@gmail.com", "999", "123456");

        // Prepara o mock pra receber coisa errada
        when(clienteService.create(any(ClienteCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("Cliente deve ser maior de idade"));

        // Act
        mockMvc.perform(post("/cliente/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isConflict()); 
    }

    @Test
    void deveRetornarErro409QuandoCriarRepetindoCpf() throws Exception{

        ClienteCreateRequestDTO request = new ClienteCreateRequestDTO("yuri", "123", LocalDate.of(2002, 1, 1), Genero.MASCULINO, "oi@gmail.com", "999", "123456");

        when(clienteService.create(any(ClienteCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("Já existe um usuário com esse email ou CPF cadastrado"));

        mockMvc.perform(post("/cliente/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isConflict());

    }

    @Test
    void deveRetornarOkAoAtualizarCliente() throws Exception{

        ClienteUpdateRequestDTO request = new ClienteUpdateRequestDTO("yuri doido", "18871809742", LocalDate.of(2002, 1, 1), Genero.MASCULINO, "oi2@gmail.com", "999");

        ClienteResponseDTO responseDTO = new ClienteResponseDTO(1L, "yuri doido", "18871809742", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi2@gmail.com", "990892873");

        when(clienteService.update(eq(1L), any(ClienteUpdateRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(patch("/cliente/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("oi2@gmail.com")) // Verifica se o JSON de volta tem id = 1
                .andExpect(jsonPath("$.nome").value("yuri doido"));

    }

    @Test
    void deveRetornarErro404QuandoAtualizarClienteNaoCadastrado() throws Exception{

        ClienteUpdateRequestDTO request = new ClienteUpdateRequestDTO("yuri doido", "18871809742", LocalDate.of(2002, 1, 1), Genero.MASCULINO, "oi2@gmail.com", "999");

        when(clienteService.update(eq(1L), any(ClienteUpdateRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Cliente não encontrado"));

        mockMvc.perform(patch("/cliente/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isNotFound());

    }

    @Test
    void deveRetornarOkAoProcurarClientePeloId() throws Exception{

        Long id = 1L;

        ClienteResponseDTO responseDTO = new ClienteResponseDTO(1L, "yuri doido", "18871809742", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi2@gmail.com", "990892873");

        when(clienteService.findById(eq(id)))
                .thenReturn(responseDTO);

        mockMvc.perform(get("/cliente/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("oi2@gmail.com"))
                .andExpect(jsonPath("$.nome").value("yuri doido"));

    }

    @Test
    void deveRetornarErro404AoProcurarClienteNaoCadastrado() throws Exception{

        Long id = 1l;

        when(clienteService.findById(id))
                .thenThrow(new ResourceNotFoundException("Cliente não encontrado"));

        mockMvc.perform(get("/cliente/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isNotFound());

    }

    @Test
    void deveRetornarOkAoProcurarTodosClientes() throws Exception{

        List<ClienteResponseDTO> list = new ArrayList<>();

        when(clienteService.findAll())
                .thenReturn(list);

        mockMvc.perform(get("/cliente")
                .contentType(MediaType.APPLICATION_JSON))
                
                .andExpect(status().isOk())
                // Como o array esta vazio, verifico se o array retornado tambem esta
                .andExpect(jsonPath("$.length()").value(0));

    }
}