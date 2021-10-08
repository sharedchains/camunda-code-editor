package org.shared.code.languageexecutor.parser;

import org.camunda.bpm.engine.variable.value.PrimitiveValue;
import org.camunda.bpm.engine.variable.value.TypedValue;
import org.springframework.stereotype.Component;

/**
 * The type Primitive parser.
 */
@Component
public class PrimitiveParser implements VariableParser {
    @Override
    public boolean supportsTypedValue(TypedValue typedValue) {
        return typedValue instanceof PrimitiveValue;
    }

    @Override
    public Object parse(TypedValue variable) {
        return variable.getValue();
    }
}
