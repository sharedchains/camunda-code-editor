package org.shared.code.languageexecutor.service;

import groovy.lang.Binding;
import groovy.lang.GroovyClassLoader;
import org.camunda.bpm.engine.variable.value.TypedValue;
import org.codehaus.groovy.runtime.InvokerHelper;
import org.shared.code.languageexecutor.dto.Context;
import org.shared.code.languageexecutor.dto.ResultOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;

@Service
public class GroovyExecutorService {

    private static final Logger log = LoggerFactory.getLogger(GroovyExecutorService.class);

    @Autowired
    private VariableParserService variableParserService;

    @Autowired
    private ContextValueParserService contextValueParserService;

    public ResultOutput executeGroovyScript(String code, List<Context> contexts) {

        var resultOutput = new ResultOutput();
        var out = new StringWriter();
        var sharedData = new Binding();
        sharedData.setVariable("out", out);
        if (contexts != null && !contexts.isEmpty()) {
            // Adding context variables to groovy script
            log.info("Binding context variables...");
            for (Context entry : contexts) {
                TypedValue contextValue = contextValueParserService.parse(entry);
                sharedData.setVariable(entry.getName(), variableParserService.parse(contextValue));
            }
        }

        try (var classLoader = new GroovyClassLoader()) {

            // TODO: SecureASTCustomizer
            var scriptClass = classLoader.parseClass(code);
            var script = InvokerHelper.createScript(scriptClass, sharedData);

            evaluateScript(resultOutput, out, script);
        } catch (IOException e) {
            resultOutput.setError(e.getMessage());
        }
        return resultOutput;
    }

    private void evaluateScript(ResultOutput resultOutput, StringWriter out, groovy.lang.Script script) {
        log.info("Evaluating script...");
        try {
            Object result = script.run();
            log.info("RETURNED: {}", result);
            resultOutput.setOutput(result != null ? String.valueOf(result) : null);
            resultOutput.setLogs(out.toString());

        } catch (Exception ex) {
            log.error("Exception executing script", ex);
            resultOutput.setError(ex.getMessage());
        }
    }

}
