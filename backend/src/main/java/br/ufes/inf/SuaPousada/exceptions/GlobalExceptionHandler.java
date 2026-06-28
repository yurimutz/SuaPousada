package br.ufes.inf.SuaPousada.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler
{
    @ExceptionHandler(DataViolationException.class)
    public ResponseEntity<Object> handleEntidadeConflito(DataViolationException ex)
    {
        Map<String,Object> response = new LinkedHashMap<>();

        response.put("timestamp", LocalDateTime.now());
        response.put("status", HttpStatus.CONFLICT.value());
        response.put("error", "Conflito de Dados.");
        response.put("message", ex.getMessage());

        return new ResponseEntity<>(response,HttpStatus.CONFLICT);
    }
}
