/**
 * @license
 * Copyright 2015 camunda Services GmBH
 * SPDX-License-Identifier: MIT
 *
 * @link https://github.com/bpmn-io/bpmn-js-properties-panel/blob/master/lib/provider/camunda/parts/implementation/Script.js
 */

import { OPEN_CODE_EDITOR, SAVE_CODE_EDITOR } from '../../../../utils/EventHelper';
import { query as domQuery } from 'min-dom';

import { escapeHTML, selectedType } from 'bpmn-js-properties-panel/lib/Utils';

// import {ExtensionElementsHelper} from 'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'
import InputOutputHelper from 'bpmn-js-properties-panel/lib/helper/InputOutputHelper';
function getScriptType(node, idPrefix) {

  // if we have an idPrefix, work with specific selector
  let selector;

  if (idPrefix && idPrefix != '') {
    selector = 'select[id="' + idPrefix + 'cam-script-type"]';
  } else {
    selector = 'select[name="scriptType"]';
  }

  return selectedType(selector, node.parentElement);
}

function canOpenCodeEditor(scopeNode, idPrefix) {
  let input = domQuery('input[name=scriptFormat]', scopeNode);
  let scriptType = getScriptType(scopeNode, idPrefix);

  return scriptType === 'script' && (input.value.toLowerCase() === 'javascript' || input.value.toLowerCase() === 'groovy');
}

function updateValues(scriptValuePropName, scriptLanguagePropName, isFormatRequired, scriptFormat, scriptType, scriptResourceValue, scriptValue) {
  let update = {
    'camunda:resource': undefined
  };
  update[scriptValuePropName] = undefined;
  update[scriptLanguagePropName] = undefined;

  if (isFormatRequired) {

    // always set language
    update[scriptLanguagePropName] = scriptFormat || '';
  } else

  // set language only when scriptFormat has a value
  if (scriptFormat !== '') {
    update[scriptLanguagePropName] = scriptFormat;
  }

  // set either inline script or resource
  if ('scriptResource' === scriptType) {
    update['camunda:resource'] = scriptResourceValue || '';
  } else {
    update[scriptValuePropName] = scriptValue || '';
  }
  return update;
}

