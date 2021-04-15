import {
  registerBpmnJSPlugin, registerClientExtension
} from 'camunda-modeler-plugin-helpers';

import BpmnExtensionModule from './bpmn-js-extension';
import CodeFragment from './react/Code/CodeFragment';


registerBpmnJSPlugin(BpmnExtensionModule);

registerClientExtension(CodeFragment);
