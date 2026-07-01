package br.ufes.inf.SuaPousada.exceptions;

public class DataViolationException extends RuntimeException
{
    public DataViolationException(String message)
    {
        super(message);
    }
}
