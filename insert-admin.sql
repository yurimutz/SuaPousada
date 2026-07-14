-- Script para injetar um Administrador diretamente no banco de dados.
-- Como estamos injetando direto no banco (SQL), a validação @Email do Spring é ignorada!

WITH inserted_pessoa AS (
  INSERT INTO tb_pessoa (nome, cpf, dt_nascimento, genero, email, telefone, senha, role)
  VALUES (
    'Administrador Master', 
    '00000000000', 
    '2000-01-01', 
    0, -- 0 geralmente equivale ao primeiro valor do Enum Genero (ex: MASCULINO)
    'admin', 
    '00000000000', 
    '$2a$10$k1jKyO6fJpC1fvtPNRc5j.696HQEu2rIv2y3uhuC6DHq/aIwWBy2u', 
    'ROLE_ADMIN'
  )
  RETURNING id
)
INSERT INTO tb_funcionario (id_pessoa)
SELECT id FROM inserted_pessoa;
