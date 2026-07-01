package br.ufes.inf.SuaPousada.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.ufes.inf.SuaPousada.dto.request.FuncionarioCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.FuncionarioUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.FuncionarioResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.service.FuncionarioService;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/funcionario")
public class FuncionarioController {
    private final FuncionarioService funcionarioService;

    public FuncionarioController(FuncionarioService funcionarioService){
        this.funcionarioService = funcionarioService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FuncionarioResponseDTO create(@RequestBody FuncionarioCreateRequestDTO dto) throws EntityNotFoundException, DataViolationException {
        try {
            return funcionarioService.create(dto);
        } catch (Exception e) {
            //tem que ver isso aqui
            return null;
        }
    }

    @PatchMapping("/{id}")
    public FuncionarioResponseDTO update(@PathVariable long id, @RequestBody FuncionarioUpdateRequestDTO dto) throws EntityNotFoundException, DataViolationException {
        try {
            return funcionarioService.update(id, dto);
        } catch (Exception e) {
            //tem que ver isso aqui
            return null;
        }
    }

    @PatchMapping("/desliga/{id}")
    public void desligaFuncionario(@PathVariable long id) throws EntityNotFoundException, DataViolationException {
        try {
            funcionarioService.desligaFuncionario(id);
        } catch (Exception e) {
            //tem que ver isso aqui
            
        }
    }

    @PutMapping("/ativa/{id}")
    public void activateFuncionario(@PathVariable long id) throws EntityNotFoundException, DataViolationException {
        try {
            funcionarioService.activateFuncionario(id);
        } catch (Exception e) {
            //tem que ver isso aqui
            
        }
    }

    @GetMapping("/getId/{id}")
    public FuncionarioResponseDTO findById(@PathVariable long id) throws EntityNotFoundException, DataViolationException{
        try {
            return funcionarioService.findById(id);
        } catch (Exception e) {
            //tem que ver isso aqui
            return null;
        }
    }

    @GetMapping("/findAllFuncionarios")
    public List<FuncionarioResponseDTO> findALL() throws EntityNotFoundException, DataViolationException{
        try {
            return funcionarioService.findAll();
        } catch (Exception e) {
            //tem que ver isso aqui
            return null;
        }
    }

    @GetMapping("/findAllAtivosFuncionario")
    public List<FuncionarioResponseDTO> findALLAtivos() throws EntityNotFoundException, DataViolationException{
        try {
            return funcionarioService.findAll();
        } catch (Exception e) {
            //tem que ver isso aqui
            return null;
        }
    }
}
