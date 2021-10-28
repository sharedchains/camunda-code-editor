package org.shared.code.languageexecutor.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hamcrest.core.Is;
import org.hamcrest.core.IsNot;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.internal.matchers.Not;
import org.shared.code.languageexecutor.dto.CodeInput;
import org.shared.code.languageexecutor.dto.Context;
import org.shared.code.languageexecutor.dto.ContextType;
import org.shared.code.languageexecutor.parser.JsonParser;
import org.shared.code.languageexecutor.parser.PrimitiveParser;
import org.shared.code.languageexecutor.parser.VariableParser;
import org.shared.code.languageexecutor.parser.XmlParser;
import org.shared.code.languageexecutor.service.ClassNodeParserService;
import org.shared.code.languageexecutor.service.ContextValueParserService;
import org.shared.code.languageexecutor.service.GroovyExecutorService;
import org.shared.code.languageexecutor.service.VariableParserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.List;
import java.util.ArrayList;

@ExtendWith(SpringExtension.class)
@WebMvcTest
@AutoConfigureMockMvc
class CodeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @org.springframework.boot.test.context.TestConfiguration
    static class TestConfiguration {
        @Bean
        @Qualifier("variableParsers")
        public List<VariableParser> variableParsers() {
            return List.of(new PrimitiveParser(), new XmlParser(), new JsonParser());
        }

        @Bean
        public ContextValueParserService contextValueParserService() {
            return new ContextValueParserService();
        }

        @Bean
        public ClassNodeParserService classNodeParserService() {
            return new ClassNodeParserService();
        }

        @Bean
        public VariableParserService variableParserService() {
            return new VariableParserService();
        }

        @Bean
        public GroovyExecutorService groovyExecutorService() {
            return new GroovyExecutorService();
        }
    }

    @Test
    void whenPostRequestAndNotEmptyCode_thenCorrectResponse() throws Exception {
        String code = "{\"code\": \"AeA\", \"context\": []}";

        mockMvc.perform(MockMvcRequestBuilders.post("/groovy/execute")
                .content(code)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.output").isEmpty())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error").isNotEmpty());
    }

    @Test
    void whenPostRequestAndEmptyCode_thenBadRequest() throws Exception {
        String code = "{\"code\": \"\", \"context\": []}";

        mockMvc.perform(MockMvcRequestBuilders.post("/groovy/execute")
                .content(code)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("$.error", Is.is("Script code is mandatory")))
                .andExpect(MockMvcResultMatchers.content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON));
    }

    @Test
    void whenPostRequestAndValidCode_thenCorrectResponse() throws Exception {

        CodeInput input = new CodeInput();
        input.setCode(Base64.getEncoder().encodeToString("return 12*2".getBytes(StandardCharsets.UTF_8)));
        input.setContext(null);

        ObjectMapper objectMapper = new ObjectMapper();
        String toSend = objectMapper.writerFor(CodeInput.class).writeValueAsString(input);

        mockMvc.perform(MockMvcRequestBuilders.post("/groovy/execute")
                .content(toSend)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.output", Is.is("24")))
        ;
    }

    @Test
    void whenPostRequestCodeWithContext_thenCorrectResponse() throws Exception {
        String content = Files.readString(Path.of("src", "test", "resources", "scripts", "simpleReturn.groovy"));
        String auctionData = Files.readString(Path.of("src", "test", "resources", "scripts", "auctionData.json"));

        Context ctx = new Context();
        ctx.setName("auctionData");
        ctx.setValue(auctionData);
        ctx.setType(ContextType.JSON);

        CodeInput input = new CodeInput();
        input.setCode(Base64.getEncoder().encodeToString(content.getBytes(StandardCharsets.UTF_8)));
        input.setContext(List.of(ctx));

        ObjectMapper objectMapper = new ObjectMapper();
        String toSend = objectMapper.writerFor(CodeInput.class).writeValueAsString(input);

        mockMvc.perform(MockMvcRequestBuilders.post("/groovy/execute")
                .content(toSend)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.output", Is.is("7000")));
    }


    @Test
    void whenPostRequestWithContext_thenCorrectResponse() throws Exception {
        Context ctx1 = new Context();
        ctx1.setName("var1");
        ctx1.setValue("1,2,3");
        ctx1.setType(ContextType.INTEGER);

        Context ctx2 = new Context();
        ctx2.setName("var2");
        ctx2.setValue("4,5,6");
        ctx2.setType(ContextType.INTEGER);

        List<Context> contexts = new ArrayList<Context>();
        contexts.add(ctx1);
        contexts.add(ctx2);

        CodeInput input = new CodeInput();
        input.setCode(Base64.getEncoder().encodeToString("return var1+var2;".getBytes(StandardCharsets.UTF_8)));
        input.setContext(contexts);

        ObjectMapper objectMapper = new ObjectMapper();
        String toSend = objectMapper.writerFor(CodeInput.class).writeValueAsString(input);

        String expectedOutput = "[{\"output\":\"5\",\"logs\":\"\",\"error\":null},{\"output\":\"7\",\"logs\":\"\",\"error\":null},{\"output\":\"9\",\"logs\":\"\",\"error\":null}]";

        mockMvc.perform(MockMvcRequestBuilders.post("/groovy/execute/vectors")
                .content(toSend)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.content().string(expectedOutput));
    }

    @Test
    void whenPostRequestWithContext_thenBadResponse() throws Exception {
        Context ctx1 = new Context();
        ctx1.setName("var1");
        ctx1.setValue("1,2,3");
        ctx1.setType(ContextType.INTEGER);

        Context ctx2 = new Context();
        ctx2.setName("var2");
        ctx2.setValue("4,5");
        ctx2.setType(ContextType.INTEGER);

        List<Context> contexts = new ArrayList<Context>();
        contexts.add(ctx1);
        contexts.add(ctx2);

        CodeInput input = new CodeInput();
        input.setCode(Base64.getEncoder().encodeToString("return var1+var2;".getBytes(StandardCharsets.UTF_8)));
        input.setContext(contexts);

        ObjectMapper objectMapper = new ObjectMapper();
        String toSend = objectMapper.writerFor(CodeInput.class).writeValueAsString(input);
        
        mockMvc.perform(MockMvcRequestBuilders.post("/groovy/execute/vectors")
                .content(toSend)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content()
                        .contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$[2].error", IsNot.not("null")));
    }

}