import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import scriptImplementation from './implementation/Script';

import { is, getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

import { remove } from 'lodash';

export default function(group, element, translate, eventBus, commandStack) {

  let scriptLanguage = remove(group.entries, (entry) => entry.id === 'script-implementation' || entry.id === 'scriptResultVariable');
  if (scriptLanguage) {
    let bo;

    if (is(element, 'bpmn:ScriptTask')) {
      bo = getBusinessObject(element);
    }

    if (!bo) {
      return;
    }

    let script = scriptImplementation('scriptFormat', 'script', false, translate, eventBus, commandStack);
    group.entries.push({
      id: 'script-implementation',
      label: translate('Script'),
      html: script.template,

      get: function(element) {
        return script.get(element, bo);
      },

      set: function(element, values, containerElement) {
        var properties = script.set(element, values, containerElement);

        return cmdHelper.updateProperties(element, properties);
      },

      validate: function(element, values) {
        return script.validate(element, values);
      },

      script: script,

      cssClasses: ['bpp-textfield']

    });

    group.entries.push(entryFactory.textField(translate, {
      id: 'scriptResultVariable',
      label: translate('Result Variable'),
      modelProperty: 'scriptResultVariable',

      get: function(element, propertyName) {
        var boResultVariable = bo.get('camunda:resultVariable');

        return { scriptResultVariable: boResultVariable };
      },

      set: function(element, values, containerElement) {
        return cmdHelper.updateProperties(element, {
          'camunda:resultVariable': values.scriptResultVariable.length
            ? values.scriptResultVariable
            : undefined
        });
      }

    }));
  }
}