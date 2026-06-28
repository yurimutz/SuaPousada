package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "tb_funcionario")
@PrimaryKeyJoinColumn(name = "id_pessoa")
@Getter
@Setter
public class Funcionario extends Pessoa
{
    private Boolean ativo;

    private LocalDate dataDesligamento;

    @Builder
    public Funcionario(Long id, String nome, String cpf, LocalDate dtNascimento, Genero genero, String email, String telefone)
    {
        super(id, nome, cpf, dtNascimento, genero, email, telefone);
        setAtivo(true);
        setDataDesligamento(null);
    }

    public Funcionario()
    {
    }
}
