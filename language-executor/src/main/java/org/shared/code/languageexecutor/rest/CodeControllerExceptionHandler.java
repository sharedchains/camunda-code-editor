package org.shared.code.languageexecutor.rest;

import org.shared.code.languageexecutor.dto.ResultOutput;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Objects;

/**
 * The Code controller exception handler.
 */
@RestControllerAdvice(basePackageClasses = {CodeController.class})
public class CodeControllerExceptionHandler {

    /**
     * Manage generic exception result output.
     *
     * @param request the actual request made
     * @param ex      the exception that has been thrown
     * @return the result output that will be returned to the user
     */
    @ExceptionHandler(Exception.class)
    @RequestMapping(method = {RequestMethod.POST, RequestMethod.GET}, produces = "application/json;charset=utf-8")
    public ResultOutput manageGenericException(HttpServletRequest request, Exception ex) {
        var output = new ResultOutput();
        output.setError(String.format("Unexpected error while calling %s", request.getRequestURI()));
        output.setLogs(ex.getMessage());
        return output;
    }

    /**
     * Manage argument not valid exception result output.
     *
     * @param ex the exception that has been thrown
     * @return the result output that will be returned to the user
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResultOutput manageArgumentNotValidException(MethodArgumentNotValidException ex) {
        var output = new ResultOutput();
        output.setError(Objects.requireNonNull(ex.getBindingResult().getFieldError()).getDefaultMessage());
        return output;
    }
}
