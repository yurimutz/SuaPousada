package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "tb_funcionario")
@PrimaryKeyJoinColumn(name = "id_pessoa")
public class Funcionario extends Pessoa
{
    //dtAdmissao, desligamento, salario, etc?????
    @Builder
    public Funcionario(Long id, String nome, String cpf, LocalDate dtNascimento, Genero genero, String email, String telefone)
    {
        super(id, nome, cpf, dtNascimento, genero, email, telefone);
    }

    public Funcionario(){}
}
