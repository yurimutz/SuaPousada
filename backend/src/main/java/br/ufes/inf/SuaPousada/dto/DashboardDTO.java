package br.ufes.inf.SuaPousada.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private List<OccupancyRateDTO> occupancyRates;
    private Double dailyRevenue;
    private List<PopularRoomDTO> popularRooms;
}
