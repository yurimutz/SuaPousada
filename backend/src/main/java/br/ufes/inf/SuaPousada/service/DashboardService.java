package br.ufes.inf.SuaPousada.service;

import br.ufes.inf.SuaPousada.domain.Reserva;
import br.ufes.inf.SuaPousada.dto.DashboardDTO;
import br.ufes.inf.SuaPousada.dto.OccupancyRateDTO;
import br.ufes.inf.SuaPousada.dto.PopularRoomDTO;
import br.ufes.inf.SuaPousada.repository.QuartoRepository;
import br.ufes.inf.SuaPousada.repository.ReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DashboardService
{
    private final ReservaRepository reservaRepository;
    private final QuartoRepository quartoRepository;

    public DashboardDTO getDashboardStatistics(Integer year, LocalDate dataAtual)
    {
        if (year == null)
        {
            year = LocalDate.now().getYear();
        }
        if (dataAtual == null)
        {
            dataAtual = LocalDate.now();
        }

        DashboardDTO dashboardDTO = new DashboardDTO();

        dashboardDTO.setDailyRevenue(calculateDailyRevenue(dataAtual));
        dashboardDTO.setPopularRooms(reservaRepository.findQuartosMaisPopulares());
        dashboardDTO.setOccupancyRates(calculateOccupancyRates(year));

        return dashboardDTO;
    }

    private Double calculateDailyRevenue(LocalDate date)
    {
        List<Reserva> reservasDoDia = reservaRepository.findReservasAtivasNaData(date);
        return reservasDoDia.stream()
                .mapToDouble(r -> r.getQuarto().getTipoQuarto().getValor_diaria())
                .sum();
    }

    private List<OccupancyRateDTO> calculateOccupancyRates(Integer year)
    {
        long totalRooms = quartoRepository.count();
        List<OccupancyRateDTO> rates = new ArrayList<>();

        if (totalRooms == 0)
        {
            for (int i = 1; i <= 12; i++)
            {
                String monthName = LocalDate.of(year, i, 1).getMonth().getDisplayName(TextStyle.FULL, Locale.of("pt", "BR"));
                monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);
                rates.add(new OccupancyRateDTO(monthName, 0.0));
            }
            return rates;
        }

        for (int month = 1; month <= 12; month++)
        {
            LocalDate inicioMes = LocalDate.of(year, month, 1);
            LocalDate inicioProximoMes = inicioMes.plusMonths(1);
            LocalDate fimMes = inicioProximoMes.minusDays(1);

            List<Reserva> overlappingReservas = reservaRepository.findReservasOverlappingPeriodo(inicioMes, fimMes);

            long occupiedDays = 0;
            for (Reserva r : overlappingReservas)
            {
                LocalDate overlapStart = r.getDtReservaInicio().isAfter(inicioMes) ? r.getDtReservaInicio() : inicioMes;
                LocalDate overlapEnd = r.getDtReservaFim().isBefore(inicioProximoMes) ? r.getDtReservaFim() : inicioProximoMes;

                long days = ChronoUnit.DAYS.between(overlapStart, overlapEnd);
                if (days > 0)
                {
                    occupiedDays += days;
                }
            }

            long possibleDays = totalRooms * inicioMes.lengthOfMonth();
            double rate = ((double) occupiedDays / possibleDays) * 100.0;

            String monthName = inicioMes.getMonth().getDisplayName(TextStyle.FULL, new Locale("pt", "BR"));
            monthName = monthName.substring(0, 1).toUpperCase() + monthName.substring(1);

            rates.add(new OccupancyRateDTO(monthName, rate));
        }

        return rates;
    }
}
