package org.shared.code.languageexecutor.parser;

import org.camunda.bpm.engine.variable.value.TypedValue;
import org.camunda.spin.Spin;
import org.camunda.spin.plugin.variable.value.XmlValue;
import org.camunda.spin.xml.SpinXmlElement;
import org.springframework.stereotype.Component;

/**
 * The type Xml parser.
 */
@Component
public class XmlParser implements VariableParser {

    @Override
    public boolean supportsTypedValue(TypedValue typedValue) {
        return typedValue instanceof XmlValue;
    }

    @Override
    public SpinXmlElement parse(TypedValue variable) {
        return Spin.XML(variable.getValue());
    }
}
