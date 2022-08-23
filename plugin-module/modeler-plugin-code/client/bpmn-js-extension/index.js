import CodePropertiesProvider from './propertiesProvider/CodePropertiesProvider';
import DisableModelingCode from './disableModeling/DisableModeling';
import EventBasedExecutor from './executor/EventBasedExecutor';

/**
 * A bpmn-js module, defining all extension services and their dependencies.
 *
 */
export default {
  __init__: [ 'codePropertiesProvider', 'disableModelingCode', 'eventBasedExecutor' ],
  codePropertiesProvider: [ 'type', CodePropertiesProvider ],
  disableModelingCode: [ 'type', DisableModelingCode ],
  eventBasedExecutor: [ 'type', EventBasedExecutor ]
};
