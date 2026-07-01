package br.ufes.inf.SuaPousada.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ClienteUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.exceptions.DataViolationException;
import br.ufes.inf.SuaPousada.service.ClienteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/cliente")
public class ClienteController {
    
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService){
        this.clienteService = clienteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClienteResponseDTO create(@RequestBody ClienteCreateRequestDTO dto) throws EntityNotFoundException, DataViolationException {
        try {
            return clienteService.create(dto);
        } catch (Exception e) {

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e.getCause());

        }
    }

    @PatchMapping("/update/{id}")
    public ClienteResponseDTO update(@PathVariable long id, @RequestBody ClienteUpdateRequestDTO dto) throws EntityNotFoundException, DataViolationException {
        try {
            return clienteService.update(id, dto);
        } catch (Exception e) {

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e.getCause());

        }
    }

    @GetMapping("/get/{id}")
    public ClienteResponseDTO findById(@PathVariable long id) throws EntityNotFoundException, DataViolationException{
        try {
            return clienteService.findById(id);
        } catch (Exception e) {
            //tem que ver isso aqui
            return null;
        }
    }

    @GetMapping("/findAllClientes")
    public List<ClienteResponseDTO> findALL() throws EntityNotFoundException, DataViolationException{
        try {
            return clienteService.findAll();
        } catch (Exception e) {
            //tem que ver isso aqui
            return null;
        }
    }
}