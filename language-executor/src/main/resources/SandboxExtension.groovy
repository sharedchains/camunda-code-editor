import groovy.transform.CompileStatic;
import org.codehaus.groovy.ast.ClassNode;
import org.codehaus.groovy.ast.MethodNode;
import org.codehaus.groovy.ast.Parameter;
import org.codehaus.groovy.transform.stc.ExtensionMethodNode;

import static org.shared.code.languageexecutor.service.GroovyExecutorService.*;

def typesOfVariables = COMPILE_OPTIONS.get()[VAR_TYPES];
def whitelistPatterns = COMPILE_OPTIONS.get()[WHITELIST_METHODS];
def scriptName = COMPILE_OPTIONS.get()[SCRIPT_NAME];

@CompileStatic
private static String prettyPrint(ClassNode node) {
    node.isArray() ? "${prettyPrint(node.componentType)}[]" : node.toString(false)
}

@CompileStatic
private static String toMethodDescriptor(MethodNode node) {
    if (node instanceof ExtensionMethodNode) {
        return toMethodDescriptor(node.extensionMethodNode)
    }
    def sb = new StringBuilder()
    sb.append(node.declaringClass.toString(false))
    sb.append("#")
    sb.append(node.name)
    sb.append('(')
    sb.append(node.parameters.collect { Parameter it ->
        prettyPrint(it.originType)
    }.join(','))
    sb.append(')')
    sb
}

onMethodSelection { expr, MethodNode methodNode ->
    def descr = toMethodDescriptor(methodNode)
    if (methodNode.declaringClass.name == 'java.lang.System' || (!whitelistPatterns.any { descr =~ it } && methodNode.getDeclaringClass().getName() != scriptName)) {
        addStaticTypeError("You tried to call a method which is not allowed, what did you expect?: $descr", expr)
    }
}

unresolvedVariable { var ->
    if (typesOfVariables[var.name]) {
        return makeDynamic(var, typesOfVariables[var.name])
    }
}
