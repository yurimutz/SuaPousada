package br.ufes.inf.SuaPousada.service;

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

import br.ufes.inf.SuaPousada.domain.Quarto;
import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import br.ufes.inf.SuaPousada.dto.request.QuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.QuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.QuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.QuartoRepository;
import br.ufes.inf.SuaPousada.repository.TipoQuartoRepository;

@ExtendWith(MockitoExtension.class)
public class QuartoServiceTest {

    @InjectMocks
    private QuartoService quartoService;

    @Mock
    private QuartoRepository quartoRepository;

    @Mock
    private TipoQuartoRepository tipoQuartoRepository;

    @Test
    void deveCriarQuartoComSucesso() {
        QuartoCreateRequestDTO request = new QuartoCreateRequestDTO(101, 1, 1L);
        TipoQuarto tipoQuarto = TipoQuarto.builder().id(1L).nome("Luxo").build();
        Quarto quartoSalvo = Quarto.builder()
                .id(1L)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipoQuarto)
                .build();

        when(quartoRepository.existsByNumero(101)).thenReturn(false);
        when(tipoQuartoRepository.findById(1L)).thenReturn(Optional.of(tipoQuarto));
        when(quartoRepository.save(any(Quarto.class))).thenReturn(quartoSalvo);

        QuartoResponseDTO response = quartoService.create(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals(101, response.numero());
        assertEquals(1, response.andar());
        assertEquals(tipoQuarto, response.tipoQuarto());

        verify(quartoRepository, times(1)).save(any(Quarto.class));
    }

