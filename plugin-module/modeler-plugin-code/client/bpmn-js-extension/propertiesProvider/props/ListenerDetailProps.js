import scriptImplementation from './implementation/Script';

import { find } from 'lodash';

export default function(group, element, translate, eventBus, commandStack) {
  let listenerScript = find(group.entries, (entry) => entry.id === 'listener-script-value');
  if (listenerScript) {
    let script = scriptImplementation('scriptFormat', 'value', true, translate, eventBus, commandStack);
    script.callback = listenerScript.set;
    listenerScript.html = '<div data-show="isScript">' +
      script.template +
      '</div>';
    listenerScript.script = script;
  }
}