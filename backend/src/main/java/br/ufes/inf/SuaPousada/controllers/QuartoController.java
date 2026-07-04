package br.ufes.inf.SuaPousada.controllers;

import br.ufes.inf.SuaPousada.dto.request.QuartoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.QuartoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.QuartoResponseDTO;
import br.ufes.inf.SuaPousada.service.QuartoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/quarto")
public class QuartoController
{
    private final QuartoService quartoService;

    public QuartoController(QuartoService quartoService)
    {
        this.quartoService = quartoService;
    }

    @PostMapping("/create")
    public ResponseEntity<QuartoResponseDTO> create(@RequestBody @Valid QuartoCreateRequestDTO dto)
    {
        return new ResponseEntity<>(quartoService.create(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<QuartoResponseDTO> update(@PathVariable Long id, @RequestBody @Valid QuartoUpdateRequestDTO dto)
    {
        return new ResponseEntity<>(quartoService.update(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> delete(@PathVariable Long id)
    {
        quartoService.delete(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<QuartoResponseDTO> findById(@PathVariable Long id)
    {
        return new ResponseEntity<>(quartoService.findById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<QuartoResponseDTO>> findAll()
    {
        return new ResponseEntity<>(quartoService.findAll(), HttpStatus.OK);
    }
}
