package br.ufes.inf.SuaPousada.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;

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

}
