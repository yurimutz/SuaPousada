package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long>
{
    Optional<Cliente> findByNome(String nome);

    Optional<Cliente> findByCpf(String cpf);

    Optional<Cliente> findByEmail(String email);
}
