
/* import { transform } from '@babel/core';

const babelOptions = {
  presets: [['es2015', { 'modules': false }]]
};

function preprocess(str) {
  const { code } = transform(str, babelOptions);

  return code;
}*/

export default function executeCode(code) {
  try {
    (new Function(code))();
  } catch (error) {
    console.error(error);
  }
}

