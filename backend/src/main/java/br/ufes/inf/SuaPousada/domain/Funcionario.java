package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tb_funcionario")
@PrimaryKeyJoinColumn(name = "id_pessoa")
public class Funcionario extends Pessoa
{
    //dtAdmissao, desligamento, salario, etc?????
}
