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

import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.TipoQuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.repository.TipoQuartoRepository;

@ExtendWith(MockitoExtension.class)
public class TipoQuartoServiceTest {

    @InjectMocks
    private TipoQuartoService tipoQuartoService;

    @Mock
    private TipoQuartoRepository tipoQuartoRepository;

    @Test
    void deveCriarTipoQuartoComSucesso() {
        TipoQuartoCreateRequestDTO request = new TipoQuartoCreateRequestDTO(
                "Suíte Presidencial", 1, 2, 2, 500.0, true);

        TipoQuarto tipoQuartoSalvo = TipoQuarto.builder()
                .id(1L)
                .nome("Suíte Presidencial")
                .qtdCamasSolteiro(1)
                .qtdCamasCasal(2)
                .qtdBanheiros(2)
                .valor_diaria(500.0)
                .existe_ArCondicionado(true)
                .build();

        when(tipoQuartoRepository.existsByNome("Suíte Presidencial")).thenReturn(false);
        when(tipoQuartoRepository.save(any(TipoQuarto.class))).thenReturn(tipoQuartoSalvo);

        TipoQuartoResponseDTO response = tipoQuartoService.create(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Suíte Presidencial", response.nome());
        assertEquals(1, response.qtdCamasSolteiro());
        assertEquals(2, response.qtdCamasCasal());
        assertEquals(2, response.qtdBanheiros());
        assertEquals(500.0, response.valor_diaria());
        assertEquals(true, response.existe_ArCondicionado());

        verify(tipoQuartoRepository, times(1)).save(any(TipoQuarto.class));
    }

    @Test
    void deveLancarExcecaoQuandoCriarTipoQuartoComNomeExistente() {
        TipoQuartoCreateRequestDTO request = new TipoQuartoCreateRequestDTO(
                "Suíte Presidencial", 1, 2, 2, 500.0, true
        );

        when(tipoQuartoRepository.existsByNome("Suíte Presidencial")).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            tipoQuartoService.create(request);
        });

