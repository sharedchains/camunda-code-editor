// function htmlEncode(str) {
//   if (typeof str !== 'string') return str;
//   return str.replace(/[&<>"']/g, function($0) {
//     return '&' + { '&': 'amp', '<': 'lt', '>': 'gt', '"': 'quot', '\'': '#39' }[$0] + ';';
//   });
// }

export default function logger(container) {

  let empty = true;
  const add = something => {
    const node = document.createElement('div');
    let text = String(something);
    let parsed;

    try {
      parsed = String(JSON.parse(text));
    } catch (error) {
      parsed = text;
    }

    // node.innerHTML = '<p>' + htmlEncode(parsed).replace(/\\n/, '<br />') + '</p>';
    node.innerHTML = '<p>' + parsed + '</p>';
    if (empty) {
      container.innerHTML = '';
      empty = false;
    }
    container.appendChild(node);
  };

  (function() {
    const originalError = console.error;
    const originalLog = console.log;
    const originalWarning = console.warn;
    const originalInfo = console.info;
    const originalClear = console.clear;

    console.error = function(error) {
      add(error.stack);
      originalError.apply(console, arguments);
    };
    console.log = function(...args) {
      args.forEach(add);
      originalLog.apply(console, args);
    };
    console.warn = function(...args) {
      args.forEach(add);
      originalWarning.apply(console, args);
    };
    console.info = function(...args) {
      args.forEach(add);
      originalInfo.apply(console, args);
    };
    console.clear = function(...args) {
      container.innerHTML = '';
      originalClear.apply(console, args);
    };
  })();

  return {
    clearConsole: function clearConsole(hintValue = '') {
      empty = true;
      container.innerHTML = hintValue;
    },
    addToConsole: add
  };
}