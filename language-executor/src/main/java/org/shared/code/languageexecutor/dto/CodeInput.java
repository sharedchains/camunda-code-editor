package org.shared.code.languageexecutor.dto;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

/**
 * The type Code input.
 */
public class CodeInput implements Serializable {

    private String code;
    private List<Context> context;

    /**
     * Sets code.
     *
     * @param code the base64-encoded code string to execute
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * Sets context.
     *
     * @param context the context variables needed for execution
     */
    public void setContext(List<Context> context) {
        this.context = context;
    }


    /**
     * Gets code.
     *
     * @return the base64-encoded code string to execute
     */
    @NotBlank(message = "Script code is mandatory")
    public String getCode() {
        return code;
    }

    /**
     * Gets context.
     *
     * @return the context variables needed for execution
     */
    public List<Context> getContext() {
        return context;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        var codeInput = (CodeInput) o;
        return Objects.equals(code, codeInput.code) && Objects.equals(context, codeInput.context);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code, context);
    }

    @Override
    public String toString() {
        return "CodeInput{" +
                "code='" + code + '\'' +
                ", context=" + context +
                '}';
    }
}
