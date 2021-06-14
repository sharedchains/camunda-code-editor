package org.shared.code.languageexecutor.parser;

import org.camunda.bpm.engine.variable.value.TypedValue;

public interface VariableParser {

    boolean supportsTypedValue(TypedValue typedValue);

    Object parse(TypedValue variable);
}
