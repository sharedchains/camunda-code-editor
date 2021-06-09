package org.shared.code.languageexecutor.rest;

import org.shared.code.languageexecutor.dto.ResultOutput;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

@RestControllerAdvice(basePackageClasses = {CodeController.class})
public class CodeControllerExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(CodeControllerExceptionHandler.class);


    @ExceptionHandler(Exception.class)
    @RequestMapping(produces = "application/json;charset=utf-8")
    public ResultOutput manageGenericException(HttpServletRequest request, Exception ex) {
        var output = new ResultOutput();
        output.setError(String.format("Unexpected error while calling %s", request.getRequestURI()));
        output.setLogs(ex.getMessage());
        return output;
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResultOutput manageArgumentNotValidException(MethodArgumentNotValidException ex) {
        var output = new ResultOutput();
        output.setError(Objects.requireNonNull(ex.getBindingResult().getFieldError()).getDefaultMessage());
        return output;
    }
}
