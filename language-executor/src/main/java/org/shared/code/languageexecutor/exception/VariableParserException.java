package org.shared.code.languageexecutor.exception;

import org.camunda.bpm.engine.variable.value.TypedValue;

public class VariableParserException extends RuntimeException {

    private final TypedValue variable;

    public VariableParserException(TypedValue variable, String message) {
        super(message);
        this.variable = variable;
    }

    public TypedValue getVariable() {
        return variable;
    }

}
