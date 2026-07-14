package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import lombok.Builder;

import java.time.LocalDate;

/**
 * Classe de domínio que representa um administrador do sistema. O administrador do sistema deve ser um funcionário
 * registrado na empresa. Ele terá permissões especiais para o gerenciamento do sistema: operações de CRUD, dashboards
 * e etc.
 */
@Entity
@Table(name = "tb_administrador")
@PrimaryKeyJoinColumn(name = "id_funcionario")
public class Administrador extends Funcionario
{
    @Builder(builderMethodName = "administradorBuilder")
    public Administrador(Long id, String nome, String cpf, LocalDate dtNascimento, Genero genero, String email, String telefone, String senha, UserRole role)
    {
        super(id, nome, cpf, dtNascimento, genero, email, telefone, senha, role);
    }

    public Administrador()
    {
    }
}