        assertEquals("Já existe um tipo de quarto cadastrado com esse nome.", excecao.getMessage());
        verify(tipoQuartoRepository, never()).save(any());
    }

    @Test
    void deveBuscarTipoQuartoPorIdComSucesso() {
        TipoQuarto tipoQuarto = TipoQuarto.builder()
                .id(1L)
                .nome("Luxo")
                .qtdCamasSolteiro(0)
                .qtdCamasCasal(1)
                .qtdBanheiros(1)
                .valor_diaria(250.0)
                .existe_ArCondicionado(true)
                .build();

        when(tipoQuartoRepository.findById(1L)).thenReturn(Optional.of(tipoQuarto));

        TipoQuartoResponseDTO response = tipoQuartoService.findById(1L);

        assertNotNull(response);
        assertEquals("Luxo", response.nome());
        assertEquals(250.0, response.valor_diaria());
    }

    @Test
    void deveLancarExcecaoQuandoBuscarTipoQuartoPorIdInexistente() {
        when(tipoQuartoRepository.findById(99L)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            tipoQuartoService.findById(99L);
        });

        assertEquals("Esse TipoQuarto não foi encontrado", excecao.getMessage());
    }

    @Test
    void deveAtualizarTipoQuartoComSucesso() {
        Long id = 1L;
        TipoQuarto tipoQuartoAntigo = TipoQuarto.builder()
                .id(id)
                .nome("Luxo Antigo")
                .qtdCamasSolteiro(1)
                .qtdCamasCasal(1)
                .qtdBanheiros(1)
                .valor_diaria(200.0)
                .existe_ArCondicionado(false)
                .build();

        TipoQuartoUpdateRequestDTO request = new TipoQuartoUpdateRequestDTO(
                "Luxo Novo", null, 2, null, 300.0, true
            );

        TipoQuarto tipoQuartoAtualizado = TipoQuarto.builder()
                .id(id)
                .nome("Luxo Novo")
                .qtdCamasSolteiro(1)
                .qtdCamasCasal(2)
                .qtdBanheiros(1)
                .valor_diaria(300.0)
                .existe_ArCondicionado(true)
                .build();

        when(tipoQuartoRepository.findById(id)).thenReturn(Optional.of(tipoQuartoAntigo));
        when(tipoQuartoRepository.existsByNomeAndIdNot("Luxo Novo", id)).thenReturn(false);
        when(tipoQuartoRepository.save(any(TipoQuarto.class))).thenReturn(tipoQuartoAtualizado);

        TipoQuartoResponseDTO response = tipoQuartoService.update(id, request);

        assertNotNull(response);
        assertEquals("Luxo Novo", response.nome());
        assertEquals(1, response.qtdCamasSolteiro());
        assertEquals(2, response.qtdCamasCasal());
        assertEquals(1, response.qtdBanheiros());
        assertEquals(300.0, response.valor_diaria());
        assertEquals(true, response.existe_ArCondicionado());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarTipoQuartoComNomeExistente() {
        Long id = 1L;
        TipoQuarto tipoQuartoAntigo = TipoQuarto.builder()
                .id(id)
                .nome("Luxo Antigo")
                .build();

        TipoQuartoUpdateRequestDTO request = new TipoQuartoUpdateRequestDTO(
                "Luxo Novo", null, null, null, null, null
        );

        when(tipoQuartoRepository.findById(id)).thenReturn(Optional.of(tipoQuartoAntigo));
        when(tipoQuartoRepository.existsByNomeAndIdNot("Luxo Novo", id)).thenReturn(true);

        DataViolationException excecao = assertThrows(DataViolationException.class, () -> {
            tipoQuartoService.update(id, request);
        });

        assertEquals("Já existe um tipo de quarto cadastrado com esse nome.", excecao.getMessage());
        verify(tipoQuartoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoQuandoAtualizarTipoQuartoInexistente() {
        Long id = 99L;
        TipoQuartoUpdateRequestDTO request = new TipoQuartoUpdateRequestDTO(
                "Luxo Novo", null, null, null, null, null
        );

        when(tipoQuartoRepository.findById(id)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            tipoQuartoService.update(id, request);
        });

        assertEquals("Tipo Quarto não encontrado", excecao.getMessage());
        verify(tipoQuartoRepository, never()).save(any());
    }

    @Test
    void deveDeletarTipoQuartoComSucesso() {
        Long id = 1L;
        TipoQuarto tipoQuarto = TipoQuarto.builder().id(id).nome("Luxo").build();

        when(tipoQuartoRepository.findById(id)).thenReturn(Optional.of(tipoQuarto));

        tipoQuartoService.delete(id);

        verify(tipoQuartoRepository, times(1)).deleteById(id);
    }

    @Test
    void deveLancarExcecaoQuandoDeletarTipoQuartoInexistente() {
        Long id = 99L;

        when(tipoQuartoRepository.findById(id)).thenReturn(Optional.empty());

        ResourceNotFoundException excecao = assertThrows(ResourceNotFoundException.class, () -> {
            tipoQuartoService.delete(id);
        });

        assertEquals("Esse TipoQuarto não foi encontrado", excecao.getMessage());
        verify(tipoQuartoRepository, never()).deleteById(anyLong());
    }

    @Test
    void deveRetornarListaDeTipoQuartos() {
        TipoQuarto t1 = TipoQuarto.builder().id(1L).nome("Luxo").build();
        TipoQuarto t2 = TipoQuarto.builder().id(2L).nome("Standard").build();

        when(tipoQuartoRepository.findAll()).thenReturn(List.of(t1, t2));

        List<TipoQuartoResponseDTO> response = tipoQuartoService.findAll();

        assertNotNull(response);
        assertEquals(2, response.size());
        assertEquals("Luxo", response.get(0).nome());
        assertEquals("Standard", response.get(1).nome());
    }
}
