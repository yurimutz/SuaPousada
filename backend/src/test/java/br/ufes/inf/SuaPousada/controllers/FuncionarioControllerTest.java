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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.ufes.inf.SuaPousada.domain.Genero;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.FuncionarioResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.service.FuncionarioService;
import tools.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
@WebMvcTest(FuncionarioController.class)
public class FuncionarioControllerTest {

    @Autowired
    private MockMvc mockMvc; // Atua como o postman

    @Autowired
    private ObjectMapper objectMapper; // Transforma Objetos em Json

    @MockitoBean
    private FuncionarioService funcionarioService; // Mock da service

    @Test
    void deveCriarFuncionarioComSucesso() throws Exception{

        FuncionarioCreateRequestDTO cliente = new FuncionarioCreateRequestDTO("yuri", "19089723", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi@gmail.com", "990892873");

        FuncionarioResponseDTO responseDTO = new FuncionarioResponseDTO(1L, "yuri", "19089723", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi@gmail.com", "990892873", true, null);

        // Define o comportamento do mock
        when(funcionarioService.create(any(FuncionarioCreateRequestDTO.class))).thenReturn(responseDTO);

        // Act
        mockMvc.perform(post("/funcionario/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cliente))) // Transforma o DTO em JSON
                
                // Verificações
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.nome").value("yuri"));

    }

    @Test
    void deveRetornarErro409QuandoCriarFuncionarioMenorDeIdade() throws Exception {
        
        FuncionarioCreateRequestDTO request = new FuncionarioCreateRequestDTO("yuri", "123", LocalDate.of(2015, 1, 1), Genero.MASCULINO, "oi@gmail.com", "999");

        // Prepara o mock pra receber coisa errada
        when(funcionarioService.create(any(FuncionarioCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("Funcionario deve ser maior de idade"));

        // Act
        mockMvc.perform(post("/funcionario/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isConflict()); 
    }

    @Test
    void deveRetornarErro409QuandoCriarFuncionarioRepetindoCpf() throws Exception{

        FuncionarioCreateRequestDTO request = new FuncionarioCreateRequestDTO("yuri", "123", LocalDate.of(2002, 1, 1), Genero.MASCULINO, "oi@gmail.com", "999");

        when(funcionarioService.create(any(FuncionarioCreateRequestDTO.class)))
                .thenThrow(new DataViolationException("Já existe um funcionário com esse email ou CPF cadastrado"));

        mockMvc.perform(post("/funcionario/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isConflict());

    }

    @Test
    void deveRetornarOkAoAtualizarFuncionario() throws Exception{

        FuncionarioUpdateRequestDTO request = new FuncionarioUpdateRequestDTO("yuri doido", "123", LocalDate.of(2002, 1, 1), Genero.MASCULINO, "oi2@gmail.com", "999");

        FuncionarioResponseDTO responseDTO = new FuncionarioResponseDTO(1L, "yuri doido", "19089723", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi2@gmail.com", "990892873", true, null);

        when(funcionarioService.update(eq(1L), any(FuncionarioUpdateRequestDTO.class)))
                .thenReturn(responseDTO);

        mockMvc.perform(patch("/funcionario/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("oi2@gmail.com")) // Verifica se o JSON de volta tem id = 1
                .andExpect(jsonPath("$.nome").value("yuri doido"));

    }

    @Test
    void deveRetornarErro404QuandoAtualizarFuncionarioNaoCadastrado() throws Exception{

        FuncionarioUpdateRequestDTO request = new FuncionarioUpdateRequestDTO("yuri doido", "123", LocalDate.of(2002, 1, 1), Genero.MASCULINO, "oi2@gmail.com", "999");

        when(funcionarioService.update(eq(1L), any(FuncionarioUpdateRequestDTO.class)))
                .thenThrow(new ResourceNotFoundException("Funcionario não encontrado"));

        mockMvc.perform(patch("/funcionario/1/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isNotFound());

    }

    //desliga func

    //ativa funca

    @Test
    void deveRetornarOkAoProcurarFuncionarioPeloId() throws Exception{

        Long id = 1L;

        FuncionarioResponseDTO responseDTO = new FuncionarioResponseDTO(1L, "yuri doido", "19089723", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi2@gmail.com", "990892873", true, null);

        when(funcionarioService.findById(eq(id)))
                .thenReturn(responseDTO);

        mockMvc.perform(get("/funcionario/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("oi2@gmail.com"))
                .andExpect(jsonPath("$.nome").value("yuri doido"));

    }

    @Test
    void deveRetornarErro404AoProcurarFuncionarioNaoCadastrado() throws Exception{

        Long id = 1l;

        when(funcionarioService.findById(id))
                .thenThrow(new ResourceNotFoundException("Funcionário não encontrado"));

        mockMvc.perform(get("/funcionario/1/get")
                .contentType(MediaType.APPLICATION_JSON)
                .content(String.valueOf(id)))
                
                // Verifica se retornou a excecao esperada
                .andExpect(status().isNotFound());

    }

    @Test
    void deveRetornarOkAoProcurarTodosFuncionarios() throws Exception{

        List<FuncionarioResponseDTO> list = new ArrayList<>();

        when(funcionarioService.findAll())
                .thenReturn(list);

        mockMvc.perform(get("/funcionario/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                
                .andExpect(status().isOk())
                // Como o array esta vazio, verifico se o array retornado tambem esta
                .andExpect(jsonPath("$.length()").value(0));

    }
    
    @Test
    void deveRetornarOkAoProcurarPorFuncionarioAtivos() throws Exception{

        FuncionarioResponseDTO responseDTO = new FuncionarioResponseDTO(1L, "yuri doido", "19089723", LocalDate.of(2002, 7, 19), Genero.MASCULINO, "oi2@gmail.com", "990892873", true, null);

        List<FuncionarioResponseDTO> list = new ArrayList<>();

        // Coloquei um func ativo para simular o sistema em producao
        list.add(responseDTO);

        when(funcionarioService.findAll())
                .thenReturn(list);

        mockMvc.perform(get("/funcionario/getAll")
                .contentType(MediaType.APPLICATION_JSON))
                
                .andExpect(status().isOk())
                // Como o array esta vazio, verifico se o array retornado tambem esta
                .andExpect(jsonPath("$.length()").value(1));

    }

}
