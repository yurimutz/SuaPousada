package br.ufes.inf.SuaPousada.exceptions;

public class DataViolationException extends RuntimeException
{
    public DataViolationException(String mensagem)
    {
        super(mensagem);
    }

    public DataViolationException(Throwable cause ,String mensagem)
    {
        super(mensagem);
    }
}
