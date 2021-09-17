import { RUN_CODE_EDITOR, GET_DATA_TYPES, DATA_TYPES } from '../../utils/EventHelper';
import GroovyAPI from '../../utils/executors/GroovyAPI';
import { encode } from 'js-base64';

export default function EventBasedExecutor(eventBus) {

  eventBus.on(RUN_CODE_EDITOR, (event, code, context) => {
    const groovyExecutor = new GroovyAPI('http://localhost:12421');
    const base64 = encode(code);
    return groovyExecutor.executeGroovy({ code: base64, context: context });
  });

  eventBus.on(GET_DATA_TYPES, () => {
    return {
      dataTypes: DATA_TYPES
    };
  });
}

EventBasedExecutor.$inject = ['eventBus'];