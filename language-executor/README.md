## Language (Groovy) Executor

A simple Spring Boot application which exposes a controller method ("/groovy/execute") to execute a single groovy script with its context variables and returns the results.

At the moment, our purpose was to execute groovy scripts (one by one), but a simple refactoring could generalize the pattern for multiple languages (if needed).

### Details

The application exposes a single POST mapping rest method ("/groovy/execute"), which gets two input parameters:
* a String "code" variable, containing the code to execute in Base64
* a List of [Context](./src/main/java/org/shared/code/languageexecutor/dto/Context.java) variables, containing the context variables needed for the execution in the form of { name : 'name', value: 'value', type: [ContextType](./src/main/java/org/shared/code/languageexecutor/dto/ContextType.java)}

and returns a JSON object containing the returned **output**, println **logs** and eventually the execution **error**.

### TODOs

* Improve sandboxing of groovy scripts
* Add a "stopExecution" method to the controller to stop groovy script execution in case of error (infinite loops? strictly related to the first todo.)
* Generalize controller pattern (replace "groovy" with a "language" pathVariable should do the trick) and handle different languages