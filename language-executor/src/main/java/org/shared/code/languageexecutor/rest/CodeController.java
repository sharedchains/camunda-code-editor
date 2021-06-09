package org.shared.code.languageexecutor.rest;

import org.shared.code.languageexecutor.dto.CodeInput;
import org.shared.code.languageexecutor.dto.ResultOutput;
import org.shared.code.languageexecutor.service.GroovyExecutorService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@RestController
public class CodeController {

    private static final Logger log = LoggerFactory.getLogger(CodeController.class);

    @Autowired
    private GroovyExecutorService groovyExecutorService;

    @PostMapping(value = "/groovy/execute", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResultOutput executeGroovy(@Valid @RequestBody CodeInput input) {

        byte[] codeByteArray = Base64.getDecoder().decode(input.getCode());
        log.info("Received input: {}", input);
        return groovyExecutorService.executeGroovyScript(new String(codeByteArray, StandardCharsets.UTF_8), input.getContext());
    }
}
