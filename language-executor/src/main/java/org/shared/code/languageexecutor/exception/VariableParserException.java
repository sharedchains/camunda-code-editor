package org.shared.code.languageexecutor.exception;

import org.camunda.bpm.engine.variable.value.TypedValue;

/**
 * The type Variable parser exception.
 */
public class VariableParserException extends RuntimeException {

    private final TypedValue variable;

    /**
     * Instantiates a new Variable parser exception.
     *
     * @param variable the variable that thrown an exception
     * @param message  the message thrown
     */
    public VariableParserException(TypedValue variable, String message) {
        super(message);
        this.variable = variable;
    }

    /**
     * Gets variable.
     *
     * @return the variable
     */
    public TypedValue getVariable() {
        return variable;
    }

}
