import scriptImplementation from './implementation/Script';

import { find } from 'lodash';
import { escapeHTML } from 'bpmn-js-properties-panel/lib/Utils';

export default function(group, element, translate, eventBus, commandStack) {
  let conditionalScript = find(group.entries, (entry) => entry.id === 'condition');
  if (conditionalScript) {
    let script = scriptImplementation('language', 'body', true, translate, eventBus, commandStack);
    script.callback = (el, values, containerElement) => {
      let additionalProperties = conditionalScript.get(el);
      return conditionalScript.set(el, { ...additionalProperties, ...values }, containerElement);
    };
    conditionalScript.script = script;
    conditionalScript.html = '<div class="bpp-row">' +
      '<label for="cam-condition-type">' + escapeHTML(translate('Condition Type')) + '</label>' +
      '<div class="bpp-field-wrapper">' +
      '<select id="cam-condition-type" name="conditionType" data-value>' +
      '<option value="expression">' + escapeHTML(translate('Expression')) + '</option>' +
      '<option value="script">' + escapeHTML(translate('Script')) + '</option>' +
      '<option value="" selected></option>' +
      '</select>' +
      '</div>' +
      '</div>' +

      // expression
      '<div class="bpp-row">' +
      '<label for="cam-condition" data-show="isExpression">' + escapeHTML(translate('Expression')) + '</label>' +
      '<div class="bpp-field-wrapper" data-show="isExpression">' +
      '<input id="cam-condition" type="text" name="condition" />' +
      '<button class="action-button clear" data-action="clear" data-show="canClear">' +
      '<span>X</span>' +
      '</button>' +
      '</div>' +
      '<div data-show="isScript">' +
      script.template +
      '</div>' +
      '</div>';
  }
}