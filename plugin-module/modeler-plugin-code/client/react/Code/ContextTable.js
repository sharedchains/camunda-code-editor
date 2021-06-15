import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import Input from '../UI/Input';

import { updateObject, checkValidity } from '../../utils/fieldUtil';

const SPACE_KEY = 32;
const BACKSPACE_KEY = 8;

const ContextTable = (props) => {

  const contextColumns = {
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text'
      },
      validation: {
        required: true
      }
    },
    type: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: '', displayValue: '' },
          { value: 'BOOLEAN', displayValue: 'Boolean' },
          { value: 'BYTES', displayValue: 'Byte Array' },
          { value: 'STRING', displayValue: 'String' },
          { value: 'SHORT', displayValue: 'Short' },
          { value: 'DOUBLE', displayValue: 'Double' },
          { value: 'INTEGER', displayValue: 'Integer' },
          { value: 'LONG', displayValue: 'Long' },
          { value: 'DATE', displayValue: 'Date' },
          { value: 'DATETIME', displayValue: 'Date & time' },
          { value: 'JSON', displayValue: 'JSON' },
          { value: 'XML', displayValue: 'XML' }
        ]
      },
      validation: {
        required: true
      }
    },
    value: {
      elementType: 'textarea',
      elementConfig: {
        rows: 1
      },
      validation: {
        required: true
      }
    }
  };

  const [validRows, setValidRows] = useState([]);

  const [, setTableIsValid] = useState(false);

  const inputChangeHandler = (event, inputIdentifier, index) => {
    let input = event.target;

    const updatedRows = [...validRows];
    const oldRow = validRows[index];
    const oldObject = oldRow[inputIdentifier];

    const updatedObject = updateObject(oldObject, {
      value: input.value,
      ...checkValidity(input.value, contextColumns[inputIdentifier].validation)
    });
    const updatedRow = updateObject(oldRow, {
      [inputIdentifier]: updatedObject
    });

    updatedRows.splice(index, 1, updatedRow);
    setValidRows(updatedRows);

    let tableValid = true;
    Object.keys(validRows).forEach(row => {
      Object.keys(row).forEach(column => {
        tableValid = column.valid && tableValid;
      });
    });

    setTableIsValid(tableValid);
    props.updateRowContext(inputIdentifier, input.value, index);
  };

  const addRow = () => {
    let newRow = [...validRows];
    let newObj = {};

    Object.keys(contextColumns).map(key => {
      newObj[key] = {
        value: '',
        ...checkValidity('', contextColumns[key].validation)
      };
    });
    newRow.push(newObj);
    setValidRows(newRow);

    props.addRowContext();
  };
  const removeRow = (index) => {
    let oldRows = [...validRows];
    oldRows.splice(index, 1);
    setValidRows(oldRows);
    props.removeRowContext(index);
  };

  const handleKeyDown = (event, elementType) => {

    // Small workaround for space and backspace not working
    if (event.keyCode === SPACE_KEY || event.keyCode === BACKSPACE_KEY) {
      event.preventDefault();

      let input = event.target;
      let newValue;
      if (event.keyCode === SPACE_KEY) {
        newValue = input.value + ' ';
      } else {
        let position = input.selectionStart;
        const splittedValue = Array.from(input.value);
        splittedValue.splice(position - 1, 1);
        newValue = splittedValue.join('');

        setTimeout(() => input.selectionStart = input.selectionEnd = (position - 1), 50);
      }

      let type = elementType === 'input' ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype;
      let nativeInputValueSetter = Object.getOwnPropertyDescriptor(type, 'value').set;
      nativeInputValueSetter.call(input, newValue);

      let ev2 = new Event('input', { bubbles: true });
      input.dispatchEvent(ev2);
    }
  };

  const rows = props.context.map((rowObject, index) => {

    const keys = Object.keys(contextColumns);
    const columns = keys.map(key => <td key={key + '_col_' + index}>
      <Input
        key={key + '_' + index}
        elementType={contextColumns[key].elementType}
        elementConfig={contextColumns[key].elementConfig}
        value={rowObject[key]}
        invalid={!validRows[index][key].valid}
        errorMessage={validRows[index][key].errorMessage}
        changed={event => inputChangeHandler(event, key, index, rowObject)}
        keyDown={event => handleKeyDown(event, contextColumns[key].elementType)}
      />
    </td>);
    return (<tr key={index}>
      {columns}
      <td>
        <button
          type="button"
          onClick={() => removeRow(index, rowObject)}
          className="context-buttons context-removeRow">-
        </button>
      </td>
    </tr>);
  });

  return (<table className="context-table">
    <thead>
      <tr key="context-title">
        {
          Object.keys(contextColumns).map(item => <th key={item} className="contextFieldTitle">{item}</th>)
        }
        <th>
          <button type="button" onClick={() => addRow()} className="context-buttons context-addRow">+</button>
        </th>
      </tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>);
};
export default ContextTable;