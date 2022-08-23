import { find, includes } from 'lodash';
import { DATA_TYPES, LOADED_CODE_EDITOR } from '../../utils/EventHelper';
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
import { isTextFieldEntryEdited } from '@bpmn-io/properties-panel';

import { Script, getScriptType, getScriptFormat } from './props/ScriptProps';

import {
  ConditionalScript,
  getScriptLanguage,
  getScriptType as getConditionalScriptType
} from './props/ConditionalProps';

const SUPPORTED_LANGUAGES = [ 'groovy', 'javascript' ];

/**
 * Our custom PropertiesProvider, replacing default camunda fields like scriptTaskProps with our custom properties.
 *
 */
export default class CodePropertiesProvider {

  constructor(propertiesPanel, injector) {
    propertiesPanel.registerProvider(200, this);

    this.injector = injector;

    let eventBus = injector.get('eventBus');
    eventBus.fire(LOADED_CODE_EDITOR, { dataTypes: DATA_TYPES });
  }

  /**
   * Return the groups provided for the given element.
   *
   * @param element
   *
   * @return groups middleware
   */
  getGroups(element) {
    return groups => {

      const businessObject = getBusinessObject(element);
      let scriptGroup = find(groups, entry => entry.id === 'CamundaPlatform__Script');
      if (scriptGroup && getScriptType(element) === 'script' && includes(SUPPORTED_LANGUAGES, getScriptFormat(businessObject))) {
        let script = find(scriptGroup.entries, entry => entry.id === 'scriptValue');

        script.component = Script;
        script.isEdited = isTextFieldEntryEdited;
      }

      let conditionGroup = find(groups, entry => entry.id === 'CamundaPlatform__Condition');
      if (conditionGroup && getConditionalScriptType(element) === 'script' && includes(SUPPORTED_LANGUAGES, getScriptLanguage(businessObject))) {
        let script = find(conditionGroup.entries, entry => entry.id === 'conditionScriptValue');

        script.component = ConditionalScript;
        script.isEdited = isTextFieldEntryEdited;
      }

      // Listeners
      let taskListenerGroup = find(groups, entry => entry.id === 'CamundaPlatform__TaskListener');
      if (taskListenerGroup) {
        decorateGroup(taskListenerGroup);
      }
      let execListenerGroup = find(groups, entry => entry.id === 'CamundaPlatform__ExecutionListener');
      if (execListenerGroup) {
        decorateGroup(execListenerGroup);
      }

      // I/O Params
      let inputGroup = find(groups, entry => entry.id === 'CamundaPlatform__Input');
      if (inputGroup) {
        decorateGroup(inputGroup);
      }
      let outputGroup = find(groups, entry => entry.id === 'CamundaPlatform__Output');
      if (outputGroup) {
        decorateGroup(outputGroup);
      }

      // Zeebee???

      return groups;
    };
  }

}

function decorateGroup(group) {
  group.items.map(item => {
    let scriptValue = find(item.entries, entry => entry.id.endsWith('scriptValue'));

    if (scriptValue) {
      let scriptObject = scriptValue.script;
      let scriptFormat = scriptObject.get('scriptFormat');

      if (includes(SUPPORTED_LANGUAGES, scriptFormat)) {
        scriptValue.component = Script;
        scriptValue.isEdited = isTextFieldEntryEdited;
      }
    }
  });
}

CodePropertiesProvider.$inject = [ 'propertiesPanel', 'injector' ];



