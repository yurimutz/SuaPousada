package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
