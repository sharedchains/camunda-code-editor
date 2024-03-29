# Code editor for Camunda Modeler

[![Compatible with Camunda Modeler version 5](https://img.shields.io/badge/Camunda%20Modeler-5.0+-blue.svg)](https://github.com/camunda/camunda-modeler)

A [Camunda Modeler](https://github.com/camunda/camunda-modeler) plug-in based on the [plug-in example](https://github.com/camunda/camunda-modeler-plugin-example).

## About

This plug-in integrates a script editor to Camunda Modeler, allowing a user to write scripts with code highlights and language auto completion.

![Screencast](./plugin-module/modeler-plugin-code/docs/screencast.gif)

## Install

Extract the [release zip file](https://github.com/sharedchains/camunda-code-editor/releases/) to your camunda-modeler/resources/plugins folder. Super easy!

## Limitations
**Up to now, only if Script Format is 'groovy' or 'javascript'** 
* **JAVA instances must be present in the system PATH variable, otherwise the plugin will not be able to detect them correctly.**
* On javascript, only for 'simple' scripts which do not involve JSON/XML manipulation.
* On groovy everything should work.

## Development Setup

Unlike other plugins, this project has been wrapped in a [Maven](https://maven.apache.org/) project to integrate other components inside it and generate a final bundle which contains:
* The Camunda Modeler javascript plugin itself
* Our Spring Boot groovy executor application which will get executed on Camunda Modeler startup
* ~~A standalone JDK which executes the mentioned application~~

To work on this plugin you will need to install:

* [Node.js](https://nodejs.org/)
* [Java JDK](https://openjdk.java.net/)
* [Maven](https://maven.apache.org/)

## Building the Plug-in

Just run ```mvn clean install```. you will find the zip bundle in the target directory of the [build module](./build-module). 

## Compatibility Notice

This plugin is currently compatible with the following Camunda Modeler versions.

| Camunda Modeler | Code Editor Plugin |
|-----------------|--------------------|
| 3.4 - 4.12      | 0.5.2              |
| 5.x             | 1.0 or newer       |



## Additional Resources

* [Codemirror editor ](https://codemirror.net/)
* [List of existing plug-ins](https://github.com/camunda/camunda-modeler-plugins)
* [Plug-ins documentation](https://github.com/camunda/camunda-modeler/tree/master/docs/plugins)


## Licence

MIT

This software includes [JS-Interpreter](https://github.com/NeilFraser/JS-Interpreter) based on Apache 2.0 license
