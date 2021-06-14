package org.shared.code.languageexecutor.service;

import org.camunda.bpm.engine.variable.Variables;
import org.camunda.bpm.engine.variable.value.*;
import org.camunda.spin.plugin.variable.SpinValues;
import org.camunda.spin.plugin.variable.value.JsonValue;
import org.camunda.spin.plugin.variable.value.XmlValue;
import org.shared.code.languageexecutor.dto.Context;
import org.shared.code.languageexecutor.exception.JsonParseException;
import org.shared.code.languageexecutor.exception.XmlParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.TemporalAccessor;
import java.util.Date;

@Service
public class ContextValueParserService {

    private static final Logger log = LoggerFactory.getLogger(ContextValueParserService.class);

    public TypedValue parse(Context context) {
        var object = context.getValue();

        switch (context.getType()) {
            case BOOLEAN:
                return convertBoolean(object);
            case BYTES:
                return convertBytes(object);
            case STRING:
                return convertString(object);
            case SHORT:
                return convertShort(object);
            case DOUBLE:
                return convertDouble(object);
            case INTEGER:
                return convertInteger(object);
            case LONG:
                return convertLong(object);
            case DATE:
                return convertDate(object);
            case DATETIME:
                return convertDateTime(object);
            case JSON:
                return convertJson(object);
            case XML:
                return convertXml(object);
            default:
                if (object == null) {
                    return Variables.untypedNullValue();
                }
                return Variables.untypedValue(object);

        }
    }

    private BooleanValue convertBoolean(Object booleanObject) {
        log.info("Converting Boolean");
        if (booleanObject == null) {
            return Variables.booleanValue(null);
        }
        Boolean bValue = Boolean.parseBoolean(String.valueOf(booleanObject));
        return Variables.booleanValue(bValue);
    }

    private BytesValue convertBytes(Object bytesObject) {
        log.info("Converting Bytes");
        if (bytesObject == null) {
            return Variables.byteArrayValue(null);
        }
        byte[] bytes;
        if (bytesObject instanceof byte[]) {
            bytes = (byte[]) bytesObject;
        } else {
            bytes = String.valueOf(bytesObject).getBytes(StandardCharsets.UTF_8);
        }

        return Variables.byteArrayValue(bytes);
    }

    private StringValue convertString(Object stringObject) {
        log.info("Converting String");
        if (stringObject == null) {
            return Variables.stringValue(null);
        }
        var string = String.valueOf(stringObject);
        return Variables.stringValue(string);
    }

    private ShortValue convertShort(Object shortObject) {
        log.info("Converting Short");
        if (shortObject == null) {
            return Variables.shortValue(null);
        }
        Short sValue = Short.parseShort(String.valueOf(shortObject));
        return Variables.shortValue(sValue);
    }

    private DoubleValue convertDouble(Object doubleObject) {
        log.info("Converting Double");
        if (doubleObject == null) {
            return Variables.doubleValue(null);
        }
        Double dValue = Double.parseDouble(String.valueOf(doubleObject));
        return Variables.doubleValue(dValue);
    }

    private IntegerValue convertInteger(Object integerObject) {
        log.info("Converting Integer");
        if (integerObject == null) {
            return Variables.integerValue(null);
        }
        Integer intValue = Integer.parseInt(String.valueOf(integerObject));
        return Variables.integerValue(intValue);
    }

    private LongValue convertLong(Object longObject) {
        log.info("Converting Long");
        if (longObject == null) {
            return Variables.longValue(null);
        }
        Long lValue = Long.parseLong(String.valueOf(longObject));
        return Variables.longValue(lValue);
    }

    private DateValue convertDate(Object dateObject) {
        log.info("Converting Date");
        if (dateObject == null) {
            return Variables.dateValue(null);
        }
        var dateString = String.valueOf(dateObject);
        var localDate = LocalDate.parse(dateString);
        ZonedDateTime zdt = localDate.atStartOfDay(ZoneId.of("UTC"));
        var instant = zdt.toInstant();
        var d = Date.from(instant);
        return Variables.dateValue(d);
    }

    private DateValue convertDateTime(Object dateTimeObject) {
        log.info("Converting DateTime");
        if (dateTimeObject == null) {
            return Variables.dateValue(null);
        }
        var dateString = String.valueOf(dateTimeObject);
        var dtf = new DateTimeFormatterBuilder()
                .parseCaseInsensitive()
                .append(DateTimeFormatter.ISO_LOCAL_DATE)
                .optionalStart().appendLiteral('T').optionalEnd()
                .optionalStart().appendLiteral(' ').optionalEnd()
                .append(DateTimeFormatter.ISO_LOCAL_TIME)
                .parseLenient().optionalStart().appendOffsetId().optionalEnd()
                .parseStrict().toFormatter();
        TemporalAccessor parsed = dtf.parseBest(dateString, ZonedDateTime::from, LocalDateTime::from);
        ZonedDateTime zonedDateTime;
        if (parsed instanceof ZonedDateTime) {
            zonedDateTime = (ZonedDateTime) parsed;
        } else if (parsed instanceof LocalDateTime) {
            LocalDateTime dt = (LocalDateTime) parsed;
            zonedDateTime = dt.atZone(ZoneId.of("UTC"));
        } else {
            log.error("Unable to parse dateTime {}", dateString);
            throw new DateTimeException("Unable to parse datetime " + dateString);
        }

        log.info("Converted dateString {} to ZonedDateTime", dateString);
        var instant = zonedDateTime.toInstant();
        log.info("Got instant from zonedDateTime");
        var d = Date.from(instant);
        log.info("Converting instant to java.util.Date");
        return Variables.dateValue(d);
    }

    private JsonValue convertJson(Object jsonObject) {
        log.info("Converting Json");
        if (jsonObject == null) {
            throw new JsonParseException();
        }
        var jsonValue = String.valueOf(jsonObject);
        if (jsonValue.isBlank()) {
            throw new JsonParseException();
        }
        return SpinValues.jsonValue(jsonValue).create();
    }

    private XmlValue convertXml(Object xmlObject) {
        log.info("Converting Xml");
        if (xmlObject == null) {
            throw new XmlParseException();
        }
        var xmlValue = String.valueOf(xmlObject);
        if (xmlValue.isBlank()) {
            throw new XmlParseException();
        }
        return SpinValues.xmlValue(String.valueOf(xmlObject)).create();
    }
}
