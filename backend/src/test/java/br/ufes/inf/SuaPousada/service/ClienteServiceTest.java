package br.ufes.inf.SuaPousada.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import br.ufes.inf.SuaPousada.domain.Cliente;
import br.ufes.inf.SuaPousada.domain.Genero;
import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ClienteUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.ClienteRepository;
import br.ufes.inf.SuaPousada.repository.PessoaRepository;

@ExtendWith(MockitoExtension.class)
public class ClienteServiceTest {

    @InjectMocks
    private ClienteService clienteService;

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private PessoaRepository pessoaRepository;

    @Test
    void deveCriarClienteComSucesso() {
        
        LocalDate dataValida = LocalDate.of(1990, 1, 1);
        ClienteCreateRequestDTO request = new ClienteCreateRequestDTO("Yuri", "123", dataValida, Genero.MASCULINO, "yuri@email.com", "999");
        
        Cliente clienteSalvo = Cliente.builder()
                .id(1L)
                .nome("Yuri")
                .cpf("123")
                .dtNascimento(dataValida)
                .genero(Genero.MASCULINO)
                .email("yuri@email.com")
                .telefone("999")
                .build();

        when(pessoaRepository.existsByCpfOrEmail(anyString(), anyString())).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenReturn(clienteSalvo);

        ClienteResponseDTO response = clienteService.create(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Yuri", response.nome());
        
        // Verifica se o método save foi chamado exatamente 1 vez
        verify(clienteRepository, times(1)).save(any(Cliente.class));
    }

    @Test
    void deveLancarExcecaoQuandoCriarClienteMenorDeIdade() {
        
        LocalDate dataInvalida = LocalDate.now().minusYears(10); 
        ClienteCreateRequestDTO request = new ClienteCreateRequestDTO("Yuri Jr", "123", dataInvalida, Genero.MASCULINO, "yuri@email.com", "999");

        // 2. Act & Assert
        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            clienteService.create(request);
        });

        assertEquals("Cliente deve ser maior de idade", excecao.getMessage());
        
        // Garante que a execução parou e NUNCA chegou a verificar duplicidade ou salvar
        verify(pessoaRepository, never()).existsByCpfOrEmail(anyString(), anyString());
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoCriarClienteComDuplicidade() {
        
        LocalDate dataValida = LocalDate.of(1990, 1, 1);
        ClienteCreateRequestDTO request = new ClienteCreateRequestDTO("Yuri", "123", dataValida, Genero.MASCULINO, "yuri@email.com", "999");

        when(pessoaRepository.existsByCpfOrEmail("123", "yuri@email.com")).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            clienteService.create(request);
        });

        assertEquals("Já existe um usuário com esse email ou CPF cadastrado", excecao.getMessage());
        verify(clienteRepository, never()).save(any());
    }

    @Test
    void deveBuscarClientePorIdComSucesso() {

        Cliente cliente = Cliente.builder().id(1L).nome("Yuri").build();
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(cliente));

        ClienteResponseDTO response = clienteService.findById(1L);

        assertNotNull(response);
        assertEquals("Yuri", response.nome());
    }

    @Test
    void deveLancarExcecaoQuandoBuscarClientePorIdInexistente() {

        when(clienteRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            clienteService.findById(99L);
        });

        assertEquals("Cliente não encontrado", excecao.getMessage());
    }

    @Test
    void deveAtualizarClienteComSucesso() {

        Long id = 1L;
        LocalDate dataValida = LocalDate.of(1990, 1, 1);
        
        Cliente clienteAntigo = Cliente.builder()
                .id(id)
                .nome("Nome Antigo")
                .cpf("123")
                .dtNascimento(dataValida)
                .email("antigo@email.com")
                .build();

        // Dados que queremos atualizar (apenas nome e email, o resto é null)
        ClienteUpdateRequestDTO request = new ClienteUpdateRequestDTO("Nome Novo", null, null, null, "novo@email.com", null);

        Cliente clienteAtualizado = Cliente.builder()
                .id(id)
                .nome("Nome Novo") // Mudou
                .cpf("123")        // Manteve
                .dtNascimento(dataValida) // Manteve
                .email("novo@email.com") // Mudou
                .build();

        when(clienteRepository.findById(id)).thenReturn(Optional.of(clienteAntigo));
        when(pessoaRepository.existsByCpfOrEmailAndIdNot(anyString(), anyString(), anyLong())).thenReturn(false);
        when(clienteRepository.save(any(Cliente.class))).thenReturn(clienteAtualizado);

        ClienteResponseDTO response = clienteService.update(id, request);

        assertNotNull(response);
        assertEquals("Nome Novo", response.nome());
        assertEquals("novo@email.com", response.email());
        assertEquals("123", response.cpf()); // Garante que o CPF antigo foi preservado
    }

    @Test
    void deveRetornarListaDeClientes() {

        Cliente c1 = Cliente.builder().id(1L).nome("Yuri").build();
        Cliente c2 = Cliente.builder().id(2L).nome("Joao").build();
        
        when(clienteRepository.findAll()).thenReturn(List.of(c1, c2));

        List<ClienteResponseDTO> response = clienteService.findAll();

        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals("Yuri", response.get(0).nome());
        assertEquals("Joao", response.get(1).nome());
    }
}