import scriptImplementation from './implementation/Script';

import { find } from 'lodash';

export default function(group, element, translate, eventBus, commandStack) {
  let inputOutputScript = find(group.entries, (entry) => entry.id.endsWith('parameterType-script'));
  if (inputOutputScript) {
    let index = inputOutputScript.id.indexOf('parameterType-script');
    let idPrefix = inputOutputScript.id.substring(0, index);
    let script = scriptImplementation('scriptFormat', 'value', true, translate, eventBus, commandStack, { idPrefix: idPrefix });
    script.callback = inputOutputScript.set;
    inputOutputScript.html = '<div data-show="show">' +
      script.template +
      '</div>';
    inputOutputScript.script = script;
  }
}