package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Quarto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuartoRepository extends JpaRepository<Quarto, Long>
{
    boolean existsByNumero(Integer numero);
}
