import { escape } from 'lodash';

export default function editorConsole(container) {

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

    node.innerHTML = '<p>' + escape(parsed) + '</p>';
    if (empty) {
      container.innerHTML = '';
      empty = false;
    }
    container.appendChild(node);
  };

  return {
    clearConsole: function clearConsole(hintValue = '') {
      empty = true;
      container.innerHTML = hintValue;
    },
    addToConsole: add
  };
}