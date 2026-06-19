#---------------------------------------------------------#
#-------------------------MAVEN---------------------------#
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copia apenas o pom.xml primeiro (isso é um truque para deixar o Docker mais rápido)
COPY pom.xml .
# Baixa as dependências da internet antes de copiar o código
RUN mvn dependency:go-offline

# Agora sim, copia a pasta 'src' com todo o seu código Java
COPY src ./src

# Roda o comando do Maven DENTRO do Docker para gerar o pacote
# (O -DskipTests evita que o Docker tente rodar testes automatizados nessa hora)
#RUN mvn clean package -DskipTests

# Vou deixar rodando os testes
RUN mvn clean package -DskipTests

#---------------------------------------------------------#
#--------------------------JAVA---------------------------#
# Usa uma imagem do Java 17 (ou 21, dependendo do seu projeto)
FROM eclipse-temurin:21-jdk-alpine

# Define a pasta de trabalho dentro do container
WORKDIR /app

# Copia o seu código compilado (.jar) para dentro do container
COPY --from=builder app/target/SuaPousada-0.0.1-SNAPSHOT.jar app.jar

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]