package org.shared.code.languageexecutor.service;

import org.camunda.bpm.engine.variable.value.*;
import org.camunda.spin.plugin.variable.value.JsonValue;
import org.camunda.spin.plugin.variable.value.XmlValue;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.shared.code.languageexecutor.exception.JsonParseException;
import org.shared.code.languageexecutor.exception.XmlParseException;
import org.shared.code.languageexecutor.configuration.TestConfiguration;
import org.shared.code.languageexecutor.dto.Context;
import org.shared.code.languageexecutor.dto.ContextType;
import org.shared.code.languageexecutor.rest.CodeController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.time.DateTimeException;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeParseException;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@ContextConfiguration(classes = TestConfiguration.class)
class ContextValueParserServiceTest {

    private static final Logger log = LoggerFactory.getLogger(CodeController.class);

    @Autowired
    private ContextValueParserService contextValueParserService;

    private Context createContext(String name, String value, ContextType contextType) {
        Context ctx = new Context();
        ctx.setName(name);
        ctx.setValue(value);
        ctx.setType(contextType);
        return ctx;
    }

    @Test
    void whenPassingBooleanType_thenReturnsBooleanValue() {
        Context ctx = createContext("input", String.valueOf(Boolean.TRUE), ContextType.BOOLEAN);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof BooleanValue);

