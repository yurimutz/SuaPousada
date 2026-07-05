package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario,Long>
{
    Optional<Funcionario> findByNome(String nome);

    Optional<Funcionario> findByCpf(String cpf);

    Optional<Funcionario> findByEmail(String email);
}
