package org.shared.code.languageexecutor.configuration;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

/**
 * The type Application configuration.
 */
@Configuration
public class ApplicationConfiguration {

    /**
     * Main configuration Jackson ObjectMapper
     *
     * @return the object mapper
     */
    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        var objectMapper = new ObjectMapper();
        objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return objectMapper;
    }

    /**
     * Instantiate the implementation of HttpMessageConverter that can read and write JSON using Jackson 2.x's ObjectMapper.
     *
     * @return the new converter
     */
    @Bean
    public MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter() {
        return new MappingJackson2HttpMessageConverter(objectMapper());
    }

    /**
     * Instantiate the synchronous client to perform HTTP requests, using the mapping converter created above
     *
     * @param mappingJackson2HttpMessageConverter the implementation of HttpMessageConverter
     * @return the rest template client
     */
    @Bean
    public RestTemplate restTemplate(MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter) {
        var builder = new RestTemplateBuilder(restTemplate -> {
            // Using a centralized jackson message converter with a configured Object Mapper
            restTemplate.getMessageConverters().removeIf(m -> m.getClass().isAssignableFrom(MappingJackson2HttpMessageConverter.class));
            mappingJackson2HttpMessageConverter.setSupportedMediaTypes(Arrays.asList(
                    MediaType.APPLICATION_JSON, new MediaType("application", "*+json"), new MediaType("text", "plain", StandardCharsets.UTF_8)
            ));
            restTemplate.getMessageConverters().add(mappingJackson2HttpMessageConverter);
        });
        return builder.build();
    }

}
