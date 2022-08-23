import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { find } from 'lodash';
import { jsxs } from '@bpmn-io/properties-panel/preact/jsx-runtime';
import { OPEN_CODE_EDITOR, SAVE_CODE_EDITOR } from '../../../utils/EventHelper';
import { TextFieldEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

// Components
export function ConditionalScript(props) {
  const {
    element
  } = props;

  const eventBus = useService('eventBus');
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return getConditionExpression(element).get('body');
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element: element,
      moddleElement: getConditionExpression(element),
      properties: {
        'body': value || ''
      }
    });
  };

  return jsxs('div', {
    onClick: () => {

      eventBus.once(SAVE_CODE_EDITOR, 10000, event => {
        const { data } = event;
        setValue(data);
      });

      eventBus.fire(OPEN_CODE_EDITOR, {
        element: element,
        data: getValue(),
        mode: getScriptLanguage(element),
        inputParameters: []
      });

    },
    children: [
      TextFieldEntry({
        element,
        id: 'conditionScriptValue',
        label: translate('Script'),
        disabled: true,
        getValue,
        setValue,
        debounce,
        description: translate('Click to edit script')
      })
    ]
  });
}

// helper utils
export function getScriptType(element) {
  const conditionExpression = getConditionExpression(element);
  if (conditionExpression) {
    const resource = conditionExpression.get('camunda:resource');

    if (typeof resource !== 'undefined') {
      return 'resource';
    } else {
      return 'script';
    }
  }
}

export function getScriptLanguage(element) {
  return getConditionExpression(element).get('language');
}

/**
 * getConditionExpression - get the body value of a condition expression for a given element
 *
 * @param  {ModdleElement} element
 *
 * @return {string|undefined}
 */


function getConditionExpression(element) {
  const businessObject = getBusinessObject(element);

  if (is(businessObject, 'bpmn:SequenceFlow')) {
    return businessObject.get('conditionExpression');
  } else if (getConditionalEventDefinition(businessObject)) {
    return getConditionalEventDefinition(businessObject).get('condition');
  }
}

function getConditionalEventDefinition(element) {
  if (!is(element, 'bpmn:Event')) {
    return false;
  }

  return getEventDefinition(element, 'bpmn:ConditionalEventDefinition');
}

function getEventDefinition(element, eventType) {
  const businessObject = getBusinessObject(element);
  const eventDefinitions = businessObject.get('eventDefinitions') || [];
  return find(eventDefinitions, function(definition) {
    return is(definition, eventType);
  });
}