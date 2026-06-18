package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends Pessoa
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
