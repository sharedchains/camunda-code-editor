package org.shared.code.languageexecutor.dto;

import java.io.Serializable;
import java.util.Objects;

public class ResultOutput implements Serializable {

    private String output;
    private String logs;
    private String error;

    public String getOutput() {
        return output;
    }

    public void setOutput(String output) {
        this.output = output;
    }

    public String getLogs() {
        return logs;
    }

    public void setLogs(String logs) {
        this.logs = logs;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ResultOutput that = (ResultOutput) o;
        return Objects.equals(output, that.output) && Objects.equals(logs, that.logs) && Objects.equals(error, that.error);
    }

    @Override
    public int hashCode() {
        return Objects.hash(output, logs, error);
    }

    @Override
    public String toString() {
        return "ResultOutput{" +
                "output='" + output + '\'' +
                ", logs='" + logs + '\'' +
                ", error='" + error + '\'' +
                '}';
    }
}
