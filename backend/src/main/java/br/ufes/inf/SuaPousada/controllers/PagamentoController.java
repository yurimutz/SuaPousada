package br.ufes.inf.SuaPousada.controllers;

import br.ufes.inf.SuaPousada.dto.request.PagamentoCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.PagamentoUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.PagamentoResponseDTO;
import br.ufes.inf.SuaPousada.service.PagamentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagamento")
public class PagamentoController
{
    private final PagamentoService pagamentoService;

    public PagamentoController(PagamentoService pagamentoService)
    {
        this.pagamentoService = pagamentoService;
    }

    @PostMapping("/create")
    public ResponseEntity<PagamentoResponseDTO> create(@RequestBody @Valid PagamentoCreateRequestDTO dto)
    {
        return new ResponseEntity<>(pagamentoService.create(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<PagamentoResponseDTO> update(@PathVariable Long id, @RequestBody @Valid PagamentoUpdateRequestDTO dto)
    {
        return new ResponseEntity<>(pagamentoService.update(id, dto), HttpStatus.OK);
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<PagamentoResponseDTO> findById(@PathVariable Long id)
    {
        return new ResponseEntity<>(pagamentoService.findById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<PagamentoResponseDTO>> findAll()
    {
        return new ResponseEntity<>(pagamentoService.findAll(), HttpStatus.OK);
    }
}
