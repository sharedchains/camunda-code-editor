package org.shared.code.languageexecutor.service;

import org.camunda.bpm.engine.variable.value.TypedValue;
import org.shared.code.languageexecutor.exception.VariableParserException;
import org.shared.code.languageexecutor.parser.VariableParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * The type Variable parser service.
 */
@Service
public class VariableParserService {

    private static final Logger log = LoggerFactory.getLogger(VariableParserService.class);

    /**
     * The collection of Variable parsers
     */
    @Autowired
    List<VariableParser> variableParsers;

    /**
     * Parse the variable and return the correspondent object
     *
     * @param variable the variable
     * @return the object
     */
    public Object parse(TypedValue variable) {
        log.info("Searching for a valid VariableParser");
        Optional<VariableParser> compatibleParser = variableParsers.stream().filter(p -> p.supportsTypedValue(variable)).findAny();

        if (compatibleParser.isEmpty()) {
            throw new VariableParserException(variable, "Cannot find a compatible parser for the received variable");
        } else {
            return compatibleParser.get().parse(variable);
        }
    }
}
