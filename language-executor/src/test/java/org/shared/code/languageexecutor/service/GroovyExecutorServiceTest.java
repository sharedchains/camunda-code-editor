package org.shared.code.languageexecutor.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.shared.code.languageexecutor.configuration.TestConfiguration;
import org.shared.code.languageexecutor.dto.Context;
import org.shared.code.languageexecutor.dto.ContextType;
import org.shared.code.languageexecutor.dto.ResultOutput;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = TestConfiguration.class)
class GroovyExecutorServiceTest {

    @Autowired
    private GroovyExecutorService groovyExecutorService;

    @Test
    void whenExecutingASimpleOperation_thenCorrectReturn() {
        ResultOutput output = groovyExecutorService.executeGroovyScript("return 12*2", null);
        assertEquals("24", output.getOutput());
        assertNull(output.getError());
    }

    @Test
    void whenExecutingASimpleOperation_thenErrorReturn() {
        ResultOutput output = groovyExecutorService.executeGroovyScript("return nothing", null);
        assertNotNull(output.getError());
    }

    @Test
    void whenExecutingASimpleOperationWithInput_thenCorrectReturn() {
        Context ctx = new Context();
        ctx.setName("input");
        ctx.setValue("13");
        ctx.setType(ContextType.INTEGER);
        ResultOutput output = groovyExecutorService.executeGroovyScript("return input*2", List.of(ctx));
        assertEquals("26", output.getOutput());
        assertNull(output.getError());
    }

    @Test
    void whenPrintingSomething_thenCorrectLogs() {
        ResultOutput output = groovyExecutorService.executeGroovyScript("println \"Hi\"", null);
        assertEquals("Hi" + System.lineSeparator(), output.getLogs());
        assertNull(output.getError());
        assertNull(output.getOutput());
    }

    @Test
    void whenLoadingAWrongTypeCheckScriptWithImports_thenErrorReturn() throws Exception {
        String content = Files.readString(Path.of("src", "test", "resources", "scripts", "MaxAcceptablePrice.groovy"));
        String offersJson = Files.readString(Path.of("src", "test", "resources", "scripts", "offersJson.json"));
        String auctionData = Files.readString(Path.of("src", "test", "resources", "scripts", "auctionData.json"));

        Context ctx1 = new Context();
        ctx1.setName("auctionData");
        ctx1.setValue(auctionData);
        ctx1.setType(ContextType.JSON);

        Context ctx2 = new Context();
        ctx2.setName("offersJson");
        ctx2.setValue(offersJson);
        ctx2.setType(ContextType.JSON);

        ResultOutput output = groovyExecutorService.executeGroovyScript(content, List.of(ctx1, ctx2));
        assertNotNull(output.getError());
    }

    @Test
    void whenLoadingRightTypeCheckScriptWithImports_thenCorrectReturn() throws Exception {
        String content = Files.readString(Path.of("src", "test", "resources", "scripts", "MaxAcceptablePriceTypes.groovy"));
        String offersJson = Files.readString(Path.of("src", "test", "resources", "scripts", "offersJson.json"));
        String auctionData = Files.readString(Path.of("src", "test", "resources", "scripts", "auctionData.json"));

        Context ctx1 = new Context();
        ctx1.setName("auctionData");
        ctx1.setValue(auctionData);
        ctx1.setType(ContextType.JSON);

        Context ctx2 = new Context();
        ctx2.setName("offersJson");
        ctx2.setValue(offersJson);
        ctx2.setType(ContextType.JSON);

        ResultOutput output = groovyExecutorService.executeGroovyScript(content, List.of(ctx1, ctx2));
        assertNull(output.getError());
    }

    @Test
    void whenExecutingSystem_thenErrorReturn() {
        ResultOutput output = groovyExecutorService.executeGroovyScript("System.exit(-1)", null);
        assertNotNull(output.getError());
    }

    @Test
    void whenExecutingSystemAsVariable_thenErrorReturn() {
        ResultOutput output = groovyExecutorService.executeGroovyScript("def c = System; c.exit(-1)", null);
        assertNotNull(output.getError());
    }

    @Test
    void whenExecutingMath_thenErrorReturn() {
        ResultOutput output = groovyExecutorService.executeGroovyScript("println(Math.PI);\r\nreturn Math.PI;", null);
        assertNotNull(output.getOutput());
    }

    @Test
    void whenExecutingInfiniteLoop_thenErrorReturn() {
        ResultOutput output = groovyExecutorService.executeGroovyScript("int i = 0; while (true) { i++ }", null);
        assertNotNull(output.getError());
    }
}