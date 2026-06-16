package br.ufes.inf.SuaPousada.domain;

import java.time.LocalDate;

public abstract class Pessoa {

	private String nome;

	private String cpf;

	private LocalDate dtNascimento;

	private Genero genero;

	private String email;

	private String telefone;

}