        assertEquals(true, t.getValue());
    }

    @Test
    void whenPassingNull_thenReturnsBooleanValueNull() {
        Context ctx = createContext("input", null, ContextType.BOOLEAN);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof BooleanValue);
        assertNull(t.getValue());
    }

    @Test
    void whenPassingDifferentType_thenReturnsBooleanValue() {
        Context ctx = createContext("input", String.valueOf(12), ContextType.BOOLEAN);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof BooleanValue);

        assertEquals(false, t.getValue());
    }

    @Test
    void whenPassingByteArray_thenReturnsBytesValue() {
        Context ctx = createContext("input", "ciao", ContextType.BYTES);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof BytesValue);

        assertArrayEquals("ciao".getBytes(StandardCharsets.UTF_8), (byte[]) t.getValue());
    }

    @Test
    void whenPassingString_thenReturnsBytesValue() {
        Context ctx = createContext("input", "ciao", ContextType.BYTES);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof BytesValue);

        assertArrayEquals("ciao".getBytes(StandardCharsets.UTF_8), (byte[]) t.getValue());
    }

    @Test
    void whenPassingInt_thenReturnsBytesValue() {
        Context ctx = createContext("input", String.valueOf(123), ContextType.BYTES);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof BytesValue);

        assertArrayEquals("123".getBytes(StandardCharsets.UTF_8), (byte[]) t.getValue());
    }

    @Test
    void whenPassingNull_thenReturnsBytesValue() {
        Context ctx = createContext("input", null, ContextType.BYTES);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof BytesValue);

        assertNull(t.getValue());
    }

    @Test
    void whenPassingStringType_thenReturnsStringValue() {
        Context ctx = createContext("input", "test", ContextType.STRING);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof StringValue);

        assertEquals("test", t.getValue());
    }

    @Test
    void whenPassingNull_thenReturnsStringValue() {
        Context ctx = createContext("input", null, ContextType.STRING);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof StringValue);

        assertNull(t.getValue());
    }

    @Test
    void whenPassingDifferentType_thenReturnsStringValue() {
        Context ctx = createContext("input", String.valueOf(Boolean.TRUE), ContextType.STRING);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof StringValue);

        assertEquals("true", t.getValue());
    }

    @Test
    void whenPassingShortType_thenReturnsShortValue() {
        Context ctx = createContext("input", String.valueOf((short) 1), ContextType.SHORT);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof ShortValue);

        assertEquals((short) 1, t.getValue());
    }

    @Test
    void whenPassingNull_thenReturnsShortValue() {
        Context ctx = createContext("input", null, ContextType.SHORT);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof ShortValue);

        assertNull(t.getValue());
    }

    @Test
    void whenPassingIntegerType_thenReturnsIntegerValue() {
        Context ctx = createContext("input", String.valueOf(11), ContextType.INTEGER);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof IntegerValue);

        assertEquals(11, t.getValue());
    }

    @Test
    void whenPassingNull_thenReturnsIntegerValue() {
        Context ctx = createContext("input", null, ContextType.INTEGER);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof IntegerValue);

        assertNull(t.getValue());
    }

    @Test
    void whenPassingDoubleType_thenReturnsIntegerValue() {
        Context ctx = createContext("input", String.valueOf(15), ContextType.DOUBLE);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DoubleValue);

        assertEquals(15D, t.getValue());
    }

    @Test
    void whenPassingNull_thenReturnsDoubleValue() {
        Context ctx = createContext("input", null, ContextType.DOUBLE);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DoubleValue);

        assertNull(t.getValue());
    }

    @Test
    void whenPassingLongType_thenReturnsLongValue() {
        Context ctx = createContext("input", String.valueOf(17L), ContextType.LONG);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof LongValue);

        assertEquals(17L, t.getValue());
    }

    @Test
    void whenPassingNull_thenReturnsLongValue() {
        Context ctx = createContext("input", null, ContextType.LONG);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof LongValue);

        assertNull(t.getValue());
    }

    @Test
    void whenPassingDateType_thenReturnsDateValue() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");

        Context ctx = createContext("input", "2021-01-25", ContextType.DATE);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DateValue);

        assertEquals("2021-01-25", simpleDateFormat.format(t.getValue()));
    }

    @Test
    void whenPassingNullDate_thenReturnsValueNull() {
        Context ctx = createContext("input", null, ContextType.DATE);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DateValue);
        assertNull(t.getValue());
    }

    @Test
    void whenPassingWrongDate_thenThrowsError() {
        Context ctx = createContext("input", "20210125", ContextType.DATE);
        Assertions.assertThrows(DateTimeParseException.class, () -> {
            contextValueParserService.parse(ctx);
        });
    }

    @Test
    void whenPassingNullDateTime_thenReturnsValueNull() {
        Context ctx = createContext("input", null, ContextType.DATETIME);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DateValue);
        assertNull(t.getValue());
    }

    @Test
    void whenPassingDateTimeType1_thenReturnsDateValue() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Context ctx = createContext("input", "2021-02-24 12:00:01", ContextType.DATETIME);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DateValue);

        ZonedDateTime zdt = ZonedDateTime.of(2021, 2, 24, 12, 0, 1, 0, ZoneId.of("UTC"));
        Date dateParsed = Date.from(zdt.toInstant());

        assertEquals(simpleDateFormat.format(dateParsed), simpleDateFormat.format(t.getValue()));
    }

    @Test
    void whenPassingDateTimeType2_thenReturnsDateValue() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");

        Context ctx = createContext("input", "2021-02-25T12:00:01", ContextType.DATETIME);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DateValue);

        ZonedDateTime zdt = ZonedDateTime.of(2021, 2, 25, 12, 0, 1, 0, ZoneId.of("UTC"));
        Date dateParsed = Date.from(zdt.toInstant());

        assertEquals(simpleDateFormat.format(dateParsed), simpleDateFormat.format(t.getValue()));
    }

    @Test
    void whenPassingDateTimeType3_thenReturnsDateValue() {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX");

        ZonedDateTime zdt = ZonedDateTime.of(2021, 2, 26, 12, 0, 1, 0, ZoneId.of("UTC"));
        Date dateParsed = Date.from(zdt.toInstant());

        Context ctx = createContext("input", "2021-02-26T14:00:01+02:00", ContextType.DATETIME);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof DateValue);

        assertEquals(simpleDateFormat.format(dateParsed), simpleDateFormat.format(t.getValue()));
    }

    @Test
    void whenPassingWrongDateTime_thenThrowsError() {
        Context ctx = createContext("input", "2021-02-26T14:00:01:12+02:00", ContextType.DATETIME);
        Assertions.assertThrows(DateTimeException.class, () -> {
            contextValueParserService.parse(ctx);
        });
    }

    @Test
    void whenPassingJsonType_thenReturnsJsonValue() {
        String json = "{\"code\": \"AeA\", \"context\": []}";
        Context ctx = createContext("input", json, ContextType.JSON);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof JsonValue);
    }

    @Test
    void whenPassingWrongType_thenReturnsJsonValue() {
        Context ctx = createContext("input", String.valueOf(23), ContextType.JSON);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof JsonValue);
    }

    @Test
    void whenPassingNullJson_thenThrowsError() {
        Context ctx = createContext("input", null, ContextType.JSON);
        Assertions.assertThrows(JsonParseException.class, () -> {
            contextValueParserService.parse(ctx);
        });
    }

    @Test
    void whenPassingBlankJson_thenThrowsError() {
        Context ctx = createContext("input", "     ", ContextType.JSON);
        Assertions.assertThrows(JsonParseException.class, () -> {
            contextValueParserService.parse(ctx);
        });
    }

    @Test
    void whenPassingXmlType_thenReturnsXmlValue() {
        String xml = "<a></a>";
        Context ctx = createContext("input", xml, ContextType.XML);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof XmlValue);
    }

    @Test
    void whenPassingWrongType_thenReturnsXmlValue() {
        Context ctx = createContext("input", String.valueOf(23), ContextType.XML);
        TypedValue t = contextValueParserService.parse(ctx);
        assertTrue(t instanceof XmlValue);
    }

    @Test
    void whenPassingNullXml_thenThrowsError() {
        Context ctx = createContext("input", null, ContextType.XML);
        Assertions.assertThrows(XmlParseException.class, () -> {
            contextValueParserService.parse(ctx);
        });
    }

    @Test
    void whenPassingBlankXml_thenThrowsError() {
        Context ctx = createContext("input", "     ", ContextType.XML);
        Assertions.assertThrows(XmlParseException.class, () -> {
            contextValueParserService.parse(ctx);
        });
    }
}