package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Pagamento;
import br.ufes.inf.SuaPousada.domain.StatusPagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PagamentoRepository extends JpaRepository<Pagamento, Long>
{
    List<Pagamento> findByStatus(StatusPagamento status);
}
