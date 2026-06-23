package br.ufes.inf.SuaPousada.exceptions;

public class EntidadeConflitoException extends RuntimeException
{
    public EntidadeConflitoException(String mensagem)
    {
        super(mensagem);
    }
}
