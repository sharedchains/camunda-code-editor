import {
  registerBpmnJSModdleExtension,
  registerBpmnJSPlugin, registerClientExtension
} from 'camunda-modeler-plugin-helpers';

import BpmnExtensionModule from './bpmn-js-extension';
import CodeFragment from './react/Code/CodeFragment';

import dataModdle from './bpmn-js-extension/propertiesProvider/descriptors/data.json';

registerBpmnJSPlugin(BpmnExtensionModule);
registerBpmnJSModdleExtension(dataModdle);

registerClientExtension(CodeFragment);
