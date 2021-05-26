import React, { useState } from 'camunda-modeler-plugin-helpers/react';
import Input from '../UI/Input';

import { updateObject, checkValidity } from '../../utils/fieldUtil';

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
      elementType: 'input',
      elementConfig: {
        type: 'text'
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

  const [validRows, setValidRows] = useState({});

  const [, setTableIsValid] = useState(false);

  const inputChangeHandler = (event, inputIdentifier, index, rowObject) => {
    const key = '' + index;
    const oldRow = validRows[key];
    const oldObject = oldRow[inputIdentifier];

    const updatedObject = updateObject(oldObject, {
      value: event.target.value,
      ...checkValidity(event.target.value, contextColumns[inputIdentifier].validation)
    });
    const updatedRow = updateObject(oldRow, {
      [inputIdentifier]: updatedObject
    });
    const updatedRows = updateObject(validRows, {
      [key]: updatedRow
    });
    setValidRows(updatedRows);

    let tableValid = true;
    Object.keys(validRows).forEach(row => {
      Object.keys(row).forEach(column => {
        tableValid = column.valid && tableValid;
      });
    });

    setTableIsValid(tableValid);
    props.updateRowContext(inputIdentifier, event.target.value, index, rowObject);
  };

  const addRow = () => {
    let index = Object.keys(validRows).length;
    let newRow = { ...validRows };
    let newObj = newRow[index] = {};

    Object.keys(contextColumns).map(key => {
      newObj[key] = {
        value: '',
        ...checkValidity('', contextColumns[key].validation)
      };
    });

    setValidRows(newRow);

    props.addRowContext();
  };
  const removeRow = () => {};

  const rows = props.context.map((rowObject, index) => {

    const keys = Object.keys(contextColumns);
    const columns = keys.map(key => <td key={key + '_col_' + index}>
      <Input
        key={key + '_' + index}
        elementType={contextColumns[key].elementType}
        elementConfig={contextColumns[key].elementConfig}
        value={rowObject[key]}
        invalid={!validRows['' + index][key].valid}
        errorMessage={validRows['' + index][key].errorMessage}
        changed={event => inputChangeHandler(event, key, index, rowObject)}
      />
    </td>);
    return (<tr key={index}>
      {columns}
      <td>
        <button type="button" onClick={() => removeRow(index, rowObject)} className="context-removeRow">-</button>
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
          <button type="button" onClick={() => addRow()} className="context-addRow">+</button>
        </th>
      </tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>);
};
export default ContextTable;