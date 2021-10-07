package org.shared.code.languageexecutor.service;

import groovy.lang.Binding;
import groovy.lang.GroovyClassLoader;
import groovy.lang.Script;
import groovy.transform.CompileStatic;
import groovy.transform.ThreadInterrupt;
import org.camunda.bpm.engine.variable.value.TypedValue;
import org.codehaus.groovy.ast.ClassNode;
import org.codehaus.groovy.control.CompilerConfiguration;
import org.codehaus.groovy.control.customizers.ASTTransformationCustomizer;
import org.codehaus.groovy.control.customizers.ImportCustomizer;
import org.codehaus.groovy.control.customizers.SecureASTCustomizer;
import org.codehaus.groovy.runtime.InvokerHelper;
import org.shared.code.languageexecutor.dto.Context;
import org.shared.code.languageexecutor.dto.ResultOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

/**
 * The type Groovy executor service.
 */
@Service
public class GroovyExecutorService {

    private static final Logger log = LoggerFactory.getLogger(GroovyExecutorService.class);

    /**
     * The constant VAR_TYPES.
     */
    public static final String VAR_TYPES = "variable.types";
    /**
     * The constant WHITELIST_METHODS.
     */
    public static final String WHITELIST_METHODS = "whitelist.methods";
    /**
     * The constant SCRIPT_NAME.
     */
    public static final String SCRIPT_NAME = "script.name";

    // TODO: Should it be parameterized ?
    private static final long TIMEOUT_THREAD_IN_MILLIS = 15000;

    /**
     * The constant COMPILE_OPTIONS.
     */
    public static final ThreadLocal<Map<String, Object>> COMPILE_OPTIONS = new ThreadLocal<>();

    @Autowired
    private VariableParserService variableParserService;
    @Autowired
    private ContextValueParserService contextValueParserService;
    @Autowired
    private ClassNodeParserService classNodeParserService;

    /**
     * Execute groovy script result output.
     *
     * @param code     the code to execute
     * @param contexts the context variables to execute the code
     * @return the result output of the execution
     */
    public ResultOutput executeGroovyScript(String code, List<Context> contexts) {
        var resultOutput = new ResultOutput();
        try (var out = new StringWriter()) {
            Map<String, Object> compilationOptions = new HashMap<>();
            Map<String, ClassNode> compilationVariableTypes = new HashMap<>();

            var sharedData = new Binding();
            sharedData.setVariable("out", out);
            if (contexts != null && !contexts.isEmpty()) {
                // Adding context variables to groovy script
                log.info("Binding context variables...");
                for (Context entry : contexts) {
                    TypedValue contextValue = contextValueParserService.parse(entry);
                    var classNode = classNodeParserService.parse(entry);
                    compilationVariableTypes.put(entry.getName(), classNode);
                    sharedData.setVariable(entry.getName(), variableParserService.parse(contextValue));
                }
                compilationOptions.put(VAR_TYPES, compilationVariableTypes);
            }
            /* Restrict groovy execution in a whitelist of allowed methods */
            List<String> patterns = new ArrayList<>();
            patterns.add("java\\.lang\\.Math#");
            patterns.add("org\\.camunda\\.spin\\.*");
            patterns.add("java\\.util\\.*");
            patterns.add("java\\.lang\\.*");
            patterns.add("groovy\\.lang\\.Script#println");
            patterns.add("org\\.codehaus\\.groovy\\.runtime\\.DefaultGroovyMethods");
            patterns.add("org\\.codehaus\\.groovy\\.runtime\\.StringGroovyMethods");

            compilationOptions.put(WHITELIST_METHODS, patterns);

            String tmpFilename = "script" + System.currentTimeMillis() + code.hashCode();
            compilationOptions.put(SCRIPT_NAME, tmpFilename);

            COMPILE_OPTIONS.set(compilationOptions);

            var configuration = new CompilerConfiguration();
            var astCustomizer = new SecureASTCustomizer();
            astCustomizer.setReceiversBlackList(List.of(System.class.getName()));
            astCustomizer.setClosuresAllowed(true);
            astCustomizer.setStaticStarImportsWhitelist(List.of("java.lang.Math", "org.camunda.spin.Spin"));

            var importCustomizer = new ImportCustomizer();
            importCustomizer.addStaticStars("java.lang.Math");
            importCustomizer.addStaticStars("org.camunda.spin.Spin");

            var astCompileStatic = new ASTTransformationCustomizer(
                    Collections.singletonMap("extensions", List.of("SandboxExtension.groovy")),
                    CompileStatic.class
            );
            var threadInterruptAst = new ASTTransformationCustomizer(ThreadInterrupt.class);

            configuration.addCompilationCustomizers(astCompileStatic);
            configuration.addCompilationCustomizers(threadInterruptAst);
            configuration.addCompilationCustomizers(astCustomizer);
            configuration.addCompilationCustomizers(importCustomizer);

            // Create a script object using the configuration above
            var script = createGroovyScript(code, resultOutput, sharedData, tmpFilename, configuration);
            if (script != null) {
                // Executing script in a separated thread in safe mode, killing it using CountDownLatch after 15 seconds
                executeScript(resultOutput, out, script);
            }
        } catch (IOException e) {
            log.error("Unexpected exception before executing script", e);
            resultOutput.setError(e.getMessage());
        } finally {
            COMPILE_OPTIONS.remove();
        }
        return resultOutput;
    }

    private Script createGroovyScript(String code, ResultOutput resultOutput, Binding sharedData, String tmpFilename, CompilerConfiguration configuration) {
        Script script = null;
        try (var classLoader = new GroovyClassLoader(Thread.currentThread().getContextClassLoader(), configuration)) {

            var scriptClass = classLoader.parseClass(code, tmpFilename + ".groovy");
            script = InvokerHelper.createScript(scriptClass, sharedData);
        } catch (Exception ex) {
            log.error("Exception parsing script", ex);
            resultOutput.setError(ex.getMessage());
        }
        return script;
    }

    private void executeScript(ResultOutput resultOutput, StringWriter out, Script script) {

        log.info("Evaluating script...");
        final var latch = new CountDownLatch(1);
        AtomicReference<Object> result = new AtomicReference<>();
        var t = new Thread(() -> {
            log.debug("Running script");
            result.set(script.run());
            latch.countDown();
        });
        try {
            log.debug("Starting thread");
            t.start();
            if (latch.await(TIMEOUT_THREAD_IN_MILLIS, TimeUnit.MILLISECONDS)) {
                log.debug("Thread returned result...");
                Object res = result.get();
                resultOutput.setOutput(res != null ? String.valueOf(res) : null);
                resultOutput.setLogs(out.toString());
                log.debug("The script printed these logs: {}", out);
            } else {
                log.debug("Latch timed out...");
                resultOutput.setError("Script interrupted without returning a result");
                if (t.isAlive()) {
                    log.debug("Thread interrupting...");
                    t.interrupt();
                }
            }
        } catch (InterruptedException ex) {
            log.error("Exception executing script", ex);
            resultOutput.setError("Script interrupted without returning a result");
            if (t.isAlive()) {
                log.debug("Thread interrupting...");
                t.interrupt();
            }
        }
    }

}
