package br.ufes.inf.SuaPousada.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PopularRoomDTO
{
    private String roomTypeName;
    private Long reservationCount;
}
