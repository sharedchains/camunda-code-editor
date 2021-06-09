package org.shared.code.languageexecutor.parser;

import org.camunda.bpm.engine.variable.value.TypedValue;
import org.camunda.spin.Spin;
import org.camunda.spin.json.SpinJsonNode;
import org.camunda.spin.plugin.variable.value.JsonValue;
import org.springframework.stereotype.Component;

@Component
public class JsonParser implements VariableParser {

    @Override
    public boolean supportsTypedValue(TypedValue typedValue) {
        return (typedValue instanceof JsonValue) || typedValue instanceof org.camunda.bpm.client.variable.value.JsonValue;
    }

    @Override
    public SpinJsonNode parse(TypedValue variable) {
        return Spin.JSON(variable.getValue());
    }
}
