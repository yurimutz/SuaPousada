package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Quarto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface QuartoRepository extends JpaRepository<Quarto, Long>
{
    boolean existsByNumero(Integer numero);

    boolean existsByNumeroAndIdNot(Integer numero, Long id);

    @Query("SELECT q FROM Quarto q WHERE NOT EXISTS (" +
           "SELECT 1 FROM Reserva r WHERE r.quarto = q " +
           "AND r.dtReservaInicio < :fim " +
           "AND r.dtReservaFim > :inicio)")
    List<Quarto> findQuartosDisponiveisNoPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
