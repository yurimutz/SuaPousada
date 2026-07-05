package br.ufes.inf.SuaPousada.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.ufes.inf.SuaPousada.dto.request.FuncionarioCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.FuncionarioResponseDTO;
import br.ufes.inf.SuaPousada.service.FuncionarioService;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/funcionario")
public class FuncionarioController
{
    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService)
    {
        this.funcionarioService = funcionarioService;
    }

    @PostMapping("/create")
    public ResponseEntity<FuncionarioResponseDTO> create(@RequestBody FuncionarioCreateRequestDTO dto)
    {
        return new ResponseEntity<>(funcionarioService.create(dto), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/update")
    public ResponseEntity<FuncionarioResponseDTO> update(@PathVariable Long id, @RequestBody FuncionarioUpdateRequestDTO dto)
    {
        return new ResponseEntity<>(funcionarioService.update(id, dto), HttpStatus.OK);
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<Void> delete(@PathVariable Long id)
    {
        funcionarioService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}/get")
    public ResponseEntity<FuncionarioResponseDTO> findById(@PathVariable Long id)
    {
        return new ResponseEntity<>(funcionarioService.findById(id), HttpStatus.OK);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<FuncionarioResponseDTO>> findAll()
    {
        return new ResponseEntity<>(funcionarioService.findAll(), HttpStatus.OK);
    }
}
