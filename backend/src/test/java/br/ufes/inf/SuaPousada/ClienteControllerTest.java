package br.ufes.inf.SuaPousada;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import br.ufes.inf.SuaPousada.controllers.ClienteController;
import br.ufes.inf.SuaPousada.domain.Genero;
import br.ufes.inf.SuaPousada.dto.request.ClienteCreateRequestDTO;
import br.ufes.inf.SuaPousada.dto.request.ClienteUpdateRequestDTO;
import br.ufes.inf.SuaPousada.dto.response.ClienteResponseDTO;
import br.ufes.inf.SuaPousada.service.ClienteService;

@ExtendWith(MockitoExtension.class)
public class ClienteControllerTest {
 
       @Mock private ClienteService clienteService;

       @InjectMocks
       private ClienteController clienteController;

       @Test
       void deveCriarClienteComSucesso() {

        String dataStr = "2002-07-01";
        LocalDate data1 = LocalDate.parse(dataStr, DateTimeFormatter.ISO_LOCAL_DATE);

        ClienteCreateRequestDTO cliente = new ClienteCreateRequestDTO("yuri", "19089723", data1, Genero.MASCULINO, "oi@gmail.com", "990892873");

        ClienteResponseDTO responseDTO = new ClienteResponseDTO(1L, "yuri", "19089723", data1, Genero.MASCULINO, "oi@gmail.com", "990892873");

        // Define o comportamento do mock
        when(clienteService.create(any(ClienteCreateRequestDTO.class))).thenReturn(responseDTO);

        // Act
        ClienteResponseDTO resultado = clienteController.create(cliente);

        // Assert
        assertNotNull(resultado);
        assertEquals("yuri", resultado.nome());
        assertEquals(1L, resultado.id());

       }

}


// /* STREAMING_CHUNK:Configurando o teste do Controller... */
// @WebMvcTest(ClienteController.class)
// public class ClienteControllerTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private ClienteService clienteService;

//     @Autowired
//     private ObjectMapper objectMapper;

//     @Test
//     void deveCriarClienteComSucesso() throws Exception {
//         /* STREAMING_CHUNK:Preparando os dados (Arrange)... */
//         ClienteCreateRequestDTO request = new ClienteCreateRequestDTO(
//                 "Yuri", 
//                 "123.456.789-00", 
//                 "yuri@email.com", 
//                 LocalDate.of(2000, 1, 1)
//         );
        
//         ClienteResponseDTO response = new ClienteResponseDTO(1L, "Yuri", "yuri@email.com");

//         /* STREAMING_CHUNK:Configurando o comportamento do Mock (Mockito)... */
//         when(clienteService.create(any(ClienteCreateRequestDTO.class))).thenReturn(response);

//         /* STREAMING_CHUNK:Executando a requisição e validando (Act & Assert)... */
//         mockMvc.perform(post("/api/clientes")
//                 .contentType(MediaType.APPLICATION_JSON)
//                 .content(objectMapper.writeValueAsString(request)))
//                 .andExpect(status().isCreated())
//                 .andExpect(jsonPath("$.id").value(1L))
//                 .andExpect(jsonPath("$.nome").value("Yuri"));
//     }
// }
// ```eof

// ### O que você precisa verificar se o teste falhar:
// 1. **Pacotes:** O `package` no topo do arquivo deve ser exatamente o mesmo onde seu `ClienteController` reside. Se o Controller estiver em `br.ufes.inf.SuaPousada.controller`, o teste também deve estar lá.
// 2. **Construtores:** Notei que usei os construtores dos DTOs (`ClienteCreateRequestDTO` e `ClienteResponseDTO`). Certifique-se de que esses DTOs possuem os construtores corretos ou que você está usando `@AllArgsConstructor` (Lombok) se estiver usando o Lombok no projeto.
// 3. **Mapeamento:** O caminho `/api/clientes` no `mockMvc.perform(post("/api/clientes"))` deve ser exatamente o que você definiu no `@RequestMapping` do seu Controller.

// Agora é só rodar! Se ele ficar verde, seu Controller está testado e validado.