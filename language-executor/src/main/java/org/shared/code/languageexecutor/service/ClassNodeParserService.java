package org.shared.code.languageexecutor.service;

import org.camunda.spin.json.SpinJsonNode;
import org.camunda.spin.xml.SpinXmlElement;
import org.codehaus.groovy.ast.ClassHelper;
import org.codehaus.groovy.ast.ClassNode;
import org.shared.code.languageexecutor.dto.Context;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ClassNodeParserService {

    public ClassNode parse(Context context) {
        switch (context.getType()) {
            case BOOLEAN:
                return ClassHelper.Boolean_TYPE;
            case BYTES:
                return ClassHelper.Byte_TYPE.makeArray();
            case STRING:
                return ClassHelper.STRING_TYPE;
            case SHORT:
                return ClassHelper.Short_TYPE;
            case DOUBLE:
                return ClassHelper.Double_TYPE;
            case INTEGER:
                return ClassHelper.Integer_TYPE;
            case LONG:
                return ClassHelper.Long_TYPE;
            case DATE:
            case DATETIME:
                return ClassHelper.make(Date.class);
            case JSON:
                return ClassHelper.make(SpinJsonNode.class);
            case XML:
                return ClassHelper.make(SpinXmlElement.class);
            default:
                return ClassHelper.OBJECT_TYPE;

        }
    }

}
