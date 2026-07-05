package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.TipoQuarto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoQuartoRepository extends JpaRepository<TipoQuarto, Long>
{
    boolean existsByNome(String nome);

    boolean existsByNomeAndIdNot(String nome, Long id);
}
