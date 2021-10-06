package org.shared.code.languageexecutor.parser;

import org.camunda.bpm.engine.variable.value.TypedValue;

/**
 * The interface Variable parser.
 */
public interface VariableParser {

    /**
     * Checks if the typed value is supported.
     *
     * @param typedValue the typed value
     * @return the boolean true if supported
     */
    boolean supportsTypedValue(TypedValue typedValue);

    /**
     * Parse the object contained in the {@param variable}
     *
     * @param variable the variable
     * @return the object inside the {@link TypedValue}
     */
    Object parse(TypedValue variable);
}
