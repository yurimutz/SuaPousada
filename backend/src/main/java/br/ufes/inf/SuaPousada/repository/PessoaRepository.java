package br.ufes.inf.SuaPousada.repository;

import br.ufes.inf.SuaPousada.domain.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PessoaRepository extends JpaRepository<Pessoa, Long>
{
    /* Operador OR no metodo realiza apenas uma ida ao banco de dados, ao invés de criar dois métodos separados.
     * DESVANTAGEM: a mensagem de erro fica genérica, pois pode ter sido o CPF ou EMAIL que lançaram a exceção */
    Boolean existsByCpfOrEmail(String cpf, String email);
}
