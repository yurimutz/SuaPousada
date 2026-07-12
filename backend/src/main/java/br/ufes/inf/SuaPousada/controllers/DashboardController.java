package br.ufes.inf.SuaPousada.controllers;

import br.ufes.inf.SuaPousada.dto.DashboardDTO;
import br.ufes.inf.SuaPousada.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController
{
    private final DashboardService dashboardService;

    @GetMapping
    public ResponseEntity<DashboardDTO> getDashboardStatistics(@RequestParam(required = false) Integer year, @RequestParam(required = false) LocalDate date)
    {
        DashboardDTO dashboardDTO = dashboardService.getDashboardStatistics(year, date);
        return ResponseEntity.ok(dashboardDTO);
    }
}
