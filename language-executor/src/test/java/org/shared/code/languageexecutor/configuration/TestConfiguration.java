package org.shared.code.languageexecutor.configuration;

import org.shared.code.languageexecutor.parser.JsonParser;
import org.shared.code.languageexecutor.parser.PrimitiveParser;
import org.shared.code.languageexecutor.parser.VariableParser;
import org.shared.code.languageexecutor.parser.XmlParser;
import org.shared.code.languageexecutor.service.ContextValueParserService;
import org.shared.code.languageexecutor.service.GroovyExecutorService;
import org.shared.code.languageexecutor.service.VariableParserService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class TestConfiguration {

    @Bean
    @Qualifier("variableParsers")
    public List<VariableParser> variableParsers() {
        return List.of(new PrimitiveParser(), new XmlParser(), new JsonParser());
    }

    @Bean
    public VariableParserService variableParserService() {
        return new VariableParserService();
    }

    @Bean
    public ContextValueParserService contextValueParserService() {
        return new ContextValueParserService();
    }

    @Bean
    public GroovyExecutorService groovyExecutorService() {
        return new GroovyExecutorService();
    }




}
