package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_cliente")
@PrimaryKeyJoinColumn(name = "id_pessoa")
@AllArgsConstructor
@NoArgsConstructor
public class Cliente extends Pessoa
{

}
