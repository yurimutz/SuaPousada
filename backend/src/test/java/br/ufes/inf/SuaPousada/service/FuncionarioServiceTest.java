package br.ufes.inf.SuaPousada.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import br.ufes.inf.SuaPousada.domain.Funcionario;
import br.ufes.inf.SuaPousada.domain.Genero;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.FuncionarioResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.FuncionarioRepository;
import br.ufes.inf.SuaPousada.repository.PessoaRepository;

@ExtendWith(MockitoExtension.class)
public class FuncionarioServiceTest {

    @InjectMocks
    private FuncionarioService funcionarioService;

    @Mock
    private FuncionarioRepository funcionarioRepository;

    @Mock
    private PessoaRepository pessoaRepository;

    @Test
    void deveCriarFuncionarioComSucesso() {

        LocalDate dataValida = LocalDate.of(1990, 1, 1);
        FuncionarioCreateRequestDTO request = new FuncionarioCreateRequestDTO("Maria", "123", dataValida, Genero.FEMININO, "maria@email.com", "999");
        
        // Objeto depois de salvar no banco, usado para comparar
        Funcionario funcionarioSalvo = Funcionario.builder()
                .id(1L)
                .nome("Maria")
                .cpf("123")
                .dtNascimento(dataValida)
                .genero(Genero.FEMININO)
                .email("maria@email.com")
                .telefone("999")
                .build();

        when(pessoaRepository.existsByCpfOrEmail(anyString(), anyString())).thenReturn(false);
        when(funcionarioRepository.save(any(Funcionario.class))).thenReturn(funcionarioSalvo);

        FuncionarioResponseDTO response = funcionarioService.create(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Maria", response.nome());
        
        // Verifica se chamou o metodo apenas uma vez
        verify(funcionarioRepository, times(1)).save(any(Funcionario.class));
    }

    @Test
    void deveLancarExcecaoQuandoCriarFuncionarioMenorDeIdade() {

        LocalDate dataInvalida = LocalDate.now().minusYears(10); // 10 anos de idade
        FuncionarioCreateRequestDTO request = new FuncionarioCreateRequestDTO("Maria Jr", "123", dataInvalida, Genero.FEMININO, "maria@email.com", "999");

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            funcionarioService.create(request);
        });

        assertEquals("Funcionário deve ser maior de idade", excecao.getMessage());
        // Verifica idade antes do cpf/email e de salvar, entao nao devem ser chamados nunca
        verify(pessoaRepository, never()).existsByCpfOrEmail(anyString(), anyString());
        verify(funcionarioRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoCriarFuncionarioComDuplicidade() {

        LocalDate dataValida = LocalDate.of(1990, 1, 1);
        FuncionarioCreateRequestDTO request = new FuncionarioCreateRequestDTO("Maria", "123", dataValida, Genero.FEMININO, "maria@email.com", "999");

        when(pessoaRepository.existsByCpfOrEmail("123", "maria@email.com")).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            funcionarioService.create(request);
        });

        assertEquals("Já existe um funcionário com esse email ou CPF cadastrado", excecao.getMessage());
        verify(funcionarioRepository, never()).save(any());
    }

    @Test
    void deveAtualizarFuncionarioComSucesso() {

        Long id = 1L;
        LocalDate dataValida = LocalDate.of(1990, 1, 1);
        
        Funcionario funcionarioAntigo = Funcionario.builder()
                .id(id)
                .nome("Nome Antigo")
                .cpf("123")
                .dtNascimento(dataValida)
                .email("antigo@email.com")
                .build();


        FuncionarioUpdateRequestDTO request = new FuncionarioUpdateRequestDTO("Nome Novo", null, null, null, "novo@email.com", null);

        Funcionario funcionarioAtualizado = Funcionario.builder()
                .id(id)
                .nome("Nome Novo")
                .cpf("123")
                .dtNascimento(dataValida)
                .email("novo@email.com")
                .build();

        when(funcionarioRepository.findById(id)).thenReturn(Optional.of(funcionarioAntigo));
        when(pessoaRepository.existsByCpfOrEmailAndIdNot(anyString(), anyString(), eq(id))).thenReturn(false);
        when(funcionarioRepository.save(any(Funcionario.class))).thenReturn(funcionarioAtualizado);

        // Act
        FuncionarioResponseDTO response = funcionarioService.update(id, request);

        assertNotNull(response);
        assertEquals("Nome Novo", response.nome());
        assertEquals("novo@email.com", response.email());
        assertEquals("123", response.cpf()); 
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarFuncionarioNaoEncontrado() {

        FuncionarioUpdateRequestDTO request = new FuncionarioUpdateRequestDTO("Nome Novo", null, null, null, null, null);
        when(funcionarioRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            funcionarioService.update(99L, request);
        });

        assertEquals("Funcionário não encontrado", excecao.getMessage());
        verify(funcionarioRepository, never()).save(any());
    }


    @Test
    void deveBuscarFuncionarioPorIdComSucesso() {
        // 1. Arrange
        Funcionario funcionario = Funcionario.builder().id(1L).nome("Maria").build();
        when(funcionarioRepository.findById(1L)).thenReturn(Optional.of(funcionario));

        // 2. Act
        FuncionarioResponseDTO response = funcionarioService.findById(1L);

        // 3. Assert
        assertNotNull(response);
        assertEquals("Maria", response.nome());
    }

    @Test
    void deveLancarExcecaoQuandoBuscarFuncionarioNaoEncontrado() {

        Long id = 99L;

        when(funcionarioRepository.findById(id)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            funcionarioService.findById(id);
        });

        assertEquals("Funcionário não encontrado", excecao.getMessage());
        verify(funcionarioRepository, never()).save(any());

    }

    @Test
    void deveRetornarTodosOsFuncionarios() {

        Funcionario f1 = Funcionario.builder().id(1L).nome("Maria").build();
        Funcionario f2 = Funcionario.builder().id(2L).nome("Joao").build();
        
        when(funcionarioRepository.findAll()).thenReturn(List.of(f1, f2));

        List<FuncionarioResponseDTO> response = funcionarioService.findAll();

        assertEquals(2, response.size());
        assertEquals("Maria", response.get(0).nome());
        assertEquals("Joao", response.get(1).nome());
    }
}