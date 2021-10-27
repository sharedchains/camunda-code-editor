/**
 * Utility function to update an object on react. In fact, react uses immutable objects, so this function creates instead
 * a new object with the updated properties.
 * @param oldObject
 * @param updatedProperties
 * @returns {*}
 */
export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties
  };
};

/**
 * Validation utility for react values
 * @param value
 * @param rules
 * @returns {{valid: boolean, errorMessage: null}}
 */
export const checkValidity = (value, rules) => {
  let isValid = true;
  let errorMessage = null;
  if (rules.required && isValid) {
    let requiredValid = value.trim() !== '';
    isValid = requiredValid && isValid;
    errorMessage = !requiredValid ? 'This field is required' : null;
  }
  if (rules.minLength && isValid) {
    let minLengthValid = value.length >= rules.minLength;
    let minLength = rules.minLength;
    isValid = minLengthValid && isValid;
    errorMessage = !minLengthValid ? `You must type at least ${minLength}` : null;
  }
  if (rules.maxLength && isValid) {
    let maxLengthValid = value.length <= rules.maxLength;
    let maxLength = rules.maxLength;
    isValid = maxLengthValid && isValid;
    errorMessage = !maxLengthValid ? `This field is max ${maxLength} length long` : null;
  }
  if (rules.isEmail && isValid) {
    const pattern = /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
    isValid = pattern.test(value) && isValid;
    errorMessage = !pattern.test(value) ? 'This field is not a valid E-Mail' : null;
  }
  if (rules.isNumeric && isValid) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
    errorMessage = !pattern.test(value) ? 'This field is not numeric' : null;
  }
  
  if(rules.vectorLength && isValid){
    let isCorrectLength = rules.vectorLength == (value.split(',')).length;
    isValid = isCorrectLength;
    errorMessage =  !isCorrectLength ? 'The array length is incorrect' : null;
  }
  return { valid: isValid, errorMessage: errorMessage };
};

