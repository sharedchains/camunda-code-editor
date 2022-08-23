import { useService } from 'bpmn-js-properties-panel';
import { jsxs } from '@bpmn-io/properties-panel/preact/jsx-runtime';

import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { TextFieldEntry } from '@bpmn-io/properties-panel';

import { OPEN_CODE_EDITOR, SAVE_CODE_EDITOR } from '../../../utils/EventHelper';

// Components
export function Script(props) {
  const {
    element,
    idPrefix,
    script
  } = props;

  const eventBus = useService('eventBus');
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const businessObject = script || getBusinessObject(element);
  const scriptProperty = getScriptProperty(businessObject);

  const getValue = () => {
    return getScriptValue(businessObject);
  };

  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: businessObject,
      properties: {
        [scriptProperty]: value || ''
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
        mode: getScriptFormat(businessObject),
        inputParameters: []
      });

    },
    children: [
      TextFieldEntry({
        element,
        id: idPrefix + 'scriptValue',
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
  const businessObject = getBusinessObject(element);
  const scriptValue = getScriptValue(businessObject);

  if (typeof scriptValue !== 'undefined') {
    return 'script';
  }

  const resource = businessObject.get('camunda:resource');

  if (typeof resource !== 'undefined') {
    return 'resource';
  }
}

export function getScriptFormat(businessObject) {
  return businessObject.get('scriptFormat');
}

function getScriptValue(businessObject) {
  return businessObject.get(getScriptProperty(businessObject));
}

function getScriptProperty(businessObject) {
  return isScript(businessObject) ? 'value' : 'script';
}

function isScript(element) {
  return is(element, 'camunda:Script');
}