package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Table(name = "tb_cliente")
@PrimaryKeyJoinColumn(name = "id_pessoa")
public class Cliente extends Pessoa
{
    /*Por causa da herança o @Builder só funciona se for declarado no construtor com super,
    outra alternativa seria @SuperBuilder definido na classe pai e todas suas subclasses. Optei pelo
    construtor.*/
    @Builder
    public Cliente(Long id, String nome, String cpf, LocalDate dtNascimento, Genero genero, String email, String telefone) {
        super(id, nome, cpf, dtNascimento, genero, email, telefone);
    }
}
