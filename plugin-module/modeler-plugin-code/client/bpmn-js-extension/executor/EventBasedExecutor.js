import { RUN_CODE_EDITOR, GET_DATA_TYPES, DATA_TYPES } from '../../utils/EventHelper';
import GroovyAPI from '../../utils/executors/GroovyAPI';
import { encode } from 'js-base64';

/**
 * Implements intercommunication events between different plugins/modules
 * @param eventBus
 * @constructor
 */
export default function EventBasedExecutor(eventBus) {

  /**
   * Receives data from the UI. Encodes the code script and calls the LanguageExecutor (groovy) to run it in safe mode
   */
  eventBus.on(RUN_CODE_EDITOR, (event, code, context) => {

    // TODO: server port should be externalized in a variable like language_executor_path
    const groovyExecutor = new GroovyAPI('http://localhost:12421');
    const base64 = encode(code);
    return groovyExecutor.executeGroovy({ code: base64, context: context });
  });

  /**
   * Returns the DATA_TYPES available for context variables
   */
  eventBus.on(GET_DATA_TYPES, () => {
    return {
      dataTypes: DATA_TYPES
    };
  });
}

EventBasedExecutor.$inject = ['eventBus'];