package org.shared.code.languageexecutor.dto;

import java.io.Serializable;

/**
 * The type Context.
 */
public class Context implements Serializable {

    private String name;
    private String value;
    private ContextType type;

    /**
     * Gets name.
     *
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets name.
     *
     * @param name the name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * Gets value.
     *
     * @return the value
     */
    public String getValue() {
        return value;
    }

    /**
     * Sets value.
     *
     * @param value the value
     */
    public void setValue(String value) {
        this.value = value;
    }

    /**
     * Gets type.
     *
     * @return the type
     */
    public ContextType getType() {
        return type;
    }

    /**
     * Sets type.
     *
     * @param type the type
     */
    public void setType(ContextType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Context{" +
                "name='" + name + '\'' +
                ", value=" + value +
                ", type='" + type + '\'' +
                '}';
    }
}
