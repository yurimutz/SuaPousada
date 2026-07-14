package br.ufes.inf.SuaPousada.config;

import br.ufes.inf.SuaPousada.domain.Genero;
import br.ufes.inf.SuaPousada.dto.request.*;
import br.ufes.inf.SuaPousada.dto.response.*;
import br.ufes.inf.SuaPousada.service.*;
import com.github.javafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final FuncionarioService funcionarioService;
    private final ClienteService clienteService;
    private final TipoQuartoService tipoQuartoService;
    private final QuartoService quartoService;
    private final ReservaService reservaService;

    public DataSeeder(FuncionarioService funcionarioService, ClienteService clienteService,
                      TipoQuartoService tipoQuartoService, QuartoService quartoService,
                      ReservaService reservaService) {
        this.funcionarioService = funcionarioService;
        this.clienteService = clienteService;
        this.tipoQuartoService = tipoQuartoService;
        this.quartoService = quartoService;
        this.reservaService = reservaService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Se já existirem dados, aborta a inserção (para evitar duplicação no Docker)
        if (!clienteService.findAll().isEmpty()) {
            return;
        }

        System.out.println("🌱 Iniciando o Seeding do Banco de Dados...");

        Faker faker = new Faker(new Locale("pt-BR"));
        Random random = new Random();

        // 1. Criar 5 Funcionários
        for (int i = 0; i < 5; i++) {
            try {
                funcionarioService.create(new FuncionarioCreateRequestDTO(
                        faker.name().fullName(),
                        gerarCpfValido(),
                        LocalDate.of(faker.number().numberBetween(1970, 2000), faker.number().numberBetween(1, 12), faker.number().numberBetween(1, 28)),
                        Genero.values()[random.nextInt(Genero.values().length)],
                        faker.internet().emailAddress(),
                        faker.phoneNumber().cellPhone().replaceAll("[^0-9]", "").substring(0, 11),
                        "123456"
                ));
            } catch (Exception e) {
                System.out.println("ERRO ao criar funcionário: " + e.getMessage());
            }
        }

        // 2. Criar 20 Clientes
        List<ClienteResponseDTO> clientes = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            try {
                ClienteResponseDTO cliente = clienteService.create(new ClienteCreateRequestDTO(
                        faker.name().fullName(),
                        gerarCpfValido(),
                        LocalDate.of(faker.number().numberBetween(1970, 2004), faker.number().numberBetween(1, 12), faker.number().numberBetween(1, 28)),
                        Genero.values()[random.nextInt(Genero.values().length)],
                        faker.internet().emailAddress(),
                        faker.phoneNumber().cellPhone().replaceAll("[^0-9]", "").substring(0, 11),
                        "123456"
                ));
                clientes.add(cliente);
            } catch (Exception e) { System.out.println("ERRO ao criar cliente: " + e.getMessage()); }
        }

        // 3. Criar 3 Tipos de Quarto (Preços Baixo, Médio e Alto)
        TipoQuartoResponseDTO tqBaixo = tipoQuartoService.create(new TipoQuartoCreateRequestDTO("Quarto Standard", 2, 0, 1, 150.0, false));
        TipoQuartoResponseDTO tqMedio = tipoQuartoService.create(new TipoQuartoCreateRequestDTO("Suíte Master", 1, 1, 1, 350.0, true));
        TipoQuartoResponseDTO tqAlto = tipoQuartoService.create(new TipoQuartoCreateRequestDTO("Suíte Presidencial", 0, 2, 2, 850.0, true));

        // 4. Criar 10 Quartos (Maior ocorrência dos baratos)
        List<QuartoResponseDTO> quartos = new ArrayList<>();
        int quartoNumero = 101;
        for (int i = 0; i < 10; i++) {
            Long tipoQuartoId;
            if (i < 5) tipoQuartoId = tqBaixo.id();        // 5 Standard
            else if (i < 8) tipoQuartoId = tqMedio.id();   // 3 Master
            else tipoQuartoId = tqAlto.id();                // 2 Presidential

            QuartoResponseDTO quarto = quartoService.create(new QuartoCreateRequestDTO(
                    quartoNumero++,
                    i < 5 ? 1 : 2, // 1º e 2º Andar
                    tipoQuartoId
            ));
            quartos.add(quarto);
        }

        // 5. Criar Reservas para Clientes (10 a 20 por cliente)
        for (ClienteResponseDTO cliente : clientes) {
            int qtdReservas = random.nextInt(11) + 10; // 10 a 20 reservas

            for (int j = 0; j < qtdReservas; j++) {
                boolean sucesso = false;
                int tentativas = 0;

                // Tenta agendar uma data. Se der conflito (lançada pelo Service), tenta outra.
                while (!sucesso && tentativas < 30) {
                    try {
                        // Data aleatória neste ano atual (de hoje até 6 meses para frente)
                        LocalDate checkIn = LocalDate.now().plusDays(random.nextInt(180) - 30); // De -30 dias atrás até 150 no futuro
                        LocalDate checkOut = checkIn.plusDays(random.nextInt(6) + 1); // 1 a 6 noites de estadia

                        // Seleciona um quarto aleatório
                        QuartoResponseDTO quarto = quartos.get(random.nextInt(quartos.size()));

                        reservaService.create(new ReservaCreateRequestDTO(
                                checkIn,
                                checkOut,
                                quarto.id(),
                                cliente.id()
                        ));
                        sucesso = true;
                    } catch (Exception e) {
                        tentativas++; // Quarto ocupado. Tenta de novo.
                    }
                }
            }
        }

        System.out.println("✅ Seeding do Banco de Dados finalizado com sucesso!");
    }

    private String gerarCpfValido() {
        int[] cpf = new int[11];
        Random rand = new Random();
        for (int i = 0; i < 9; i++) {
            cpf[i] = rand.nextInt(10);
        }
        cpf[9] = calcDigito(cpf, 9);
        cpf[10] = calcDigito(cpf, 10);
        
        StringBuilder sb = new StringBuilder();
        for (int j : cpf) sb.append(j);
        return sb.toString();
    }

    private int calcDigito(int[] cpf, int pesoInicial) {
        int soma = 0;
        int peso = pesoInicial + 1;
        for (int i = 0; i < pesoInicial; i++) {
            soma += cpf[i] * peso--;
        }
        int resto = 11 - (soma % 11);
        return (resto > 9) ? 0 : resto;
    }
}
