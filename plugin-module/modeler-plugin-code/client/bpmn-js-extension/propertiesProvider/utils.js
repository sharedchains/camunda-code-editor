import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

export const getCorrectBusinessObject = function(element, isProcessDocumentation) {
  let businessObject = getBusinessObject(element);
  if (is(element, 'bpmn:Participant') && isProcessDocumentation) {
    businessObject = businessObject.processRef;
  }
  return businessObject;
};