package br.ufes.inf.SuaPousada.controllers;

import java.util.List;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ClienteUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.service.ClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteController
{
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService)
    {
        this.clienteService = clienteService;
    }

    @PostMapping("/create")
    public ResponseEntity<ClienteResponseDTO> create(@RequestBody @Valid ClienteCreateRequestDTO dto)
    {
        return new ResponseEntity<>(clienteService.create(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<ClienteResponseDTO> update(@PathVariable Long id, @RequestBody @Valid ClienteUpdateRequestDTO dto)
    {
        return new ResponseEntity<>(clienteService.update(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> delete(@PathVariable Long id)
    {
        clienteService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<ClienteResponseDTO> findById(@PathVariable Long id)
    {
        return new ResponseEntity<>(clienteService.findById(id), HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<List<ClienteResponseDTO>> findALL()
    {
        return new ResponseEntity<>(clienteService.findAll(), HttpStatus.OK);
    }
}