package br.ufes.inf.SuaPousada.controllers;

import br.ufes.inf.SuaPousada.dto.request.ReservaCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ReservaUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ReservaResponseDTO;
import br.ufes.inf.SuaPousada.service.ReservaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/reservas")
public class ReservaController
{

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService)
    {
        this.reservaService = reservaService;
    }

    @PostMapping("/create")
    public ResponseEntity<ReservaResponseDTO> create(@RequestBody @Valid ReservaCreateRequestDTO requestDTO)
    {
        ReservaResponseDTO response = reservaService.create(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<ReservaResponseDTO> update(@PathVariable Long id, @RequestBody @Valid ReservaUpdateRequestDTO requestDTO)
    {
        ReservaResponseDTO response = reservaService.update(id, requestDTO);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/getById")
    public ResponseEntity<ReservaResponseDTO> findById(@PathVariable Long id)
    {
        ReservaResponseDTO response = reservaService.findById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{idCliente}/findAllByClientId")
    public ResponseEntity<List<ReservaResponseDTO>> findAllByCliente(@PathVariable Long idCliente)
    {
        List<ReservaResponseDTO> responses = reservaService.findAllReservasFromCliente(idCliente);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{idQuarto}/findAllByQuartoId")
    public ResponseEntity<List<ReservaResponseDTO>> findAllByQuarto(@PathVariable Long idQuarto)
    {
        List<ReservaResponseDTO> responses = reservaService.findAllReservasFromQuarto(idQuarto);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/findAllByPeriodo")
    public ResponseEntity<List<ReservaResponseDTO>> findAllByPeriodo(@RequestParam LocalDate inicio, @RequestParam LocalDate fim)
    {
        List<ReservaResponseDTO> responses = reservaService.findAllReservasFromPeriodo(inicio, fim);
        return ResponseEntity.ok(responses);
    }
}