    @Test
    void deveLancarExcecaoQuandoCriarQuartoComNumeroExistente() {
        QuartoCreateRequestDTO request = new QuartoCreateRequestDTO(101, 1, 1L);

        when(quartoRepository.existsByNumero(101)).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            quartoService.create(request);
        });

        assertEquals("Já existe um Quarto cadastrado com este numero", excecao.getMessage());
        verify(tipoQuartoRepository, never()).findById(anyLong());
        verify(quartoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoCriarQuartoComTipoQuartoInexistente() {
        QuartoCreateRequestDTO request = new QuartoCreateRequestDTO(101, 1, 1L);

        when(quartoRepository.existsByNumero(101)).thenReturn(false);
        when(tipoQuartoRepository.findById(1L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            quartoService.create(request);
        });

        assertEquals("Tipo de Quarto não encontrado", excecao.getMessage());
        verify(quartoRepository, never()).save(any());
    }

    @Test
    void deveBuscarQuartoPorIdComSucesso() {
        TipoQuarto tipoQuarto = TipoQuarto.builder().id(1L).nome("Luxo").build();
        Quarto quarto = Quarto.builder()
                .id(1L)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipoQuarto)
                .build();

        when(quartoRepository.findById(1L)).thenReturn(Optional.of(quarto));

        QuartoResponseDTO response = quartoService.findById(1L);

        assertNotNull(response);
        assertEquals(101, response.numero());
        assertEquals(tipoQuarto, response.tipoQuarto());
    }

    @Test
    void deveLancarExcecaoQuandoBuscarQuartoPorIdInexistente() {
        when(quartoRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            quartoService.findById(99L);
        });

        assertEquals("Esse Quarto não foi encontrado", excecao.getMessage());
    }

    @Test
    void deveAtualizarQuartoComSucessoSemMudarTipoQuarto() {
        Long id = 1L;
        TipoQuarto tipoQuarto = TipoQuarto.builder().id(1L).nome("Luxo").build();
        Quarto quartoAntigo = Quarto.builder()
                .id(id)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipoQuarto)
                .build();

        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(102, 2, null);

        Quarto quartoAtualizado = Quarto.builder()
                .id(id)
                .numero(102)
                .andar(2)
                .tipoQuarto(tipoQuarto)
                .build();

        when(quartoRepository.findById(id)).thenReturn(Optional.of(quartoAntigo));
        when(quartoRepository.existsByNumeroAndIdNot(102, id)).thenReturn(false);
        when(quartoRepository.save(any(Quarto.class))).thenReturn(quartoAtualizado);

        QuartoResponseDTO response = quartoService.update(id, request);

        assertNotNull(response);
        assertEquals(102, response.numero());
        assertEquals(2, response.andar());
        assertEquals(tipoQuarto, response.tipoQuarto());

        verify(tipoQuartoRepository, never()).findById(anyLong());
    }

    @Test
    void deveAtualizarQuartoComSucessoMudandoTipoQuarto() {
        Long id = 1L;
        TipoQuarto tipoQuartoAntigo = TipoQuarto.builder().id(1L).nome("Luxo").build();
        TipoQuarto tipoQuartoNovo = TipoQuarto.builder().id(2L).nome("Standard").build();
        Quarto quartoAntigo = Quarto.builder()
                .id(id)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipoQuartoAntigo)
                .build();

        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(null, null, 2L);

        Quarto quartoAtualizado = Quarto.builder()
                .id(id)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipoQuartoNovo)
                .build();

        when(quartoRepository.findById(id)).thenReturn(Optional.of(quartoAntigo));
        when(tipoQuartoRepository.findById(2L)).thenReturn(Optional.of(tipoQuartoNovo));
        when(quartoRepository.existsByNumeroAndIdNot(101, id)).thenReturn(false);
        when(quartoRepository.save(any(Quarto.class))).thenReturn(quartoAtualizado);

        QuartoResponseDTO response = quartoService.update(id, request);

        assertNotNull(response);
        assertEquals(101, response.numero());
        assertEquals(tipoQuartoNovo, response.tipoQuarto());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarQuartoInexistente() {
        Long id = 99L;
        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(102, 2, null);

        when(quartoRepository.findById(id)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            quartoService.update(id, request);
        });

        assertEquals("Quarto não encontrado", excecao.getMessage());
        verify(quartoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarQuartoComTipoQuartoInexistente() {
        Long id = 1L;
        TipoQuarto tipoQuarto = TipoQuarto.builder().id(1L).nome("Luxo").build();
        Quarto quartoAntigo = Quarto.builder()
                .id(id)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipoQuarto)
                .build();

        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(null, null, 2L);

        when(quartoRepository.findById(id)).thenReturn(Optional.of(quartoAntigo));
        when(tipoQuartoRepository.findById(2L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            quartoService.update(id, request);
        });

        assertEquals("Tipo de Quarto não encontrado", excecao.getMessage());
        verify(quartoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarQuartoComNumeroExistente() {
        Long id = 1L;
        TipoQuarto tipoQuarto = TipoQuarto.builder().id(1L).nome("Luxo").build();
        Quarto quartoAntigo = Quarto.builder()
                .id(id)
                .numero(101)
                .andar(1)
                .tipoQuarto(tipoQuarto)
                .build();

        QuartoUpdateRequestDTO request = new QuartoUpdateRequestDTO(102, null, null);

        when(quartoRepository.findById(id)).thenReturn(Optional.of(quartoAntigo));
        when(quartoRepository.existsByNumeroAndIdNot(102, id)).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            quartoService.update(id, request);
        });

        assertEquals("Já existe um Quarto cadastrado com este numero", excecao.getMessage());
        verify(quartoRepository, never()).save(any());
    }

    @Test
    void deveDeletarQuartoComSucesso() {
        Long id = 1L;
        Quarto quarto = Quarto.builder().id(id).numero(101).build();

        when(quartoRepository.findById(id)).thenReturn(Optional.of(quarto));

        quartoService.delete(id);

        verify(quartoRepository, times(1)).deleteById(id);
    }

    @Test
    void deveLancarExcecaoQuandoDeletarQuartoInexistente() {
        Long id = 99L;

        when(quartoRepository.findById(id)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            quartoService.delete(id);
        });

        assertEquals("Esse Quarto não foi encontrado", excecao.getMessage());
        verify(quartoRepository, never()).deleteById(anyLong());
    }

    @Test
    void deveRetornarListaDeQuartos() {
        TipoQuarto tipoQuarto = TipoQuarto.builder().id(1L).nome("Luxo").build();
        Quarto q1 = Quarto.builder().id(1L).numero(101).tipoQuarto(tipoQuarto).build();
        Quarto q2 = Quarto.builder().id(2L).numero(102).tipoQuarto(tipoQuarto).build();

        when(quartoRepository.findAll()).thenReturn(List.of(q1, q2));

        List<QuartoResponseDTO> response = quartoService.findAll();

        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals(101, response.get(0).numero());
        assertEquals(102, response.get(1).numero());
    }
}
