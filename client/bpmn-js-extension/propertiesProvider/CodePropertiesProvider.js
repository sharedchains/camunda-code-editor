import inherits from 'inherits';

import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';

import { find } from 'lodash';
import scriptTaskProps from './parts/ScriptTaskProps';
import { is } from 'bpmn-js/lib/util/ModelUtil';


export default function CodePropertiesProvider(eventBus, commandStack, bpmnFactory, translate, selection, propertiesProvider) {
  PropertiesActivator.call(this, eventBus);

  let camundaGetTabs = propertiesProvider.getTabs;
  propertiesProvider.getTabs = function(element) {

    const array = camundaGetTabs(element);
    let generalTab = find(array, { id: 'general' });
    let detailsTab = find(generalTab.groups, { id: 'details' });
    if (is(element, 'bpmn:ScriptTask') && detailsTab) {
      scriptTaskProps(detailsTab, element, translate, eventBus, commandStack);
    }
    return array;
  };
}

inherits(CodePropertiesProvider, PropertiesActivator);

CodePropertiesProvider.$inject = ['eventBus', 'commandStack', 'bpmnFactory', 'translate', 'selection', 'propertiesProvider'];