import inherits from 'inherits';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

import { find } from 'lodash';
import scriptTaskProps from './parts/ScriptTaskProps';
import listenerDetailProps from './parts/ListenerDetailProps';
import conditionalProps from './parts/ConditionalProps';
import inputOutputProps from './parts/InputOutputProps';
import { DATA_TYPES, LOADED_CODE_EDITOR } from '../../utils/EventHelper';

export default function CodePropertiesProvider(eventBus, commandStack, bpmnFactory, translate, selection, propertiesProvider) {
  PropertiesActivator.call(this, eventBus);

  eventBus.fire(LOADED_CODE_EDITOR, { dataTypes: DATA_TYPES });

  let camundaGetTabs = propertiesProvider.getTabs;
  propertiesProvider.getTabs = function(element) {

    const array = camundaGetTabs(element);
    let generalTab = find(array, { id: 'general' });
    let detailsGroup = find(generalTab.groups, { id: 'details' });
    if (detailsGroup) {
      scriptTaskProps(detailsGroup, element, translate, eventBus, commandStack);
      conditionalProps(detailsGroup, element, translate, eventBus, commandStack);
    }

    let listenersTab = find(array, { id: 'listeners' });
    if (listenersTab) {
      let listenerDetailsGroup = find(listenersTab.groups, { id: 'listener-details' });
      if (listenerDetailsGroup) {
        listenerDetailProps(listenerDetailsGroup, element, translate, eventBus, commandStack);
      }
    }
    let inputOutputTab = find(array, { id: 'input-output' });
    if (inputOutputTab) {
      inputOutputTab.groups.forEach(group => {
        inputOutputProps(group, element, translate, eventBus, commandStack);
      });
    }

    return array;
  };
}

inherits(CodePropertiesProvider, PropertiesActivator);

CodePropertiesProvider.$inject = ['eventBus', 'commandStack', 'bpmnFactory', 'translate', 'selection', 'propertiesProvider'];