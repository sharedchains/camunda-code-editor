/**
 * Imported libraries and disabled modeling on opening Code Editor
 * @author luca.bonora@sharedchains.com (Luca Bonora)
 */

/**
 * @license
 * Copyright 2017 bpmn.io
 * SPDX-License-Identifier: MIT
 */

import { query, classes } from 'min-dom';
import {
  OPEN_CODE_EDITOR,
  SAVE_CODE_EDITOR,
} from '../../utils/EventHelper';

var HIGH_PRIORITY = 10005;

export default function DisableModeling(eventBus, canvas, contextPad, dragging, directEditing, editorActions, modeling, palette, moveCanvas) {
  const self = this;

  this._eventBus = eventBus;
  this._canvas = canvas;
  this.modelingDisabled = false;

  function disable() {
    directEditing.cancel();
    contextPad.close();
    dragging.cancel();

    // hiding palette
    classes(self.canvasParent).add('exportMode');
    classes(self.palette).add('hidden');

  }

  function enable() {
    classes(self.canvasParent).remove('exportMode');
    classes(self.palette).remove('hidden');
  }

  eventBus.on('import.done', function() {
    self.canvasParent = self._canvas.getContainer().parentNode;
    self.palette = query('.djs-palette', self._canvas.getContainer());
  });

  eventBus.on(OPEN_CODE_EDITOR, HIGH_PRIORITY, function() {
    self.modelingDisabled = true;
    disable();
    palette._update();
  });

  eventBus.on(SAVE_CODE_EDITOR, HIGH_PRIORITY, function() {
    self.modelingDisabled = false;
    enable();
    palette._update();
  });

  function intercept(obj, fnName, cb) {
    var fn = obj[fnName];
    obj[fnName] = function() {
      return cb.call(this, fn, arguments);
    };
  }

  function ignoreIfModelingDisabled(obj, fnName) {
    intercept(obj, fnName, function(fn, args) {
      if (self.modelingDisabled) {
        return;
      }

      return fn.apply(this, args);
    });
  }

  function throwIfModelingDisabled(obj, fnName) {
    intercept(obj, fnName, function(fn, args) {
      if (self.modelingDisabled) {
        throw new Error('model is read-only');
      }

      return fn.apply(this, args);
    });
  }

  ignoreIfModelingDisabled(contextPad, 'open');
  ignoreIfModelingDisabled(dragging, 'init');
  ignoreIfModelingDisabled(directEditing, 'activate');
  ignoreIfModelingDisabled(moveCanvas, 'handleStart');
  ignoreIfModelingDisabled(moveCanvas, 'handleMove');
  ignoreIfModelingDisabled(moveCanvas, 'handleEnd');

  throwIfModelingDisabled(modeling, 'moveShape');
  throwIfModelingDisabled(modeling, 'updateAttachment');
  throwIfModelingDisabled(modeling, 'moveElements');
  throwIfModelingDisabled(modeling, 'moveConnection');
  throwIfModelingDisabled(modeling, 'layoutConnection');
  throwIfModelingDisabled(modeling, 'createConnection');
  throwIfModelingDisabled(modeling, 'createShape');
  throwIfModelingDisabled(modeling, 'createLabel');
  throwIfModelingDisabled(modeling, 'appendShape');
  throwIfModelingDisabled(modeling, 'removeElements');
  throwIfModelingDisabled(modeling, 'distributeElements');
  throwIfModelingDisabled(modeling, 'removeShape');
  throwIfModelingDisabled(modeling, 'removeConnection');
  throwIfModelingDisabled(modeling, 'replaceShape');
  throwIfModelingDisabled(modeling, 'pasteElements');
  throwIfModelingDisabled(modeling, 'alignElements');

  // throwIfModelingDisabled(modeling, 'resizeShape');
  throwIfModelingDisabled(modeling, 'createSpace');
  throwIfModelingDisabled(modeling, 'updateWaypoints');
  throwIfModelingDisabled(modeling, 'reconnectStart');
  throwIfModelingDisabled(modeling, 'reconnectEnd');

  intercept(editorActions, 'trigger', function(fn, args) {
    var action = args[0];

    if (self.modelingDisabled && isAnyAction([
      'undo',
      'redo',
      'copy',
      'paste',
      'removeSelection',
      'spaceTool',
      'lassoTool',
      'globalConnectTool',
      'distributeElements',
      'alignElements',
      'directEditing',
      'activateHandtool',
      'toggleTokenSimulation',
      'resetTokenSimulation',
      'toggleTokenSimulationLog',
      'togglePauseTokenSimulation'
    ], action)) {
      return;
    }

    return fn.apply(this, args);
  });
}

DisableModeling.$inject = [
  'eventBus',
  'canvas',
  'contextPad',
  'dragging',
  'directEditing',
  'editorActions',
  'modeling',
  'palette',
  'moveCanvas'
];

// helpers //////////

function isAnyAction(actions, action) {
  return actions.indexOf(action) > -1;
}