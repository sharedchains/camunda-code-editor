# Changelog

All notable changes to the [camunda-code-editor](https://github.com/sharedchains/camunda-code-editor) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 1.0.0
* `FEAT`: Support Camunda Modeler 5.x
* `FIX`: Fixed editor for DMN modeler
* `FIX`: Fixed editorActions error on startup

## 0.5.2
* `FEAT`: Solves - Plugins menu for java instances issue
* `FEAT`: Solves - Copy and paste inside code editor plugin issue 


## 0.5.1

* `FEAT`: Implemented boundary testing vector mode to run scripts

## 0.5.0

* `DOCS`: Documented the whole code source
* `FEAT`: Externalized server port into a custom variable
* `FEAT`: Detect the installed JVMs inside the operating system and let the user choose which one wants to use.
* `FEAT`: Copy input parameters from BPMN to code editor context variables

## 0.4.0

* `FIX`: Solves [#3](https://github.com/sharedchains/camunda-code-editor/issues/3) - Remove JDK from the bundle
* `FIX`: Solves [#7](https://github.com/sharedchains/camunda-code-editor/issues/7) - Missing editor button on input/output parameters
* `FEAT`: Better error handling for missing JAVA executable
* `FEAT`: Integrating this plugin with our fork of [bpmn-js-token-simulation-plugin](https://github.com/bpmn-io/bpmn-js-token-simulation-plugin)

## 0.3.1

* `FIX`: scripts are saved also on tab change

## 0.3.0

* `FEAT`: support script code editor in input/output, listeners and gateway sequence flows 

## 0.2.0

* `FEAT`: implemented a Spring Boot groovy code executor to test groovy scripts in a safe environment
* `FEAT`: integrated JS-Interpreter to execute javascript scripts which do not involve JSON/XML manipulation
* `FEAT`: integrated a standalone JDK to execute the mentioned application

## 0.1.0

* `CHORE`: support Camunda Modeler v4.x.x+
* `FEAT`: open a script editor inside a react popup window, only for javascript and groovy

