import scriptImplementation from './implementation/Script';

import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

import { find } from 'lodash';

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

  }
}