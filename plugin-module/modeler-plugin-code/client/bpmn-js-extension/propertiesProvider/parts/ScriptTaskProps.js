import scriptImplementation from './implementation/Script';

import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import { find } from 'lodash';
import { DATA_TYPES, GET_DATA_RESULT_VARIABLE_TYPE, SET_DATA_RESULT_VARIABLE_TYPE } from '../../../utils/EventHelper';

export default function(group, element, translate, eventBus, commandStack) {

  let originalScriptTaskProps = find(group.entries, (entry) => entry.id === 'script-implementation');
  if (originalScriptTaskProps) {
    let bo;

    if (is(element, 'bpmn:ScriptTask')) {
      bo = getBusinessObject(element);
    }

    if (!bo) {
      return;
    }

    let script = scriptImplementation('scriptFormat', 'script', false, translate, eventBus, commandStack);
    script.callback = originalScriptTaskProps.set;
    originalScriptTaskProps.html = script.template;
    originalScriptTaskProps.script = script;

    group.entries.push(entryFactory.selectBox(translate, {
      id: 'scriptResultVariableType',
      label: translate('Result Variable Type'),
      selectOptions: DATA_TYPES,
      modelProperty: 'scriptResultVariableType',
      get: function(elem) {
        let businessObject = getBusinessObject(elem);
        let resultVariableType = undefined;
        if (businessObject.resultVariable) {
          resultVariableType = eventBus.fire(GET_DATA_RESULT_VARIABLE_TYPE,
            {
              element: businessObject,
              resultVariable: businessObject.resultVariable
            }
          );
        }
        return { scriptResultVariableType: resultVariableType };
      },
      set: function(elem, values) {
        let businessObject = getBusinessObject(elem);
        eventBus.fire(SET_DATA_RESULT_VARIABLE_TYPE,
          {
            element: businessObject,
            resultVariable: businessObject.resultVariable,
            resultVariableType: values.scriptResultVariableType
          }
        );
        return [];
      }
    }));

  }
}