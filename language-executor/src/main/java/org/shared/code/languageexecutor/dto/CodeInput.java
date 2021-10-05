package org.shared.code.languageexecutor.dto;

import javax.validation.constraints.NotBlank;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

public class CodeInput implements Serializable {

    private String code;
    private List<Context> context;

    public void setCode(String code) {
        this.code = code;
    }

    public void setContext(List<Context> context) {
        this.context = context;
    }

    @NotBlank(message = "Script code is mandatory")
    public String getCode() {
        return code;
    }

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