export default function(scriptLanguagePropName, scriptValuePropName, isFormatRequired, translate, eventBus, commandStack, options) {
  let idPrefix = options && options.idPrefix || '';

  let scriptObject = {
    callback: () => {

      // This is intentional
    },
    template:
      '<div class="bpp-row bpp-textfield code-editor-script-format">' +
      '<label for="' + idPrefix + 'cam-script-format">' + escapeHTML(translate('Script Format')) + '</label>' +
      '<div class="bpp-field-wrapper">' +
      '<input id="' + idPrefix + 'cam-script-format" type="text" name="scriptFormat"/>' +
      '<button class="action-button clear" data-action="script.clearScriptFormat" data-show="script.canClearScriptFormat">' +
      '<span>X</span>' +
      '</button>' +
      '<button class="action-button code-editor-script" data-action="script.openCodeEditor" data-show="script.canOpenCodeEditor">' +
      '<span>\u{1F589}</span>' +
      '</button>' +
      '</div>' +
      '</div>' +

      '<div class="bpp-row">' +
      '<label for="' + idPrefix + 'cam-script-type">' + escapeHTML(translate('Script Type')) + '</label>' +
      '<div class="bpp-field-wrapper">' +
      '<select id="' + idPrefix + 'cam-script-type" name="scriptType" data-value>' +
      '<option value="script" selected>' + escapeHTML(translate('Inline Script')) + '</option>' +
      '<option value="scriptResource">' + escapeHTML(translate('External Resource')) + '</option>' +
      '</select>' +
      '</div>' +
      '</div>' +

      '<div class="bpp-row bpp-textfield">' +
      '<label for="' + idPrefix + 'cam-script-resource-val" data-show="script.isScriptResource">' + escapeHTML(translate('Resource')) + '</label>' +
      '<div class="bpp-field-wrapper" data-show="script.isScriptResource">' +
      '<input id="' + idPrefix + 'cam-script-resource-val" type="text" name="scriptResourceValue" />' +
      '<button class="action-button clear" data-action="script.clearScriptResource" data-show="script.canClearScriptResource">' +
      '<span>X</span>' +
      '</button>' +
      '</div>' +
      '</div>' +

      '<div class="bpp-row">' +
      '<label for="' + idPrefix + 'cam-script-val" data-show="script.isScript">' + escapeHTML(translate('Script')) + '</label>' +
      '<div class="bpp-field-wrapper" data-show="script.isScript">' +
      '<textarea id="' + idPrefix + 'cam-script-val" type="text" name="scriptValue"></textarea>' +
      '</div>' +
      '</div>',

    get: function(element, bo) {
      let values = {};

      // read values from xml:
      let boScriptResource = bo.get('camunda:resource'),
          boScript = bo.get(scriptValuePropName),
          boScriptFormat = bo.get(scriptLanguagePropName);

      if (typeof boScriptResource !== 'undefined') {
        values.scriptResourceValue = boScriptResource;
        values.scriptType = 'scriptResource';
      } else {
        values.scriptValue = boScript;
        values.scriptType = 'script';
      }

      values.scriptFormat = boScriptFormat;

      return values;
    },

    set: function(element, values, containerElement) {
      let scriptFormat = values.scriptFormat,
          scriptType = values.scriptType,
          scriptResourceValue = values.scriptResourceValue,
          scriptValue = values.scriptValue;

      // init update
      return updateValues(scriptValuePropName, scriptLanguagePropName, isFormatRequired, scriptFormat, scriptType, scriptResourceValue, scriptValue);
    },

    validate: function(element, values) {
      let validationResult = {};

      if (values.scriptType === 'script' && !values.scriptValue) {
        validationResult.scriptValue = translate('Must provide a value');
      }

      if (values.scriptType === 'scriptResource' && !values.scriptResourceValue) {
        validationResult.scriptResourceValue = translate('Must provide a value');
      }

      if (isFormatRequired && (!values.scriptFormat || values.scriptFormat.length === 0)) {
        validationResult.scriptFormat = translate('Must provide a value');
      }

      return validationResult;
    },

    clearScriptFormat: function(element, inputNode, btnNode, scopeNode) {
      domQuery('input[name=scriptFormat]', scopeNode).value = '';

      return true;
    },

    canClearScriptFormat: function(element, inputNode, btnNode, scopeNode) {
      let input = domQuery('input[name=scriptFormat]', scopeNode);

      return input.value !== '';
    },

    clearScriptResource: function(element, inputNode, btnNode, scopeNode) {
      domQuery('input[name=scriptResourceValue]', scopeNode).value = '';

      return true;
    },

    canClearScriptResource: function(element, inputNode, btnNode, scopeNode) {
      let input = domQuery('input[name=scriptResourceValue]', scopeNode);

      return input.value !== '';
    },

    clearScript: function(element, inputNode, btnNode, scopeNode) {
      domQuery('textarea[name=scriptValue]', scopeNode).value = '';

      return true;
    },

    canClearScript: function(element, inputNode, btnNode, scopeNode) {
      let input = domQuery('textarea[name=scriptValue]', scopeNode);

      return input.value !== '';
    },

    isScriptResource: function(element, inputNode, btnNode, scopeNode) {
      let scriptType = getScriptType(scopeNode, idPrefix);
      return scriptType === 'scriptResource';
    },

    isScript: function(element, inputNode, btnNode, scopeNode) {
      let scriptType = getScriptType(scopeNode, idPrefix);
      return scriptType === 'script' && !canOpenCodeEditor(scopeNode, idPrefix);
    },

    openCodeEditor: function(element, inputNode, btnNode, scopeNode) {
      let inputParams = InputOutputHelper.getInputParameters(element);

      let scriptFormat = domQuery('input[name=scriptFormat]', scopeNode).value.toLowerCase(),
          scriptValue = domQuery('textarea[name=scriptValue]', scopeNode).value,
          scriptType = getScriptType(scopeNode, idPrefix),
          scriptResourceValue = domQuery('input[name=scriptResourceValue]', scopeNode).value;


      eventBus.fire(OPEN_CODE_EDITOR, {
        element: element,
        node: inputNode,
        data: scriptValue,
        mode: scriptFormat,
        inputParameters: inputParams
      });

      eventBus.once(SAVE_CODE_EDITOR, 10000, event => {

        const { data } = event;
        scriptValue = data;
        let properties = { scriptFormat, scriptType, scriptResourceValue, scriptValue };

        let updateElement = scriptObject.callback(element, properties, scopeNode);
        if (Array.isArray(updateElement)) {
          updateElement.forEach(update => {
            commandStack.execute(update.cmd, update.context);
          });
        } else {
          commandStack.execute(updateElement.cmd, updateElement.context);
        }

        return false;
      });

      return true;
    },

    canOpenCodeEditor: function(element, inputNode, btnNode, scopeNode) {
      return canOpenCodeEditor(scopeNode, idPrefix);
    }

  };
  return scriptObject;

}
