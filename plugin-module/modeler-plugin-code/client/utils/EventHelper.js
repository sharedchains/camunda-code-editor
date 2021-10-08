/**
 * A list of event types called on {@link eventBus}
 * @type {string}
 */

let codePrefix = 'codeEditor';

const LOADED_CODE_EDITOR = codePrefix + '.init';
const OPEN_CODE_EDITOR = codePrefix + '.open';
const SAVE_CODE_EDITOR = codePrefix + '.saveData';
const RUN_CODE_EDITOR = codePrefix + '.run';
const STOP_CODE_EDITOR = codePrefix + '.stop';
const GET_DATA_TYPES = codePrefix + '.getTypes';


export {
  OPEN_CODE_EDITOR,
  SAVE_CODE_EDITOR,
  RUN_CODE_EDITOR,
  STOP_CODE_EDITOR,
  LOADED_CODE_EDITOR,
  GET_DATA_TYPES
};

/**
 * Variable Data Types
 */
export const DATA_TYPES = [
  { value: '', name: '' },
  { value: 'BOOLEAN', name: 'Boolean' },
  { value: 'BYTES', name: 'Byte Array' },
  { value: 'STRING', name: 'String' },
  { value: 'SHORT', name: 'Short' },
  { value: 'DOUBLE', name: 'Double' },
  { value: 'INTEGER', name: 'Integer' },
  { value: 'LONG', name: 'Long' },
  { value: 'DATE', name: 'Date' },
  { value: 'DATETIME', name: 'Date & time' },
  { value: 'JSON', name: 'JSON' },
  { value: 'XML', name: 'XML' }
]
;
