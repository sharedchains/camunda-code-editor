import CodePropertiesProvider from './propertiesProvider/CodePropertiesProvider';
import DisableModelingCode from './disableModeling/DisableModeling';

/**
 * A bpmn-js module, defining all extension services and their dependencies.
 *
 */
export default {
  __init__: ['CodePropertiesProvider', 'DisableModelingCode'],
  CodePropertiesProvider: ['type', CodePropertiesProvider],
  DisableModelingCode: ['type', DisableModelingCode],
};
