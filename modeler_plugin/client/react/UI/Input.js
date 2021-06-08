import React from 'camunda-modeler-plugin-helpers/react';

const input = (props) => {
  let inputElement;
  let validationError = null;
  let inputClasses = ['contextInput'];

  if (props.invalid) {
    inputClasses.push('invalid'); // Da controllare
    validationError = <p className="validationError">{props.errorMessage}</p>;
  }

  switch (props.elementType) {
  case 'textarea':
    inputElement = <textarea
      className={inputClasses.join(' ')}
      {...props.elementConfig}
      value={props.value}
      onChange={props.changed}
      onKeyDown={props.keyDown}
    />;
    break;
  case 'select':
    inputElement = <select className={inputClasses.join(' ')}
      value={props.value}
      onChange={props.changed}>
      {props.elementConfig.options.map(option => (
        <option key={option.value} value={option.value}>{option.displayValue}</option>
      ))}
    </select>;
    break;
  case 'input':
  default:
    inputElement = <input
      className={inputClasses.join(' ')}
      {...props.elementConfig}
      value={props.value}
      onChange={props.changed}
      onKeyDown={props.keyDown}
    />;
  }
  return (
    <div>
      {inputElement}
      {validationError}
    </div>
  );
};
export default input;