package br.ufes.inf.SuaPousada.controllers;

import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.TipoQuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.TipoQuartoResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.ResourceNotFoundException;
import br.ufes.inf.SuaPousada.service.TipoQuartoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipoQuarto")
public class TipoQuartoController
{
    private final TipoQuartoService tipoQuartoService;

    public TipoQuartoController(TipoQuartoService tipoQuartoService)
    {
        this.tipoQuartoService = tipoQuartoService;
    }

    @PostMapping("/create")
    public ResponseEntity<TipoQuartoResponseDTO> create(@RequestBody @Valid TipoQuartoCreateRequestDTO dto)
    {
        return new ResponseEntity<>(tipoQuartoService.create(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<TipoQuartoResponseDTO> update(@PathVariable Long id, @RequestBody @Valid TipoQuartoUpdateRequestDTO dto)
    {
        return new ResponseEntity<>(tipoQuartoService.update(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> delete(@PathVariable Long id)
    {
        tipoQuartoService.delete(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<TipoQuartoResponseDTO> findById(@PathVariable Long id)
    {
        return new ResponseEntity<>(tipoQuartoService.findById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<TipoQuartoResponseDTO>> findAll()
    {
        return new ResponseEntity<>(tipoQuartoService.findAll(), HttpStatus.OK);
    }
}