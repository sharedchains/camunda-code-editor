import { find } from 'lodash';
import { DATA_TYPES, LOADED_CODE_EDITOR, OPEN_CODE_EDITOR, SAVE_CODE_EDITOR } from '../../utils/EventHelper';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { jsxs } from '@bpmn-io/properties-panel/preact/jsx-runtime';

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

      let scriptGroup = find(groups, entry => entry.id === 'CamundaPlatform__Script');
      const businessObject = getBusinessObject(element);
      if (getScriptType(element) === 'script' && (getScriptFormat(businessObject) === 'groovy' || getScriptFormat(businessObject) === 'javascript')) {
        let script = find(scriptGroup.entries, entry => entry.id === 'scriptValue');

        script.component = Script;
        script.isEdited = isTextFieldEntryEdited;
      }

      return groups;
    };
  }

  // const array = camundaGetTabs(element);
  // let generalTab = find(array, { id: 'general' });
  // let detailsGroup = find(generalTab.groups, { id: 'details' });
  // if (detailsGroup) {
  //   scriptTaskProps(detailsGroup, element, translate, eventBus, commandStack);
  //   conditionalProps(detailsGroup, element, translate, eventBus, commandStack);
  // }
  //
  // let listenersTab = find(array, { id: 'listeners' });
  // if (listenersTab) {
  //   let listenerDetailsGroup = find(listenersTab.groups, { id: 'listener-details' });
  //   if (listenerDetailsGroup) {
  //     listenerDetailProps(listenerDetailsGroup, element, translate, eventBus, commandStack);
  //   }
  // }
  // let inputOutputTab = find(array, { id: 'input-output' });
  // if (inputOutputTab) {
  //   inputOutputTab.groups.forEach(group => {
  //     inputOutputProps(group, element, translate, eventBus, commandStack);
  //   });
  // }
  //
  // return array;
}

CodePropertiesProvider.$inject = [ 'propertiesPanel', 'injector' ];

// Components
function Script(props) {
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
        data: getScriptValue(businessObject),
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
        description: translate('Click to edit documentation')
      })
    ]
  });

}

// helper utils
function getScriptType(element) {
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

function getScriptFormat(businessObject) {
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