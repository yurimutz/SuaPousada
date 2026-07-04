package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

import java.util.Date;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long>
{
    /* Busca todas as reservas de um cliente recebendo apenas o ID dele, JPA já entende essa QUERY separando
    os atributos por camelCase */
    List<Reserva> findByClienteId(Long idCliente);

    List<Reserva> findByClienteNome(String nomeCliente);

    List<Reserva> findByClienteEmail(String emailCliente);

    List<Reserva> findByClienteCpf(String cpfCliente);

    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.quarto.id = :quartoId " +
           "AND r.dtReservaInicio < :fim " +
           "AND r.dtReservaFim > :inicio")
    boolean existsOverlappingReserva(@Param("quartoId") Long quartoId,
                                     @Param("inicio") LocalDate inicio,
                                     @Param("fim") LocalDate fim);

    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.quarto.id = :quartoId " +
           "AND r.id <> :reservaId " +
           "AND r.dtReservaInicio < :fim " +
           "AND r.dtReservaFim > :inicio")
    boolean existsOverlappingReservaIgnoringId(@Param("quartoId") Long quartoId,
                                               @Param("inicio") LocalDate inicio,
                                               @Param("fim") LocalDate fim,
                                               @Param("reservaId") Long reservaId);

    List<Reserva> findAllByClienteId(Long idCliente);

    List<Reserva> findAllByQuartoId(Long idQuarto);

    @Query("SELECT r FROM Reserva r WHERE r.dtReservaInicio >= :inicio AND r.dtReservaFim <= :fim")
    List<Reserva> findReservasByPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

}
